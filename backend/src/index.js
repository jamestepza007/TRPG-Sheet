import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import characterRoutes from './routes/characters.js';
import campaignRoutes from './routes/campaigns.js';
import partyRoutes from './routes/parties.js';
import diceRoutes from './routes/dice.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: process.env.FRONTEND_URL || '*', credentials: true }));

// Increase limit for base64 image uploads
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/characters', characterRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/parties', partyRoutes);
app.use('/api/dice', diceRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok', node: process.version }));

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`🎲 TRPG Sheet API running on port ${PORT} (Node ${process.version})`);
});
