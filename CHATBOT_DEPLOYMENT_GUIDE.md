# SmartStitch Chatbot - Deployment & Troubleshooting Guide

## Pre-Deployment Checklist

### Development Environment
- [ ] Node.js installed (v14+)
- [ ] MongoDB running locally or accessible
- [ ] Git initialized (for version control)
- [ ] Environment variables configured
- [ ] All dependencies installed

### Code Quality
- [ ] No console errors in development
- [ ] No ESLint warnings (or acceptable)
- [ ] All imports resolve correctly
- [ ] API endpoints tested with Postman
- [ ] Database queries tested

### Testing
- [ ] Chatbot appears on all pages
- [ ] Message sending works
- [ ] Bot responds to different queries
- [ ] Product recommendations load
- [ ] Links work correctly
- [ ] Responsive on mobile devices
- [ ] No memory leaks

---

## Development Setup Issues & Solutions

### Issue: Chatbot Button Not Appearing

**Symptoms:**
- No pink button at bottom-right
- Button appears inconsistently

**Solutions:**
1. **Check imports in App.jsx:**
   ```bash
   # Verify this line exists:
   import ChatBot from "./components/ChatBot/ChatBot.jsx";
   ```

2. **Check ChatBot component is rendered:**
   ```bash
   # In App.jsx, inside CartProvider:
   <ChatBot />
   ```

3. **Verify CSS file exists:**
   ```bash
   ls src/components/ChatBot/ChatBot.css
   ```

4. **Check z-index:**
   - Make sure other elements don't have higher z-index
   - Chatbot uses `z-index: 9999`

5. **Clear cache:**
   ```bash
   # Hard refresh in browser
   Ctrl+Shift+R (Windows)
   Cmd+Shift+R (Mac)
   ```

---

### Issue: "API Connection Failed" or 404 Errors

**Symptoms:**
- Chatbot opens but shows errors
- Message: "Sorry, I encountered an error"

**Solutions:**
1. **Verify backend is running:**
   ```bash
   # Check if server is listening on port 5000
   curl http://localhost:5000/
   # Should show: "Hello World!"
   ```

2. **Check API route is registered:**
   ```bash
   # In server/app.js, verify:
   import chatbotRoutes from './routes/chatbot.route.js'
   app.use('/api/chatbot', chatbotRoutes);
   ```

3. **Check CORS configuration:**
   ```bash
   # In server/app.js, verify localhost:5173 is in allowed origins:
   app.use(cors({
     origin: ['http://localhost:5173', ...],
     credentials: true
   }));
   ```

4. **Test endpoint directly:**
   ```bash
   curl -X POST http://localhost:5000/api/chatbot/message \
     -H "Content-Type: application/json" \
     -d '{"message": "hello"}'
   ```

5. **Check environment variables:**
   ```bash
   # In client/vite-project/src/api/chatbotApi.js
   # Verify API_BASE_URL is correct
   echo $VITE_API_URL  # Should be set or default to localhost
   ```

---

### Issue: Empty Product List in Recommendations

**Symptoms:**
- Chatbot responds but shows no products
- Products list is empty

**Solutions:**
1. **Verify MongoDB connection:**
   ```bash
   # Check in server console:
   # Should show connection successful
   ```

2. **Check if Clothes collection has data:**
   ```bash
   # MongoDB shell:
   use smartstitch  # or your db name
   db.clothes.count()  # Should show > 0
   ```

3. **Verify Clothes model:**
   ```bash
   # Check server/models/clothes.model.js exists
   # and exports correctly
   ```

4. **Test database query directly:**
   ```bash
   # In server console or test file:
   const clothes = await Clothes.find({}).limit(3);
   console.log(clothes);
   ```

5. **Check image paths:**
   - Ensure product images exist in public folder
   - Image paths should be accessible from frontend

---

### Issue: Messages Not Sending

**Symptoms:**
- Input field accepts text
- Clicking send does nothing
- No error message shown

**Solutions:**
1. **Check network tab (F12):**
   - DevTools → Network tab
   - Send message
   - Look for POST to `/api/chatbot/message`
   - Check Status code (should be 200)

2. **Check browser console:**
   ```bash
   # DevTools → Console
   # Look for JavaScript errors
   ```

3. **Verify input validation:**
   ```javascript
   // In ChatBot.jsx: handleSendMessage()
   if (!inputValue.trim()) return;  // Should allow non-empty strings
   ```

4. **Check API client:**
   ```bash
   # Verify src/api/chatbotApi.js
   # getChatbotResponse() function exists
   ```

5. **Test with sample payload:**
   ```bash
   curl -X POST http://localhost:5000/api/chatbot/message \
     -H "Content-Type: application/json" \
     -d '{"message": "test"}'
   ```

---

### Issue: Styling Problems (Colors, Layout)

**Symptoms:**
- Colors don't match
- Layout is broken on mobile
- Text is cut off

**Solutions:**
1. **Verify CSS file is imported:**
   ```bash
   # In ChatBot.jsx:
   import './ChatBot.css';
   ```

