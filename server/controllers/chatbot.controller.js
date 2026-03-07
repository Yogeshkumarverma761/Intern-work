import Clothes from '../models/clothes.model.js';

// ─── Site Knowledge Base ────────────────────────────────────────────────────
const siteInfo = {
  about: `SmartStitch is an AI-powered clothing customization platform that blends cutting-edge technology with fashion expertise. We help you discover clothes that fit perfectly and match your personal style — all from the comfort of your home.

Key highlights:
• AI Try-On technology to visualize outfits on you
• Custom measurements for tailored fits
• Premium quality fabrics and craftsmanship
• Seamless online shopping experience`,

  features: `✨ Our key features:
1. **AI Try-On** — Upload your photo and see how any outfit looks on you instantly
2. **Custom Measurements** — Provide your body measurements and get clothes tailored to perfection
3. **Design Customization** — Choose neckline, sleeve length, fabric, and color for every piece
4. **Smart Recommendations** — Get personalized suggestions based on your style preferences
5. **Virtual Fitting Room** — No more guessing — see the exact fit before ordering`,

  shipping: `🚚 Shipping & Delivery:
• Free shipping on orders above ₹5,000
• Standard delivery: 5–7 business days
• Express delivery: 2–3 business days (select areas)
• All orders are carefully packaged to ensure quality
• Track your order in real-time from your profile`,

  returns: `↩️ Returns & Exchange Policy:
• 14-day hassle-free returns
• Free return shipping on defective items
• Easy exchange for size or fit issues
• Refund processed within 5–7 business days
• Contact support for any concerns`,

  faq: `❓ Frequently Asked Questions:

**How does AI Try-On work?**
Upload a photo and our AI overlays the selected outfit on you, giving you a realistic preview.

**Can I customize the fit?**
Absolutely! Provide your measurements and we'll tailor the piece to your exact specifications.

**What's your return policy?**
14-day hassle-free returns with free return shipping on defective items.

**Is my payment secure?**
Yes — all transactions are processed through secure, encrypted payment gateways.

**Do you offer international shipping?**
Currently we ship within India. International shipping is coming soon!`,

  categories: `👗 Our Clothing Categories:
We carry a wide range including suits, kurtas, dresses, sarees, shirts, frocks, and much more. Each item can be customized with your choice of neckline, sleeves, fabric, and color.

Ask me about any specific type and I'll show you what we have!`,

  contact: `📞 Get in Touch:
• Email: support@smartstitch.com
• Phone: +91-XXXX-XXXX-XXXX
• Live Chat: Available 24/7 (that's me! 😊)
• Support Hours: Mon-Sun, round the clock
• Response Time: Usually within a few hours`,

  pricing: `💰 Pricing & Offers:
• Budget-friendly options starting from ₹1,000
• Premium collections from ₹3,500 to ₹10,000+
• Regular seasonal sales and flash discounts
• Discounts on bulk / wholesale orders
• No hidden charges — what you see is what you pay`,

  measurement: `📏 Custom Measurement Guide:
1. Go to your Profile → Measurements
2. Enter your chest, waist, hip, shoulder, and sleeve measurements
3. We tailor every piece to your exact specifications
4. You can update measurements anytime before placing an order

Tip: Use a soft measuring tape and measure over light clothing for best results!`,

  tryon: `📸 AI Try-On — How It Works:
1. Navigate to the AI Try-On page from the menu
2. Upload a clear, full-body photo of yourself
3. Select any outfit from our catalog
4. Our AI generates a realistic preview of you wearing the outfit
5. Adjust style, color, and design — then order with confidence!

Note: You need to be logged in to use AI Try-On.`,

  payment: `💳 Payment Methods We Accept:
• Credit / Debit Cards (Visa, Mastercard, RuPay)
• UPI (Google Pay, PhonePe, Paytm)
• Net Banking
• Cash on Delivery (select locations)
• EMI options available on orders above ₹3,000`,

  sizing: `📐 Size Guide:
| Size | Chest (in) | Waist (in) | Hip (in) |
|------|-----------|-----------|---------|
| XS   | 32–34     | 26–28     | 34–36   |
| S    | 34–36     | 28–30     | 36–38   |
| M    | 38–40     | 32–34     | 40–42   |
| L    | 42–44     | 36–38     | 44–46   |
| XL   | 46–48     | 40–42     | 48–50   |

For the perfect fit, we recommend using our Custom Measurement feature instead of standard sizes.`
};

