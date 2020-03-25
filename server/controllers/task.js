const taskModel = require('../models/taskModel.js'),
  targetModel = require('../models/targetModel')
function getDayInDateSection(daysInWeek, beginDate, endDate) {
  // console.log(typeof daysInWeek[0])
  console.log(beginDate, endDate)
  let weekday = ['7', '1', '2', '3', '4', '5', '6']
  // 返回时间段中是daysInWeek中天，
  // ['1', '2'], 2019-10-20, 2019-10-27
  // 返回时间段中是星期一和星期二的日期数组
  let beginTime = new Date(beginDate).getTime()
  let endTime = new Date(endDate).getTime()
  let status_arr = []
  for (let time = beginTime; time <= endTime; time += 1000 * 3600 * 24) {
    for (const day of daysInWeek) {
      // console.log(weekday[new Date(time).getDay()], day.toString())
      if (weekday[new Date(time).getDay()] === day.toString()) {
        status_arr.push({
          status: 0,
          date: new Date(time).Format('yyyy-MM-dd')
        })
      }
    }
  }
  return status_arr
}

class TaskControllers {
  // 获取全部订单列表

  static async getTaskList(ctx) {
    const { target_id } = ctx.query
    let taskList = await taskModel.find({
      target_id,
    }).sort({updateDate: -1})
    // console.log(taskList)
    // console.log(_id, taskList)
    if (taskList !== null) {
      // taskList = taskList.map((val) => {
      //   val = val._doc
      //   return Object.assign({}, val, {
      //     createDate: val.createDate.Format('yyyy-MM-dd hh:mm:ss'),
      //     updateDate: val.updateDate.Format('yyyy-MM-dd hh:mm:ss'),
      //     beginDate: val.beginDate.Format('yyyy-MM-dd'),
      //     finishDate: val.finishDate.Format('yyyy-MM-dd')
      //   })
      // })
      return ctx.send(taskList, '获取任务成功')
    } else {
      return ctx.sendError('000002', '获取任务失败，请刷新或重新登陆');
    }
  }
  // 插入Task
  static async insertTask(ctx) {
    const data = ctx.request.body;
    let createDate = new Date();
    if (!data) {
      return ctx.sendError('000002', '参数不合法');
    }
    const target = await targetModel.findOne({_id: data.target_id})
    data.status = 0;
    data.createDate = createDate;
    data.updateDate = createDate;
    // data.status_arr = getDayInDateSection(data.days_in_week, data.createDate, target.finishDate)
    const result = await taskModel.create(data);
    if (result !== null) {
      console.log(result);
      return ctx.send(result, '添加任务成功');
    } else {
      return ctx.sendError('000002', '添加任务失败，请刷新或重新登陆');
    }
  }
  // 更新Task
  static async updateTask(ctx) {
    let data = ctx.request.body;
    if (!data) {
      return ctx.sendError('000002', '参数不合法');
    }
    // console.log('data.status_arr: ', data.status_arr)
    let task = await taskModel.findOne({ _id: data._id })
    let statusArr = task._doc.status_arr
    let updateTask = Object.assign({}, task._doc, data)
    let status
    updateTask.status_arr = statusArr.map(value => {
      status = 0
      if (data.hasOwnProperty('status_arr')) {
        data.status_arr.forEach(res => {
          if (res.date === value.date) {
            status = 1
          }
        })
      }
      return {
        status,
        date: value.date
      }
    })
    // console.log(updateTask.status_arr)
    // return
    const result = await taskModel.updateOne({ _id: data._id }, updateTask);
    console.log('updateTask: ', result)
    if (result !== null && result.nModified === 1) {
      return ctx.send(updateTask, '修改任务成功');
    } else {
      return ctx.sendError('000002', '修改任务失败，请刷新或重新登陆');
    }
  }
  // 更新Task status
  static async updateTaskStatus(ctx) {
    let data = ctx.request.body;
    let { _id, status, updateDate, beginDate, finishDate } = data

    if (!data) {
      return ctx.sendError('000002', '参数不合法');
    }
    // console.log(data)
    let task = await taskModel.findOne({ _id })
    task.status = parseInt(status)
    task.updateDate = updateDate
    task.beginDate = beginDate
    task.finishDate = finishDate
    const target = await targetModel.findOne({ _id: task.target_id })
    if (task.status === 1 && task.status_arr.length === 0) {
      task.status_arr = getDayInDateSection(task.days_in_week, data.beginDate, target.finishDate)
      // task.status_arr = getDayInDateSection(task.days_in_week, target.beginDate, target.finishDate)
      // console.log('status: 1, ', task)
    }
    if (task.status === 2) {
      task.status_arr = task.status_arr.filter(value => {
        return value.date <= data.finishDate
      })
    }
    const result = await taskModel.updateOne({ _id }, task);
    console.log(result, task)
    if (result !== null && result.nModified === 1) {
      return ctx.send(task, '修改任务成功');
    } else {
      return ctx.sendError('000002', '修改任务失败，请刷新或重新登陆');
    }
  }
  static async toggleTodayTaskStatus(ctx) {
    // console.log(ctx.request.body)
    let data = ctx.request.body;
    const { _id, date, targetFinishDate, status } = data
    if (!data) {
      return ctx.sendError('000002', '参数不合法');
    }
    let result = await taskModel.findOne({ _id: data._id })
    //console.log(result)
    if (result === null) {
      return ctx.sendError('000002', '该任务不存在，请刷新或重新登陆');
    }
    let haveDate = false // date是否包含在task.status_arr
    result.status_arr = result.status_arr.map(date_status => {
      if (date_status.date === date) {
        date_status.status = parseInt(status)
        haveDate = true
        console.log(date_status.status)
        return date_status
      } else return date_status
    })
    if (!haveDate) {
      result.status_arr.push({
        status,
        date
      })
    }

    const resultUpdate = await taskModel.updateOne({ _id }, result)
    // console.log(result, resultUpdate)
    if (resultUpdate !== null && resultUpdate.nModified === 1) {
      return ctx.send(null, '修改任务成功');
    } else {
      return ctx.sendError('000002', '修改任务失败，请刷新或重新登陆');
    }
  }
  // 删除一个Task
  static async deleteTask(ctx) {
    let data = ctx.request.body;
    if (!data) {
      return ctx.sendError('000002', '参数不合法');
    }
    const result = await taskModel.deleteOne({_id: data.task_id});
    console.log(result)
    if (result !== null) {
      return ctx.send(result, '任务删除成功');
    } else {
      return ctx.sendError('000002', '任务删除失败，请刷新或重新登陆');
    }
  }
  // 删除多个个Task
  static async deleteManyTask(ctx) {
    let data = ctx.request.body;
    if (!data) {
      return ctx.sendError('000002', '参数不合法');
    }
    const result = await taskModel.deleteMany({_id: {$in: data}});
    if (result !== null) {
      return ctx.send(result, '订单删除成功');
    } else {
      return ctx.sendError('000002', '订单删除失败，请刷新或重新登陆');
    }
  }


}

module.exports = TaskControllers;