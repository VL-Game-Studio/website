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
  async create({ id, platform, ...props }) {
    const leagueExists = await admin.database()
      .ref(`/leagues/${id}`)
      .once('value')
      .then(snap => snap.val());
    if (leagueExists) return false;

    await admin.database()
      .ref(`/leagues/${id}`)
      .set({ id, platform, ...props });

    const league = await admin.database()
      .ref(`/leagues/${id}`)
      .once('value')
      .then(snap => snap.val());

    return league;
  },
  async pair(playerID) {
    // Fetch players and shortcut if there are not enough players for a match
    const players = await admin.database()
      .ref('/leagues')
      .once('value')
      .then(snap => snap.val())
      .then(val => Object.values(val));
    if (players.length < 2) return null;

    // Calculate players' points
    players.map(player => {
      let wins = 0, ties = 0;

      if (player.matches) {
        Object.values(player.matches).forEach(({ result }) => {
          const stats = result.split('-');

          wins += parseInt(stats[0]);
          ties += parseInt(stats[2]);
        });
      }

      return player.points = (parseInt(wins) === 2 ? 3 : parseInt(wins) === 1 ? 1 : 0) + parseInt(ties);
    });

    // Find and check if player exists; set defaults if uninitiated
    const [player] = players.filter(({ id }) => id === playerID);
    if (!player) throw new Error('You are not in a league.');

    // Set player defaults
    player.matches = player.matches || [];
    player.opponents = player.opponents || [];

    // Calculate points ceiling
    const maxDiff = (Object.values(player.matches).length + 1) * 3;
    const [opponent] = players
    // Remove player from opponent selection
    .filter(({ id }) => id !== player.id)

    // Filter to same platform
    .filter(({ platform }) => platform === player.platform)

    // Check if opponent has played before
    .filter(({ opponents = [] }) => !Object.values(opponents).includes(player))

    // Check if opponent isn't already paired or playing
    .filter(({ matches = [], opponents = [] }) =>
      Object.values(opponents).length === Object.values(matches).length &&
      Object.values(matches).length === Object.values(player.matches).length
    )

    // Pair within point ceiling
    .filter(({ points = 0 }) => Math.abs(points - player.points) <= maxDiff);
    if (!opponent) return null;

    // Append opponent to player's history
    await admin.database()
      .ref(`/leagues/${playerID}`)
      .update({ opponents: player.opponents ? [...player.opponents, opponent.id] : [opponent.id] });

    // Append player to opponent's history
    await admin.database()
      .ref(`/leagues/${opponent.id}`)
      .update({ opponents: opponent.opponents ? [...opponent.opponents, player.id] : [player.id] });

    return opponent.id;
  },
  async report({ id: playerID, result }) {
    const player = await admin.database()
      .ref(`/leagues/${playerID}`)
      .once('value')
      .then(snap => snap.val());
    if (!player) return false;

    const { opponents = [], matches = [] } = player;
    const [wins, losses, ties] = result.split('-');

    const opponentID = Object.values(opponents).length > 0 && Object.values(opponents).pop();
    if (!opponentID) return false;

    const playerRound = {
      round: Object.values(matches).length,
      record: `${wins}-${losses}-${ties}`,
      opponent: opponentID,
    };

    await admin.database()
      .ref(`/leagues/${playerID}/matches/${opponents.length}`)
      .set(playerRound);

    if (Object.values(opponents.length) === 5) {
      const league = await admin.database()
        .ref(`/leagues/${playerID}`)
        .once('value')
        .then(snap => snap.val());

      await results.create(league);
    }

    const opponent = await admin.database()
      .ref(`/leagues/${opponentID}`)
      .once('value')
      .then(snap => snap.val());

    const { opponents: oppOpponents, matches: oppMatches = [] } = opponent;

    const opponentRound = {
      round: Object.values(oppMatches).length,
      record: `${losses}-${wins}-${ties}`,
      opponent: playerID,
    };

    await admin.database()
      .ref(`/leagues/${opponentID}/matches/${oppOpponents.length}`)
      .set(opponentRound);

    if (Object.values(oppOpponents.length) === 5) {
      const league = await admin.database()
        .ref(`/leagues/${opponentID}`)
        .once('value')
        .then(snap => snap.val());

      await results.create(league);

      await admin.database()
        .ref(`/leagues/${opponentID}`)
        .remove();
    }

    const playerReceipt = await admin.database()
      .ref(`/leagues/${playerID}`)
      .once('value')
      .then(snap => snap.val());

    return playerReceipt;
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
