const mongoose = require('mongoose');
const targetSchema = new mongoose.Schema({
  fav: Boolean,
  user_id: String,
  classify: String,
  title: String,
  describe: String,
  status: Number, // 0：未开始，1：提前进行中，2：进行中，3：延期进行中，4：提前完成，5：已完成，6：延期完成
  createDate: Date,
  updateDate: Date,
  beginDate: Date,
  finishDate: Date,
  realBeginDate: Date,
  realFinishDate: Date,
  feeling: String,
});
module.exports = mongoose.model('target', targetSchema, 'target');