// ─── Keyword Intent Mapping ─────────────────────────────────────────────────
const keywordIntents = {
  greeting: ['hi', 'hello', 'hey', 'hii', 'hiii', 'good morning', 'good afternoon', 'good evening', 'howdy', 'sup', 'yo', 'hola', 'namaste'],
  about: ['about', 'what is', 'who are', 'smartstitch', 'company', 'tell me about', 'who are you', 'what do you do'],
  features: ['features', 'capabilities', 'what can', 'services', 'available', 'can you do', 'offer', 'provide'],
  shipping: ['shipping', 'delivery', 'how long', 'deliver', 'ship', 'dispatch', 'track order', 'tracking'],
  returns: ['return', 'exchange', 'refund', 'money back', 'send back', 'replace'],
  faq: ['faq', 'frequently', 'common question', 'help me understand'],
  categories: ['category', 'categories', 'types', 'kinds', 'what do you sell', 'what do you have', 'collection', 'catalog'],
  contact: ['contact', 'support', 'email', 'phone', 'reach', 'customer service', 'talk to someone', 'human', 'agent'],
  pricing: ['price', 'cost', 'how much', 'expensive', 'affordable', 'discount', 'cheap', 'budget', 'sale'],
  measurement: ['measurement', 'measure', 'body size', 'tailor', 'custom fit', 'my size'],
  tryon: ['try on', 'tryon', 'try-on', 'virtual', 'ai try', 'upload photo', 'see on me', 'visualize', 'fitting room'],
  payment: ['payment', 'pay', 'upi', 'card', 'cod', 'cash on delivery', 'emi', 'net banking'],
  sizing: ['size guide', 'size chart', 'what size', 'which size'],
  recommend: ['recommend', 'suggest', 'show me', 'looking for', 'want', 'need', 'give me', "i'm looking", 'browse', 'find me']
};

// Common clothing terms — if ANY of these appear, treat as product query
const clothingTerms = [
  'suit', 'dress', 'kurta', 'shirt', 'saree', 'sari', 'frock', 'gown',
  'lehenga', 'salwar', 'kameez', 'blouse', 'top', 'skirt', 'pant',
  'trouser', 'jeans', 'jacket', 'blazer', 'coat', 'sherwani', 'dhoti',
  'palazzo', 'kurti', 'tunic', 'anarkali', 'jumpsuit', 'romper',
  'sweatshirt', 'hoodie', 'sweater', 'cardigan', 'vest', 'crop',
  'maxi', 'midi', 'mini', 'formal', 'casual', 'party', 'ethnic',
  'traditional', 'western', 'indo-western', 'bridal', 'wedding',
  'festive', 'office', 'work', 'evening', 'floral', 'printed',
  'embroidered', 'plain', 'cotton', 'silk', 'linen', 'chiffon',
  'georgette', 'velvet', 'satin', 'net', 'cloth', 'clothe',
  'product', 'outfit', 'wear', 'garment', 'apparel', 'fashion',
  't-shirt', 'tshirt'
];

