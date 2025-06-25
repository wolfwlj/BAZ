import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { 
  getUnreadMotivationalMessagesByUser, 
  getTimedMotivationalMessages,
  markMessageAsRead 
} from '../services/MotivationalMessageService';
import MotivationalMessage from './MotivationalMessage';

const MotivationalMessageManager = () => {
  const { userInfo } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch messages on component mount and periodically
  useEffect(() => {
    fetchMessages();

    // Set up interval to check for new messages every 5 minutes
    const interval = setInterval(() => {
      fetchMessages();
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const fetchMessages = async () => {
    if (!userInfo || !userInfo.ID) return;

    setRefreshing(true);
    
    try {
      // Get unread messages
      const unreadResponse = await getUnreadMotivationalMessagesByUser(userInfo.ID);
      
      // Get timed messages (based on current time)
      const timedResponse = await getTimedMotivationalMessages(userInfo.ID);
      
      if (unreadResponse.success && timedResponse.success) {
        const unreadMessages = unreadResponse.data.motivational_messages || [];
        const timedMessages = timedResponse.data.motivational_messages || [];
        
        // Combine and deduplicate messages
        const allMessages = [...unreadMessages];
        
        timedMessages.forEach(timedMsg => {
          // Only add if not already in the list
          if (!allMessages.some(msg => msg.ID === timedMsg.ID)) {
            allMessages.push(timedMsg);
          }
        });
        
        setMessages(allMessages);
      }
    } catch (error) {
      console.error('Error fetching motivational messages:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleDismiss = async (messageId) => {
    // Mark message as read in the backend
    await markMessageAsRead(messageId);
    
    // Remove from local state
    setMessages(prevMessages => 
      prevMessages.filter(msg => msg.ID !== messageId)
    );
  };

  if (messages.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={item => item.ID.toString()}
        renderItem={({ item }) => (
          <MotivationalMessage 
            message={item} 
            onDismiss={() => handleDismiss(item.ID)} 
          />
        )}
        style={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
    marginBottom: 8,
  },
  list: {
    maxHeight: 200, // Limit height so it doesn't take over the screen
  },
});

export default MotivationalMessageManager;
