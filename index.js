require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const app = express();

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to Database'));

app.use(express.json());

// Routes
const bfhlRouter = require('./routes/endpoint');
app.use('/bfhl', bfhlRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started successfully on port ${PORT}`));
