import express from 'express';
import path from 'path';
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
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use(cookieParser());

const uploadPath = process.env.UPLOAD_PATH || 'uploads';
app.use('/uploads', express.static(path.join(process.cwd(), uploadPath)));

app.get('/', (req,res)=>{
    res.send('Hello World!');
})
app.use('/users', userRoutes);
app.use('/orders', orderRoutes);
app.use('/cloths', clothRoutes);
app.use('/measurements', measurementRoutes);
app.use('/api/chatbot', chatbotRoutes);

export default app;