2. **Clear CSS cache:**
   ```bash
   # In browser DevTools:
   Ctrl+Shift+Delete → Clear cache
   # Or use Hard refresh: Ctrl+Shift+R
   ```

3. **Check for CSS conflicts:**
   ```bash
   # DevTools → Elements/Inspector
   # Inspect elements
   # Check Computed styles
   ```

4. **Verify Tailwind CSS:**
   - If using Tailwind utilities, ensure Tailwind is configured
   - Current setup uses custom CSS mostly

5. **Test responsive:**
   ```bash
   # Press F12 → Responsive Design Mode
   # Resize to different dimensions
   ```

---

### Issue: Typing Indicator Always Shows

**Symptoms:**
- "..." keeps bouncing
- Messages never arrive

**Solutions:**
1. **Check isLoading state:**
   ```javascript
   // In ChatBot.jsx, verify:
   setIsLoading(false);  // Is called in finally block
   ```

2. **Verify API response:**
   - Check browser Network tab
   - Ensure server sends valid JSON response

3. **Check error handling:**
   ```javascript
   // Should have try-catch
   catch (error) {
     setIsLoading(false);  // Stop loading
     // Show error message
   }
   ```

---

## Deployment Issues & Solutions

### Issue: Cannot Deploy Frontend

**Symptoms:**
- `npm run build` fails
- Build optimization errors

**Solutions:**
1. **Check build command:**
   ```bash
   cd client/vite-project
   npm run build
   # Should create dist/ folder
   ```

2. **Verify all imports:**
   ```bash
   # Check for missing files
   npm run lint
   ```

3. **Check Node version:**
   ```bash
   node --version  # Should be v14+
   ```

4. **Clear node_modules:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   npm run build
   ```

5. **Check environment variables:**
   ```bash
   # Ensure VITE_API_URL is set in .env.production
   VITE_API_URL=https://your-api-domain/api
   ```

---

### Issue: Cannot Deploy Backend

**Symptoms:**
- Server fails to start on production
- Port already in use

**Solutions:**
1. **Check port availability:**
   ```bash
   lsof -i :5000  # macOS/Linux
   netstat -ano | findstr :5000  # Windows
   ```

2. **Use different port:**
   ```bash
   # In .env:
   PORT=3001
   ```

3. **Check MongoDB connection:**
   ```bash
   # In production, ensure:
   MONGODB_URI=your_production_mongo_uri
   ```

4. **Verify all dependencies installed:**
   ```bash
   cd server
   npm install
   npm start
   ```

5. **Check environment variables:**
   ```bash
   # .env file should have:
   MONGODB_URI=...
   ALLOWED_ORIGINS=https://yourdomain.com
   ```

---

### Issue: CORS Errors in Production

**Symptoms:**
- Error: "Access to XMLHttpRequest has been blocked by CORS policy"

**Solutions:**
1. **Update CORS configuration:**
   ```javascript
   // In server/app.js:
   app.use(cors({
     origin: 'https://yourdomain.com',
     credentials: true
   }));
   ```

2. **Update API URL in frontend:**
   ```javascript
   // In chatbotApi.js or .env:
   VITE_API_URL=https://your-api-domain/api
   ```

3. **Check preflight requests:**
   - Ensure OPTIONS method is allowed
   - Check Content-Type header

4. **Verify domain is exact:**
   - No extra slashes or parameters
   - HTTPS instead of HTTP

---

### Issue: Database Connection Fails in Production

**Symptoms:**
- Chatbot loads but products don't
- Server console shows connection error

**Solutions:**
1. **Verify MongoDB URI:**
   ```bash
   # In .env:
   MONGODB_URI=mongodb+srv://user:password@host/database
   ```

2. **Check network access:**
   - Ensure server IP is whitelisted in MongoDB Atlas
   - Firewall allows MongoDB port (27017)

3. **Test connection:**
   ```bash
   mongo "mongodb+srv://user:password@host/database"
   ```

4. **Use connection pooling:**
   - Mongoose handles this automatically
   - Increase pool size if needed

---

## Performance Troubleshooting

### Issue: Slow Message Response

**Symptoms:**
- Takes 10+ seconds to get response
- Typing indicator shows too long

**Solutions:**
1. **Check database query speed:**
   ```bash
   # In MongoDB:
   db.clothes.find({}).explain("executionStats")
   ```

2. **Add database indexes:**
   ```javascript
   // In MongoDB:
   db.clothes.createIndex({ "category": 1 })
   db.clothes.createIndex({ "title": 1 })
   ```

3. **Reduce query limits:**
   ```javascript
   // In controller: limit(3) is already set
   // Can reduce further if needed
   products = await Clothes.find(query).limit(3).lean();
   ```

4. **Enable caching:**
   ```javascript
   // Add Redis caching for static info
   const infoCache = new Map();
   ```

5. **Monitor server:**
   - Check CPU usage
   - Check memory usage
   - Check network latency

---

### Issue: High Memory Usage

**Symptoms:**
- Application becomes slow
- Server eventually crashes

**Solutions:**
1. **Check for memory leaks:**
   ```bash
   # Use Node.js inspector:
   node --inspect server/index.js
   ```

2. **Limit message history:**
   - Frontend: Keep last 50 messages only
   - Implement pagination

3. **Use lean() queries:**
   ```javascript
   // Already implemented:
   .lean()  // Returns plain objects, faster
   ```

---

## Logging & Monitoring

### Enable Detailed Logging

**Backend:**
```javascript
// In server/app.js:
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`${timestamp} ${req.method} ${req.path}`);
  res.on('finish', () => {
    console.log(`${res.statusCode} ${res.statusMessage}`);
  });
  next();
});
```

**Frontend:**
```javascript
// In ChatBot.jsx:
console.log('Sending message:', inputValue);
const response = await getChatbotResponse(inputValue);
console.log('Response:', response);
```

---

## Verification Checklist After Deployment

### Frontend
- [ ] Website loads without errors
- [ ] Chatbot button visible on all pages
- [ ] Can open/close chat window
- [ ] Chat sends messages
- [ ] Bot responds appropriately
- [ ] Product recommendations display
- [ ] Images load correctly
- [ ] Links to products work
- [ ] Responsive on mobile
- [ ] No console errors (F12)

### Backend
- [ ] Server starts without errors
- [ ] Database connection successful
- [ ] API endpoints respond (test with curl/Postman)
- [ ] CORS allows frontend domain
- [ ] Products load from database
- [ ] No memory leaks
- [ ] Response times acceptable (<1s)
- [ ] Error handling works
- [ ] Logs show expected requests

### Integration
- [ ] Frontend can reach backend API
- [ ] Messages appear in server logs
- [ ] Products appear in responses
- [ ] No 404 or 500 errors
- [ ] User context/authentication works (if needed)
- [ ] HTTPS/SSL working (if applicable)

---

## Testing Commands

### Test Backend API
```bash
# Test if server is running
curl http://localhost:5000/

