# SmartStitch Chatbot - Quick Setup Guide

## 🚀 Quick Start

### What's Been Created?

A fully functional AI chatbot that:
✅ Provides site information (features, shipping, pricing, etc.)
✅ Recommends clothing products based on user preferences
✅ Appears as a floating widget on all pages
✅ Has smart intent recognition
✅ Displays product images, names, and prices
✅ Fully responsive on mobile and desktop

---

## 📁 Files Created/Modified

### Frontend Files Created:
```
client/vite-project/src/
├── components/ChatBot/
│   ├── ChatBot.jsx (Main component)
│   └── ChatBot.css (Styling)
├── api/
│   └── chatbotApi.js (API client)
```

### Backend Files Created:
```
server/
├── controllers/
│   └── chatbot.controller.js (Logic)
└── routes/
    └── chatbot.route.js (Routes)
```

### Files Modified:
```
client/vite-project/src/App.jsx (Added ChatBot component)
server/app.js (Added chatbot routes)
```

### Documentation:
```
CHATBOT_DOCUMENTATION.md (Complete guide)
CHATBOT_QUICK_SETUP.md (This file)
```

---

## 🎯 How to Run

### 1. **Start Backend Server**
```bash
cd server
npm install  # if needed
npm start    # or appropriate start script
```

### 2. **Start Frontend Development Server**
```bash
cd client/vite-project
npm install  # if needed
npm run dev
```

### 3. **Open in Browser**
```
http://localhost:5173
```

### 4. **Test Chatbot**
- Look for pink floating button at bottom-right
- Click to open chatbot
- Try asking:
  - "Tell me about SmartStitch"
  - "Recommend a casual suit"
  - "How much does shipping cost?"
  - "What products do you have?"

---

## 🎨 Preview

### Chatbot Widget Features:
- **Floating Button**: Pink gradient, appears on all pages
- **Chat Window**: 420px × 700px (responsive)
- **Magic Features**:
  - Real-time messaging
  - Product recommendations with thumbnails
  - Quick action buttons
  - Typing indicators
  - Message timestamps
  - Smooth animations

---

## 🤖 What the Chatbot Can Do

### 1. **Answer Questions About**
- Company information
- Features and capabilities
- Shipping and delivery
- Pricing and discounts
- Returns and FAQs
- Contact information
- Product categories

### 2. **Recommend Products**
- By category (Suits, Dresses, Kurtas)
- By style (Casual, Formal, Party)
- With direct links to product pages
- Shows price and product image

### 3. **Smart Intent Recognition**
- Understands what user is asking for
- Provides relevant information or products
- Suggests next steps
- Maintains conversation context

---

## 📝 Example Conversations

### Getting Product Recommendations:
```
User: "Show me casual suits"
Bot: "Great! Here are casual suit recommendations"
     [Shows 3 products with images, prices, links]
     Suggestions: [Show more options] [Tell me about features]
```

### Getting Information:
```
User: "How does shipping work?"
Bot: "🚚 We offer:
     - Fast shipping to your doorstep
     - Free shipping on orders above ₹5000
     - Standard delivery: 5-7 business days
     - Express delivery: 2-3 business days"
```

### General Help:
```
User: "Help me"
Bot: "I can tell you about:
     • What SmartStitch offers
     • Our features and services
     • Shipping & delivery
     • Pricing and discounts
     [Quick action buttons]"
```

---

## 🔧 Configuration

### Change API URL (if needed)
Edit: `client/vite-project/src/api/chatbotApi.js`
```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
```

### Add to .env (Optional)
```
VITE_API_URL=http://localhost:5000/api
```

---

## 🎨 Customize Appearance

### Change Color Scheme
Edit: `client/vite-project/src/components/ChatBot/ChatBot.css`

Find this line (appears multiple times):
```css
background: linear-gradient(135deg, #ec4899 0%, #db2777 100%);
```

Replace with your brand color:
```css
background: linear-gradient(135deg, #YOUR_COLOR_1 0%, #YOUR_COLOR_2 100%);
```

### Adjust Window Size
```css
.chatbot-window {
  width: 420px;   /* Change width */
  height: 700px;  /* Change height */
}
```

---

## 🚀 Deploy to Production

### Frontend Deployment
```bash
cd client/vite-project
npm run build
# Upload dist/ folder to your hosting
```

