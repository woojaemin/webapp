var express = require('express');
var router = express.Router();
var User = require('./../../models/user')
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var jwtSecret = 'secret';
var fs = require('fs');
var crypto = require('crypto');
var userid;

mongoose.connect('mongodb://localhost:27017/member', {useNewUrlParser: true});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/member', function(req, res, next){
  res.render('login');
});

router.post('/member/signup', function(req, res) {
  var signup = new User();
  signup.id = req.body.signupid;
  signup.password = req.body.signuppassword;
  signup.username = req.body.username;
  signup.email = req.body.email;

  signup.image.contentsType='image/png';
  var buffer = fs.readFileSync('./routes/login/profile.jpg');  //이미지부분, 추후 수정!
  signup.image.data = buffer;

  if (signup.id==="") res.send('id를 입력하세요.');
  if (signup.password==="") res.send('password를 입력하세요.');
  if (signup.username==="") res.send('usrename을 입력하세요.')

  User.findOne({'id': req.body.signupid}, function(err, user){
    if (err) {
      console.err(err);
      throw err;
    } 
    else if (user===null) {
      localSignUp(signup, function(err, saveUser){
        if (err) {res.send({success:false, data:"Error Occured"+err});}
        else {res.send({success: true, type: "signup"})}
      })
    }
    else res.send('이미 존재하는 id입니다.');
  })
});

function localSignUp(User, next) {

  User.save(function(err, newUser) {
    newUser.jsonWebToken = jwt.sign(newUser.toJSON(), jwtSecret);
    newUser.save(function(err, saveUser) {
      next(err, saveUser);
    });
  });
}

router.post('/member/login', function(req, res) {
  var local_id = req.body.id;
  var local_password = req.body.password;

  var findConditionLocalUser = {
    id: local_id,
    password: local_password
  }

  User.findOne(findConditionLocalUser).exec(function (err, user) {
    if(err){
      res.send({success:false, data:"Error Occured"+err});
    } else if(!user) {
      res.send({
        success: false,
        data: "Incorrect id/password",
        type: "login"
      });
    } else if(user) {
      res.send({
        success:true,
        data: user,
        type: "login",
        token: user.jsonWebToken
      });
    }
  })
});

router.get('/me', ensureAuthorized, function(req, res, next){
  var findConditionToken ={
    jsonWebToken: req.token
  };
  User.findOne(findConditionToken, function(err, user){
    if(err) {res.send({success:false, type:"Error Occured"+err});}
    else {
      console.log("me: "+user.username)
      console.log("following: "+user.following)
      console.log("follower: "+user.follower)
      console.log("posts: "+user.posts)
      console.log("image: "+user.image.data)
      //res.send({success:true, data:user});
    }
  })
});

function ensureAuthorized(req, res, next) {
  var bearerToken;
  var bearerHeader = req.headers["authorization"];
  console.log(bearerHeader);
  if (typeof bearerHeader !== "undefined") {
    var bearer = bearerHeader.split(" ");
    //bearerToken = bearer[1];
    bearerToken = bearer[0];
    req.token = bearerToken;
    next();
  } else{
    res.sendStatus(403);
  }
}


router.post('/member/delete', function(req, res) {
  User.findOne({'id': req.body.id}, function(err, user){
    if (err) {
      console.err(err);
      throw err;
    } 
    else if (user===null) res.send('일치하는 id가 없습니다.');
    else if(!(user.password===req.body.password)) res.send('password가 일치하지 않습니다.');
    else User.remove(user, function() {res.send('회원정보가 삭제되었습니다.');})
  })
});


module.exports = router;
