// 1ST DRAFT DATA MODEL
const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');


// a Group
// * includes the name of group, (and its members, potentially?)
// * they also can have 0 or more members
const Group = new mongoose.Schema({
  name: {type: String, required: true},
  member: [{type: mongoose.Schema.Types.ObjectId, ref: 'Member'}]
});


// users
// * our site requires authentication...
// * so users have a username and password
// * they also can have 0 or more lists
const User = new mongoose.Schema({
  // username provided by authentication plugin
  // password hash provided by authentication plugin
  group: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Group' }]
});

User.plugin(passportLocalMongoose);


// a Member
// * each Member must have a related Group, name, date, and time
const Member = new mongoose.Schema({
  group: {type: mongoose.Schema.Types.ObjectId, ref: 'Group'},
  name: {type: String, required: true},
  date: {type: String, required: true},
  time: {type: String, required: true}
});

/*
const inviteQueue = new mongoose.Schema({
    group: {type: mongoose.Schema.Types.ObjectId, ref:'Group'}
});
*/

// TODO: add remainder of setup for slugs, connection, registering models, etc. below


// is the environment variable, NODE_ENV, set to PRODUCTION? 
let dbconf;
if (process.env.NODE_ENV === 'PRODUCTION') {
 // if we're in PRODUCTION mode, then read the configuration from a file
 // use blocking file io to do this...
 const fs = require('fs');
 const path = require('path');
 const fn = path.join(__dirname, 'config.json');
 const data = fs.readFileSync(fn);

 // our configuration file will be in json, so parse it and set the
 // conenction string appropriately!
 const conf = JSON.parse(data);
 dbconf = conf.dbconf;
} else{
 // if we're not in PRODUCTION mode, then use
 dbconf = 'mongodb://localhost/finaltest';
}

mongoose.model('Group', Group);
mongoose.model('User', User);
mongoose.model('Member', Member);
mongoose.connect(dbconf);