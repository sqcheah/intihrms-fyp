import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes/index.js';
import multer from 'multer';
import path from 'path';
import { Server } from 'socket.io';
import { createServer } from 'http';

//https://pawelgrzybek.com/all-you-need-to-know-to-move-from-commonjs-to-ecmascript-modules-esm-in-node-js/
//https://stackoverflow.com/a/68117993
const app = express();
dotenv.config();
//https://stackoverflow.com/questions/23259168/what-are-express-json-and-express-urlencoded
//{ limit: '30mb', extended: 'true' }
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ extended: true }));

app.use(cors());
//https://stackoverflow.com/questions/25260818/rest-with-express-js-nested-router
app.use('/', routes);
//https://stackoverflow.com/a/39819473
//https://stackoverflow.com/a/28279609
const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));
//const CONNECTION_URL = 'mongodb+srv://admin:admin123@cluster0.onl1q.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
//https://arunrajeevan.medium.com/understanding-mongoose-connection-options-2b6e73d96de1
//https://stackoverflow.com/questions/68915722/option-usefindandmodify-is-not-supported
const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.CONNECTION_URL)
  .then(() => {
    //app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.log(err.message));

//https://socket.io/docs/v3/server-initialization/#with-express
//https://stackoverflow.com/a/41741696
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: 'http://localhost:3000' },
});

let onlineUsers = [];

const addNewUser = (data, socketId) => {
  if (!onlineUsers.some((user) => user.email === data.email)) {
    onlineUsers.push({ ...data, socketId });
    console.log(`${data.email} joined`);
  }
};

const removeUser = (socketId) => {
  onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
};
const getUser = (email) => {
  return onlineUsers.find((user) => user.email === email);
};

io.on('connection', (socket) => {
  //const user = JSON.parse(localStorage.getItem('profile'))?.result;
  socket.on('newUser', (data) => {
    addNewUser(data, socket.id);
  });
  socket.on('listUser', () => {
    onlineUsers.forEach((user) => {
      console.log(user.email);
    });
  });
  socket.on('sendNoti', ({ senderName, receiverName, content }) => {
    const receiver = getUser(receiverName);
    io.to(receiver.socketId).emit('getNoti', { senderName, content });
  });
  socket.on('disconnect', () => {
    removeUser(socket.id);
    console.log('user disconnected');
  });
});
//https://stackoverflow.com/questions/65712319/getting-port-already-in-use-error-when-adding-socket-io-to-express-app-happe
httpServer.listen(PORT);

//https://stackoverflow.com/a/62438729
export { io };
