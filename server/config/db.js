const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/databaseName', { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;

db.on('connected', () => {
    console.log('连接成功');
})

db.on('error', (err) => {
    console.log('连接失败: ' + err);  
});

module.exports = db;