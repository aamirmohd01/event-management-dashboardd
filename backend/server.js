const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');
const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/events');
const attendeeRoutes = require('./routes/attendees');
const taskRoutes = require('./routes/tasks');
const authenticateToken = require('./middleware/auth');

// Load environment variables from .env file
dotenv.config();

// Initialize Express app
const app = express();

// Middleware Setup
app.use(cors({
  origin: 'http://localhost:3000', // Frontend URL
  credentials: true,
}));
app.use(express.json());

// Create HTTP server
const server = http.createServer(app);

// Setup Socket.io
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

// Socket.io event handling
io.on('connection', (socket) => {
  console.log('a user connected');
  
  // Handle user disconnect
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
  
  // Emit events when task status changes
  socket.on('taskUpdated', (task) => {
    // Broadcast task update to all connected clients
    io.emit('taskUpdated', task);
  });
});

// Import Routes and Use them
app.use('/api/auth', authRoutes);
app.use('/api/events', authenticateToken, eventRoutes);
app.use('/api/attendees', authenticateToken, attendeeRoutes);
app.use('/api/tasks', authenticateToken, taskRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Server listening on the specified port
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Sample Task Route (Example for emitting event)
const taskRouter = require('./routes/tasks');
taskRouter.put('/:id/status', async (req, res) => {
  try {
    // Assuming you update a task in the DB
    const task = await Task.findById(req.params.id);
    task.status = req.body.status;
    await task.save();
    
    // Emit the updated task to all connected clients
    io.emit('taskUpdated', task); // Emit event
    res.json(task);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error updating task status');
  }
});