// ─── Intent Detection ───────────────────────────────────────────────────────
const detectIntent = (message) => {
  const lower = message.toLowerCase().trim();

  // Greeting check
  const greetWords = keywordIntents.greeting;
  if (greetWords.some(g => lower === g || lower.startsWith(g + ' ') || lower.startsWith(g + '!'))) {
    return 'greeting';
  }

  // Check for clothing/product terms first (highest priority)
  if (clothingTerms.some(term => lower.includes(term))) {
    return 'recommend';
  }

  // Standard keyword matching
  for (const [intent, keywords] of Object.entries(keywordIntents)) {
    if (intent === 'greeting') continue;
    if (keywords.some(keyword => lower.includes(keyword))) {
      return intent;
    }
  }

  return 'general';
};

// ─── Response Messages ──────────────────────────────────────────────────────
const getResponseMessage = (intent, clothingType = null) => {
  const responses = {
    greeting: `Hey there! 👋 Welcome to SmartStitch! I'm your AI fashion assistant. Here's what I can help you with:

• 🛍️ Browse and discover clothing
• 📸 Learn about our AI Try-On feature
• 📏 Custom measurement guidance
• 🚚 Shipping & return info
• 💬 Answer any questions about SmartStitch

What would you like to know?`,

    about: siteInfo.about,
    features: siteInfo.features,
    shipping: siteInfo.shipping,
    returns: siteInfo.returns,
    faq: siteInfo.faq,
    categories: siteInfo.categories,
    contact: siteInfo.contact,
    pricing: siteInfo.pricing,
    measurement: siteInfo.measurement,
    tryon: siteInfo.tryon,
    payment: siteInfo.payment,
    sizing: siteInfo.sizing,

    recommend: clothingType
      ? `Here's what we have in **${clothingType}** 👇`
      : `Here are some picks from our collection 👇`,

    general: `I'm here to help! Here's what I can tell you about:

• 🏪 About SmartStitch
• ✨ Features & services
• 👗 Our clothing categories
• 📸 AI Try-On technology
• 📏 Custom measurements
• 🚚 Shipping & delivery
• ↩️ Returns & exchanges
• 💰 Pricing & discounts
• 💳 Payment methods
• 📐 Size guide

Or just tell me what type of clothing you're looking for — like "show me sarees" or "I want a shirt"! 😊`
  };

  return responses[intent] || responses.general;
};

// ─── Extract Search Keywords From User Message ──────────────────────────────
// Instead of hardcoded category aliases, we extract meaningful words
// from the user's message and search the DB dynamically.
const extractSearchTerms = (message) => {
  const lower = message.toLowerCase();

  // Remove common filler words to get meaningful search terms
  const stopWords = new Set([
    'i', 'me', 'my', 'we', 'our', 'you', 'your', 'the', 'a', 'an',
    'is', 'am', 'are', 'was', 'were', 'be', 'been', 'being',
    'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
    'could', 'should', 'may', 'might', 'can', 'shall',
    'to', 'of', 'in', 'for', 'on', 'with', 'at', 'by', 'from',
    'it', 'its', 'this', 'that', 'these', 'those',
    'and', 'but', 'or', 'not', 'no', 'so', 'if', 'then',
    'want', 'need', 'like', 'looking', 'show', 'give', 'find',
    'get', 'see', 'some', 'any', 'please', 'recommend', 'suggest',
    'me', 'something', 'anything', 'browse', 'search', 'look'
  ]);

  const words = lower
    .replace(/[^a-z0-9\s-]/g, '')  // remove special chars
    .split(/\s+/)
    .filter(w => w.length > 1 && !stopWords.has(w));

  // Extract price constraint
  let priceMax = null;
  const priceMatch = lower.match(/(?:under|below|less than|max|upto|up to|within)\s*₹?\s*(\d+)/);
  if (priceMatch) priceMax = parseInt(priceMatch[1]);

  return { words, priceMax };
};

