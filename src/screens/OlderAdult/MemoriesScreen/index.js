import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Platform, PermissionsAndroid, Button } from 'react-native';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import RNFS from 'react-native-fs';
import Tts from 'react-native-tts';
import SoundLevel from 'react-native-sound-level';
import {
  AudioEncoderAndroidType,
  AudioSourceAndroidType,
  AVEncoderAudioQualityIOSType,
  AVEncodingOption,
} from 'react-native-audio-recorder-player';

const audioRecorderPlayer = new AudioRecorderPlayer();

const MemoriesScreenOlder = () => {
  const [audioPath, setAudioPath] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const lastVoiceTimeRef = useRef(Date.now());
  const recordingActiveRef = useRef(false);

  // --- Request microphone permission ---
  const requestMicrophonePermission = async () => {
    if (Platform.OS !== 'android') return true;
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
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

      console.log('Recording started');
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
      setAudioPath(uri);

      SoundLevel.start();
      SoundLevel.onNewFrame = (data) => {
        if (!recordingActiveRef.current || isSpeaking) return;

        if (data.value > -50) {
          lastVoiceTimeRef.current = Date.now();
        } else {
          if (Date.now() - lastVoiceTimeRef.current > 3000) {
            console.log('Silence detected, stopping recording...');
            stopRecording();
          }
        }
      };
    } catch (e) {
      console.error('Failed to start recording', e);
      setIsRecording(false);
      recordingActiveRef.current = false;
    }
  };

  // --- Stop recording ---
  const stopRecording = async () => {
    if (!recordingActiveRef.current) return;
    try {
      console.log('Stopping recording...');
      SoundLevel.stop();
      const result = await audioRecorderPlayer.stopRecorder();
      audioRecorderPlayer.removeRecordBackListener();
      setIsRecording(false);
      recordingActiveRef.current = false;
      setAudioPath(result);
      sendAudio(result);
    } catch (e) {
      console.error('Failed to stop recording', e);
      recordingActiveRef.current = false;
      setIsRecording(false);
    }
  };

  // --- Send audio to AI ---
  const sendAudio = async (path) => {
    if (!path) return;

    const formData = new FormData();
    formData.append('audio', {
      uri: path,
      type: Platform.OS === 'ios' ? 'audio/m4a' : 'audio/ogg',
      name: Platform.OS === 'ios' ? 'voice.m4a' : 'voice.ogg',
    });

    try {
      const response = await fetch(
        'https://test.realitybird.com/backend-socket/voice',
        {
          method: 'POST',
          headers: { 'Content-Type': 'multipart/form-data' },
          body: formData,
        }
      );

      const json = await response.json();
      console.log('Server response:', json);

      if (json.answer) {
        const cleanAnswer = json.answer.replace(/\([^)]*\)/g, '').trim();
        speakAIText(cleanAnswer);
      } else {
        setTimeout(startRecording, 500);
      }
    } catch (e) {
      console.error('Upload failed', e);
      setTimeout(startRecording, 500);
    }
  };

  // --- Speak AI response ---
  const speakAIText = (text) => {
    if (!text) return;
    setIsSpeaking(true);
    Tts.stop();
    Tts.setDefaultLanguage('fr-FR');
    Tts.speak(text);

    const finishListener = Tts.addEventListener('tts-finish', () => {
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
    if (!audioPath) {
      console.log('No audio to play.');
      return;
    }
    try {
      console.log('Playing audio:', audioPath);
      setIsPlaying(true);
      await audioRecorderPlayer.startPlayer(audioPath);
      audioRecorderPlayer.addPlayBackListener((e) => {
        if (e.currentPosition >= e.duration) {
          setIsPlaying(false);
          audioRecorderPlayer.stopPlayer();
        }
      });
    } catch (e) {
      console.error('Failed to play audio', e);
      setIsPlaying(false);
    }
  };

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
      <Button title="▶ Play Last Audio" onPress={playLastAudio} disabled={!audioPath || isPlaying} />
    </View>
  );
};

export default MemoriesScreenOlder;
