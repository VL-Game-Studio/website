const request = require('supertest');
const app = require('.');

describe('Decklists', () => {
  const deck = {
    mainboard: "4 Death's Shadow\n4 Gurmag Angler\n4 Street Wraith\n3 Snapcaster Mage\n4 Stubborn Denial\n4 Thoughtseize\n3 Fatal Push\n3 Mishra's Bauble\n3 Thought Scour\n2 Dismember\n2 Inquisition of Kozilek\n2 Serum Visions\n2 Temur Battle Rage\n1 Faithless Looting\n1 Kolaghan's Command\n1 Lightning Bolt\n4 Bloodstained Mire\n4 Polluted Delta\n3 Scalding Tarn\n2 Watery Grave\n1 Blood Crypt\n1 Steam Vents\n1 Snow-Covered Island\n1 Snow-Covered Swamp",
    sideboard: "2 Collective Brutality\n2 Disdainful Stroke\n2 Liliana, the Last Hope\n2 Surgical Extraction\n1 Abrade\n1 Ceremonious Rejection\n1 Duress\n1 Jace, Vryn's Prodigy\n1 Kolaghan's Command\n1 Spell Snare\n1 Terminate"
  };

  const testDecklist = {
    author: 'Test#1234',
    name: 'Test Deck',
    ...deck
  };

  it('creates decklist', async () => {
    const { mainboard, sideboard, ...ref } = testDecklist;
    const res = await request(app)
      .post('/decklists')
      .set('secret', process.env.SECRET)
      .send(testDecklist);

    expect(res.statusCode).toEqual(201);
    Object.keys(ref).forEach(key => {
      expect(res.body).toHaveProperty(key);
      expect(res.body[key]).toEqual(testDecklist[key]);
    });

    testDecklist.id = res.body.id;
    testDecklist.mainboard = res.body.mainboard;
    testDecklist.sideboard = res.body.sideboard;
  });

  it('updates decklist', async () => {
    testDecklist.name = 'Test Deck #2';

    const { id, mainboard, sideboard, ...rest } = testDecklist;

    const res = await request(app)
      .post(`/decklists/${id}`)
      .set('secret', process.env.SECRET)
      .send({ ...rest, ...deck });

    expect(res.statusCode).toEqual(200);
    Object.keys(testDecklist).forEach(key => {
      expect(res.body).toHaveProperty(key);
      expect(res.body[key]).toEqual(testDecklist[key]);
    });
  });

  it('fetches all decklists', async () => {
    const { id } = testDecklist;

    const res = await request(app)
      .get('/decklists');

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty(id);
    Object.keys(testDecklist).forEach(key => {
      expect(res.body[id]).toHaveProperty(key);
      expect(res.body[id][key]).toEqual(testDecklist[key]);
    });
  });

  it('fetches decklist', async () => {
    const { id } = testDecklist;

    const res = await request(app)
      .get(`/decklists/${id}`);

    expect(res.statusCode).toEqual(200);
    Object.keys(testDecklist).forEach(key => {
      expect(res.body).toHaveProperty(key);
      expect(res.body[key]).toEqual(testDecklist[key]);
    });
  });

  it('deletes decklist', async () => {
    const { id } = testDecklist;

    const res = await request(app)
      .delete(`/decklists/${id}`)
      .set('secret', process.env.SECRET);

    expect(res.statusCode).toEqual(200);
    Object.keys(testDecklist).forEach(key => {
      expect(res.body).toHaveProperty(key);
      expect(res.body[key]).toEqual(testDecklist[key]);
    });
  });
});
