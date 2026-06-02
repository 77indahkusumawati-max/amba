const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import routes
const productsRouter = require('./routes/products');
const ordersRouter = require('./routes/orders');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger
app.use((req, res, next) => {
    console.log(`📨 ${new Date().toLocaleTimeString()} | ${req.method} ${req.url}`);
    next();
});

// Routes
app.use('/api/products', productsRouter);
app.use('/api/orders', ordersRouter);

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'STMJ Ningrat API is running',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: true,
        message: 'Route not found'
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('❌ Server Error:', err);
    res.status(500).json({
        error: true,
        message: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════╗
║   🍵 STMJ Ningrat API Server        ║
║   👑 Minuman Para Raja              ║
╠═══════════════════════════════════════╣
║   Server  : http://localhost:${PORT}    ║
║   API     : http://localhost:${PORT}/api║
║   Health  : http://localhost:${PORT}/api/health ║
║   Mode    : ${process.env.NODE_ENV || 'development'}               ║
╚═══════════════════════════════════════╝
    `);
});