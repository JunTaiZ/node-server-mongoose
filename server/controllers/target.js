const
  crypto = require('crypto'),
  jwt = require('jsonwebtoken'),
  targetModel = require('../models/targetModel.js'),
  taskModel = require('../models/taskModel'),
  userModel = require('../models/userModel.js'),
  classifyModel = require('../models/classifyModel.js');


class TargetControllers {

  // 获取全部订单列表
  static async getClassifyList(ctx) {
    const { _id } = ctx.state.user
    let classifyList = await classifyModel.findOne({
      user_id: _id,
    })
    console.log(classifyList)
    // console.log(_id, targetList)
    if (classifyList !== null) {

      return ctx.send(classifyList.classifyList, '获取分类成功')
    } else {
      return ctx.sendError('000002', '获取分类失败，请刷新或重新登陆');
    }
  }

  static async addClassify(ctx) {
    const { _id } = ctx.state.user
    const { classify } = ctx.request.body
    let classifyDoc = await classifyModel.findOne({
      user_id: _id,
    })
    // console.log(_id, targetList)
    if (classifyDoc !== null) {
      classifyDoc.classifyList.push(classify)
      console.log(classifyDoc)
      const result = await classifyModel.updateOne({ user_id: _id }, { classifyList: classifyDoc.classifyList })
      if (result !== null && result.nModified === 1) {
        console.log(result);
        return ctx.send(null, '添加分类成功');
      } else {
        return ctx.sendError('000002', '添加分类失败，请刷新或重新登陆');
      }
    } else {
      return ctx.sendError('000002', '获取分类失败，请刷新或重新登陆');
    }
  }

  static async deleteClassify(ctx) {
    const { _id } = ctx.state.user
    const { classify } = ctx.request.body
    let classifyDoc = await classifyModel.findOne({
      user_id: _id,
    })
    console.log(classifyDoc)
    // console.log(_id, targetList)
    if (classifyDoc !== null) {
      classifyDoc.classifyList = classifyDoc.classifyList.filter(val => val !== classify)
      const result = await classifyModel.updateOne({ user_id: _id }, { classifyList: classifyDoc.classifyList })
      if (result !== null && result.nModified === 1) {
        console.log(result);
        return ctx.send(result, '删除分类成功');
      } else {
        return ctx.sendError('000002', '删除分类失败，请刷新或重新登陆');
      }
    } else {
      return ctx.sendError('000002', '获取分类失败，请刷新或重新登陆');
    }
  }

  // 获取全部订单列表
  static async getAllTarget(ctx) {
    const { _id } = ctx.state.user
    let targetList = await targetModel.find({
      user_id: _id,
    }).sort({updateDate: -1})
    // console.log(targetList)
    // console.log(_id, targetList)
    if (targetList !== null) {
      return ctx.send(targetList, '获取目标成功')
    } else {
      return ctx.sendError('000002', '获取目标失败，请刷新或重新登陆');
    }
  }
  // 获取订单列表
  
  static async getTarget(ctx) {
    const { _id } = ctx.state.user
    const { count, pageSize, classify } = ctx.query
    let targetList = await targetModel.find({
      user_id: _id,
    }).sort({ updateDate: -1 })
    let length = targetList.length
    if (classify === '全部') {
    } else if (classify === '收藏') {
      targetList = targetList.filter(target => target._doc.fav === true)
    } else {
      targetList = targetList.filter(target => target._doc.classify === classify)
    }
    // console.log(_id, targetList)
    if (targetList !== null) {
      let length = targetList.length
      if (length <= (count - 1) * pageSize) {
        return ctx.sendError('000004', '无更多数据');
      }

      targetList = targetList.map((val) => {
        val = val._doc
        return Object.assign({}, val, {
          createDate: val.createDate.Format('yy-MM-dd hh-mm-ss'),
          updateDate: val.updateDate.Format('yy-MM-dd hh-mm-ss'),
          beginDate: val.beginDate.Format('yy-MM-dd hh-mm-ss'),
          finishDate: val.finishDate.Format('yy-MM-dd hh-mm-ss')
        })
      })
      let obj = {
        length,
        targetList: targetList.slice((count-1) * pageSize, count * pageSize)
      }
      return ctx.send(obj, '获取目标成功')
    } else {
      return ctx.sendError('000002', '获取目标失败，请刷新或重新登陆');
    }
  }
  // 插入Target
  static async insertTarget(ctx) {
    const data = ctx.request.body;
    let createDate = new Date();
    if (!data) {
      return ctx.sendError('000002', '参数不合法');
    }
    data.createDate = createDate
    data.updateDate = data.createDate
    data.realBeginDate = null
    data.realFinishDate = null
    const result = await targetModel.create(data);
    if (result !== null) {
      console.log(result);
      return ctx.send(result, '添加目标成功');
    } else {
      return ctx.sendError('000002', '添加目标失败，请刷新或重新登陆');
    }
  }


  // 更新Target
  static async updateTarget(ctx) {
    let data = ctx.request.body;

    if (!data) {
      return ctx.sendError('000002', '参数不合法')
    }
    const result = await targetModel.updateOne({_id: data._id}, data)
    console.log(result)
    if (result !== null) {
      return ctx.send(result, '修改目标成功');
    } else {
      return ctx.sendError('000002', '修改目标失败，请刷新或重新登陆')
    }
  }
  // toggle fav
  static async favTarget(ctx) {
    let data = ctx.request.body;
    if (!data) {
      return ctx.sendError('000002', '参数不合法')
    }
    let { fav, _id, updateDate } = data
    const result = await targetModel.updateOne({_id: data._id}, { fav, updateDate })
    console.log(result)
    if (result !== null && result.nModified === 1) {
      return ctx.send(result, '修改目标成功');
    } else {
      return ctx.sendError('000002', '修改目标失败，请刷新或重新登陆')
    }
  }
  // 删除一个Target
  static async deleteTarget(ctx) {
    let data = ctx.request.body;
    if (!data) {
      return ctx.sendError('000002', '参数不合法')
    }
    const { target_id } = data
    // console.log(data)
    const target = await targetModel.findOne({ _id: target_id })
    const result = await targetModel.deleteOne({ _id: target_id })
    console.log(result)
    if (result !== null && result.deletedCount === 1) {
      // const taskList = await taskModel.find({ target_id })
      // console.log(taskList)
      const deleteResult = await taskModel.deleteMany({ target_id })
      return ctx.send(result, '目标删除成功')
    } else {
      return ctx.sendError('000002', '目标删除失败，请刷新或重新登陆')
    }
  }
  // 删除多个个Target
  static async deleteManyTarget(ctx) {
    let data = ctx.request.body;
    if (!data) {
      return ctx.sendError('000002', '参数不合法')
    }
    const result = await targetModel.deleteMany({_id: {$in: data}})
    if (result !== null) {
      return ctx.send(result, '订单删除成功');
    } else {
      return ctx.sendError('000002', '订单删除失败，请刷新或重新登陆')
    }
  }


}

module.exports = TargetControllers;