const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const route = require('./route'); // ก็ได้เหมือนกันกับ './route/index'


app.use(express.json());
app.use(cors());
app.use('/users', route);  // ใช้เส้นทางจากไฟล์ index.js ในโฟลเดอร์ 'route'

// เริ่มต้นเซิร์ฟเวอร์
app.listen(process.env.PORT || 3000, () => {
    console.log('Server is running on http://localhost:3000');
});


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});
