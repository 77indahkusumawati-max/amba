const express = require('express');
const router = express.Router();
const pool = require('../config/database');

router.get('/', async (req, res) => {
    try {
        const { status } = req.query;
        let query = 'SELECT * FROM orders';
        const params = [];
        
        if (status && status !== 'all') {
            query += ' WHERE status = ?';
            params.push(status);
        }
        
        query += ' ORDER BY created_at DESC';
        
        const [rows] = await pool.query(query, params);
        res.json({ success: true, data: rows });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM orders WHERE id = ? OR order_number = ?', [req.params.id, req.params.id]);
        if (rows.length === 0) return res.status(404).json({ error: 'Not found' });
        
        const [items] = await pool.query('SELECT * FROM order_items WHERE order_id = ?', [rows[0].id]);
        rows[0].items = items;
        
        res.json({ success: true, data: rows[0] });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        
        const { customer_name, items, payment_method } = req.body;
        const orderNumber = 'STMJ-' + Date.now().toString().slice(-8);
        
        let total = 0;
        items.forEach(item => { total += item.price * item.quantity; });
        
        const [result] = await connection.query(
            'INSERT INTO orders (order_number, customer_name, total, payment_method) VALUES (?, ?, ?, ?)',
            [orderNumber, customer_name || 'Customer', total, payment_method || 'QRIS']
        );
        
        const orderId = result.insertId;
        
        for (let item of items) {
            await connection.query(
                'INSERT INTO order_items (order_id, product_id, quantity, price, subtotal) VALUES (?, ?, ?, ?, ?)',
                [orderId, item.id || item.product_id, item.quantity, item.price, item.price * item.quantity]
            );
        }
        
        await connection.commit();
        res.json({ success: true, order_id: orderId, order_number: orderNumber, total });
        
    } catch (error) {
        await connection.rollback();
        res.status(500).json({ error: error.message });
    } finally {
        connection.release();
    }
});

router.patch('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        await pool.query('UPDATE orders SET status = ?, updated_at = NOW() WHERE id = ? OR order_number = ?', 
            [status, req.params.id, req.params.id]);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM orders WHERE id = ? OR order_number = ?', [req.params.id, req.params.id]);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;