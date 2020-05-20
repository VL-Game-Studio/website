const { Router } = require('express');
const { events } = require('../persistence');

const router = new Router();

router.get('/', async (req, res) => {
  try {
    const allEvents = await events.fetchAll();

    return res.status(200).json(allEvents);
  } catch (error) {
    console.error(`GET /events >> ${error.stack}`);
    return res.status(500).json({ error: `An error occured while fetching events.` });
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const event = await events.fetch(id);
    if (!event) return res.status(404).json({ message: `An event could not be found for: ${id}.` });

    return res.status(200).json(event);
  } catch (error) {
    console.error(`GET /events/${id} >> ${error.stack}`);
    return res.status(500).json({ error: `An error occured while fetching event: ${id}.` });
  }
});

router.post('/', async (req, res) => {
  const { name, description, time, date, platform, ...rest } = req.body;

  try {
    const event = await events.create({ name, description, time, date, platform, ...rest });

    return res.status(200).json(event);
  } catch (error) {
    console.error(`POST /events/ ({ name: ${name}, description: ${description}, time: ${time}, date: ${date}, platform: ${platform} }) >> ${error.stack}`);
    return res.status(500).json({ error: 'An error occured while creating event.' });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const event = await events.delete(id);
    if (!event) return res.status(404).json({ message: `An event could not be found for: ${id}.` });

    return res.status(200).json(event);
  } catch (error) {
    console.error(`DELETE /events/${id} >> ${error.stack}`);
    return res.status(500).json({ error: `An error occured while deleting event: ${id}.` });
  }
});

module.exports = router;
