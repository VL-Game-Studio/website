const { Router } = require('express');
const { events } = require('../persistence');

const router = new Router();

function getEventsTable(events) {
  const headers = [
    'ID',
    'Name',
    'Description',
    'Platform',
    'Fired',
    'Discord ID',
    'Username',
    'Record',
    'Deck Name',
    'Deck Mainboard',
    'Deck Sideboard',
    'Opponents',
    'Records'
  ].map(header => `<td>${header}</td>`).join('');

  const table = `<table>${headers}${events.map(({ id, name, description, platform, fired, players = [] }) => {
    const eventData = [
      `<td>${id}</td>`,
      `<td>${name}</td>`,
      `<td>${description}</td>`,
      `<td>${platform}</td>`,
      `<td>${fired ? 'TRUE' : 'FALSE'}</td>`,
    ].join('');

    return Object.values(players).map(({ id, username, matches = [], opponents = [], deck: { name, mainboard, sideboard = [] } }) => {
      let wins = 0;
      let losses = 0;
      let ties = 0;

      Object.values(matches).forEach(({ record }) => {
        const [w, l, t] = record.split('-');

        wins += parseInt(w) === 2 ? 1 : 0;
        losses += parseInt(l) === 2 ? 1 : 0;
        ties += (parseInt(l) === 0 && parseInt(w) === 0) && parseInt(t) === 1 ? 1 : 0;
      });

      const record = `${wins};${losses};${ties}`;

      return [
        `<tr>`,
        eventData,
        `<td>${id}</td>`,
        `<td>${username}</td>`,
        `<td>${record}</td>`,
        `<td>${name}</td>`,
        `<td>${Object.values(mainboard).join(';')}</td>`,
        `<td>${Object.values(sideboard).join(';')}</td>`,
        `<td>${Object.values(opponents).join(';')}</td>`,
        `<td>${Object.values(matches).map(({ record }) => record).join(',')}</td>`,
        `</tr>`,
      ];
    }).join('');
  }).join('')}</table>`;

  return table;
}

router.get('/events', async (req, res) => {
  try {
    const activeEvents = Object.values(await events.fetchAll()).filter(({ fired }) => fired);
    if (!activeEvents) return res.status(404).json({ error: 'There aren\'t any backdated, active events.' });

    const table = getEventsTable(activeEvents);

    return res.status(200).send(table);
  } catch (error) {
    console.error(`GET /events >> ${error.stack}`);
    return res.status(500).json({ error: 'An error occured while parsing events.' });
  }
});

router.get('/events/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const activeEvent = await events.fetch(id);
    if (!activeEvent || !activeEvent.fired) return res.status(404).json({ error: 'There isn\'t an active event by that ID.' });

    const table = getEventsTable([activeEvent]);

    return res.status(200).send(table);
  } catch (error) {
    console.error(`GET /events/${id} >> ${error.stack}`);
    return res.status(500).json({ error: `An error occured while parsing event: ${id}.` });
  }
});

module.exports = router;
