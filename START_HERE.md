# Get Started in 5 Minutes! 🚀

## Step 1: Start Backend (30 seconds)

```bash
cd server
npm start
```

**Wait for message:**
```
✓ Connected to MongoDB
✓ Listening on port 5000
```

---

## Step 2: Start Frontend (30 seconds)

Open **new terminal** in `client/vite-project`:

```bash
npm run dev
```

**Wait for message:**
```
➜  Local:   http://localhost:5173/
```

---

## Step 3: Open Browser (30 seconds)

Go to: **http://localhost:5173**

Look for **pink button** at bottom-right corner ✓

---

## Step 4: Try the Chatbot! (2 minutes)

1. **Click the pink button**
   - Chat window opens with greeting

2. **Ask a question:**
   ```
   "Tell me about SmartStitch"
   ```
   - Bot responds with information ✓

3. **Get recommendations:**
   ```
   "Show me casual suits"
   ```
   - Bot shows 3 products with images ✓

4. **Check shipping:**
   ```
   "How does shipping work?"
   ```
   - Bot shows shipping details ✓

---

## 🎉 It Works!

The chatbot is now:
- ✅ Visible on all pages
- ✅ Answering questions
- ✅ Recommending products
- ✅ Showing product images & prices

---

## 📚 Next Steps

1. **Read Quick Setup Guide:**
   ```
   CHATBOT_QUICK_SETUP.md
   ```

2. **Understand the System:**
   ```
   CHATBOT_DOCUMENTATION.md
   ```

3. **Learn the API:**
   ```
   CHATBOT_API_REFERENCE.md
   ```

4. **Deploy to Production:**
   ```
   CHATBOT_DEPLOYMENT_GUIDE.md
   ```

---

## 🐛 Having Issues?

### Chatbot button not showing?
- Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
- Check browser console (F12) for errors

### API errors?
- Make sure backend is running
- Check if port 5000 is accessible
- Open Network tab (F12) to see API calls

### No products showing?
- Verify MongoDB is running
- Check if Clothes collection has data
- Look at server console for errors

**Full troubleshooting:** See **CHATBOT_DEPLOYMENT_GUIDE.md**

---

## 🎨 Customize It

Want to change colors?

Edit: `client/vite-project/src/components/ChatBot/ChatBot.css`

Find:
```css
background: linear-gradient(135deg, #ec4899 0%, #db2777 100%);
```

Replace with your color (e.g., `#007bff` for blue)

---

## 📞 Files Created

**Frontend:**
- `src/components/ChatBot/ChatBot.jsx` - Main component
- `src/components/ChatBot/ChatBot.css` - Styling
- `src/api/chatbotApi.js` - API client

**Backend:**
- `server/controllers/chatbot.controller.js` - Logic
- `server/routes/chatbot.route.js` - Routes

**Documentation:**
- `CHATBOT_DOCUMENTATION.md` - Complete guide
- `CHATBOT_QUICK_SETUP.md` - Setup guide
- `CHATBOT_API_REFERENCE.md` - API docs
- `CHATBOT_DEPLOYMENT_GUIDE.md` - Deployment
- `CHATBOT_IMPLEMENTATION_SUMMARY.md` - Summary

---

## 🚀 You're Ready!

The chatbot system is:
- ✅ Fully implemented
- ✅ Production ready
- ✅ Well documented
- ✅ Easy to customize

**Enjoy! Questions? Check the documentation files!**

---

*SmartStitch Chatbot - Make your customers happy! 💬*
