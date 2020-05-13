const request = require('supertest');
const app = require('.');

describe('Results', () => {
  const testResult = {
    deckID: 'TestDeck',
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
      }
    ]
  };

  it('creates result', async () => {
    const res = await request(app)
      .post('/results')
      .send(testResult);

    expect(res.statusCode).toEqual(200);
    Object.keys(testResult).forEach(key => {
      expect(res.body).toHaveProperty(key);
      expect(res.body[key]).toEqual(testResult[key]);
    });

    testResult.id = res.body.id;
  });

  it('updates result', async () => {
    testResult.deckID = 'TestDeck#2';

    const { id, ...rest } = testResult;

    const res = await request(app)
      .post(`/results/${id}`)
      .send(rest);

    expect(res.statusCode).toEqual(200);
    Object.keys(testResult).forEach(key => {
      expect(res.body).toHaveProperty(key);
      expect(res.body[key]).toEqual(testResult[key]);
    });
  });

  it('fetches all results', async () => {
    const { id } = testResult;

    const res = await request(app)
      .get('/results');

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty(id);
    Object.keys(testResult).forEach(key => {
      expect(res.body[id]).toHaveProperty(key);
      expect(res.body[id][key]).toEqual(testResult[key]);
    });
  });

  it('fetches result', async () => {
    const { id } = testResult;

    const res = await request(app)
      .get(`/results/${id}`);

    expect(res.statusCode).toEqual(200);
    Object.keys(testResult).forEach(key => {
      expect(res.body).toHaveProperty(key);
      expect(res.body[key]).toEqual(testResult[key]);
    });
  });

  it('deletes result', async () => {
    const { id } = testResult;

    const res = await request(app)
      .delete(`/results/${id}`);

    expect(res.statusCode).toEqual(200);
    Object.keys(testResult).forEach(key => {
      expect(res.body).toHaveProperty(key);
      expect(res.body[key]).toEqual(testResult[key]);
    });
  });
});
