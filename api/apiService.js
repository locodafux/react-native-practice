import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://10.185.98.182:8000';

const getAuthHeader = async () => {
  const token = await AsyncStorage.getItem('userToken');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const apiService = {
  // Books endpoints
  getBooks: async () => {
    const headers = await getAuthHeader();
    const response = await fetch(`${API_URL}/books`, {
      method: 'GET',
      headers,
    });
    if (!response.ok) throw new Error('Failed to fetch books');
    return response.json();
  },

  getBook: async (bookId) => {
    const headers = await getAuthHeader();
    const response = await fetch(`${API_URL}/books/${bookId}`, {
      method: 'GET',
      headers,
    });
    if (!response.ok) throw new Error('Failed to fetch book');
    return response.json();
  },

  createBook: async (title, author, description = null) => {
    const headers = await getAuthHeader();
    const response = await fetch(`${API_URL}/books`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ title, author, description }),
    });
    if (!response.ok) throw new Error('Failed to create book');
    return response.json();
  },

  updateBook: async (bookId, title, author, description = null) => {
    const headers = await getAuthHeader();
    const response = await fetch(`${API_URL}/books/${bookId}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ title, author, description }),
    });
    if (!response.ok) throw new Error('Failed to update book');
    return response.json();
  },

  deleteBook: async (bookId) => {
    const headers = await getAuthHeader();
    const response = await fetch(`${API_URL}/books/${bookId}`, {
      method: 'DELETE',
      headers,
    });
    if (!response.ok) throw new Error('Failed to delete book');
  },
};
