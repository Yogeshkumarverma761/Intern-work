# SmartStitch Chatbot - API Reference & Examples

## Base URL
```
http://localhost:5000/api/chatbot
```

---

## Endpoints

### 1. Send Message to Chatbot
**POST** `/api/chatbot/message`

**Request:**
```json
{
  "message": "Show me casual suits"
}
```

**Response (Success):**
```json
{
  "message": "Great! Here are some clothing recommendations for you:",
  "products": [
    {
      "_id": "dummy-1",
      "name": "Casual Suit Set",
      "category": "Suits",
      "price": 3500,
      "image": "/path/to/image.png"
    },
    {
      "_id": "dummy-2",
      "name": "Formal Blazer",
      "category": "Suits",
      "price": 4200,
      "image": "/path/to/image2.png"
    }
  ],
  "suggestions": [
    "Show more options",
    "Tell me about features",
    "Check shipping info"
  ],
  "intent": "recommend"
}
```

**Response (Information Query):**
```json
{
  "message": "☺️ SmartStitch is an innovative AI-powered clothing customization platform...",
  "products": [],
  "suggestions": [
    "Recommend products",
    "Tell me more",
    "Explore shop"
  ],
  "intent": "about"
}
```

**Response (Error):**
```json
{
  "message": "Sorry, I encountered an error. Please try again later.",
  "error": "Database connection error"
}
```

---

### 2. Get Information by Category
**GET** `/api/chatbot/info/:category`

**Available Categories:**
- `about` - About SmartStitch
- `features` - Features and capabilities
- `shipping` - Shipping information
- `faq` - Frequently asked questions
- `categories` - Product categories
- `contact` - Contact information
- `pricing` - Pricing information

**Example Request:**
```
GET /api/chatbot/info/shipping
```

**Response:**
```json
{
  "category": "shipping",
  "info": "🚚 We offer:\n- Fast shipping to your doorstep\n- Free shipping on orders above ₹5000\n- Standard delivery: 5-7 business days\n- Express delivery: 2-3 business days (available in select areas)\n- Easy returns within 14 days"
}
```

---

### 3. Get Product Suggestions
**GET** `/api/chatbot/suggest?query=casual`

**Parameters:**
- `query` (optional) - Search query/preferences

**Example Requests:**
```
GET /api/chatbot/suggest                    # Get all products
GET /api/chatbot/suggest?query=suit         # Get suit recommendations
GET /api/chatbot/suggest?query=elegant      # Get formal wear
GET /api/chatbot/suggest?query=floral       # Get floral designs
```

**Response:**
```json
{
  "products": [
    {
      "_id": "dummy-1",
      "name": "Casual Suit Set",
      "category": "Suits",
      "price": 3500,
      "image": "/path/to/image.png"
    },
    {
      "_id": "dummy-2",
      "name": "Floral Print Kurta",
      "category": "Kurtas",
      "price": 2500,
      "image": "/path/to/image2.png"
    }
  ]
}
```

---

## Common API Calls Examples

### Getting Product Recommendations

**cURL:**
```bash
curl -X POST http://localhost:5000/api/chatbot/message \
  -H "Content-Type: application/json" \
  -d '{"message": "Recommend a casual suit"}'
```

**JavaScript/Fetch:**
```javascript
const response = await fetch('http://localhost:5000/api/chatbot/message', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ message: 'Show me elegant dresses' })
});
const data = await response.json();
console.log(data);
```

**Axios:**
```javascript
const response = await axios.post('/api/chatbot/message', {
  message: 'What kurtas do you have?'
});
console.log(response.data);
```

---

### Getting Information

**JavaScript/Fetch:**
```javascript
const response = await fetch('http://localhost:5000/api/chatbot/info/shipping');
const data = await response.json();
console.log(data.info);
```

**cURL:**
```bash
curl http://localhost:5000/api/chatbot/info/features
curl http://localhost:5000/api/chatbot/info/pricing
curl http://localhost:5000/api/chatbot/info/contact
```

---

### Getting Product Suggestions

**JavaScript/Fetch:**
```javascript
const response = await fetch('http://localhost:5000/api/chatbot/suggest?query=casual');
const data = await response.json();
console.log(data.products);
```

**Axios:**
```javascript
const response = await axios.get('/api/chatbot/suggest', {
  params: { query: 'formal' }
});
console.log(response.data.products);
```

---

## Intent Types

The chatbot recognizes these intents:

| Intent | Detected By | Response |
|--------|------------|----------|
| `about` | "about", "what is", "who are", "company" | Company info + features |
| `features` | "features", "capabilities", "help" | Available features |
| `shipping` | "shipping", "delivery", "postage" | Shipping details |
| `faq` | "faq", "question", "how does", "works" | Common FAQs |
| `categories` | "category", "types", "what do you sell" | Product categories |
| `contact` | "contact", "support", "email" | Contact information |
| `pricing` | "price", "cost", "discount" | Pricing information |
| `recommend` | "recommend", "suggest", "looking for" | Product recommendations |
| `general` | Default | Menu of options |

---

## Testing with Postman

