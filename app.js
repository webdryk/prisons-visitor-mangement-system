// app.js
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User'); // Create this model later
const ejs= require('ejs')
const app = express();


// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/myapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then((isconn)=>{
    if(!isconn)console.log('database not connected')
    if(isconn)console.log ('database connected successfull')
});

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/public'));
 
app.use(
    session({
      secret: 'your-secret-key',
      resave: false,
      saveUninitialized: false,
    })
  );

;


// Middleware


app.use(passport.initialize());
app.use(passport.session());

const authRoutes = require('./routes/authRoutes');

app.use('/', authRoutes)



// Passport configuration
passport.use(
    new LocalStrategy((username, password, done) => {
      User.findOne({ username })
        .then((user) => {
          if (!user) {
            return done(null, false, { message: 'Incorrect username.' });
          }
  
          bcrypt.compare(password, user.password, (err, res) => {
            if (err) {
              return done(err);
            }
            if (res === false) {
              return done(null, false, { message: 'Incorrect password.' });
            }
            return done(null, user);
          });
        })
        .catch((err) => {
          return done(err);
        });
    })
  ); 
  
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
  passport.deserializeUser((id, done) => {
    User.findById(id)
      .then((user) => {
        done(null, user);
      })
      .catch((err) => {
        done(err);
      });
  });


const port = 3000;
app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
