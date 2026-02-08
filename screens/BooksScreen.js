import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { apiService } from '../api/apiService';
import { useAuth } from '../context/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function BooksScreen({ navigation }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { logout } = useAuth();

  useFocusEffect(
    React.useCallback(() => {
      loadBooks();
    }, [])
  );

  const loadBooks = async () => {
    try {
      setLoading(true);
      const data = await apiService.getBooks();
      setBooks(data);
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const data = await apiService.getBooks();
      setBooks(data);
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setRefreshing(false);
    }
  };

  const handleDelete = (bookId) => {
    Alert.alert('Delete Book', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        onPress: async () => {
          try {
            await apiService.deleteBook(bookId);
            setBooks(books.filter((b) => b.id !== bookId));
          } catch (error) {
            Alert.alert('Error', error.message);
          }
        },
        style: 'destructive',
      },
    ]);
  };

  const renderBook = ({ item }) => (
  <TouchableOpacity
    style={styles.card}
    onPress={() => navigation.navigate('BookDetails', { bookId: item.id })}
  >
    <View style={{ flex: 1 }}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.author}>by {item.author}</Text>
      {item.description && (
        <Text style={styles.desc} numberOfLines={2}>
          {item.description}
        </Text>
      )}
    </View>

    <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteBtn}>
      <Text style={styles.deleteText}>Delete</Text>
    </TouchableOpacity>
  </TouchableOpacity>
  );


  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4f46e5" />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📚 My Books</Text>
        <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* List */}
      {books.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>📭</Text>
          <Text style={styles.emptyTitle}>No books yet</Text>
          <Text style={styles.emptySubtitle}>Tap + to add your first book</Text>
        </View>
      ) : (
        <FlatList
          contentContainerStyle={{ padding: 16 }}
          data={books}
          renderItem={renderBook}
          keyExtractor={(item) => item.id.toString()}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      )}

      {/* Floating Add Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddBook')}
      >
        <Text style={styles.fabText}>＋</Text>
      </TouchableOpacity>
    </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fb',
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },

  headerTitle: {
    fontSize: 26,
    fontWeight: '700',
  },

  logoutBtn: {
    backgroundColor: '#e5e7eb',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },

  logoutText: {
    fontWeight: '600',
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,

    // shadow
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },

  title: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },

  author: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },

  desc: {
    fontSize: 12,
    color: '#9ca3af',
  },

  deleteBtn: {
    borderWidth: 1,
    borderColor: '#ef4444',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginLeft: 10,
  },

  deleteText: {
    color: '#ef4444',
    fontWeight: '600',
    fontSize: 12,
  },

  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  emptyEmoji: {
    fontSize: 40,
    marginBottom: 10,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
  },

  emptySubtitle: {
    color: '#6b7280',
    marginTop: 4,
  },

  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4f46e5',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },

  fabText: {
    color: '#fff',
    fontSize: 28,
    marginTop: -2,
  },
});
