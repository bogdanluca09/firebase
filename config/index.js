'use strict';

module.exports = {
  port: 3000,
  hostname: '127.0.0.1',
  firebase: {
    serviceAccountKey: require('./firebase'),
    databaseURL: "https://abcd-e334e.firebaseio.com"
  }
};
