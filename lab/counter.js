
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
      expect(result).to.include({"counter": 0});
      expect(result.counter).to.equal(0);
      done();
    });
  });

  test.skip('GET set payload/params to params.hello = world to expect joi validation error', (done) => {
    const options = {
      method: 'GET',
      url: '/counter'
    };
    server.inject(options, (res) => {
      let result = res.result;
      console.log(result);
      done();
    });
  });

  test('POST /counter set payload counter to 50', (done) => {
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
      expect(result).to.include({"counter": 50});
      done();
    });
  });

  test('POST /counter set payload counter to -2', (done) => {
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

    test('POST /counter set payload counter to 1002', (done) => {
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

    test('POST /counter set payload counter to "zero"', (done) => {
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

    test('POST /counter set payload counter to 0, then PUT to /counter/increment', (done) => {
      const options = {
        method: 'POST',
        url: '/counter',
        payload: {
          counter: 0
        }
      };
      server.inject(options, (res) => {
        let result = res.result;
      });

      const options2 =  {
        method: 'PUT',
        url: '/counter/increment'
      };
      server.inject(options2, (res) => {
        let result = res.result;
        expect(res.statusCode).to.equal(200);
        expect(result).to.include({"counter": 1});
        done();
      });
    });

    test('POST /counter set payload counter to 1000, then PUT to /counter/increment', (done) => {
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

    test('POST /counter to set payload counter to 1000, then PUT to /counter/decrement', (done) => {
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
        expect(result).to.include({"counter": 999});
        done();
      });
    });

});
