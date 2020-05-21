const request = require('supertest');
const app = require('.');

describe('events', () => {
  const testEvent = {
    name: 'Test Event Name',
    description: 'Test event description.',
    time: '11 AM CST',
    date: '2020-05-20',
    platform: 'MTGO'
  };

  const testRegistration = {
    player: '1234',
    username: 'Test#1234',
    deckID: 'testDeck'
  };

  it('creates event', async () => {
    const res = await request(app)
      .post('/events')
      .send(testEvent);

    expect(res.statusCode).toEqual(200);
    Object.keys(testEvent).forEach(key => {
      expect(res.body).toHaveProperty(key);
      expect(res.body[key]).toEqual(testEvent[key]);
    });

    testEvent.id = res.body.id;
  });

  it('fetches all events', async () => {
    const { id } = testEvent;

    const res = await request(app)
      .get('/events');

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty(id);
    Object.keys(testEvent).forEach(key => {
      expect(res.body[id]).toHaveProperty(key);
      expect(res.body[id][key]).toEqual(testEvent[key]);
    });
  });

  it('fetches event', async () => {
    const { id } = testEvent;

    const res = await request(app)
      .get(`/events/${id}`);

    expect(res.statusCode).toEqual(200);
    Object.keys(testEvent).forEach(key => {
      expect(res.body).toHaveProperty(key);
      expect(res.body[key]).toEqual(testEvent[key]);
    });
  });

  it('signs up for event', async () => {
    const { id } = testEvent;

    const res = await request(app)
      .post(`/events/signup/${id}`)
      .send(testRegistration);

    expect(res.statusCode).toEqual(200);
    Object.keys(testRegistration).forEach(key => {
      expect(res.body).toHaveProperty(key);
      expect(res.body[key]).toEqual(testRegistration[key]);
    });
  });

  it('deletes event', async () => {
    const { id } = testEvent;

    const res = await request(app)
      .delete(`/events/${id}`);

    expect(res.statusCode).toEqual(200);
    Object.keys(testEvent).forEach(key => {
      expect(res.body).toHaveProperty(key);
      expect(res.body[key]).toEqual(testEvent[key]);
    });
  });
});
