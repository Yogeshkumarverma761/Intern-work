import express from 'express';
import {
  handleChatbotMessage,
  getInfoCategory,
  getSuggestedProducts
} from '../controllers/chatbot.controller.js';

const router = express.Router();

// POST: Send message to chatbot
router.post('/message', handleChatbotMessage);

// GET: Get specific info category
router.get('/info/:category', getInfoCategory);

// GET: Get product suggestions
router.get('/suggest', getSuggestedProducts);

export default router;
