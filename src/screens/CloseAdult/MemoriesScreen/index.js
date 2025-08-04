import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions
} from 'react-native';
import { MotiView } from 'moti';
import { useTranslation } from 'react-i18next';
// import { Ionicons } from '@expo/vector-icons'; // Or use another icon lib
import { fetchMemories } from '../../../shared/api'; // Replace with your real API

const screenWidth = Dimensions.get('window').width;

const MemoriesScreen = ({ route }) => {
  const { t } = useTranslation();
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);
  const olderId = route.params?.IDOlderAdult;

  useEffect(() => {
    const loadMemories = async () => {
      try {
        const res = await fetchMemories(olderId);
        setMemories(res.memories);
      } catch (err) {
        console.error('Error fetching memories:', err);
      } finally {
        setLoading(false);
      }
    };

    loadMemories();
  }, [olderId]);

  const renderItem = ({ item, index }) => {
    const isLeft = index % 2 === 0;
    const date = new Date(item.date).toLocaleDateString();

    return (
      <MotiView
        from={{ opacity: 0, translateY: 40 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ delay: index * 100, type: 'timing', duration: 500 }}
        style={[
          styles.memoryCard,
          { alignSelf: isLeft ? 'flex-start' : 'flex-end' }
        ]}
      >
        <Text style={styles.date}>{date}</Text>
        {item.type === 'text' && (
          <Text style={styles.text}>{item.content}</Text>
        )}
        {item.type === 'audio' && (
          <View style={styles.audioContainer}>
            {/* <Ionicons name="musical-notes-outline" size={28} color="#5a5a5a" /> */}
            <Text style={styles.audioLabel}>Audio Memory</Text>
            {/* Plug in your audio player here */}
          </View>
        )}
        {item.type === 'video' && (
          <TouchableOpacity>
            <Image
              source={{
                uri: item.thumbnail || 'https://via.placeholder.com/300x180'
              }}
              style={styles.videoThumbnail}
            />
            {/* <Ionicons
              name="play-circle"
              size={48}
              color="#fff"
              style={styles.playIcon}
            /> */}
          </TouchableOpacity>
        )}
      </MotiView>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{t('memories.title')}</Text>

      {loading ? (
        <Text style={styles.loading}>{t('memories.loading')}</Text>
      ) : memories.length === 0 ? (
        <Text style={styles.empty}>{t('memories.empty')}</Text>
      ) : (
        <FlatList
          data={memories.sort((a, b) => new Date(b.date) - new Date(a.date))}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9F6',
    paddingTop: 20,
    paddingHorizontal: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  list: {
    paddingBottom: 30,
  },
  memoryCard: {
    maxWidth: screenWidth * 0.75,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  date: {
    fontSize: 13,
    color: '#999',
    marginBottom: 8,
  },
  text: {
    fontSize: 16,
    color: '#444',
    lineHeight: 22,
  },
  audioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#f1f1f1',
    borderRadius: 10,
    padding: 10,
  },
  audioLabel: {
    fontSize: 16,
    color: '#555',
  },
  videoThumbnail: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    backgroundColor: '#000',
  },
  playIcon: {
    position: 'absolute',
    top: '40%',
    left: '40%',
  },
  loading: {
    textAlign: 'center',
    marginTop: 40,
    color: '#666',
  },
  empty: {
    textAlign: 'center',
    marginTop: 40,
    color: '#aaa',
    fontSize: 16,
  },
});

export default MemoriesScreen;
