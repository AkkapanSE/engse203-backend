// server.js (WebSocket Version)
const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*" }
});

const PORT = process.env.PORT || 3001;

// Serve static files (สำหรับไฟล์ HTML, CSS, JS)
app.use(express.static('public'));

// เสิร์ฟไฟล์ HTML สำหรับ Client
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// จัดการ Event เมื่อมีคนเชื่อมต่อเข้ามา
io.on('connection', (socket) => {
    console.log('🔗 User connected:', socket.id);

    // ส่ง welcome message ไปให้ client
    socket.emit('chat message', 'Welcome to ENGSE203 Chat!');

    // เมื่อได้รับ message จาก client
    socket.on('chat message', (msg) => {
        console.log('💬 Message from', socket.id, ':', msg);
        
        // ส่ง message ไปให้ทุกคนที่เชื่อมต่ออยู่
        io.emit('chat message', `[${socket.id.substring(0, 5)}]: ${msg}`);
    });

    // เมื่อ client disconnect
    socket.on('disconnect', () => {
        console.log('❌ User disconnected:', socket.id);
    });
});

server.listen(PORT, () => {
    console.log(`🚀 WebSocket Server running on http://localhost:${PORT}`);
});