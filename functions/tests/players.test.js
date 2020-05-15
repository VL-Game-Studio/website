const request = require('supertest');
const app = require('.');

describe('Players', () => {
  const testPlayer = {
    id: '123',
    name: 'Test#1234',
    platforms: {
      mtgo: 'TestUsername'
    }
  };

  it('creates player', async () => {
    const { id, ...rest } = testPlayer;

    const res = await request(app)
      .post(`/players/${id}`)
      .send(rest);

    expect(res.statusCode).toEqual(200);
    Object.keys(testPlayer).forEach(key => {
      expect(res.body).toHaveProperty(key);
      expect(res.body[key]).toEqual(testPlayer[key]);
    });
  });

  it('fetches all players', async () => {
    const { id } = testPlayer;

    const res = await request(app)
      .get('/players');

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty(id);
    Object.keys(testPlayer).forEach(key => {
      expect(res.body[id]).toHaveProperty(key);
      expect(res.body[id][key]).toEqual(testPlayer[key]);
    });
  });

  it('fetches player', async () => {
    const { id } = testPlayer;

    const res = await request(app)
      .get(`/players/${id}`);

    expect(res.statusCode).toEqual(200);
    Object.keys(testPlayer).forEach(key => {
      expect(res.body).toHaveProperty(key);
      expect(res.body[key]).toEqual(testPlayer[key]);
    });
  });

  it('deletes player', async () => {
    const { id } = testPlayer;

    const res = await request(app)
      .delete(`/players/${id}`);

    expect(res.statusCode).toEqual(200);
    Object.keys(testPlayer).forEach(key => {
      expect(res.body).toHaveProperty(key);
      expect(res.body[key]).toEqual(testPlayer[key]);
    });
  });
});
