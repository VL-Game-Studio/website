import request from 'supertest'
import { server } from '../'
import config from '../config'

describe('Decklists', () => {
  const deck = {
    mainboard:
      "4 Death's Shadow\n4 Gurmag Angler\n4 Street Wraith\n3 Snapcaster Mage\n4 Stubborn Denial\n4 Thoughtseize\n3 Fatal Push\n3 Mishra's Bauble\n3 Thought Scour\n2 Dismember\n2 Inquisition of Kozilek\n2 Serum Visions\n2 Temur Battle Rage\n1 Faithless Looting\n1 Kolaghan's Command\n1 Lightning Bolt\n4 Bloodstained Mire\n4 Polluted Delta\n3 Scalding Tarn\n2 Watery Grave\n1 Blood Crypt\n1 Steam Vents\n1 Snow-Covered Island\n1 Snow-Covered Swamp",
    sideboard:
      "2 Collective Brutality\n2 Disdainful Stroke\n2 Liliana, the Last Hope\n2 Surgical Extraction\n1 Abrade\n1 Ceremonious Rejection\n1 Duress\n1 Jace, Vryn's Prodigy\n1 Kolaghan's Command\n1 Spell Snare\n1 Terminate",
  }

  const testDecklist = {
    id: null,
    author: 'Test#1234',
    name: 'Test Deck',
    ...deck,
  }

  it('creates decklist', async () => {
    const res = await request(server).post('/decklists').set('secret', config.secret).send(testDecklist)

    expect(res.statusCode).toEqual(201)
    testDecklist.id = res.body.id
  })

  it('updates decklist', async () => {
    testDecklist.name = 'Test Deck #2'

    const { id, mainboard, sideboard, ...rest } = testDecklist

    const res = await request(server)
      .post(`/decklists/${id}`)
      .set('secret', config.secret)
      .send({ ...rest, ...deck })

    expect(res.statusCode).toEqual(200)
  })

  it('fetches all decklists', async () => {
    const { id } = testDecklist

    const res = await request(server).get('/decklists')

    expect(res.statusCode).toEqual(200)
    expect(res.body).toHaveProperty(id)
  })

  it('fetches decklist', async () => {
    const { id } = testDecklist

    const res = await request(server).get(`/decklists/${id}`)

    expect(res.statusCode).toEqual(200)
  })

  it('deletes decklist', async () => {
    const { id } = testDecklist

    const res = await request(server).delete(`/decklists/${id}`).set('secret', config.secret)

    expect(res.statusCode).toEqual(200)
  })
})
