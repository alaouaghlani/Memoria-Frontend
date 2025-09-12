import React, { useState } from 'react';
import { View, Text, Button, PermissionsAndroid, Platform } from 'react-native';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import axios from 'axios';
import Tts from 'react-native-tts';

const audioRecorderPlayer = new AudioRecorderPlayer();

const MemoriesScreenOlder = () => {
  const [recording, setRecording] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');
  const [assistantAnswer, setAssistantAnswer] = useState('');

  // 🔒 Request mic permission
  const requestAudioPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: 'Microphone Permission',
            message:
              'This app needs access to your microphone to record audio.',
            buttonPositive: 'OK',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn('Permission error:', err);
        return false;
      }
    }
    return true;
  };

  // 🎤 Start recording
  const startRecording = async () => {
    const hasPermission = await requestAudioPermission();
    if (!hasPermission) {
      console.warn('❌ Mic permission not granted');
      return;
    }

    setRecording(true);
    const uri = await audioRecorderPlayer.startRecorder();
  };

  // ⏹ Stop + send to backend
  const stopRecording = async () => {
    const result = await audioRecorderPlayer.stopRecorder();
    setRecording(false);

    const formData = new FormData();
    formData.append('audio', {
      uri: result.startsWith('file://') ? result : `file://${result}`,
      type: 'audio/m4a', // ✅ use m4a instead of mp4
      name: 'voice.m4a',
    });

    try {
      const response = await axios.post(
        'https://test.realitybird.com/memoria-backend/memoria/voice',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        },
      );

      const { transcription, reply } = response.data;
      setRecognizedText(transcription);
      setAssistantAnswer(reply);

      // 🗣 Speak reply
      await Tts.setDefaultLanguage('fr-FR');
      Tts.speak(reply);
    } catch (err) {
      console.error('Upload error:', err);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ marginBottom: 10 }}>🎤 Press record to talk</Text>

      <Button
        title={recording ? '⏹ Stop Recording' : '🎙 Start Recording'}
        onPress={recording ? stopRecording : startRecording}
      />

      <Text style={{ marginTop: 20 }}>📝 You said: {recognizedText}</Text>
      <Text style={{ marginTop: 20 }}>🤖 AI replied: {assistantAnswer}</Text>
    </View>
  );
};

export default MemoriesScreenOlder;
