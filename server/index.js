import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes/index.js';
import multer from 'multer';
import path from 'path';

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
  .then(() =>
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
  )
  .catch((err) => console.log(err.message));