### 1. Create new POST request
```
URL: http://localhost:5000/api/chatbot/message
Method: POST
```

### 2. Headers
```
Content-Type: application/json
```

### 3. Body (raw JSON)
```json
{
  "message": "Tell me about your features"
}
```

### 4. Click Send

---

## Response Status Codes

| Code | Meaning |
|------|---------|
| `200` | Success |
| `400` | Bad request |
| `404` | Not found (e.g., invalid info category) |
| `500` | Server error |

---

## Error Handling

### Frontend Error Handling
```javascript
try {
  const response = await getChatbotResponse(userMessage);
  // Success - response contains message, products, suggestions
} catch (error) {
  console.error('Error:', error);
  // Show user-friendly error message
  return 'Sorry, I encountered an error. Please try again.';
}
```

### Backend Error Handling
```javascript
try {
  // Process message
  const result = await processChatbot(message);
  res.json(result); // 200 OK
} catch (error) {
  console.error('Error:', error);
  res.status(500).json({
    message: 'Sorry, I encountered an error.',
    error: error.message
  });
}
```

---

## Request/Response Examples by Scenario

### Scenario 1: User Asks for Company Info

**User Input:**
```
"What is SmartStitch?"
```

**Request:**
```json
POST /api/chatbot/message
{
  "message": "What is SmartStitch?"
}
```

**Processing:**
- Detect intent: "about" ✓
- Fetch company information ✓
- No database query needed
- Generate suggestions

**Response:**
```json
{
  "message": "☺️ SmartStitch is an innovative AI-powered clothing customization platform...",
  "products": [],
  "suggestions": [
    "Recommend products",
    "Tell me more",
    "Explore shop"
  ],
  "intent": "about"
}
```

---

### Scenario 2: User Wants Product Recommendations

**User Input:**
```
"I need a formal dress"
```

**Request:**
```json
POST /api/chatbot/message
{
  "message": "I need a formal dress"
}
```

**Processing:**
- Detect intent: "recommend" ✓
- Extract preferences: category="Dresses", style="formal"
- Query database: `find({ category: "Dresses" })`
- Format products with images and prices
- Generate suggestions

**Response:**
```json
{
  "message": "Great! Here are some clothing recommendations for you:",
  "products": [
    {
      "_id": "prod-id-1",
      "name": "Chiffon Evening Gown",
      "category": "Dresses",
      "price": 5500,
      "image": "/home/prod_chiffon.png"
    }
  ],
  "suggestions": [
    "Show more options",
    "Tell me about features",
    "Check shipping info"
  ],
  "intent": "recommend"
}
```

---

### Scenario 3: User Asks About Shipping

**User Input:**
```
"How long does delivery take?"
```

**Request:**
```json
POST /api/chatbot/message
{
  "message": "How long does delivery take?"
}
```

**Processing:**
- Detect intent: "shipping" ✓
- Fetch shipping information
- No database query needed
- Generate suggestions

**Response:**
```json
{
  "message": "🚚 We offer:\n- Fast shipping to your doorstep\n- Free shipping on orders above ₹5000\n- Standard delivery: 5-7 business days\n- Express delivery: 2-3 business days...",
  "products": [],
  "suggestions": [
    "Tell me about features",
    "Recommend products",
    "View FAQs"
  ],
  "intent": "shipping"
}
```

---

## Database Query Examples

The chatbot uses these MongoDB queries:

```javascript
// Get products by category
await Clothes.find({ category: "Suits" }).limit(3)

// Get products by keyword search
await Clothes.find({ 
  $or: [
    { title: { $regex: query, $options: 'i' } },
    { category: { $regex: query, $options: 'i' } }
  ]
}).limit(5)

// Get all products (no filter)
await Clothes.find({}).limit(5)
```

---

## Logging & Debugging

### Enable Request Logging
Add to backend:
```javascript
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
  next();
});
```

### Enable Response Logging
```javascript
router.post('/message', (req, res) => {
  console.log('Received message:', req.body.message);
  const result = handleChatbotMessage(req, res);
  console.log('Response:', result);
  return result;
});
```

### Frontend Debug
```javascript
const response = await getChatbotResponse(message);
console.log('API Response:', response);
console.log('Intent:', response.intent);
console.log('Products:', response.products);
```

---

## Rate Limiting (Recommended)

```javascript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

router.post('/message', limiter, handleChatbotMessage);
```

---

## CORS Configuration

Current setup in `app.js`:
```javascript
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'],
  credentials: true
}));
```

For production, update to:
```javascript
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['https://yourdomain.com'],
  credentials: true
}));
```

---

## Performance Tips

1. **Index Database** - Add index on `category` field:
```javascript
db.clothes.createIndex({ "category": 1 })
```

2. **Cache Responses** - For static info endpoints:
```javascript
const infoCache = new Map();
// Store responses with TTL
```

3. **Limit Results** - Already implemented (limit: 3-5)

4. **Optimize Images** - Ensure product images are compressed

---

This reference guide provides everything needed to understand and test the chatbot API!

---

*Last Updated: February 2026*
*SmartStitch Chatbot API v1.0*
