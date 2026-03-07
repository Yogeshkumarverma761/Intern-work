# SmartStitch Chatbot Documentation

## Overview

The SmartStitch Chatbot is an AI-powered customer assistant that provides essential information about the site and recommends related clothing products. It's integrated as a floating widget that appears on all pages of the application.

## Features

### 1. **Information & Support**
The chatbot provides comprehensive information about:
- **About SmartStitch**: Company mission and overview
- **Features**: AI Try-On, Custom Measurements, Quality Assurance
- **Shipping & Delivery**: Delivery times, costs, and return policy
- **Pricing**: Budget information and discounts
- **FAQs**: Common questions answered
- **Categories**: Available product categories
- **Contact Info**: Customer support channels

### 2. **Product Recommendations**
The chatbot can:
- Suggest clothing items based on user preferences
- Recommend products by category (Suits, Dresses, Kurtas, etc.)
- Provide direct links to product pages
- Display product details (name, category, price, image)

### 3. **Smart Intent Recognition**
The chatbot automatically detects user intent from messages and:
- Provides relevant information for information queries
- Suggests products for shopping queries
- Offers follow-up suggestions
- Maintains contextual conversation flow

## Architecture

### Frontend Components

#### `ChatBot.jsx`
- Main React component managing the chatbot UI
- Floating window interface with message history
- Handles user input and API calls
- Displays product recommendations and suggestions
- Responsive design for mobile and desktop

#### `ChatBot.css`
- Complete styling for the chatbot widget
- Gradient pink color scheme (`#ec4899`)
- Responsive breakpoints for mobile devices
- Smooth animations and transitions
- Dark mode consideration with good contrast

#### `chatbotApi.js`
- API client for communicating with backend
- Three main endpoints:
  - `POST /api/chatbot/message` - Send user message
  - `GET /api/chatbot/info/:category` - Get specific information
  - `GET /api/chatbot/suggest` - Get product suggestions

### Backend Components

#### `chatbot.controller.js`
**Functions:**
- `handleChatbotMessage()` - Main message handler
  - Detects user intent using keyword mapping
  - Fetches relevant information or products
  - Returns formatted response with suggestions
  
- `getInfoCategory()` - Serves specific information
  
- `getSuggestedProducts()` - Handles product recommendations

**Intent Types:**
- `about` - Company and service information
- `features` - Available features and capabilities
- `shipping` - Delivery and shipping information
- `faq` - Frequently asked questions
- `categories` - Available product categories
- `contact` - Support and contact information
- `pricing` - Price information and discounts
- `recommend` - Product recommendations
- `general` - Default greeting and menu

#### `chatbot.route.js`
**Endpoints:**
```
POST /api/chatbot/message          - Send message to chatbot
GET  /api/chatbot/info/:category   - Get information by category
GET  /api/chatbot/suggest?query=   - Get product suggestions
```

## User Interface

### Floating Button
- Located at bottom-right corner of screen
- Pink gradient background with shadow
- Badge showing availability (can show unread count)
- Hover effects for better interactivity

### Chat Window
- **Dimensions**: 420px × 700px (adjusts on mobile)
- **Header**: Gradient pink with chatbot title
- **Message Area**: Scrollable with smooth animations
- **Features**:
  - User messages: Pink/right-aligned
  - Bot messages: Gray/left-aligned
  - Product cards with images and prices
  - Quick action suggestion buttons
  - Timestamps for each message
  - Typing indicator when bot is processing

### Input Area
- Text input field with placeholder
- Send button with icon
- Help text at the bottom
- Disabled state during loading

## How to Use

### For Users

1. **Open the Chatbot**
   - Click the pink floating button at the bottom-right
   - Chat window opens with a greeting

2. **Ask Questions**
   - Type questions about the site, products, or services
   - Press Enter or click Send button
   - Bot responds with relevant information

3. **Get Recommendations**
   - Ask for clothing recommendations
   - Mention what you're looking for (casual, formal, etc.)
   - Bot displays suggested products with details
   - Click product cards to view full details

4. **Quick Actions**
   - Use suggestion buttons for common queries
   - Follow bot's suggestions for next steps
   - Explore related topics

### Example Queries

**Information Queries:**
- "Tell me about SmartStitch"
- "What features do you offer?"
- "How much does shipping cost?"
- "Do you offer returns?"
- "How can I contact you?"

**Product Recommendations:**
- "Recommend a casual suit"
- "I want an elegant dress"
- "Show me floral designs"
- "What kurtas do you have?"
- "Suggest something formal"

**General:**
- "Help"
- "What can you do?"
- "Tell me more"

## Technical Integration

### Installation Steps

