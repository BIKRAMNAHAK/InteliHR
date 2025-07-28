// PostCard.js (Facebook style with comments toggle on "X Comments" click)
import React, { useState } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, ScrollView, Alert, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const PostCard = ({ item, onLike, onComment }) => {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const comments = item.comments || [];
  const [likes, setLikes] = useState(item.likes || 0);
  const [isLiked, setIsLiked] = useState(item.isLiked || false);

  const handleLike = async () => {
    try {
      const result = await onLike(item.id);
      if (result === 'liked') {
        setLikes(likes + 1);
        setIsLiked(true);
      } else if (result === 'unliked') {
        setLikes(Math.max(likes - 1, 0));
        setIsLiked(false);
      }
    } catch (e) {
      Alert.alert('Error', 'Failed to like/unlike post.');
    }
  };

  const handleComment = async () => {
    if (!commentText.trim()) return;
    try {
      await onComment(item.id, commentText.trim());
      setCommentText('');
      comments.push({
        id: Date.now(),
        user: empname,
        text: commentText.trim(),
        created_at: 'Just now',
      });
      setShowComments(true);
    } catch (e) {
      Alert.alert('Error', 'Failed to post comment.');
    }
  };

  return (
    <View style={styles.card}>
      {/* Header Section */}
      <View style={styles.header}>
        <Image
          source={{ uri: item.profile_pic || 'https://images.unsplash.com/photo-1595152772835-219674b2a8a6?crop=faces&fit=crop&w=300&h=300' }}
          style={styles.profileImg}
        />
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{item.empname || 'Unknown User'}</Text>
          <Text style={styles.timestamp}>{item.created_at || 'Just now'}</Text>
        </View>
      </View>

      {/* Post Content */}
      {item.post_text && <Text style={styles.caption}>{item.post_text}</Text>}
      {item.image_path && (
        <Image source={{ uri: item.image_path }} style={styles.postImage} />
      )}

      {/* Likes & Comments Count (clickable for comments) */}
      <View style={styles.statsRow}>
        <Text style={styles.statsText}>{likes} Likes</Text>
        <TouchableOpacity onPress={() => setShowComments(!showComments)}>
          <Text style={[styles.statsText, { color: '#1877F2', fontWeight: '500' }]}>
            {comments.length} Comments
          </Text>
        </TouchableOpacity>
      </View>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionBtn} onPress={handleLike}>
          <Ionicons
            name="thumbs-up"
            size={18}
            color={isLiked ? '#1877F2' : '#444'}
          />
          <Text style={[styles.actionLabel, isLiked && { color: '#1877F2' }]}>
            Like
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => setShowComments(!showComments)}
        >
          <Ionicons name="chatbubble-outline" size={18} color="#444" />
          <Text style={styles.actionLabel}>Comment</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => Alert.alert('Share', 'Feature coming soon!')}
        >
          <Ionicons name="share-social-outline" size={18} color="#444" />
          <Text style={styles.actionLabel}>Share</Text>
        </TouchableOpacity>
      </View>

      {/* Comments Section (only if toggled) */}
      {showComments && (
        <View style={styles.commentSection}>
          <ScrollView style={styles.commentsList} nestedScrollEnabled>
            {comments.map((c) => (
              <View key={c.id} style={styles.commentRow}>
                <Image
                  source={{
                    uri: c.user_pic || 'https://images.unsplash.com/photo-1595152772835-219674b2a8a6?crop=faces&fit=crop&w=300&h=300',
                  }}
                  style={styles.commentProfile}
                />
                <View style={styles.commentBox}>
                  <Text style={styles.commentUser}>{c.user}</Text>
                  <Text style={styles.commentText}>{c.text}</Text>
                  <Text style={styles.commentTime}>{c.created_at || ''}</Text>
                </View>
              </View>
            ))}
          </ScrollView>

          {/* Add Comment Box */}
          <View style={styles.addCommentRow}>
            <TextInput
              style={styles.commentInput}
              value={commentText}
              onChangeText={setCommentText}
              placeholder="Write a comment..."
              placeholderTextColor="#888"
            />
            <TouchableOpacity onPress={handleComment}>
              <Ionicons name="send" size={22} color="#1877F2" />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

export default PostCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    marginBottom: 10,
    paddingVertical: 10,
    borderRadius: 8,
    elevation: 2,
  },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10 },
  profileImg: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  name: { fontSize: 15, fontWeight: '600', color: '#000' },
  timestamp: { fontSize: 12, color: '#666' },

  caption: { fontSize: 14, color: '#222', margin: 10 },
  postImage: { width: '100%', height: 220, marginTop: 5 },

  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    marginVertical: 6,
  },
  statsText: { fontSize: 13, color: '#666' },

  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  actionBtn: { flexDirection: 'row', alignItems: 'center' },
  actionLabel: { marginLeft: 6, fontSize: 14, fontWeight: '500', color: '#444' },

  commentSection: { paddingHorizontal: 10, paddingTop: 8 },
  commentsList: { maxHeight: 140 },
  commentRow: { flexDirection: 'row', marginBottom: 8 },
  commentProfile: { width: 32, height: 32, borderRadius: 16, marginRight: 8 },
  commentBox: {
    backgroundColor: '#f0f2f5',
    padding: 8,
    borderRadius: 10,
    flex: 1,
  },
  commentUser: { fontWeight: '600', fontSize: 13, color: '#000' },
  commentText: { fontSize: 13, color: '#333', marginVertical: 2 },
  commentTime: { fontSize: 11, color: '#888' },

  addCommentRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    fontSize: 14,
    marginRight: 8,
  },
});





