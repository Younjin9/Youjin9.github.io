const express = require('express');
const cors = require("cors");
const userRoutes = require('./routes/userRoutes');

const app = express();
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));

app.use('/api', userRoutes);        // user 라우트 연결

app.listen(3001, () => {
    console.log("서버 실행")
});