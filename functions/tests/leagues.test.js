const request = require('supertest');
const app = require('.');

describe('Leagues', () => {
  const testLeague = {
    id: '1',
    username: 'TestPlayer',
    platform: 'testPlatform',
    deckID: 'TestDeck'
  };

  it('creates league', async () => {
    const { id, ...rest } = testLeague;

    const res = await request(app)
      .post(`/leagues/${id}`)
      .send(rest);

    expect(res.statusCode).toEqual(201);
    Object.keys(testLeague).forEach(key => {
      expect(res.body).toHaveProperty(key);
      expect(res.body[key]).toEqual(testLeague[key]);
    });
  });

  it('fetches all leagues', async () => {
    const { id } = testLeague;

    const res = await request(app)
      .get('/leagues');

    expect(res.statusCode).toEqual(200);
    Object.keys(testLeague).forEach(key => {
      expect(res.body[id]).toHaveProperty(key);
      expect(res.body[id][key]).toEqual(testLeague[key]);
    });
  });

  it('fetches league', async () => {
    const { id } = testLeague;

    const res = await request(app)
      .get(`/leagues/${id}`);

    expect(res.statusCode).toEqual(200);
    Object.keys(testLeague).forEach(key => {
      expect(res.body).toHaveProperty(key);
      expect(res.body[key]).toEqual(testLeague[key]);
    });
  });

  it('gets next pairing', async () => {
    const { id, ...rest } = testLeague;

    await request(app)
      .post(`/leagues/2`)
      .send(rest);

    const res = await request(app)
      .get(`/leagues/pair/${id}`);

    expect(res.statusCode).toEqual(200);
  });

  it('reports league match result', async () => {
    const { id } = testLeague;

    const res = await request(app)
      .post(`/leagues/report/${id}`)
      .send({ result: '2-0-0' });

    expect(res.statusCode).toEqual(200);
    testLeague.matches = res.body.matches;
    Object.keys(testLeague).forEach(key => {
      expect(res.body).toHaveProperty(key);
      expect(res.body[key]).toEqual(testLeague[key]);
    });
  });

  it('deletes league', async () => {
    const { id } = testLeague;

    const res = await request(app)
      .delete(`/leagues/${id}`);

    await request(app)
      .delete('/leagues/2');

    expect(res.statusCode).toEqual(200);
    Object.keys(testLeague).forEach(key => {
      expect(res.body).toHaveProperty(key);
      expect(res.body[key]).toEqual(testLeague[key]);
    });
  });
});
