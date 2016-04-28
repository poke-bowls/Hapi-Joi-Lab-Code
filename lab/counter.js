
'use strict';

const Lab = require('lab');
const Code = require('code');
const lab = exports.lab = Lab.script();
const server = require('../src');

const test = lab.test;
const expect = Code.expect;

lab.experiment('Counter', () => {

  test('GET to /counter, expect return value 0', (done) => {
    const options = {
      method: 'GET',
      url: '/counter'
    };
    server.inject(options, (res) => {
      let result = res.result;
      expect(res.statusCode).to.equal(200);
      expect(result).to.be.an.object();
      expect(result).to.deep.equal({"counter": 0});
      expect(result.counter).to.equal(0);
      done();
    });
  });

  test('GET set payload/params to params.hello = world to expect joi validation error', (done) => {
    const options = {
      method: 'GET',
      url: '/counter?hello=world'
    };
    server.inject(options, (res) => {
      let result = res.result;
      expect(res.statusCode).to.equal(400);
      expect(result.message).to.deep.equal('"hello" is not allowed');
      done();
    });
  });

  test('POST /counter set payload counter to 50, expect return value 50', (done) => {
    const options = {
      method: 'POST',
      url: '/counter',
      payload: {
        counter: 50
      }
    };
    server.inject(options, (res) => {
      let result = res.result;
      expect(res.statusCode).to.equal(200);
      expect(result).to.deep.equal({"counter": 50});
      expect(result.counter).to.equal(50);
      done();
    });
  });

  test('POST /counter set payload counter to -2, expect joi validation error', (done) => {
      const options = {
        method: 'POST',
        url: '/counter',
        payload: {
          counter: -2
        }
      };
      server.inject(options, (res) => {
        let result = res.result;
        expect(res.statusCode).to.equal(400);
        expect(result.message).to.equal('child \"counter\" fails because [\"counter\" must be larger than or equal to 0]');
        done();
      });
    });

    test('POST /counter set payload counter to 1002, expect joi validation error', (done) => {
      const options = {
        method: 'POST',
        url: '/counter',
        payload: {
          counter: 1002
        }
      };
      server.inject(options, (res) => {
        let result = res.result;
        expect(res.statusCode).to.equal(400);
        expect(result.message).to.equal('child "counter" fails because ["counter" must be less than or equal to 1000]');
        done();
      });
    });

    test('POST /counter set payload counter to "zero", expect joi validation error', (done) => {
      const options = {
        method: 'POST',
        url: '/counter',
        payload: {
          counter: "zero"
        }
      };
      server.inject(options, (res) => {
        let result = res.result;
        expect(res.statusCode).to.equal(400);
        expect(result.message).to.equal('child "counter" fails because ["counter" must be a number]');
        done();
      });
    });

    test('POST /counter set payload counter to 0, then PUT to /counter/increment, expect return value 1', (done) => {
      const options = {
        method: 'POST',
        url: '/counter',
        payload: {
          counter: 0
        }
      };
      server.inject(options, (res) => {
      });

      const options2 =  {
        method: 'PUT',
        url: '/counter/increment'
      };
      server.inject(options2, (res) => {
        let result = res.result;
        expect(res.statusCode).to.equal(200);
        expect(result).to.deep.equal({"counter": 1});
        done();
      });
    });

    test('POST /counter set payload counter to 1000, then PUT to /counter/increment, expect joi validation error', (done) => {
       const options = {
        method: 'POST',
        url: '/counter',
        payload: {
          counter: 1000
        }
      };
      server.inject(options, (res) => {
      });

      const options2 =  {
        method: 'PUT',
        url: '/counter/increment'
      };
      server.inject(options2, (res) => {
        let result = res.result;
        expect(res.statusCode).to.equal(400);
        expect(result.message).to.equal('child "counter" fails because ["counter" must be less than or equal to 1000]');
        done();
      });
    });

    test('POST /counter to set payload counter to 1000, then PUT to /counter/decrement, expect return value 999', (done) => {
      const options = {
        method:'POST',
        url: '/counter',
        payload: {
          counter: 1000
        }
      };
      server.inject(options, (res) => {
      });

      const options2 = {
        method: 'PUT',
        url: '/counter/decrement',
      };
      server.inject(options2, (res) => {
        let result = res.result;
        expect(res.statusCode).to.equal(200);
        expect(result).to.deep.equal({"counter": 999});
        expect(result.counter).to.equal(999);
        done();
      });
    });

    test('POST /counter to set payload counter to 0, then PUT to /counter/decrement, expect joi validation error', (done) => {
      const options = {
        method:'POST',
        url: '/counter',
        payload: {
          counter: 0
        }
      };
      server.inject(options, (res) => {
      });

      const options2 = {
        method: 'PUT',
        url: '/counter/decrement',
      };
      server.inject(options2, (res) => {
        let result = res.result;
        expect(res.statusCode).to.equal(400);
        expect(result.message).to.equal('child "counter" fails because ["counter" must be larger than or equal to 0]');
        done();
      });
    });
});
