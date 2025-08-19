import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Platform, PermissionsAndroid, Button } from 'react-native';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import RNFS from 'react-native-fs';
import Tts from 'react-native-tts';
import SoundLevel from 'react-native-sound-level';
import io from 'socket.io-client';
import {
  AudioEncoderAndroidType,
  AudioSourceAndroidType,
  AVEncoderAudioQualityIOSType,
  AVEncodingOption,
} from 'react-native-audio-recorder-player';

const audioRecorderPlayer = new AudioRecorderPlayer();

// --- connect to socket server ---
const socket = io("https://test.realitybird.com", {
  path: "/backend-socket/socket.io",
  transports: ["websocket"],
});
socket.on("connect", () => {
  console.log("✅ Socket connected! ID:", socket.id);
});

socket.on("disconnect", (reason) => {
  console.log("⚠️ Socket disconnected. Reason:", reason);
});

socket.on("connect_error", (err) => {
  console.error("❌ Socket connection error:", err);
});
const MemoriesScreenOlder = () => {
  const [audioPath, setAudioPath] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [assistantAnswer, setAssistantAnswer] = useState('');

  const lastVoiceTimeRef = useRef(Date.now());
  const recordingActiveRef = useRef(false);

  // --- Request microphone permission ---
  const requestMicrophonePermission = async () => {
    if (Platform.OS !== 'android') return true;
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  };

  // --- Start recording ---
  const startRecording = async () => {
    if (isSpeaking || recordingActiveRef.current) return;

    const hasPermission = await requestMicrophonePermission();
    if (!hasPermission) return;

    try {
      await audioRecorderPlayer.stopRecorder().catch(() => {});
      audioRecorderPlayer.removeRecordBackListener();

      const path = Platform.select({
        ios: `${RNFS.CachesDirectoryPath}/voice.m4a`,
        android: `${RNFS.CachesDirectoryPath}/voice.ogg`,
      });

      console.log('🎤 Starting recording...');
      setIsRecording(true);
      recordingActiveRef.current = true;
      lastVoiceTimeRef.current = Date.now();

      const uri = await audioRecorderPlayer.startRecorder(path, {
        AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
        AudioSourceAndroid: AudioSourceAndroidType.MIC,
        AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
        AVNumberOfChannelsKeyIOS: 1,
        AVFormatIDKeyIOS: AVEncodingOption.aac,
        meteringEnabled: true,
      });
      console.log('✅ Recording started at:', uri);
      setAudioPath(uri);

      SoundLevel.start();
      SoundLevel.onNewFrame = data => {
        if (!recordingActiveRef.current || isSpeaking) return;

        if (data.value > -50) {
          lastVoiceTimeRef.current = Date.now();
        } else {
          if (Date.now() - lastVoiceTimeRef.current > 3000) {
            console.log('🤫 Silence detected, stopping recording...');
            stopRecording();
          }
        }
      };
    } catch (e) {
      console.error('❌ Failed to start recording', e);
      setIsRecording(false);
      recordingActiveRef.current = false;
    }
  };

  // --- Stop recording ---
  const stopRecording = async () => {
    if (!recordingActiveRef.current) return;
    try {
      console.log('🛑 Stopping recording...');
      SoundLevel.stop();
      const result = await audioRecorderPlayer.stopRecorder();
      audioRecorderPlayer.removeRecordBackListener();
      setIsRecording(false);
      recordingActiveRef.current = false;
      console.log('✅ Recording stopped. File saved at:', result);
      setAudioPath(result);
      sendAudio(result);
    } catch (e) {
      console.error('❌ Failed to stop recording', e);
      recordingActiveRef.current = false;
      setIsRecording(false);
    }
  };

  // --- Send audio over socket ---
const sendAudio = async (path) => {
  console.log("📤 Sending audio to server...");
  try {
    const fileBuffer = await RNFS.readFile(path, "base64");

    // Detect extension from path
    const ext = path.endsWith(".ogg") ? "ogg" : "m4a";

    socket.emit("voice", {
      filename: `voice.${ext}`,   // use correct extension
      fileBuffer,
    });

    console.log("✅ Audio sent!");
    setAssistantAnswer("");
  } catch (err) {
    console.error("❌ Error sending audio:", err);
  }
};




  // --- Speak AI response ---
  const speakAIText = text => {
    if (!text) return;
    console.log('🗣 Speaking AI response:', text);
    setIsSpeaking(true);
    Tts.stop();
    Tts.setDefaultLanguage('fr-FR');
    Tts.speak(text);

    const finishListener = Tts.addEventListener('tts-finish', () => {
      console.log('✅ Finished speaking, resuming recording...');
      setIsSpeaking(false);
      finishListener.remove();
      setTimeout(() => {
        lastVoiceTimeRef.current = Date.now();
        startRecording();
      }, 2500);
    });
  };

  // --- Play last recorded audio ---
  const playLastAudio = async () => {
    if (!audioPath) return;
    try {
      console.log('▶ Playing audio:', audioPath);
      setIsPlaying(true);
      await audioRecorderPlayer.startPlayer(audioPath);
      audioRecorderPlayer.addPlayBackListener(e => {
        if (e.currentPosition >= e.duration) {
          console.log('⏹ Finished playing audio.');
          setIsPlaying(false);
          audioRecorderPlayer.stopPlayer();
        }
      });
    } catch (e) {
      console.error('❌ Failed to play audio', e);
      setIsPlaying(false);
    }
  };

  // --- Socket listeners for streaming ---
  useEffect(() => {
    socket.on('stream', data => {
      console.log('💬 Stream chunk received:', data);
      setAssistantAnswer(prev => prev + data);
    });

    socket.on('stream-end', () => {
      console.log('✅ Stream finished, final answer:', assistantAnswer);
      const clean = assistantAnswer.replace(/\([^)]*\)/g, '').trim();
      speakAIText(clean);
    });

    return () => {
      socket.off('stream');
      socket.off('stream-end');
    };
  }, [assistantAnswer]);

  // --- Auto start recording on mount ---
  useEffect(() => {
    startRecording();
    return () => {
      audioRecorderPlayer.stopRecorder().catch(() => {});
      audioRecorderPlayer.removeRecordBackListener();
      SoundLevel.stop();
      Tts.stop();
    };
  }, []);

  return (
    <View style={{ padding: 20 }}>
      <Text>{isRecording ? '🎤 Recording...' : 'AI Thinking...'}</Text>
      <Text>{isSpeaking ? '🗣 AI Speaking...' : ''}</Text>
      <Text style={{ marginVertical: 10 }}>{assistantAnswer}</Text>
      <Button
        title="▶ Play Last Audio"
        onPress={playLastAudio}
        disabled={!audioPath || isPlaying}
      />
      <Button
        title="Stop recording"
        onPress={stopRecording}
        // disabled={!audioPath || isPlaying}
      />
    </View>
  );
};

export default MemoriesScreenOlder;
