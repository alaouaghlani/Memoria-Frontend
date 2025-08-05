import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  Modal,
  Pressable,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTranslation } from 'react-i18next';

const screenWidth = Dimensions.get('window').width;

const MemoriesScreen = () => {
  const { t } = useTranslation();
  const [memories, setMemories] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showPicker, setShowPicker] = useState(false);
  const [filteredMemories, setFilteredMemories] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentMedia, setCurrentMedia] = useState(null);

  useEffect(() => {
    const data = [
      {
        id: '1',
        type: 'text',
        content: 'I remember our trip to the mountains 🌄. It was beautiful!',
        date: '2024-05-01',
      },
      {
        id: '2',
        type: 'audio',
        content: 'audio-file-url.mp3',
        date: '2024-06-10',
      },
      {
        id: '3',
        type: 'video',
        thumbnail: 'https://via.placeholder.com/300x180',
        content: 'video-file-url.mp4',
        date: '2024-07-22',
      },
      {
        id: '4',
        type: 'text',
        content: 'Your birthday surprise was unforgettable 🎂🎁.',
        date: '2024-08-02',
      },
    ];
    setMemories(data);
    setFilteredMemories(data);
  }, []);

  const handleDateChange = (event, date) => {
    setShowPicker(false);
    if (date) {
      setSelectedDate(date);
      const filtered = memories.filter((m) => {
        const memDate = new Date(m.date);
        return (
          memDate.getFullYear() === date.getFullYear() &&
          memDate.getMonth() === date.getMonth()
        );
      });
      setFilteredMemories(filtered);
    }
  };

  const clearFilter = () => {
    setSelectedDate(null);
    setFilteredMemories(memories);
  };

  const openMediaModal = (item) => {
    setCurrentMedia(item);
    setModalVisible(true);
  };

  const renderMemory = ({ item, index }) => {
    const isLeft = index % 2 === 0;
    const iconName =
      item.type === 'text'
        ? 'align-left'
        : item.type === 'audio'
        ? 'headphones'
        : 'video';

    return (
      <View style={styles.memoryWrapper}>
        {isLeft && <View style={{ flex: 1 }} />}
        <View style={[styles.memoryContainer, isLeft ? styles.left : styles.right]}>
          <View style={styles.iconWrapper}>
            <Icon name={iconName} size={16} color="#fff" />
          </View>
          <Text style={styles.date}>{new Date(item.date).toLocaleDateString()}</Text>

          {item.type === 'text' && (
            <Text style={styles.textContent}>{item.content}</Text>
          )}
          {item.type === 'audio' && (
            <TouchableOpacity
              style={styles.audioContent}
              onPress={() => openMediaModal(item)}
            >
              <Icon name="play" size={20} color="#555" />
              <Text style={styles.audioLabel}>Play audio</Text>
            </TouchableOpacity>
          )}
          {item.type === 'video' && (
            <TouchableOpacity
              style={styles.videoContainer}
              onPress={() => openMediaModal(item)}
            >
              <Image
                source={{ uri: item.thumbnail }}
                style={styles.videoThumbnail}
              />
              <Icon
                name="play-circle"
                size={32}
                color="#fff"
                style={styles.playIcon}
              />
            </TouchableOpacity>
          )}
        </View>
        {!isLeft && <View style={{ flex: 1 }} />}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* <Text style={styles.header}>{t('memories.title') || 'Memories Timeline'}</Text> */}

      <View style={styles.filterRow}>
        <TouchableOpacity
          onPress={() => setShowPicker(true)}
          style={styles.filterButton}
          activeOpacity={0.8}
        >
          <Icon name="calendar-alt" size={16} color="#fff" />
          <Text style={styles.filterButtonText}>
            {selectedDate
              ? `Filter: ${selectedDate.toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'long',
                })}`
              : 'Filter by Month'}
          </Text>
        </TouchableOpacity>

        {selectedDate && (
          <TouchableOpacity
            onPress={clearFilter}
            style={[styles.filterButton, styles.clearFilterButton]}
            activeOpacity={0.8}
          >
            <Icon name="times" size={16} color="#fff" />
            <Text style={styles.filterButtonText}>Clear</Text>
          </TouchableOpacity>
        )}
      </View>

      {showPicker && (
        <DateTimePicker
          value={selectedDate || new Date()}
          mode="date"
          display="calendar"
          onChange={handleDateChange}
        />
      )}

      <FlatList
        data={filteredMemories.sort((a, b) => new Date(b.date) - new Date(a.date))}
        keyExtractor={(item) => item.id}
        renderItem={renderMemory}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      />

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Media Player</Text>
            <Text style={styles.modalText}>
              {currentMedia?.type} - {currentMedia?.content}
            </Text>
            <Pressable
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eef2ff',
    paddingTop: 40,
    paddingHorizontal: 16,
  },
  // header: {
  //   fontSize: 26,
  //   fontWeight: '700',
  //   textAlign: 'center',
  //   marginBottom: 24,
  //   color: '#333',
  // },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 10,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6366f1',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
  },
  clearFilterButton: {
    backgroundColor: '#e53e3e',
  },
  filterButtonText: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 8,
  },
  memoryWrapper: {
    flexDirection: 'row',
    marginVertical: 20,
    marginLeft: 8,
    alignItems: 'flex-start',
  },
  memoryContainer: {
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 20,
    width: screenWidth * 0.72,
    position: 'relative',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  left: {
    marginRight: 12,
    alignSelf: 'flex-start',
  },
  right: {
    marginLeft: 12,
    alignSelf: 'flex-end',
  },
  iconWrapper: {
    backgroundColor: '#6366f1',
    padding: 9,
    borderRadius: 50,
    position: 'absolute',
    top: -20,
    left: -20,
    zIndex: 10,
  },
  date: {
    fontSize: 12,
    color: '#888',
    marginBottom: 10,
  },
  textContent: {
    fontSize: 16,
    color: '#444',
    lineHeight: 24,
  },
  audioContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
  },
  audioLabel: {
    fontSize: 16,
    color: '#555',
  },
  videoContainer: {
    position: 'relative',
    borderRadius: 14,
    overflow: 'hidden',
  },
  videoThumbnail: {
    width: '100%',
    height: 190,
    backgroundColor: '#000',
  },
  playIcon: {
    position: 'absolute',
    top: '40%',
    left: '40%',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  modalText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 24,
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: '#6366f1',
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 12,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default MemoriesScreen;
