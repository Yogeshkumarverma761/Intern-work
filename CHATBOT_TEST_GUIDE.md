# Quick Test Guide - Updated Chatbot Features

## ⚡ 30-Second Verification

### 1. **Start Servers**
```bash
# Terminal 1 - Backend
cd server
npm start
# Wait for: "Listening on port 5000"

# Terminal 2 - Frontend  
cd client/vite-project
npm run dev
# Wait for: "http://localhost:5173"
```

### 2. **Test Without Login**
```
1. Open: http://localhost:5173
2. Look at bottom-right corner
3. Should see BLUE button with "LogIn" icon
4. Hover over it → Should show tooltip "Login to use Chat Assistant"
5. Click → Should redirect to /login page
Result: ✅ BLUE LOGIN BUTTON WORKING
```

### 3. **Login to Account**
```
1. On login page, enter credentials
2. Login successfully
3. Get redirected back to home or stay on protected page
Result: ✅ LOGGED IN
```

### 4. **Test With Login**
```
1. Now on home page (logged in)
2. Look at bottom-right corner
3. Should see PINK button with "MessageCircle" icon
4. Hover → Should show "Open Chat Assistant"
5. Click → Chat window opens
Result: ✅ PINK CHAT BUTTON WORKING
```

### 5. **Test Keyword Matching - Suits**
```
Chat Message: "I want a suit"

Expected Bot Response:
"Great! Here are some suits & dresses recommendations for you:"

Should Show Products:
├─ At least 1 Suit
├─ At least 1 Dress
└─ Mix of categories

Result: ✅ KEYWORD MATCHING WORKING
```

### 6. **Test Keyword Matching - Dresses**
```
Chat Message: "Show me dresses"

Expected Bot Response:
"Great! Here are some dresses & kurtas recommendations for you:"

Should Show Products:
├─ At least 1 Dress
└─ At least 1 Kurta or other related category

Result: ✅ MULTIPLE CATEGORIES WORKING
```

### 7. **Test Information Query**
```
Chat Message: "What's your shipping policy?"

Expected:
Shows shipping information
Suggests: "Recommend products", "Tell me more", "Check shipping info"

Result: ✅ INFO QUERIES WORKING
```

---

## 🧪 Detailed Test Scenarios

### Scenario 1: User Journey - Not Logged In
```
Step 1: Visit homepage (logged out)
├─ Expected: Blue login button visible
├─ Actual: [Check if blue button appears]
└─ Status: ✅ PASS / ❌ FAIL

Step 2: Click blue button
├─ Expected: Redirects to /login
├─ Actual: [Check URL]
└─ Status: ✅ PASS / ❌ FAIL
```

### Scenario 2: User Journey - Logged In
```
Step 1: After login, return to home
├─ Expected: Pink chat button visible
├─ Actual: [Check if pink button appears]
└─ Status: ✅ PASS / ❌ FAIL

Step 2: Click pink button
├─ Expected: Chat window opens
├─ Actual: [Check if window appears]
└─ Status: ✅ PASS / ❌ FAIL

Step 3: Type a message
├─ Expected: Message sends, bot responds
├─ Actual: [Check chat]
└─ Status: ✅ PASS / ❌ FAIL
```

### Scenario 3: Suit Query With Related Products
```
Message Sent: "I want a suit"

Check #1: Bot Response Message
├─ Expected: Includes "suits & dresses"
├─ Actual: [Copy bot message here]
└─ Status: ✅ PASS / ❌ FAIL

Check #2: Product Categories
├─ Expected: Mix of Suits and Dresses
├─ Actual: [List categories shown]
└─ Status: ✅ PASS / ❌ FAIL

Check #3: Product Count
├─ Expected: 3 products (min)
├─ Actual: [Count products shown]
└─ Status: ✅ PASS / ❌ FAIL
```

### Scenario 4: Dress Query With Related Products
```
Message Sent: "Show me elegant dresses"

Check #1: Bot Response Message
├─ Expected: Includes "dresses & kurtas"
├─ Actual: [Copy bot message here]
└─ Status: ✅ PASS / ❌ FAIL

Check #2: Product Categories
├─ Expected: Mix of Dresses and Kurtas
├─ Actual: [List categories shown]
└─ Status: ✅ PASS / ❌ FAIL

Check #3: Styling Detected
├─ Expected: "elegant" style recognized
├─ Actual: [Check if formal wear shown]
└─ Status: ✅ PASS / ❌ FAIL
```

---

## 🔍 Debugging Checklist

### If Blue Login Button NOT Showing
- [ ] User is actually logged out (check localStorage)
- [ ] Clear browser cache: Ctrl+Shift+Delete
- [ ] Hard refresh: Ctrl+Shift+R
- [ ] Check browser console (F12) for errors
- [ ] Verify UserContext is imported in ChatBot.jsx
- [ ] Verify useNavigate is imported from react-router-dom

### If Pink Chat Button NOT Showing
- [ ] User is actually logged in (check token)
- [ ] Hard refresh: Ctrl+Shift+R
- [ ] Check localStorage: Open DevTools → Application → localStorage
- [ ] Look for 'token' and 'user' keys
- [ ] Check if isLoggedIn variable is true

