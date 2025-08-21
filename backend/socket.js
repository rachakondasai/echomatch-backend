const User = require('./models/User');
const Message = require('./models/Message');

function initSocket(io) {
  io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id);

    socket.on('user-online', async ({ userId }) => {
      await User.findByIdAndUpdate(userId, { isOnline: true, socketId: socket.id });
      const onlineUsers = await User.find({ isOnline: true });
      io.emit('online-users', onlineUsers);
    });

    socket.on('call-user', ({ toSocketId, offer, fromUser }) => {
      io.to(toSocketId).emit('incoming-call', { from: socket.id, offer, fromUser });
    });

    socket.on('answer-call', ({ toSocketId, answer }) => {
      io.to(toSocketId).emit('call-answered', { from: socket.id, answer });
    });

    socket.on('send-message', async ({ from, to, content }) => {
      const msg = new Message({ from, to, content });
      await msg.save();
      io.emit('new-message', msg);
    });

    socket.on('disconnect', async () => {
      await User.findOneAndUpdate({ socketId: socket.id }, { isOnline: false, socketId: '' });
      const onlineUsers = await User.find({ isOnline: true });
      io.emit('online-users', onlineUsers);
    });
  });
}

module.exports = initSocket;