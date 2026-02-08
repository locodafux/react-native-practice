import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { apiService } from '../api/apiService';

export default function BookDetailsScreen({ route }) {
  const { bookId } = route.params;
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBook();
  }, []);

  const loadBook = async () => {
    try {
      const data = await apiService.getBook(bookId);
      setBook(data);
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4f46e5" />
      </View>
    );
  }

  if (!book) {
    return (
      <View style={styles.center}>
        <Text>Book not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{book.title}</Text>
      <Text style={styles.author}>by {book.author}</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>
          {book.description || 'No description'}
        </Text>
      </View>

      <Text style={styles.id}>Book ID: {book.id}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fb',
    padding: 20,
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 6,
  },

  author: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 20,
  },

  section: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 2,
  },

  sectionTitle: {
    fontWeight: '700',
    marginBottom: 8,
  },

  description: {
    color: '#444',
    lineHeight: 20,
  },

  id: {
    color: '#9ca3af',
    fontSize: 12,
  },
});
