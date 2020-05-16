const request = require('supertest');
const app = require('.');

describe('Leagues', () => {
  const testLeague = {
    id: '123',
    format: 'modern',
    platform: 'mtgo',
    deckID: 'TestDeck',
    points: 9,
    matches: [
      {
        round: 1,
        record: '2-0-0',
        opponent: 'Opponent #1'
      },
      {
        round: 2,
        record: '2-0-0',
        opponent: 'Opponent #2'
      },
      {
        round: 3,
        record: '2-0-0',
        opponent: 'Opponent #3'
      },
    ],
    opponents: [
      'Opponent #1',
      'Opponent #2',
      'Opponent #3',
      'Opponent #4',
    ],
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

  it('reports league match result', async () => {
    const { id } = testLeague;

    const res = await request(app)
      .post(`/leagues/report/${id}`)
      .send({ result: '2-0-0' });

    expect(res.statusCode).toEqual(200);
    testLeague.matches = res.body.matches;
    testLeague.points = res.body.points;
    Object.keys(testLeague).forEach(key => {
      expect(res.body).toHaveProperty(key);
      expect(res.body[key]).toEqual(testLeague[key]);
    });
  });

  it('gets next pairing', async () => {
    const { id } = testLeague;

    const res = await request(app)
      .get(`/leagues/pair/${id}`);

    expect(res.statusCode).toEqual(409);
  });

  it('deletes league', async () => {
    const { id } = testLeague;

    const res = await request(app)
      .delete(`/leagues/${id}`);

    expect(res.statusCode).toEqual(200);
    Object.keys(testLeague).forEach(key => {
      expect(res.body).toHaveProperty(key);
      expect(res.body[key]).toEqual(testLeague[key]);
    });
  });
});
