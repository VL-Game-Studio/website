const request = require('supertest');
const app = require('.');

describe('Sheets', () => {
  it('fetches events', async () => {
    const res = await request(app)
      .get('/sheets/events');

    expect(res.statusCode).toEqual(200);
  });

  it('fetches unknown event', async () => {
    const res = await request(app)
      .get('/sheets/events/test');

    expect(res.statusCode).toEqual(404);
  });

  it('fetches event 1590836400000', async () => {
    const res = await request(app)
      .get('/sheets/events/1590836400000');

    expect(res.statusCode).toEqual(200);
  });
});
