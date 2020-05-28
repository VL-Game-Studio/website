const request = require('supertest');
const app = require('.');

describe('events', () => {
  const testEvent = {
    name: 'Test Event Name',
    description: 'Test event description.',
    time: '11 AM CST',
    date: '2020-05-20',
    platform: 'MTGO',
    players: [
      {
        id: '1',
        player: '1',
        username: 'Test#1',
        deckID: 'testDeck'
      },
      {
        id: '2',
        player: '2',
        username: 'Test#2',
        deckID: 'testDeck'
      },
      {
        id: '3',
        player: '3',
        username: 'Test#3',
        deckID: 'testDeck'
      },
      {
        id: '4',
        player: '4',
        username: 'Test#4',
        deckID: 'testDeck'
      },
      {
        id: '5',
        player: '5',
        username: 'Test#5',
        deckID: 'testDeck'
      }
    ]
  };

  const testRegistration = {
    player: '6',
    username: 'Test#6',
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
    testRegistration.id = res.body.id;
    Object.keys(testRegistration).forEach(key => {
      expect(res.body).toHaveProperty(key);
      expect(res.body[key]).toEqual(testRegistration[key]);
    });
  });

  it('drops player from event', async () => {
    const { id } = testEvent;

    const res = await request(app)
      .get(`/events/drop/${id}/6`);

    expect(res.statusCode).toEqual(200);
    testRegistration.dropped = res.body.dropped;
    Object.keys(testRegistration).forEach(key => {
      expect(res.body).toHaveProperty(key);
      expect(res.body[key]).toEqual(testRegistration[key]);
    });
  });

  it('generates pairings', async () => {
    const { id } = testEvent;

    const res = await request(app)
      .get(`/events/pairings/${id}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual([
      { player1: '1', player2: '2' },
      { player1: '3', player2: '4' },
      { player1: '5', player2: 'bye' }
    ]);
  });

  it('reports match result', async () => {
    const { id } = testEvent;
    const playerID = 1;

    const res = await request(app)
      .post(`/events/report/${id}/${playerID}`)
      .send({ result: '2-0-0' });

    expect(res.statusCode).toEqual(200);

    const opponent = res.body.players[playerID].opponents.pop();
    expect(res.body.players[playerID].points).toEqual(3);
    expect(res.body.players[opponent].points).toEqual(0);
  });

  it('deletes event', async () => {
    const { id } = testEvent;

    const res = await request(app)
      .delete(`/events/${id}`);

    expect(res.statusCode).toEqual(200);
  });
});
