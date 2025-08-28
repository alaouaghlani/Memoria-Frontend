import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput } from 'react-native';
import io from 'socket.io-client';
import Tts from 'react-native-tts';

// --- Connexion socket ---
const socket = io("https://test.realitybird.com", {
  path: "/backend-socket/socket.io",
  transports: ["websocket"],
});

socket.on("connect", () => {
  console.log("✅ Socket connected! ID:", socket.id);
  socket.emit("join_room", "test_vocal1");
});

const MemoriesScreenOlder = () => {
  const [recognizedText, setRecognizedText] = useState('');
  const [assistantAnswer, setAssistantAnswer] = useState('');
  const timeoutRef = useRef(null);
  const bufferRef = useRef(""); // accumulate partial text

  // --- Clean text (remove parentheses + unwanted prefixes + leading ?)
  const cleanText = (txt) =>
    txt
      .replace(/\([^)]*\)/g, "")       // remove ( ... )
      .replace(/^assist\s*\?/i, "")    // remove "assist ?"
      .replace(/answer:\s*/gi, "")     // remove "Answer:"
      .replace(/^[\?\s]+/, "")         // remove leading ? and spaces
      .trim();

  // --- Language detection ---
  const detectLanguage = (text) => {
    const cleaned = text.toLowerCase();

    const frenchWords = [
      // Pronouns
      "je","tu","il","elle","nous","vous","ils","elles","on",
      // Articles
      "le","la","les","un","une","des","du","de la","au","aux","ce","cet","cette","ces",
      // Prepositions & conjunctions
      "à","dans","en","par","pour","avec","sans","sur","sous","entre","mais","ou","donc","car","quand","que","si",
      // Adverbs
      "très","bien","mal","souvent","parfois","jamais","toujours","déjà","encore","bientôt","ici","là","partout","ici","là-bas","ailleurs",
      // Common verbs
      "être","avoir","aller","faire","dire","pouvoir","savoir","voir","venir","devoir","prendre","mettre","vouloir","falloir","aimer","parler","manger","boire","dormir","travailler","jouer","vivre","comprendre","apprendre",
      // Common nouns / everyday words
      "jour","nuit","temps","main","enfant","homme","femme","pain","baguette","merci","bonjour","salut","maison","école","travail","eau","nourriture","ami","amour","famille","voiture","ville","pays","chien","chat","ordinateur","téléphone","livre","musique","film"
    ];

    const englishWords = [
      "i","you","he","she","we","they","yes","no",
      "thank","hello","good","bad","because","what","how"
    ];

    let frCount = 0, enCount = 0;
    frenchWords.forEach(w => { if (cleaned.includes(` ${w} `)) frCount++; });
    englishWords.forEach(w => { if (cleaned.includes(` ${w} `)) enCount++; });
    if (/[éèêàùçôûîïœ]/.test(cleaned)) frCount++;

    return frCount >= enCount ? "fr" : "en";
  };

  // --- Speak sentence ---
  const speakSentence = async (sentence) => {
    const cleaned = cleanText(sentence);
    if (!cleaned) return;

    const lang = detectLanguage(cleaned);

    try {
      if (lang === "fr") {
        await Tts.setDefaultVoice("fr-fr-x-frc-local"); // force French
      } else {
        await Tts.setDefaultLanguage("en-US"); // fallback English
      }
    } catch (err) {
      console.warn("⚠️ Voice selection error:", err);
    }

    Tts.speak(cleaned, {
      rate: 0.95,
      androidParams: {
        KEY_PARAM_PAN: 0,
        KEY_PARAM_VOLUME: 1,
        KEY_PARAM_STREAM: 'STREAM_MUSIC',
      },
    });
  };

  // --- Send text after 3 seconds of inactivity ---
  useEffect(() => {
    if (!recognizedText) return;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      socket.emit('voice', { requestText: recognizedText });
      setRecognizedText('');
    }, 3000);

    return () => clearTimeout(timeoutRef.current);
  }, [recognizedText]);

  // --- Receive AI responses ---
  useEffect(() => {
    const handleStream = (data) => {
      bufferRef.current += data;

      // Split buffer into sentences
      const sentenceRegex = /([^.?!]*[.?!])/g;
      let match;
      let lastIndex = 0;

      while ((match = sentenceRegex.exec(bufferRef.current)) !== null) {
        const sentence = match[0];
        speakSentence(sentence); // speak only complete sentences
        lastIndex = sentenceRegex.lastIndex;
      }

      // Keep unfinished sentence in buffer
      const spokenPart = bufferRef.current.slice(0, lastIndex);
      bufferRef.current = bufferRef.current.slice(lastIndex);

      // Append spoken part to displayed text
      const cleanedChunk = cleanText(spokenPart);
      if (cleanedChunk) setAssistantAnswer(prev => prev + cleanedChunk + " ");
    };

    const handleStreamEnd = () => {
      const finalChunk = cleanText(bufferRef.current);
      if (finalChunk) {
        speakSentence(finalChunk);
        setAssistantAnswer(prev => prev + finalChunk + " ");
        bufferRef.current = "";
      }
    };

    socket.on('stream', handleStream);
    socket.on('stream-end', handleStreamEnd);

    return () => {
      socket.off('stream', handleStream);
      socket.off('stream-end', handleStreamEnd);
    };
  }, []);

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ marginBottom: 10 }}>
        🎤 Tapez ou utilisez le micro du clavier pour dicter :
      </Text>
      <TextInput
        placeholder="Tapez ou utilisez la dictée"
        value={recognizedText}
        onChangeText={setRecognizedText}
        style={{
          borderWidth: 1,
          borderRadius: 5,
          padding: 10,
          minHeight: 50,
        }}
        multiline
      />
      <Text style={{ marginTop: 20 }}>AI: {assistantAnswer}</Text>
    </View>
  );
};

export default MemoriesScreenOlder;
