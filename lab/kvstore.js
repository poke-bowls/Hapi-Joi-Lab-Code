
'use strict';

const Lab = require('lab');
const Code = require('code');
const lab = exports.lab = Lab.script();
const server = require('../src');

const test = lab.test;
const expect = Code.expect;

lab.experiment('KVStore', { skip: true }, () => {
  test('GET to /kvstore, expect return value empty object, {}', (done) => {
    const options = {
      method: 'GET',
      url: '/kvstore'
    };
    server.inject(options, (res) => {
      let result = res.result;
      expect(res.statusCode).to.equal(200);
      expect(result).to.be.an.object();
      expect(result).to.deep.equal({});
      done();
    });
  });

  test( 'GET to /kvstore/{key}, expect Boom 404 error', (done) => {
    const options = {
      method: 'GET',
      url: '/kvstore/test',
    };
    server.inject(options, (res) => {
      let result = res.result;
      expect(res.statusCode).to.equal(404);
      expect(result.message).to.deep.equal('Error: Key does not exist');
      done();
    });
  });

  test('POST to /kvstore/string, expect return value to be the key:value set', (done) => {
    const options = {
      method: 'POST',
      url: '/kvstore/string',
      payload: {
        key: 'test',
        value: 'a string'
      }
    };
    server.inject(options, (res) => {
      let result = res.result;
      expect(res.statusCode).to.equal(200);
      expect(result).to.deep.equal({'test': 'a string'});
      done();
    });
  });

  test('GET to /kvstore/test, expect return value to be key:value set in previous test', (done) => {
    const options = {
      method: 'GET',
      url: '/kvstore/test'
    };
    server.inject(options, (res) => {
      let result = res.result;
      expect(res.statusCode).to.equal(200);
      expect(result).to.deep.equal({'test': 'a string'});
      done();
    });
  });

  test('POST to /kvstore/string with bad key, expect joi validation error', (done) => {
    const options = {
      method: 'POST',
      url: '/kvstore/string',
      payload: {
        key: 'test!][',
        value: 'key that does not only contain alpha-numeric characters'
      }
    };
    server.inject(options, (res) => {
      let result = res.result;
      expect(res.statusCode).to.equal(400);
      expect(result.message).to.deep.equal('child "key" fails because ["key" must only contain alpha-numeric characters]');
      done();
    });
  });

  test('POST to /kvstore/string with bad value, expect joi validation error', (done) => {
    const options = {
      method: 'POST',
      url: '/kvstore/string',
      payload: {
        key: 'test1',
        value: 'a string with more than 10 characters'
      }
    };
    server.inject(options, (res) => {
      let result = res.result;
      expect(res.statusCode).to.equal(400);
      expect(result.message).to.deep.equal('child "value" fails because ["value" length must be less than or equal to 10 characters long]');
      done();
    });
  });

  test('POST to /kvstore/test, expect Boom 409 error', (done) => {
    const options = {
      method: 'POST',
      url: '/kvstore/string',
      payload: {
        key: 'test',
        value: 'a string'
      }
    };
    server.inject(options, (res) => {
      let result = res.result;
      expect(res.statusCode).to.equal(409);
      expect(result.message).to.deep.equal('Error: Key already exists');
      done();
    });
  });

  test('POST to /kvstore/number, expect return value to be the key:value set', (done) => {
    const options = {
      method: 'POST',
      url: '/kvstore/number',
      payload: {
        key: 'test2',
        value: 888
      }
    };
    server.inject(options, (res) => {
      let result = res.result;
      expect(res.statusCode).to.equal(200);
      expect(result).to.deep.equal({ test2: 888 });
      done();
    });
  });

  test('POST to /kvstore/number with bad value, expect joi validation error', (done) => {
    const options = {
      method: 'POST',
      url: '/kvstore/number',
      payload: {
        key: 'test3',
        value: 2.41234
      }
    };
    server.inject(options, (res) => {
      let result = res.result;
      expect(res.statusCode).to.equal(400);
      expect(result.message).to.deep.equal('child "value" fails because ["value" must be an integer]');
      done();
    });
  });

  test('POST to /kvstore/array/string, expect return value to be key:value set', (done) => {
    const options = {
      method: 'POST',
      url: '/kvstore/array/string',
      payload: {
        key: 'test4',
        value: [ 'hakuna', 'matata' ]
      }
    };
    server.inject(options, (res) => {
      let result = res.result;
      expect(res.statusCode).to.equal(200);
      expect(result).to.deep.equal({ test4: [ 'hakuna', 'matata' ] });
      done();
    });
  });

  test('POST to /kvstore/array/string with bad value, expect joi validation error', (done) => {
    const options = {
      method: 'POST',
      url: '/kvstore/array/string',
      payload: {
        key: 'test5',
        value: [ 'hakunamatatameansnoworries','matata' ]
      }
    };
    server.inject(options, (res) => {
      let result = res.result;
      expect(res.statusCode).to.equal(400);
      expect(result.message).to.deep.equal('child "value" fails because ["value" at position 0 fails because ["0" length must be less than or equal to 10 characters long]]');
      done();
    });
  });

  test('POST to /kvstore/array/string with bad value, expect joi validation error', (done) => {
    const options = {
      method: 'POST',
      url: '/kvstore/array/string',
      payload: {
        key: 'test5',
        value: [ 'hakuna', 1, 'matata' ]
      }
    };
    server.inject(options, (res) => {
      let result = res.result;
      expect(res.statusCode).to.equal(400);
      expect(result.message).to.deep.equal('child "value" fails because ["value" at position 1 fails because ["1" must be a string]]');
      done();
    });
  });

  test('POST to /kvstore/array/number, expect return value to be key:value set', (done) => {
    const options = {
      method: 'POST',
      url: '/kvstore/array/number',
      payload: {
        key: 'test6',
        value: [ 123, 456, 789 ]
      }
    };
    server.inject(options, (res) => {
      let result = res.result;
      expect(res.statusCode).to.equal(200);
      expect(result).to.deep.equal({ test6: [ 123, 456, 789 ] });
      done();
    });
  });

  test('POST to /kvstore/array/number with bad value, expect joi validation Error', (done) => {
    const options = {
      method: 'POST',
      url: '/kvstore/array/number',
      payload: {
        key: 'test7',
        value: [ 123, 456, 7891 ]
      }
    };
    server.inject(options, (res) => {
      let result = res.result;
      expect(res.statusCode).to.equal(400);
      expect(result.message).to.deep.equal('child "value" fails because ["value" at position 2 fails because ["2" must be less than or equal to 1000]]');
      done();
    });
  });

  test('POST to /kvstore/array/number with bad value, expect joi validation Error', (done) => {
    const options = {
      method: 'POST',
      url: '/kvstore/array/number',
      payload: {
        key: 'test7',
        value: [ 123, 456, 789, 'wat' ]
      }
    };
    server.inject(options, (res) => {
      let result = res.result;
      expect(res.statusCode).to.equal(400);
      expect(result.message).to.deep.equal('child "value" fails because ["value" at position 3 fails because ["3" must be a number]]');
      done();
    });
  });

  test('POST to /kvstore/array, expect return value to be key:value set', (done) => {
    const options = {
      method: 'POST',
      url: '/kvstore/array',
      payload: {
        key: 'test8',
        value: [ 123, 456, 789, 'wat' ]
      }
    };
    server.inject(options, (res) => {
      let result = res.result;
      expect(res.statusCode).to.equal(200);
      expect(result).to.deep.equal({ test8: [ 123, 456, 789, 'wat' ] });
      done();
    });
  });

  test('POST to /kvstore/array with bad value, expect joi validation error', (done) => {
    const options = {
      method: 'POST',
      url: '/kvstore/array',
      payload: {
        key: 'test9',
        value: [ 123, 456, 7892, 'wat' ]
      }
    };
    server.inject(options, (res) => {
      let result = res.result;
      expect(res.statusCode).to.equal(400);
      expect(result.message).to.deep.equal('child "value" fails because ["value" at position 2 does not match any of the allowed types]');
      done();
    });
  });

  test('POST to /kvstore/array with bad value, expect joi validation error', (done) => {
    const options = {
      method: 'POST',
      url: '/kvstore/array',
      payload: {
        key: 'test9',
        value: [ 123, 456, 782, 'watthisislongerthan10chars' ]
      }
    };
    server.inject(options, (res) => {
      let result = res.result;
      expect(res.statusCode).to.equal(400);
      expect(result.message).to.deep.equal('child "value" fails because ["value" at position 3 does not match any of the allowed types]');
      done();
    });
  });
});
