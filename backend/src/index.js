import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import characterRoutes from './routes/characters.js';
import campaignRoutes from './routes/campaigns.js';
import partyRoutes from './routes/parties.js';
import diceRoutes from './routes/dice.js';
import webhookRoutes from './routes/webhooks.js';
import sseRoutes from './routes/sse.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

const allowedOrigins = (process.env.FRONTEND_URL || '')
  .split(',').map(s => s.trim()).filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.length === 0) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS blocked: ${origin}`));
  },
  credentials: true,
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
}));
app.options('*', cors());
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/characters', characterRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/parties', partyRoutes);
app.use('/api/dice', diceRoutes);
app.use('/api/webhooks', webhookRoutes);
app.use('/api/sse', sseRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok', node: process.version }));

app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`🎲 TRPG Sheet API on port ${PORT}`);
  console.log(`   Origins: ${allowedOrigins.join(', ') || '(all)'}`);
});
