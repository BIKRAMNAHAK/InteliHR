import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Text,
  FlatList,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const samplePosts = [
  {
    id: '1',
    name: 'Utkarsha Nagrikar',
    time: '2 hours ago',
    text: `Excited to share that our team just launched the new app update! 🚀\nCheck it out and share your feedback.`,
    image: 'https://images.unsplash.com/photo-1603791440384-56cd371ee9a7?crop=entropy&fit=crop&w=600&h=400',
    likes: 12,
  },
  {
    id: '2',
    name: 'Rahul Sharma',
    time: 'Yesterday',
    text: `Had an amazing team outing at the lake.\nBonding and fun times with colleagues!`,
    image: 'https://images.unsplash.com/photo-1505238680356-667803448bb6?crop=entropy&fit=crop&w=600&h=400',
    likes: 8,
  },
  {
    id: '3',
    name: 'Priya Verma',
    time: '3 days ago',
    text: `Inspirational quote of the day:\n“Strive not to be a success, but rather to be of value.”`,
    image: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?crop=entropy&fit=crop&w=600&h=400',
    likes: 25,
  },
  {
    id: '4',
    name: 'Amit Gupta',
    time: '1 week ago',
    text: `Just completed my first marathon!\nFeeling proud and energized. 🏃‍♂️`,
    image: 'https://wallpapers.com/images/hd/coding-background-9izlympnd0ovmpli.jpg',
    likes: 40,
  },
];
const filters = ['All posts', 'Organisation', 'HR'];

const WallPost = ({ onAddPress, navigation }) => {
  const [activeFilter, setActiveFilter] = useState('All posts');

  const handleLike = (post) => {
    console.log('Liked post', post.id);
  };

  const handleComment = (post) => {
    console.log('Comment on post', post.id);
  };

  const handleShare = (post) => {
    console.log('Share post', post.id);
  };

  const handleCaptionPress = (post) => {
    console.log('Caption tapped for post', post.id);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.header}>
        <Image source={{ uri: item.image }} style={styles.profileImg} />
        <View>
          <Text style={styles.name}>
            <Text style={{ fontWeight: '600' }}>{item.name}</Text> created a post
          </Text>
          <Text style={styles.timestamp}>{item.time}</Text>
        </View>
      </View>

      <TouchableOpacity onPress={() => handleCaptionPress(item)}>
        <Text style={styles.caption}>{item.text}</Text>
      </TouchableOpacity>

      <Image source={{ uri: item.image }} style={styles.postImage} />

      <TouchableOpacity style={styles.likeRow} onPress={() => handleLike(item)}>
        <Ionicons name="thumbs-up" size={18} color="#E53935" />
        <Text style={styles.likeText}>{item.likes}</Text>
      </TouchableOpacity>

      <View style={styles.actions}>
        <TouchableOpacity onPress={() => handleLike(item)}>
          <Text style={styles.actionText}>👍 Like</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleComment(item)}>
          <Text style={styles.actionText}>💬 Comment</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleShare(item)}>
          <Text style={styles.actionText}>🔗 Share</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.wrapper}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1595152772835-219674b2a8a6?crop=faces&fit=crop&w=300&h=300' }}
            style={styles.profileImage}
          />
        </TouchableOpacity>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search your colleagues"
            placeholderTextColor="#888"
          />
        </View>
      </View>

      <View style={styles.filterBar}>
        {filters.map(filter => {
          const isActive = activeFilter === filter;
          return (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterButton,
                isActive ? styles.activeFilter : styles.inactiveFilter,
              ]}
              onPress={() => setActiveFilter(filter)}
            >
              <Text
                style={[
                  styles.filterText,
                  isActive ? styles.activeFilterText : styles.inactiveFilterText,
                ]}
              >
                {filter}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <FlatList
        data={samplePosts}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 70 }}
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity style={styles.addButton} onPress={onAddPress}>
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

export default WallPost;

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: '#fff' },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    paddingTop: 20,
    backgroundColor: '#fff',
    elevation: 5,
  },
  profileImage: { width: 40, height: 40, borderRadius: 20 },
  searchContainer: { flex: 1, marginLeft: 10 },
  searchInput: {
    height: 40,
    backgroundColor: '#eee',
    borderRadius: 20,
    paddingHorizontal: 15,
    fontSize: 14,
    color: '#000',
  },

  filterBar: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  filterButton: {
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginRight: 10,
  },
  activeFilter: { backgroundColor: '#E53935' },
  inactiveFilter: { backgroundColor: '#eee' },
  filterText: { fontSize: 14 },
  activeFilterText: { color: '#fff', fontWeight: '600' },
  inactiveFilterText: { color: '#000' },

  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 10,
    marginVertical: 15,
    elevation: 5,
  },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  profileImg: { width: 35, height: 35, borderRadius: 20, marginRight: 10 },
  name: { color: '#000', fontSize: 14 },
  timestamp: { color: '#888', fontSize: 12 },
  caption: { color: '#000', marginVertical: 10, fontSize: 14, lineHeight: 20 },
  postImage: { width: '100%', height: 260, borderRadius: 10, marginBottom: 10 },
  likeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  likeText: { color: '#000', marginLeft: 5 },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    borderTopWidth: 1,
    borderTopColor: '#444',
    paddingTop: 6,
    marginTop: 6,
  },
  actionText: { color: '#000', fontSize: 14 },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#E53935',
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
});