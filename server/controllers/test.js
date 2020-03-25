
class TestControllers {
  // 获取所有商店列表
  static async getNameTest(ctx) {
    console.log('hi')
    // console.log(store);
    return ctx.send(null, 'hi');

  }

}

module.exports = TestControllers;