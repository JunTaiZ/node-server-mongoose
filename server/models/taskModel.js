const mongoose = require('mongoose');
const taskSchema = new mongoose.Schema({
  user_id: String,
  target_id: String,
  title: String,
  describe: String,
  status: Number, // 0：未开始，1：进行中，2：已完成
  days_in_week: [Number], // 执行天列表，exp: [1, 3, 5]，在星期一、星期三、星期五要执行
  // 当天要执行的时间段，exp: ['00:00', '02:00']，在当天0点到2点执行
  times_in_day: Array,
  createDate: Date,
  updateDate: Date,
  beginDate: Date,
  finishDate: Date,
  status_arr: [{
    date: String,
    status: Number,
  }],
  feeling: String,
});
module.exports = mongoose.model('task', taskSchema, 'task');