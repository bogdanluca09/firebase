# Evozonjs Elements
Evozonjs Elements is a suite of basic building blocks used in the JavaScript department of [Evozon](https://evozon.com).

## Setup
```
npm install git://github.com/evozonjs/elements.git --save
```

## elements/response

elements/response proposes a standard format for messages. We propose the following attributes:

Name       | Type         | Required | Default | Description
---------- | ------       | -------- | ------- | -------
`uid`      |`string`      | NO       | auto    | a unique timebased message identifier (based on node-uuid v1)
`ok`       |`boolean`     | YES      |         | status of the message
`code`     |`number`      | NO       | `0`     | a numeric code
`data`     |`array|object`| NO       | `{}`    | main data container
`metadata` |`object`      | NO       | `{}`    | secondary data container
`err`      |`string`      | NO       | `''`    | will contain an error message in case of an error
`msg`      |`string`      | NO       | `''`    | an extra message

The constructor accepts the following instantiation scenarios:

```javascript
// load an element
const response = require('elements/response');

// 1 object parameter holding some of all the attributes
console.log(new response({ ok: false, err: 'some error'}));
 
/**
-- will return --
{ uid: '76a16e00-f5dc-11e6-af8e-cf6322a4a5f7',
  ok: true,
  code: 0,
  data: {},
  metadata: {},
  err: '',
  msg: '' }
*/

// or 1 boolean parameter considered as being the 'ok' attribute 
console.log(response(true));
/** 
-- will return --
{ uid: '76a16e00-f5dc-11e6-af8e-cf6322a4a5f7',
  ok: true,
  code: 0,
  data: {},
  metadata: {},
  err: '',
  msg: '' }
*/

// or 2 parameters considered as being the 'ok' attribute and the 'data' attribute
console.log(new response(true, [1,2,3]));
/** 
-- will return --
{ uid: 'f66328d0-f5dd-11e6-9ba8-61642a559e2e',
  ok: true,
  code: 0,
  data: [ 1, 2, 3 ],
  metadata: { count: 3 },
  err: '',
  msg: '' }
*/

// or 3 parameters considered as being the 'ok' attribute, the 'data' attribute, and the 'metadata' attribute
console.log(response(true, [1,2,3], { extra: 'some data' }));
/**
-- will return --
{ uid: 'd6f81960-f5dd-11e6-94ca-35a81f2588d0',
  ok: true,
  code: 0,
  data: [ 1, 2, 3 ],
  metadata: { extra: 'some data', count: 3 },
  err: '',
  msg: '' }
*/

```

As a bonus, if the `data` attribute is an array, and if `metadata.count` is not defined by the user the constructor will
automatically put the array length into `metadata.count`.

If the format of an attribute is not accepted and error will be thrown.

## Licence
MIT
