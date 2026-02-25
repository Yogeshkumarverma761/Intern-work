import userModel from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import blacklistTokenModel from "../models/blacklistToken.model.js";

const authUser = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const isBlacklisted = await blacklistTokenModel.findOne({token: token});
    if (isBlacklisted) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const user = await userModel.findById(decoded._id)

        req.user = user;

        return next();
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
}

const authAdmin = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    if (!token) {
        console.log("❌ authAdmin: No token provided");
        return res.status(401).json({ message: 'Unauthorized - No token provided' });
    }

    const isBlacklisted = await blacklistTokenModel.findOne({token: token});
    if (isBlacklisted) {
        console.log("❌ authAdmin: Token is blacklisted");
        return res.status(401).json({ message: 'Unauthorized - Token blacklisted' });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        console.log("✅ authAdmin: Token decoded, userId:", decoded._id);
        
        const user = await userModel.findById(decoded._id);
        console.log("📝 authAdmin: Checking userModel - Found:", user ? `${user.email}` : "NOT FOUND");

        if (!user) {
            console.log("❌ authAdmin: User not found in either model");
            return res.status(401).json({ message: 'Unauthorized - User not found' });
        }

        console.log("🔍 authAdmin: User email:", user.email, "ADMIN_EMAIL:", process.env.ADMIN_EMAIL);
        
        // Check if user email matches admin email
        if (user.email !== process.env.ADMIN_EMAIL) {
            console.log("❌ authAdmin: Email mismatch - user is not admin");
            return res.status(403).json({ message: 'Forbidden - Admin access required' });
        }

        console.log("✅ authAdmin: Admin verified!");
        req.user = user;
        return next();
    } catch (error) {
        console.log("❌ authAdmin: Token verification failed:", error.message);
        return res.status(401).json({ message: 'Unauthorized - Invalid token' });
    }
}

export default {
    authUser,
    authAdmin
}