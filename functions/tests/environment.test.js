const request = require('supertest');
const app = require('.');

describe('Environment', () => {
  it('runs without crashing', () => {
    const instance = app.listen(80, () => instance.close());
  });
});