// ─── Search Products in DB ──────────────────────────────────────────────────
// Uses multiple strategies: text search, regex on title/category/description
const searchProducts = async (searchTerms, limit = 5) => {
  const { words, priceMax } = searchTerms;

  if (words.length === 0) {
    // No specific terms — return all products
    const query = priceMax ? { price: { $lte: priceMax } } : {};
    return await Clothes.find(query).limit(limit).lean();
  }

  let results = [];

  // Strategy 1: MongoDB full-text search (uses the text index on title + description)
  try {
    const textQuery = words.join(' ');
    const query = { $text: { $search: textQuery } };
    if (priceMax) query.price = { $lte: priceMax };
    results = await Clothes.find(query, { score: { $meta: 'textScore' } })
      .sort({ score: { $meta: 'textScore' } })
      .limit(limit)
      .lean();
  } catch (e) {
    // Text search might fail if index doesn't exist
  }

  // Strategy 2: If text search got no results, try regex on title and category
  if (results.length === 0) {
    const regexPatterns = words.map(w => new RegExp(w, 'i'));
    const query = {
      $or: [
        { title: { $in: regexPatterns } },
        { category: { $in: regexPatterns } },
        { description: { $in: regexPatterns } },
        { tags: { $in: regexPatterns } }
      ]
    };
    if (priceMax) query.price = { $lte: priceMax };
    results = await Clothes.find(query).limit(limit).lean();
  }

  // Strategy 3: If still nothing, try each word individually
  if (results.length === 0) {
    for (const word of words) {
      const regex = new RegExp(word, 'i');
      const query = {
        $or: [
          { title: regex },
          { category: regex },
          { description: regex }
        ]
      };
      if (priceMax) query.price = { $lte: priceMax };
      const found = await Clothes.find(query).limit(limit).lean();
      if (found.length > 0) {
        results = found;
        break;
      }
    }
  }

  // Strategy 4: If absolutely nothing found, return latest products
  if (results.length === 0) {
    const query = priceMax ? { price: { $lte: priceMax } } : {};
    results = await Clothes.find(query).sort({ createdAt: -1 }).limit(limit).lean();
  }

  return results;
};

// ─── Get Related Products ───────────────────────────────────────────────────
// Finds products in other categories than what was already shown
const getRelatedProducts = async (shownProducts, limit = 3) => {
  const shownIds = shownProducts.map(p => p._id);
  const shownCategories = [...new Set(shownProducts.map(p => p.category))];

  // Find products NOT in the same categories as shown
  let related = await Clothes.find({
    _id: { $nin: shownIds },
    category: { $nin: shownCategories }
  }).limit(limit).lean();

  // If not enough, just find products not already shown
  if (related.length === 0) {
    related = await Clothes.find({
      _id: { $nin: shownIds }
    }).limit(limit).lean();
  }

  return related;
};

// ─── Suggestions per Intent ─────────────────────────────────────────────────
const getSuggestions = async (intent) => {
  const staticSuggestions = {
    greeting: ['Show me clothing', 'What is SmartStitch?', 'AI Try-On help', 'Shipping info'],
    about: ['Show me products', 'How does AI Try-On work?', 'What categories do you have?'],
    features: ['Try AI Try-On', 'Show me clothing', 'Custom measurements'],
    shipping: ['Returns policy', 'Track my order', 'Show me products'],
    returns: ['Shipping info', 'Contact support', 'Browse shop'],
    faq: ['AI Try-On help', 'Show me products', 'Size guide'],
    contact: ['FAQ', 'Returns info', 'Show me products'],
    pricing: ['Show affordable options', 'View premium collection', 'Current offers'],
    measurement: ['Size guide', 'AI Try-On help', 'Show me products'],
    tryon: ['Show me clothing', 'Custom measurements', 'About SmartStitch'],
    payment: ['Shipping info', 'Returns policy', 'Show me products'],
    sizing: ['Custom measurements', 'Show me products', 'AI Try-On help'],
    general: ['What is SmartStitch?', 'Show me clothing', 'AI Try-On help', 'Shipping info']
  };

  // For recommend intent, build dynamic suggestions from actual DB categories
  if (intent === 'recommend' || intent === 'categories') {
    try {
      const categories = await Clothes.distinct('category');
      const catSuggestions = categories
        .filter(c => c && c.trim())
        .slice(0, 4)
        .map(c => `Show me ${c.toLowerCase()}`);
      if (catSuggestions.length > 0) {
        return [...catSuggestions, 'Shipping info'];
      }
    } catch (e) { /* fallback below */ }
  }

  return staticSuggestions[intent] || staticSuggestions.general;
};