### If Chat Doesn't Open
- [ ] Check browser console (F12) for JavaScript errors
- [ ] Verify handleSendMessage function is working
- [ ] Check Network tab to see API requests
- [ ] Ensure backend is running on port 5000

### If Products Not Showing
- [ ] Backend must be running: `npm start` in server folder
- [ ] MongoDB must be connected: Check server console
- [ ] Clothes collection must have data
- [ ] Check Network tab → API response should have products array
- [ ] Look at server console for database errors

### If Keywords Not Matching Multiple Categories
- [ ] Check queryMessage includes a keyword from categoryAliases
- [ ] Try different keywords: "suit", "formal", "dress", "kurta"
- [ ] Look at server logs when sending message
- [ ] Verify categoryAliases object in chatbot.controller.js
- [ ] Try refreshing page and trying again

---

## 📊 Test Results Template

Fill this out as you test:

```
Test Date: ____________
Tester Name: ____________

AUTHENTICATION TESTS:
[ ] Blue button shows when logged out
[ ] Blue button redirects to /login when clicked
[ ] Pink button shows when logged in
[ ] Pink button opens chat when clicked

KEYWORD MATCHING TESTS:
[ ] "I want a suit" shows suits & dresses
[ ] "Show me dresses" shows dresses & kurtas  
[ ] "Give me formal wear" shows formal categories
[ ] "I need casual clothes" shows casual suits

MESSAGE QUALITY TESTS:
[ ] Bot message includes clothing types shown
[ ] Bot message is contextual and helpful
[ ] Error messages are clear and helpful
[ ] Suggestions are relevant

FUNCTIONALITY TESTS:
[ ] Chat window opens/closes smoothly
[ ] Messages send successfully
[ ] Bot responds to all message types
[ ] Product links work correctly
[ ] Responsive on mobile devices

OVERALL STATUS:
[ ] ✅ All tests passed
[ ] ⚠️ Some tests failed
[ ] ❌ Major issues found

Notes:
_________________________________
_________________________________
_________________________________
```

---

## 🚀 Performance Checks

### Frontend Performance
- Open DevTools (F12) → Performance tab
- Type message → Check response time
- Should be < 1 second typically
- If slow, check server connection

### Backend Performance
- Open server console
- Watch for database query time
- Should be < 500ms per request
- If slow, check MongoDB connection

### Network Performance
- Open DevTools (F12) → Network tab
- Send message
- Look for POST `/api/chatbot/message`
- Check Response tab for JSON
- Should return within 1-2 seconds

---

## ✅ Final Verification Checklist

Before considering complete:

```
REQUIRED FEATURES:
├─ [ ] Login authentication working
├─ [ ] Blue login button visible when logged out
├─ [ ] Pink chat button visible when logged in  
├─ [ ] Related category matching (suit + dress)
├─ [ ] Multiple category support
├─ [ ] Context-aware messages
├─ [ ] No console errors
├─ [ ] All imports working
└─ [ ] Database queries working

QUALITY CHECKS:
├─ [ ] UI looks correct
├─ [ ] Colors are right (blue for login, pink for chat)
├─ [ ] Responsive on mobile
├─ [ ] No lag or slowness
├─ [ ] Error messages helpful
├─ [ ] Product formatting good
└─ [ ] Suggestions make sense

EDGE CASES:
├─ [ ] Tested with empty message
├─ [ ] Tested with long message
├─ [ ] Tested with no products found
├─ [ ] Tested with database error
├─ [ ] Tested quick logout/login
└─ [ ] Tested page refresh during chat
```

---

## 🐛 Common Issues & Solutions

### Issue: Blue button showing instead of pink (after login)
**Solution:** Hard refresh browser (Ctrl+Shift+R)

### Issue: Products not showing for queries
**Solution:** 
1. Check backend running: `curl http://localhost:5000/`
2. Check MongoDB connected: Look at server console
3. Check database has data: Use MongoDB compass/Atlas

### Issue: Categories not matching correctly
**Solution:**
1. Try different keywords from the aliases list
2. Check exact spelling matches
3. Try re-phrasing: "I want a suit" vs "Suit please"

### Issue: Chat window opens but can't type
**Solution:** Check if isLoading is stuck true, refresh page

### Issue: Login button doesn't navigate
**Solution:**
1. Verify routes are set up: /login path exists
2. Check Router is wrapping components
3. Try hard refresh and login again

---

## 📱 Mobile Testing

### Test on Mobile Device/Emulator:
```
1. Open http://localhost:5173 on mobile
2. Blue/Pink button should be visible
3. Tap button to open/navigate
4. Chat window should fit screen
5. Text input should be tappable
6. Keyboard should appear when typing
7. Messages should scroll smoothly
8. Product cards should be readable
```

### Responsive Breakpoints to Test:
- [ ] Desktop (1920px)
- [ ] Tablet (768px) 
- [ ] Mobile (375px)
- [ ] Small phone (320px)

---

## 💾 Save Test Results

After testing, document:
1. What worked ✅
2. What didn't work ❌
3. Any error messages
4. Browser/OS used
5. Any performance issues

This helps with future improvements!

---

**Start Testing Now!** 🚀

Follow the sections above in order:
1. Start Servers
2. 30-Second Verification
3. Detailed Scenarios  
4. Debugging if needed

*Good luck! You've got this! 💪*
