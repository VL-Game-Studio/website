const admin = require('firebase-admin');
const { results } = require('./results');

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
  async set({ id, format, platform, ...props }) {
    const leagueExists = await admin.database()
      .ref(`/leagues/${id}`)
      .once('value')
      .then(snap => snap.val());
    if (leagueExists) throw new Error(`Player: ${id} is already in a league!`);

    await admin.database()
      .ref(`/leagues/${id}`)
      .set({ id, format, platform, ...props });

    const league = await admin.database()
      .ref(`/leagues/${id}`)
      .once('value')
      .then(snap => snap.val());

    return league;
  },
  async pair(id) {
    const league = await admin.database()
      .ref(`/leagues/${id}`)
      .once('value')
      .then(snap => snap.val());
    if (!league) throw new Error(`League data does not exist for player: ${id}.`);

    const { format, platform, points = 0, matches = [], opponents = [] } = league;
    const players = await admin.database()
      .ref('/leagues')
      .once('value')
      .then(snap => snap.val());

    const maxDiff = (Object.values(matches).length + 1) * 3;
    const [opponent] = Object.values(players)
      .filter(opp => opp.id && opp.id !== id)
      .filter(opp => opp.format && opp.format === format)
      .filter(opp => opp.platform && opp.platform === platform)
      .filter(opp => opp.opponents && !opp.opponents.includes(id))
      .filter(opp => opp.matches && Object.values(opp.matches).length === Object.values(matches).length)
      .filter(opp => opp.points && Math.abs(opp.points - points) <= maxDiff);
    if (!opponent) return null;

    await firebase.database()
      .ref(`/leagues/${id}`)
      .update({ opponents: [...opponents, opponent] });

    return opponent;
  },
  async report({ id, result }) {
    const player = await admin.database()
      .ref(`/leagues/${id}`)
      .once('value')
      .then(snap => snap.val());
    if (!player) throw new Error(`Could not find player to report: ${id}.`);

    const { points = 0, matches = [], opponents = [] } = player;
    const [wins, losses, ties] = result;

    const matchHistory = [
      ...Object.values(matches),
      {
        round: Object.values(matches).length + 1,
        record: `${wins}-${losses}-${ties}`,
        opponent: Object.values(opponents)[Object.values(opponents).length],
      },
    ];

    await admin.database()
      .ref(`/leagues/${id}`)
      .update({
        points: points + ((wins * 3) + ties),
        matches: matchHistory,
      });

    if (matchHistory.length === 5) {
      const { deckID } = await admin.database()
        .ref(`/leagues/${id}`)
        .once('value')
        .then(snap => snap.val());

      await results.create({ id, deckID, matches: matchHistory });
    }

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
    if (!league) return false;

    await admin.database()
      .ref(`/leagues/${id}`)
      .remove();

    return league;
  },
};

module.exports = leagues;
