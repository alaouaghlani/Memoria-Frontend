import React, { useState } from 'react';
import {
  View,
  Text,
  Platform,
  Alert,
  PermissionsAndroid,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
} from 'react-native';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import RNFS from 'react-native-fs';
import Tts from 'react-native-tts';

const audioRecorderPlayer = new AudioRecorderPlayer();

const MemoriesScreenOlder = () => {
  const [audioPath, setAudioPath] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [aiAnswer, setAiAnswer] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [loadingSend, setLoadingSend] = useState(false);

  const requestMicrophonePermission = async () => {
    if (Platform.OS !== 'android') return true;

    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        {
          title: 'Microphone Permission',
          message: 'App needs access to your microphone to record audio',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn('Permission error:', err);
      return false;
    }
  };

  const startRecording = async () => {
    const hasPermission = await requestMicrophonePermission();
    if (!hasPermission) {
      Alert.alert(
        'Permission required',
        'Cannot record without microphone permission',
      );
      return;
    }

    const path = Platform.select({
      ios: `${RNFS.CachesDirectoryPath}/voice.m4a`,
      android: `${RNFS.CachesDirectoryPath}/voice.ogg`,
    });

    try {
      await audioRecorderPlayer.stopPlayer();
      await audioRecorderPlayer.stopRecorder();
      setIsRecording(true);
      const uri = await audioRecorderPlayer.startRecorder(path);
      setAudioPath(uri);
      console.log('Recording started at:', uri);
    } catch (e) {
      console.error('Failed to start recording', e);
      setIsRecording(false);
    }
  };

  const stopRecording = async () => {
    try {
      const result = await audioRecorderPlayer.stopRecorder();
      audioRecorderPlayer.removeRecordBackListener();
      setAudioPath(result);
      setIsRecording(false);
      console.log('Recording stopped, file saved at:', result);
      checkFileSize();
    } catch (e) {
      console.error('Failed to stop recording', e);
      setIsRecording(false);
    }
  };

//   const playRecording = async () => {
//     if (!audioPath) {
//       Alert.alert('No audio', 'Please record audio before playing');
//       return;
//     }

//     try {
//       setIsPlaying(true);

//       await audioRecorderPlayer.startPlayer(audioPath);
//       audioRecorderPlayer.setVolume(1.0);

//       const listenerId = audioRecorderPlayer.addPlayBackListener(e => {
//         if (e.current_position >= e.duration) {
//           audioRecorderPlayer.stopPlayer().then(() => {
//             audioRecorderPlayer.removePlayBackListener(listenerId);
//             setIsPlaying(false);
//             console.log('Playback finished');
//           });
//         }
//       });

//       console.log('Playback started');
//     } catch (e) {
//       console.error('Failed to play recording', e);
//       setIsPlaying(false);
//     }
//   };

  const checkFileSize = async () => {
    if (!audioPath) return;
    try {
      const stats = await RNFS.stat(audioPath);
      console.log('Recorded file size:', stats.size);
      Alert.alert('File Size', `Recorded file size: ${stats.size} bytes`);
    } catch (e) {
      console.warn('Error checking file size', e);
    }
  };

  const sendAudio = async () => {
    if (!audioPath) {
      Alert.alert('No audio', 'Please record audio before sending');
      return;
    }

    setLoadingSend(true);

    const formData = new FormData();
    formData.append('audio', {
      uri: audioPath,
      type: Platform.OS === 'ios' ? 'audio/m4a' : 'audio/ogg',
      name: Platform.OS === 'ios' ? 'voice.m4a' : 'voice.ogg',
    });

    try {
      const response = await fetch(
        'https://test.realitybird.com/backend-socket/voice',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          body: formData,
        },
      );

      const json = await response.json();
      console.log('Server response:', json);
      if (json.answer) {
        setAiAnswer(json.answer);
        Alert.alert('Success', `Server replied: ${json.answer}`);
      } else {
        Alert.alert('Success', 'Server replied but no answer found.');
      }
    } catch (e) {
      console.error('Upload failed', e);
      Alert.alert('Upload failed', e.message);
    } finally {
      setLoadingSend(false);
    }
  };

  const speakAIText = text => {
    if (!text) return;

    // Extract French and English parts
    const match = text.match(/^(.*?)\s*\((.*?)\)\s*$/);
    Tts.stop();

    if (match) {
      const frenchPart = match[1].trim();
      const englishPart = match[2].trim();

      Tts.setDefaultLanguage('fr-FR');
      Tts.speak(frenchPart);

      setTimeout(() => {
        Tts.setDefaultLanguage('en-US');
        Tts.speak(englishPart);
      }, 4000);
    } else {
      const cleanText = text.replace(/[\u200B-\u200D\uFEFF]/g, '').trim();
      Tts.setDefaultLanguage('fr-FR');
      Tts.speak(cleanText);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Memories Voice Recorder</Text>

      <TouchableOpacity
        style={[styles.button, isRecording && styles.buttonDisabled]}
        onPress={startRecording}
        disabled={isRecording}
      >
        <Text style={styles.buttonText}>
          {isRecording ? 'Recording...' : 'Start Recording'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, !isRecording && styles.buttonDisabled]}
        onPress={stopRecording}
        disabled={!isRecording}
      >
        <Text style={styles.buttonText}>Stop Recording</Text>
      </TouchableOpacity>

      {/* <TouchableOpacity
        style={[styles.button, isPlaying && styles.buttonDisabled]}
        onPress={playRecording}
        disabled={isPlaying || !audioPath}
      >
        {isPlaying ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Play Recording</Text>
        )}
      </TouchableOpacity> */}

      <TouchableOpacity
        style={[styles.button, (!audioPath || loadingSend) && styles.buttonDisabled]}
        onPress={sendAudio}
        disabled={!audioPath || loadingSend}
      >
        {loadingSend ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Send Audio</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, !aiAnswer && styles.buttonDisabled]}
        onPress={() => speakAIText(aiAnswer)}
        disabled={!aiAnswer}
      >
        <Text style={styles.buttonText}>Speak AI Response</Text>
      </TouchableOpacity>

      {aiAnswer ? (
        <View style={styles.aiResponseBox}>
          <Text style={styles.aiResponseTitle}>AI Response:</Text>
          <Text style={styles.aiResponseText}>{aiAnswer}</Text>
        </View>
      ) : null}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingBottom: 40,
    backgroundColor: '#f9fafb',
    flexGrow: 1,
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 24,
    color: '#4f46e5', // Indigo-600
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#4f46e5', // Indigo-600
    paddingVertical: 14,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#4f46e5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  buttonDisabled: {
    backgroundColor: '#a5b4fc', // Indigo-300
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  aiResponseBox: {
    marginTop: 24,
    backgroundColor: '#e0e7ff', // Indigo-100
    padding: 16,
    borderRadius: 8,
    shadowColor: '#4f46e5',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  aiResponseTitle: {
    fontWeight: '700',
    fontSize: 18,
    marginBottom: 8,
    color: '#4338ca', // Indigo-700
  },
  aiResponseText: {
    fontSize: 16,
    color: '#3730a3', // Indigo-800
  },
});

export default MemoriesScreenOlder;