// ─── Format Product for Response ────────────────────────────────────────────
const formatProduct = (p) => ({
  _id: p._id,
  name: p.title || p.name,
  category: p.category,
  price: p.price,
  image: p.images && p.images[0] ? p.images[0] : (p.image || null)
});

// ═══════════════════════════════════════════════════════════════════════════
// CONTROLLERS
// ═══════════════════════════════════════════════════════════════════════════

// POST /api/chatbot/message
export const handleChatbotMessage = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.json({
        message: 'Please type something so I can help you! 😊',
        suggestions: ['What is SmartStitch?', 'Show me clothing', 'Shipping info']
      });
    }

    const intent = detectIntent(message);
    let responseText = getResponseMessage(intent);
    let products = [];
    let relatedProducts = [];
    let suggestions = await getSuggestions(intent);

    // ── Product recommendation flow ──
    if (intent === 'recommend') {
      try {
        const searchTerms = extractSearchTerms(message);

        // Search DB for matching products
        products = await searchProducts(searchTerms, 5);

        // Build a human-readable type from the search words
        const clothingType = searchTerms.words
          .filter(w => clothingTerms.includes(w))
          .join(', ') || null;

        responseText = getResponseMessage('recommend', clothingType);

        // Get related products from different categories
        if (products.length > 0) {
          relatedProducts = await getRelatedProducts(products, 3);
        }

        // If we found zero products at all, tell the user
        if (products.length === 0) {
          responseText = `I couldn't find any products matching "${message}". We might not have that in stock right now.\n\nTry checking our Shop page for the latest inventory, or ask me about something else!`;
          // Still try to return all products as general browse
          products = await Clothes.find({}).sort({ createdAt: -1 }).limit(5).lean();
          if (products.length > 0) {
            responseText += `\n\nHere's what we currently have in our store:`;
          }
        }

        suggestions = await getSuggestions('recommend');
      } catch (dbError) {
        console.error('Database error:', dbError);
        responseText = `I'd love to show you products, but I'm having trouble reaching our catalog right now. Please try the Shop page directly!`;
        suggestions = ['About SmartStitch', 'Shipping info', 'AI Try-On help'];
      }
    }

    res.json({
      message: responseText,
      products: products.map(formatProduct),
      relatedProducts: relatedProducts.map(formatProduct),
      suggestions,
      intent
    });

  } catch (error) {
    console.error('Chatbot error:', error);
    res.status(500).json({
      message: 'Sorry, I encountered an error. Please try again later.',
      error: error.message
    });
  }
};

// GET /api/chatbot/info/:category
export const getInfoCategory = async (req, res) => {
  try {
    const { category } = req.params;

    if (siteInfo[category]) {
      res.json({ category, info: siteInfo[category] });
    } else {
      res.status(404).json({ message: 'Information category not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching information', error: error.message });
  }
};

// GET /api/chatbot/suggest?query=...
export const getSuggestedProducts = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      const products = await Clothes.find({}).limit(5).lean();
      return res.json({ products: products.map(formatProduct) });
    }

    const searchTerms = extractSearchTerms(query);
    const products = await searchProducts(searchTerms, 5);

    res.json({ products: products.map(formatProduct) });

  } catch (error) {
    console.error('Suggested products error:', error);
    res.status(500).json({ message: 'Error fetching suggestions', error: error.message });
  }
};
