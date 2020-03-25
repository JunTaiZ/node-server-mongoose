const mongoose = require('mongoose');

const classifySchema = new mongoose.Schema({
  user_id: String,
  classifyList: {
    type: Array,
    default: ['全部', '收藏', '技能', '物质', '职业', '学业']
  }
});

module.exports = mongoose.model('classify', classifySchema, 'classify');