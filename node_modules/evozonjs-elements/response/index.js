const uuid = require('node-uuid');

/**
 * Class representing a Response object
 *
 * @class
 */
class Response {

  constructor() {
    // set default values
    let ok,
      uid = this.getUid(),
      code = this.getCode(),
      data = this.getData(),
      metadata = this.getMetadata(),
      err = this.getErr(),
      msg = this.getMsg();

    // if we get a single parameter
    if (Object.keys(arguments).length === 1) {

      // and if it is an object
      if (typeof arguments[0] === 'object') {

        // we check all the keys
        const obj = arguments[0];

        uid = this.getUid(obj.uid);
        ok = this.getOk(obj.ok);
        data = this.getData(obj.data);
        metadata = this.getMetadata(obj.metadata);
        err = this.getMetadata(obj.err);
        msg = this.getMetadata(obj.msg);
        code = this.getCode(obj.code);

        // else we consider it is the key 'ok'
      }
      else {
        ok = this.getOk(arguments[0]);
      }

      // if we get multiple parameters
    }
    else {

      // we consider only the 3 first paramaters
      ok = this.getOk(arguments[0]);
      data = this.getData(arguments[1]);
      metadata = this.getMetadata(arguments[2]);
    }

    // auto-count data if array
    if (!metadata.count && Array.isArray(data)) {
      metadata.count = data.length;
    }

    return {
      uid,
      ok,
      code,
      data,
      metadata,
      err,
      msg
    };
  }

  getUid(uid) {
    if (!typeof uid === 'string')
      throw Error('Response: "ok" must be of type boolean and we got ' + typeof ok);

    return uid || uuid.v1();
  }

  getData(data) {
    if (data && !Array.isArray(data) && typeof data !== 'object')
      throw Error('Response: "data" must be of type array or object and we got ' + typeof data);

    return data || {};
  }

  getMetadata(metadata) {
    if (metadata && typeof metadata !== 'object' || Array.isArray(metadata))
      throw Error('Response: "metadata" must be of type object');

    return metadata || {};
  }

  getOk(ok) {
    if (typeof ok === 'undefined')
      throw Error('Response: "ok" is required (and should be a boolean)');

    if (typeof ok !== 'boolean')
      throw Error('Response: "ok" must be of type boolean and we got ' + typeof ok);

    return ok;
  }

  getMsg(msg) {
    if (msg && typeof msg !== 'string')
      throw Error('Response: "msg" must be a string and we got ' + typeof msg);

    return msg || '';
  }

  getErr(err) {
    if (err && typeof err !== 'string')
      throw Error('Response: "err" must be a string and we got ' + typeof msg);

    return err || '';
  }

  getCode(code) {
    if (code && typeof code !== 'number')
      throw Error('Response: "code" must be a number and we got ' + typeof code);

    return code || 0;
  }
}

module.exports = Response;
