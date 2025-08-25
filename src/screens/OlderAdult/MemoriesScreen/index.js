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
  socket.emit("join_room", "test_vocal");
});

const MemoriesScreenOlder = () => {
  const [recognizedText, setRecognizedText] = useState('');
  const [assistantAnswer, setAssistantAnswer] = useState('');
  const timeoutRef = useRef(null);
  const bufferRef = useRef(""); // accumulate partial text

  // --- Envoi automatique via socket après 3 secondes d'inactivité ---
  useEffect(() => {
    if (!recognizedText) return;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      socket.emit('voice', { requestText: recognizedText });
      console.log('📤 Text sent via socket:', recognizedText);
      setRecognizedText('');
    }, 3000);

    return () => clearTimeout(timeoutRef.current);
  }, [recognizedText]);

  // --- Réception des réponses serveur ---
  useEffect(() => {
    const speakSentence = (sentence) => {
      // Remove parentheses and their content
      const cleaned = sentence.replace(/\([^)]*\)/g, "").trim();

      if (cleaned) {
        Tts.speak(cleaned, {
          rate: 0.95, // natural pace
          androidParams: {
            KEY_PARAM_PAN: 0,
            KEY_PARAM_VOLUME: 1,
            KEY_PARAM_STREAM: 'STREAM_MUSIC',
          },
        });
      }
    };

    const handleStream = (data) => {
      bufferRef.current += data;
      setAssistantAnswer(prev => prev + data);

      // Detect full sentences ending with ., ?, or !
      const sentenceRegex = /([^.?!]*[.?!])/g;
      let match;
      let consumed = 0;

      while ((match = sentenceRegex.exec(bufferRef.current)) !== null) {
        const sentence = match[0];
        speakSentence(sentence);
        consumed = sentenceRegex.lastIndex;
      }

      // Keep unfinished part in buffer
      bufferRef.current = bufferRef.current.slice(consumed);
    };

    const handleStreamEnd = () => {
      console.log('✅ Stream finished');

      // Speak leftover if any
      if (bufferRef.current.trim()) {
        const cleaned = bufferRef.current.replace(/\([^)]*\)/g, "").trim();
        if (cleaned) Tts.speak(cleaned, { rate: 0.95 });
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
