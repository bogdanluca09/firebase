const firebase = require("firebase-admin");

let firebaseInstance;
let authInstance;
let dbInstance;

function init(config) {
  if (!firebaseInstance) {
    firebaseInstance = firebase.initializeApp({
      credential: firebase.credential.cert(config.serviceAccountKey),
      databaseURL: config.databaseURL
    });
  }

  return firebaseInstance;
}

function getAuth() {
  if (!authInstance) {
    authInstance = init().auth();
  }

  return authInstance;
}

function getDatabase() {
  if (!dbInstance) {
    dbInstance = init().database().ref();
  }

  return dbInstance;
}

function getConstants() {
  return constants;
}

module.exports.init = init;
module.exports.instance = init;
module.exports.auth = getAuth;
module.exports.database = getDatabase;