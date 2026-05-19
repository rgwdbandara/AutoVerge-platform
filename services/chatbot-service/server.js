require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const chatbotRoutes = require('./routes/chatbotRoutes');

const app = express();
app.use(cors());
app.use(express.json({limit: '1mb'}));

const MONGO = process.env.MONGODB_URI || 'mongodb://mongodb:27017/autoverge';
mongoose.connect(MONGO, {useNewUrlParser:true, useUnifiedTopology:true})
  .then(()=> console.log('Chatbot service connected to MongoDB'))
  .catch(err=> console.error('MongoDB connect error', err));

app.use('/api/chat', chatbotRoutes);

const PORT = process.env.PORT || 5050;
app.listen(PORT, ()=> console.log(`Chatbot service running on ${PORT}`));