# Test chatbot endpoint
curl -X POST http://localhost:5000/api/chatbot/message \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello"}'

# Test info endpoint
curl http://localhost:5000/api/chatbot/info/shipping

# Test suggestions endpoint
curl http://localhost:5000/api/chatbot/suggest?query=suit
```

### Test Frontend with DevTools
```javascript
// In browser console:
// Test API directly
const response = await fetch('/api/chatbot/message', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ message: 'test' })
});
console.log(await response.json());
```

---

## Quick Fix Reference

| Problem | Quick Fix |
|---------|-----------|
| No button | Import ChatBot in App.jsx |
| API errors | Check backend running + CORS |
| No products | Verify MongoDB + data exists |
| Slow | Add database indexes |
| Layout broken | Hard refresh + clear cache |
| CORS error | Update origin in app.js |
| Message not sending | Check Network tab + console |
| Images not loading | Check image paths + public folder |

---

## Emergency Debug Mode

### Enable All Logging
```javascript
// In ChatBot.jsx - uncomment for debugging:
console.log('=== CHATBOT DEBUG ===');
console.log('Sending:', inputValue);
console.log('Response:', response);
console.log('Products:', response.products);
console.log('Intent:', response.intent);
```

### Check Everything
```bash
# Terminal 1: Backend
cd server
npm start
# Should see: "Connected to MongoDB"
# Should see: "Listening on port 5000"

# Terminal 2: Frontend
cd client/vite-project
npm run dev
# Should see: "VITE v4.x.x ... ready in xxx ms"

# Terminal 3: Check requests
# Open browser DevTools (F12)
# Network tab
# Console tab
# Send message and watch requests
```

---

## Support Resources

1. **Documentation:**
   - CHATBOT_DOCUMENTATION.md (complete guide)
   - CHATBOT_QUICK_SETUP.md (quick start)
   - CHATBOT_API_REFERENCE.md (API docs)

2. **Code Files:**
   - Frontend: client/vite-project/src/components/ChatBot/
   - Backend: server/controllers/chatbot.controller.js
   - Routes: server/routes/chatbot.route.js

3. **External Resources:**
   - React docs: https://react.dev
   - Express docs: https://expressjs.com
   - MongoDB docs: https://docs.mongodb.com

---

## Common Error Messages & Solutions

### "Cannot find module ChatBot"
```
Solution: Check import path in App.jsx
import ChatBot from "./components/ChatBot/ChatBot.jsx";
```

### "ECONNREFUSED: Connection refused"
```
Solution: Backend server not running
cd server && npm start
```

### "MongoServerSelectionError"
```
Solution: MongoDB not running or wrong URI
Check MONGODB_URI in .env
```

### "TypeError: Cannot read property 'map' of undefined"
```
Solution: Response doesn't have products array
Check API response structure in Network tab
```

---

**Last Updated:** February 2026
**Version:** 1.0
**Status:** Production Ready

For additional help, review the documentation files or check the code comments.

---

*Remember: Always test thoroughly in development before deploying to production!*
