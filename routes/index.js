let mongoose = require('mongoose');
let express = require('express');
let router = express.Router();
let htmlspecialchars = require('htmlspecialchars'); 

mongoose.connect('mongodb://localhost/todoapp');
const Task = mongoose.model('Task', {user_name: String, content: String, create_date:Date});

/*
* 初期表示
*/
router.get('/', function(req, res, next) {
  res.render('index', {task_list:null});
});

/*
* タスク取得処理
*/
router.post('/selecttask', function(req, res) {
  let post_data = req.body;
  Task.find({user_name:post_data.user_name}, function (err, tasks) {
    if(err) throw err;
    res.send({ task_list:tasks });
  });
});

/*
* タスク追加処理
*/
router.post('/addtask', function(req, res) {
  let post_data = req.body;
  let task = new Task({user_name: htmlspecialchars(post_data.user_name), content: htmlspecialchars(post_data.content), create_date:new Date()});
  task.save(function(err){
    if(err) throw err;

    Task.find({user_name:post_data.user_name}, function (err, tasks) {
      if(err) throw err;
      res.send({message:'ok', task_list:tasks});
    });
  });
});

/*
* タスク削除処理
*/
router.post('/deletetask', function(req, res) {
  let post_data = req.body;
  Task.remove({_id:post_data.id}, function(err){
    if(err) throw err;
  });

  res.send({message:'ok'});
});

module.exports = router;
