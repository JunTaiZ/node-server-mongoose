const router = require('koa-router')(),
  User = require('../controllers/user.js'),
  Target = require('../controllers/target.js'),
  Task = require('../controllers/task.js'),
  Store = require('../controllers/store.js'),
  Product = require('../controllers/product.js'),
  ProdKey = require('../controllers/prodKey.js'),
  Test = require('../controllers/test.js');

router.get('/test/name', Test.getNameTest);

router.post('/setForgetPassword', User.setForgetPassword);
router.post('/getVerifyCode', User.getVerifyCode);
router.post('/register', User.register);
router.post('/login', User.login);
router.post('/target/addTarget', Target.insertTarget);
router.post('/task/addTask', Task.insertTask);
// router.post('/changePassword', User.changePassword);
router.post('/target/updateTarget', Target.updateTarget);
router.post('/target/deleteTarget', Target.deleteTarget);
router.post('/target/favTarget', Target.favTarget);
router.post('/task/updateTask', Task.updateTask);
router.post('/task/toggleTodayTaskStatus', Task.toggleTodayTaskStatus);
router.post('/task/updateTaskStatus', Task.updateTaskStatus);
router.post('/task/deleteTask', Task.deleteTask);
// router.post('/target/deleteManyTarget', Target.deleteManyTarget);
router.post('/target/deleteClassify', Target.deleteClassify);
router.post('/target/addClassify', Target.addClassify);

router.get('/getUsers', User.getUsers);
router.get('/getUserInfo', User.getUserInfo);
router.get('/target/getTarget', Target.getTarget);
router.get('/target/getClassifyList', Target.getClassifyList);
router.get('/task/getTaskList', Task.getTaskList);
router.get('/target/getAllTarget', Target.getAllTarget);
router.get('/getStore', Store.getStore);
router.get('/getProduct', Product.getProduct);
router.get('/getProdKey', ProdKey.getProdKey);
module.exports = router;
