const request = require('supertest');
const app = require('.');

describe('Leagues', () => {
  const format = 'modern';
  const platform = 'mtgo';
  const testLeague = {
    id: '123',
    deckID: 'TestDeck',
    points: '0',
    matches: [
      {
        round: '1',
        record: '2-0-0',
        opponent: 'Opponent #1'
      },
      {
        round: '2',
        record: '2-0-0',
        opponent: 'Opponent #2'
      },
      {
        round: '3',
        record: '2-0-0',
        opponent: 'Opponent #3'
      },
      {
        round: '4',
        record: '2-0-0',
        opponent: 'Opponent #4'
      },
      {
        round: '5',
        record: '2-0-0',
        opponent: 'Opponent #5'
      },
    ],
    opponents: [
      'Opponent #1',
      'Opponent #2',
      'Opponent #3',
      'Opponent #4',
      'Opponent #5'
    ]
  };

  it('creates league', async () => {
    const { id, ...rest } = testLeague;

    const res = await request(app)
      .post(`/leagues/${format}/${platform}/${id}`)
      .send(rest);

    expect(res.statusCode).toEqual(201);
    Object.keys(testLeague).forEach(key => {
      expect(res.body).toHaveProperty(key);
      expect(res.body[key]).toEqual(testLeague[key]);
    });
  });

  it(`fetches all ${format} leagues`, async () => {
    const { id } = testLeague;

    const res = await request(app)
      .get(`/leagues/${format}`);

    expect(res.statusCode).toEqual(200);
    Object.keys(testLeague).forEach(key => {
      expect(res.body[platform][id]).toHaveProperty(key);
      expect(res.body[platform][id][key]).toEqual(testLeague[key]);
    });
  });

  it(`fetches all ${format} leagues for ${platform}`, async () => {
    const { id } = testLeague;

    const res = await request(app)
      .get(`/leagues/${format}/${platform}`);

    expect(res.statusCode).toEqual(200);
    Object.keys(testLeague).forEach(key => {
      expect(res.body[id]).toHaveProperty(key);
      expect(res.body[id][key]).toEqual(testLeague[key]);
    });
  });

  it('fetches league', async () => {
    const { id } = testLeague;

    const res = await request(app)
      .get(`/leagues/${format}/${platform}/${id}`);

    expect(res.statusCode).toEqual(200);
    Object.keys(testLeague).forEach(key => {
      expect(res.body).toHaveProperty(key);
      expect(res.body[key]).toEqual(testLeague[key]);
    });
  });

  it('deletes league', async () => {
    const { id } = testLeague;

    const res = await request(app)
      .delete(`/leagues/${format}/${platform}/${id}`);

    expect(res.statusCode).toEqual(200);
    Object.keys(testLeague).forEach(key => {
      expect(res.body).toHaveProperty(key);
      expect(res.body[key]).toEqual(testLeague[key]);
    });
  });
});
