const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
  connectionStateRecovery: {
    maxDisconnectionDuration: 2 * 60 * 1000, // 2 minutes
    skipMiddlewares: true,
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Store connected users and messages
const users = {};
const messages = [];
const typingUsers = {};

// Socket.io connection handler
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Handle user joining
  socket.on('user_join', (username) => {
    if (!username || username.trim() === '') {
      socket.emit('error', 'Username is required');
      return;
    }

    // Check if username is already taken
    const usernameTaken = Object.values(users).some(user => user.username === username);
    if (usernameTaken) {
      socket.emit('error', 'Username is already taken');
      return;
    }

    users[socket.id] = { username, id: socket.id, lastSeen: new Date().toISOString() };
    
    // Send user the last 20 messages
    socket.emit('initial_data', {
      messages: messages.slice(-20),
      users: Object.values(users)
    });
    
    // Notify all users about the new user
    io.emit('user_list', Object.values(users));
    io.emit('user_joined', { username, id: socket.id });
    console.log(`${username} joined the chat`);
  });

  // Handle chat messages
  socket.on('send_message', (messageData) => {
    if (!users[socket.id]) {
      socket.emit('error', 'You must join first');
      return;
    }

    const message = {
      ...messageData,
      id: Date.now(),
      sender: users[socket.id].username,
      senderId: socket.id,
      timestamp: new Date().toISOString(),
      readBy: [socket.id] // Mark as read by sender
    };
    
    messages.push(message);
    
    // Limit stored messages to prevent memory issues
    if (messages.length > 100) {
      messages.shift();
    }
    
    io.emit('receive_message', message);
  });

  // Handle typing indicator
  socket.on('typing', (isTyping) => {
    if (users[socket.id]) {
      const username = users[socket.id].username;
      
      if (isTyping) {
        typingUsers[socket.id] = username;
      } else {
        delete typingUsers[socket.id];
      }
      
      io.emit('typing_users', Object.values(typingUsers));
    }
  });

  // Handle private messages
  socket.on('private_message', ({ to, message }, callback) => {
    if (!users[socket.id]) {
      callback({ success: false, error: 'You must join first' });
      return;
    }

    if (!users[to]) {
      callback({ success: false, error: 'Recipient not found' });
      return;
    }

    const messageData = {
      id: Date.now(),
      sender: users[socket.id].username,
      senderId: socket.id,
      recipientId: to,
      message,
      timestamp: new Date().toISOString(),
      isPrivate: true,
      readBy: [socket.id]
    };
    
    // Send to recipient
    socket.to(to).emit('private_message', messageData);
    // Send back to sender
    socket.emit('private_message', messageData);
    
    callback({ success: true });
  });

  // Handle message read receipt
  socket.on('message_read', (messageId) => {
    const message = messages.find(m => m.id === messageId);
    if (message && !message.readBy.includes(socket.id)) {
      message.readBy.push(socket.id);
      io.emit('message_update', message);
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    if (users[socket.id]) {
      const { username } = users[socket.id];
      users[socket.id].lastSeen = new Date().toISOString();
      io.emit('user_left', { username, id: socket.id });
      console.log(`${username} left the chat`);
    }
    
    delete users[socket.id];
    delete typingUsers[socket.id];
    
    io.emit('user_list', Object.values(users));
    io.emit('typing_users', Object.values(typingUsers));
  });
});

// API routes
app.get('/api/messages', (req, res) => {
  res.json(messages);
});

app.get('/api/users', (req, res) => {
  res.json(Object.values(users));
});

// Root route
app.get('/', (req, res) => {
  res.send('Socket.io Chat Server is running');
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = { app, server, io };