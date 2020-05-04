const admin = require('firebase-admin');

const leagues = {
  async fetchAll() {
    const allLeagues = await admin.database()
      .ref('/leagues')
      .once('value')
      .then(snap => snap.val());

    return allLeagues;
  },
  async fetch(id) {
    const league = await admin.database()
      .ref(`/leagues/${id}`)
      .once('value')
      .then(snap => snap.val());

    return league;
  },
  async fetchPlayers(id) {
    const player = await admin.database()
      .ref(`/leagues/${id}/players`)
      .once('value')
      .then(snap => snap.val());

    return player;
  },
  async fetchPlayer(id, playerID) {
    const player = await admin.database()
      .ref(`/leagues/${id}/players/${playerID}`)
      .once('value')
      .then(snap => snap.val());

    return player;
  },
  async removePlayer(id, playerID) {
    const player = await admin.database()
      .ref(`/leagues/${id}/players/${playerID}`)
      .once('value')
      .then(snap => snap.val());

    await admin.database()
      .ref(`/leagues/${id}/players/${playerID}`)
      .remove();

    return player;
  },
  async update({ id, ...rest }) {
    await admin.database()
      .ref(`/leagues/${id}`)
      .update(rest);

    const league = await admin.database()
      .ref(`/leagues/${id}`)
      .once('value')
      .then(snap => snap.val());

    return league;
  },
  async create({ name, date, time, limit, platform }) {
    const id = await admin.database()
      .ref('/leagues')
      .push({ name, date, time, limit, platform })
      .then(({ key }) => key);

    await admin.database()
      .ref(`/leagues/${id}`)
      .update({ id });

    const league = await admin.database()
      .ref(`/leagues/${id}`)
      .once('value')
      .then(snap => snap.val());

    return league;
  },
  async join({ id, name, username, deckID }) {
    await admin.database()
      .ref(`/leagues/${id}/players`)
      .push({ name, username, deckID });

    const league = await admin.database()
      .ref(`/leagues/${id}`)
      .once('value')
      .then(snap => snap.val());

    return league;
  },
  async report({ id, result, reportingPlayer }) {
    const [player, draws, opponent] = result.split('-');

    const { player1, player2 } = await admin.database()
      .ref(`/leagues/${id}/pairings`)
      .once('value')
      .then(snap => snap.val());

    if (![player1, player2].includes(reportingPlayer)) return false;

    const activePlayer = reportingPlayer === player1;
    const key = await admin.database()
      .ref(`/leagues/${id}/results`)
      .push({
        player1: activePlayer ? player : opponent,
        draws,
        player2: activePlayer ? opponent : player,
      })
      .then(({ key }) => key);

    const results = await admin.database()
      .ref(`/leagues/${id}/results/${key}`)
      .once('value')
      .then(snap => snap.val());

    return results;
  },
  async fire(id) {
    await admin.database()
      .ref(`/leagues/${id}`)
      .update({ fired: true });

    const league = await admin.database()
      .ref(`/leagues/${id}`)
      .once('value')
      .then(snap => snap.val());

    return league;
  },
  async delete(id) {
    const league = await admin.database()
      .ref(`/leagues/${id}`)
      .once('value')
      .then(snap => snap.val());

    await admin.database()
      .ref(`/leagues/${id}`)
      .remove();

    return league;
  },
};

module.exports = leagues;
