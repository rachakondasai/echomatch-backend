const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./db');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const messageRoutes = require('./routes/message');
const initSocket = require('./socket');

require('dotenv').config();
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: process.env.CLIENT_URL, methods: ['GET', 'POST'] } });

connectDB();
app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);

initSocket(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));