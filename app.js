require('./db');
require('./auth');

const passport = require('passport');
const mongoose = require('mongoose');

const express = require('express');
//const router = express.Router();
const path = require('path');
const bodyParser = require('body-parser');

const app = express();

// enable sessions
const session = require('express-session');
const sessionOptions = {
    secret: 'secret cookie thang (store this elsewhere!)',
    resave: true,
      saveUninitialized: true
};
app.use(session(sessionOptions));

//enable passport middleware
app.use(passport.initialize());
app.use(passport.session());

//make user data available to all templates
app.use(function(req, res, next){
	res.locals.user = req.user;
	next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// body parser setup
app.use(express.urlencoded({ extended: false }));

// serve static files
app.use(express.static(path.join(__dirname, 'public')));


const Group = mongoose.model('Group');
const User = mongoose.model('User');
const Member = mongoose.model('Member');


//sessions
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});


app.get('/login', (req, res) => {
  res.render('login');
});

app.get('/register', (req, res) => {
  res.render('register');
});

app.get('/', (req, res) => {
  if(req.user) {
    User.findOne({username: req.user.username}).populate('group').exec((errUser, foundUser) => {
      //console.log(foundUser.group);
      if(foundUser){
          res.render('index', {groups: foundUser.group});
      } else{
        console.log(errUser || 'user not found');
        res.redirect('login');
      }
    });
  } else{
    res.redirect('login'); 
  }
});

app.get('/create-group', (req, res) => {
  res.render('addGroup');
});

//dynamically creating group routes 
app.get('/:group', function(req, res) {
  Group.findOne({groupName: req.params.group}).populate('member').exec((errGroup, foundGroup) => {
    if(foundGroup){
      res.render('currentGroup', {currentGroupMembers: foundGroup.member, groupName: req.params.group});
    } else{
      console.log(errUser || 'group not found');
      res.redirect('index');
    }
  });
});

app.get('/:group/add-member', function(req, res){
  res.render('addGroupMember', {groupName: req.params.group});
});

//adding members to specific groups 
app.post('/:group/add-member', function(req, res) { 
  User.findOne({username: req.user.username}, (errUser, foundUser) => {
    if(foundUser){ 
      //create new member in group 
      const member = new Member({
        //group: Group.findOne({group: req.params.group}).exec(),
        name: req.body.name, 
        date: req.body.date, 
        time: req.body.time
      });
      member.save((errMember, savedMember) => { 
        if(errMember){
          console.log(errMember);
        } else { 
          //update the group with new member 
          console.log(req.params.group);
          Group.findOne({groupName: req.params.group}, (errGroup, foundGroup) => { 
            if(errGroup){
              console.log(errGroup);
            } else{
              foundGroup.member.push(savedMember._id);
              foundGroup.save((errUpdatedGroup, updatedGroup) => { 
                if(errUpdatedGroup){ 
                  console.log(errUpdatedGroup);
                } else{
                  res.render('currentGroup', {currentGroupMembers: foundGroup.member});
                }
              });
            }
          });
        }
      });
      
    } else{ 
      console.log(errUser || 'user not found');
    }
  });
});
          /*
          foundUser[req.params.group][member].push(savedMember._id);
          foundUser.save((errUpdatedUser, updatedUser) => { 
          console.log(errUpdatedUser, updatedUser);
          */



/*
app.get('/delete-group', (req, res) => {
  res.render('deleteGroup');
});
*/

app.get('/logout', function(req, res){
  req.logout();
  req.session.destroy(function(err) {
    if(err) {
      console.log('error'); 
      res.send('an error occurred, please see the server logs for more information');
    } else{
      res.redirect('/');
    }
  });
});

app.post('/create-group', (req, res) => {
  
  User.findOne({username: req.user.username}, (errUser, foundUser) => {
    if(foundUser){
      //create and save the new group
      const group = new Group({
        name: req.body.name,
      });
      group.save((errGroup, savedGroup) => { 
        if(errGroup){
          //console.log("entered here");
          console.log(errGroup);
        } else{ 
          //update the user with new group 
          foundUser.group.push(savedGroup._id);
          foundUser.save((errUpdatedUser, updatedUser) => { 
          console.log(errUpdatedUser, updatedUser);
          //console.log("entered here 2");
          });
        }
      });
    } else{ 
      console.log(errUser || 'user not found');
      //console.log("entered here 3");
    }
    res.redirect('/');
  });
});

/*
app.post('/delete-group', (req, res) => { 
  if(req.query.name ){

  };
});
*/

app.post('/register', function(req, res) {
  User.register(new User({username:req.body.username}), 
      req.body.password, function(err, user){
    if (err) {
      res.render('register', {message:'Your registration information is not valid'});
    } else {
      passport.authenticate('local')(req, res, function() {
        res.redirect('/');
      });
    }
  });   
});

app.post('/login', function(req,res,next) {
  passport.authenticate('local', function(err,user) {
    if(user) {
      req.logIn(user, function(err) {
        res.redirect('/');
      });
    } else{
      res.render('login', {message:'Your login or password is incorrect.'});
    }
  })(req, res, next);
});

//module.exports = router;

app.listen(process.env.PORT || 3000);