### Backend Deployment
```bash
cd server
# Deploy to your server/cloud platform
# Ensure environment variables are set
```

### Update API URL
```javascript
// In chatbotApi.js
const API_BASE_URL = 'https://your-api-domain.com/api';
```

---

## 🐛 Troubleshooting

### Chatbot Not Showing?
1. ✓ Is backend running? (Check console for errors)
2. ✓ Is frontend running? (Check http://localhost:5173)
3. ✓ Are routes registered? (Check server/app.js)
4. ✓ Check browser console (F12) for errors

### Products Not Loading?
1. ✓ Verify MongoDB is connected
2. ✓ Check if Clothes collection has data
3. ✓ Look at API response in Network tab
4. ✓ Check server console for database errors

### Styling Issues?
1. ✓ Clear browser cache (Ctrl+Shift+Delete)
2. ✓ Check if ChatBot.css is imported
3. ✓ Verify CSS file path is correct
4. ✓ Check for CSS conflicts in console

---

## 📊 Testing the Chatbot

### Test Queries:
```
Information Queries:
✓ "Tell me about SmartStitch"
✓ "What's the shipping cost?"
✓ "Do you offer returns?"
✓ "How to contact support?"
✓ "What categories do you have?"

Product Queries:
✓ "Recommend a suit"
✓ "Show me dresses"
✓ "I want a kurta"
✓ "What's available?"
✓ "Casual clothing suggestions"

General:
✓ "Help"
✓ "Hi"
✓ (long custom messages)
```

---

## 📚 Key Features Summary

| Feature | Details |
|---------|---------|
| **UI Framework** | React 19 |
| **Styling** | Tailwind CSS + Custom CSS |
| **Backend** | Node.js/Express |
| **Database** | MongoDB |
| **API Style** | RESTful |
| **Mobile Ready** | Yes (Responsive) |
| **Dark Mode** | Not included (can be added) |
| **Animations** | Smooth transitions |
| **Icons** | Lucide React |

---

## 🎓 Understanding the Code

### Frontend Flow:
```
User types message
    ↓
handleSendMessage() sends to API
    ↓
getChatbotResponse() calls backend
    ↓
Response received with message + products
    ↓
UI updates with bot message
    ↓
Products displayed as cards
    ↓
User can click to view details
```

### Backend Flow:
```
Request received at /api/chatbot/message
    ↓
detectIntent() analyzes user message
    ↓
getResponseMessage() generates response
    ↓
extractPreferences() for products
    ↓
Query Clothes collection if needed
    ↓
Format response with products + suggestions
    ↓
Send JSON response to frontend
```

---

## 📈 Next Steps

After setup, you can:
1. **Test thoroughly** with various queries
2. **Customize colors** to match brand
3. **Add more information** to siteInfo object
4. **Track analytics** with additional logging
5. **Implement ML** for better recommendations
6. **Add more languages** for localization
7. **Deploy to production**

---

## 🤝 Integration Points

### Chatbot connects with:
- ✅ Existing Clothes/Products database
- ✅ Product Detail pages (/product/:id)
- ✅ User authentication (context ready)
- ✅ Cart system (can be extended)
- ✅ All pages via App.jsx

### Can be extended for:
- Order tracking
- Wishlist management
- Size recommendations
- AI Try-On integration
- User preferences learning

---

## 📞 Support

For issues or questions:
1. Check CHATBOT_DOCUMENTATION.md for detailed info
2. Review this Quick Setup guide
3. Check browser console (F12) for errors
4. Check server console for backend errors
5. Verify all files are in correct locations

---

## ✅ Verification Checklist

After setup, verify:
- [ ] Backend server running without errors
- [ ] Frontend server running without errors
- [ ] Chatbot button visible on home page
- [ ] Can open/close chat window
- [ ] Can type and send messages
- [ ] Bot responds with appropriate messages
- [ ] Product recommendations load
- [ ] Product images display
- [ ] Can click product cards
- [ ] Works on mobile (responsive)
- [ ] No console errors
- [ ] API calls visible in Network tab

---

**Status**: ✅ Ready to Use
**Files**: All created and integrated
**Next Step**: Start servers and test!

---

*Last Updated: February 2026*
*SmartStitch Chatbot v1.0*