1. **Frontend Setup**
   ```bash
   # Components added to:
   # - src/components/ChatBot/ChatBot.jsx
   # - src/components/ChatBot/ChatBot.css
   # - src/api/chatbotApi.js
   
   # Updated:
   # - src/App.jsx (added ChatBot component)
   ```

2. **Backend Setup**
   ```bash
   # Files added to:
   # - server/controllers/chatbot.controller.js
   # - server/routes/chatbot.route.js
   
   # Updated:
   # - server/app.js (added route import and middleware)
   ```

3. **Database Requirements**
   - Uses existing `Clothes` model
   - No new database schema required
   - Queries existing product collection

### Environment Setup

Add to `.env` file if needed:
```
VITE_API_URL=http://localhost:5000/api
```

## Customization Guide

### Change Colors
Edit `ChatBot.css`:
```css
/* Current: Pink (#ec4899) */
/* Change gradient to your brand color */
background: linear-gradient(135deg, #YourColor1 0%, #YourColor2 100%);
```

### Add More Information Categories
Edit `chatbot.controller.js`:
```javascript
const siteInfo = {
  // Add new category here
  newCategory: 'Your information text'
};

// Add keywords to detect it
const keywordIntents = {
  newCategory: ['keyword1', 'keyword2', ...]
};
```

### Modify Intent Detection
Update keyword mappings in `chatbot.controller.js` to improve recognition of user queries.

### Add Database Integration
The chatbot already integrates with the Clothes database for product recommendations. You can extend this by:
- Adding more detailed product filtering in `extractPreferences()`
- Implementing user preference learning
- Adding product ratings and reviews to recommendations

## API Response Format

### Successful Response
```json
{
  "message": "Bot response text",
  "products": [
    {
      "_id": "product_id",
      "name": "Product Name",
      "category": "Category",
      "price": 3500,
      "image": "/path/to/image.png"
    }
  ],
  "suggestions": ["Suggestion 1", "Suggestion 2"],
  "intent": "recommend"
}
```

### Error Response
```json
{
  "message": "Error message",
  "error": "Detailed error information"
}
```

## Performance Considerations

1. **Message Caching**: Consider implementing Redis for frequently asked information
2. **Product Queries**: Use database indexes on category field for faster queries
3. **Image Optimization**: Ensure product images are optimized for quick loading
4. **Rate Limiting**: Consider adding rate limits to prevent abuse

## Future Enhancements

1. **AI/ML Integration**
   - Use NLP for better intent recognition
   - Machine learning for personalized recommendations
   - Sentiment analysis for user satisfaction

2. **User Context**
   - Remember user preferences across sessions
   - Personalized recommendations based on history
   - User feedback tracking

3. **Advanced Features**
   - Order tracking through chatbot
   - Size recommendation based on measurements
   - Integration with AI Try-On feature
   - Wishlist management

4. **Analytics**
   - Track popular queries
   - Monitor chatbot satisfaction
   - Analyze user behavior patterns
   - A/B testing for responses

5. **Multi-language Support**
   - Implement translation API
   - Support Hindi, regional languages
   - Localized product recommendations

## Troubleshooting

### Chatbot Not Appearing
- Check if ChatBot component is imported in App.jsx
- Verify CSS file is loaded correctly
- Check browser console for errors

### API Errors
- Ensure backend server is running
- Verify `/api/chatbot` routes are registered
- Check MongoDB connection
- Verify environment variables are set

### Product Recommendations Not Showing
- Ensure Clothes model exists and has data
- Check database connection
- Verify product image paths
- Check browser console for API errors

### Styling Issues
- Clear browser cache
- Check CSS file path
- Verify Tailwind CSS is configured
- Check for CSS conflicts with other styles

## Testing the Chatbot

### Manual Testing Checklist
- [ ] Chatbot button appears on all pages
- [ ] Window opens and closes properly
- [ ] Messages send and receive correctly
- [ ] Products display with images and prices
- [ ] Suggestions work as clickable buttons
- [ ] Responsive on mobile devices
- [ ] Timestamps display correctly
- [ ] Typing indicator shows during loading
- [ ] Error handling works properly
- [ ] Product links navigate correctly

## Browser Compatibility

- ✅ Chrome/Edge (Latest)
- ✅ Firefox (Latest)
- ✅ Safari (Latest)
- ✅ Mobile browsers
- ✅ Responsive design (320px+)

## Support & Feedback

For issues or feature requests related to the chatbot:
1. Check this documentation
2. Review the troubleshooting section
3. Check browser console for errors
4. Contact development team with error details

---

**Last Updated**: February 2026
**Version**: 1.0
**Status**: Production Ready
