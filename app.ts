const express = require('express');
require('dotenv').config();
const prisma = require('./prisma/prismaClient.ts');
const routes = require('./routes');

const app = express();

// Port Number
const PORT = process.env.PORT || 5000;

// Parse JSON requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// load routes
app.use('/api', routes);

// Server Setup
app.listen(PORT, async (error: Error) => {
    if (error) {
        console.log('Server error: ', error);
        await prisma.$disconnect();
    } else {
        console.log(`Server started on port ${PORT}`);
    }
});