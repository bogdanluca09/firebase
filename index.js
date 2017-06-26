const http = require('http');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const methodOverride = require('method-override');
const path = require('path');

const firebase = require('./firebase');
const config = require('./config');

firebase.init(config.firebase);

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(expressValidator());
app.use(methodOverride());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/public/index.html'));
});

app.post('/user.register', (req, res) => {
  const data = req.body;
  if (!data) {
    return res.status(400).send('User data required');
  }
  if (!isString(data.email) || !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(data.email)) {
    return res.status(400).send('Please enter valid email address');
  }
  if (!isString(data.password) || data.password.length < 6) {
    return res.status(400).send('Please enter password');
  }
  if (!isString(data.phoneNumber) || !/^(\+|)[0-9]{10,}$/.test(data.phoneNumber)) {
    return res.status(400).send('Please enter valid phone number');
  }
  if (!isString(data.firstName)) {
    return res.status(400).send('Please enter first name');
  }
  if (!isString(data.lastName)) {
    return res.status(400).send('Please enter last name');
  }
  if (!isString(data.address)) {
    return res.status(400).send('Please enter address');
  }

  const userData = {
    email: data.email,
    emailVerified: false,
    password: data.password,
    displayName: `${data.firstName} ${data.lastName}`,
    photoUrl: "http://www.themost10.com/wp-content/uploads/2012/05/Charlie-Kelly-2.jpg",
    disabled: false
  };

  firebase.auth().createUser(userData).then(userRecord => {
    userData.firstName = data.firstName;
    userData.lastName = data.lastName;
    userData.phoneNumber = data.phoneNumber;
    userData.address = data.address;
    delete userData.password;
    delete userData.displayName;

    const userInitData = {};
    userInitData[`users/${userRecord.uid}`] = userData;
    userInitData[`phone_numbers/${userData.phoneNumber}`] = userRecord.uid;
    firebase.database().update(userInitData).then(__ => {
      res.send();
    });
  }).catch(error => {
    res.status(500).json(error);
  });
});

app.put('/user.update', (req, res) => {
  const data = req.body;
  if (!data) {
    return res.status(400).send('User data required');
  }

  tryGetUserInfo(req, (err, userInfo) => {
    if (err) {
      return res.status(err.code).send(err.message);
    }

    const updateData = {};
    if (isString(data.firstName)) {
      updateData.firstName = data.firstName;
    }
    if (isString(data.lastName)) {
      updateData.lastName = data.lastName;
    }
    if (isString(data.address)) {
      updateData.address = data.address;
    }

    if (updateData.length < 1) {
      return res.status(400).send('Please enter valid user data');
    }

    firebase.database().child('users').child(userInfo.uid).update(updateData).then(_ => {
      res.send();
    }).catch(error => {
      res.status(500).send(error);
    });
  });
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(err.status || 500).send(err);
});

function tryGetUserInfo(req, callback) {
  const authorization = req.headers['authorization'];
  if (!authorization) {
    return callback({code: 404});
  }

  const parts = authorization.split(' ');
  if (2 > parts.length) {
    return callback({code: 404});
  }

  const scheme = parts[0];
  const idToken = parts[1];

  if (!/Bearer/.test(scheme)) {
    return callback({code: 404});
  }

  firebase.auth().verifyIdToken(idToken).then(decodedToken => {
    const userInfo = {};
    userInfo.uid = decodedToken.uid;
    userInfo.email = decodedToken.email;
    callback(null, userInfo);
  }).catch(error => {
    callback(error);
  });
}

function isString(obj) {
  return (obj && typeof obj === 'string');
}

const server = http.createServer(app);
server.listen(config.port || 3000, config.hostname || '127.0.0.1', () => {
  const addr = server.address();
  console.log(`Server is running on port ${addr.port}`);
});

module.exports = app;