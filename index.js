var http = require('http');
var Sequelize = require('sequelize');
//config
var db = new Sequelize('deadlock_test', 'root', 'codemao', {
  host: 'you host',
  dialect: 'mysql',
  port:3306,
  pool: {
    max: 5,
  }
});

//model
var User = db.define('user', {
  id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true, unique: true },
  age: { type: Sequelize.INTEGER}
}, {
    tableName: 'user',
    timestamps:false
});

//transaction
function transaction(){
  db.transaction({autocommit:false}).then(function(t){
    User.create({
      age:14
    },{transaction:t}).then(function(result){
      User.create({ age:15 },{transaction:t}).then(function(){
        User.create({ age:15 },{transaction:t}).then(function(){
          t.rollback();
        })
      })
    })
  })
}

//DML
function dml(){
  User.update({age:16},{where:{age:14}}).catch(function(err){console.log(err)});
}

//make deadlock
function deadlock(){
  User.find({
    where:{
      age:14
    }
  }).catch(function(err){
    console.log(err)
  });
}

function test(){
  transaction();
  dml();
  deadlock();
}
setInterval(test,2000);
