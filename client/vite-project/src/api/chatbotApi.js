import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const getChatbotResponse = async (userMessage) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/chatbot/message`, {
      message: userMessage
    });
    return response.data;
  } catch (error) {
    console.error('Chatbot API error:', error);
    throw error;
  }
};

export const getChatbotInfo = async (infoType) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/chatbot/info/${infoType}`);
    return response.data;
  } catch (error) {
    console.error('Chatbot info API error:', error);
    throw error;
  }
};

export const getSuggestedProducts = async (searchQuery) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/chatbot/suggest`, {
      params: { query: searchQuery }
    });
    return response.data;
  } catch (error) {
    console.error('Suggested products API error:', error);
    throw error;
  }
};
