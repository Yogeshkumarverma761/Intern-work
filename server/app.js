import express from 'express';
import connectToDB from './db/db.js';
import dotenv from 'dotenv';
import cors from 'cors';
import userRoutes from './routes/user.route.js';
import cookieParser from 'cookie-parser';
import orderRoutes from './routes/order.route.js';
import measurementRoutes from './routes/measurement.route.js'
import clothRoutes from './routes/cloth.route.js'
import chatbotRoutes from './routes/chatbot.route.js'

dotenv.config();
const app = express();
connectToDB();

const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:5173,http://localhost:3000,https://smart-stitch-chi.vercel.app')
  .split(',')
  .map((origin) => origin.trim().replace(/\/$/, ''))
  .filter(Boolean);

app.set('trust proxy', 1);
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) {
      return callback(null, true);
    }

    const normalizedOrigin = origin.replace(/\/$/, '');
    if (allowedOrigins.includes(normalizedOrigin)) {
      return callback(null, true);
    }

    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser());



app.get('/', (req, res) => {
  res.send('Hello World!!!!');
})
app.use('/users', userRoutes);
app.use('/orders', orderRoutes);
app.use('/cloths', clothRoutes);
app.use('/measurements', measurementRoutes);
app.use('/chatbot', chatbotRoutes);

export default app;