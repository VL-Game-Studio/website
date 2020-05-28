const admin = require('firebase-admin');

const events = {
  async fetchAll() {
    const allEvents = await admin.database()
      .ref('/events')
      .once('value')
      .then(snap => snap.val());

    return allEvents;
  },
  async fetch(id) {
    const eventItem = await admin.database()
      .ref(`/events/${id}`)
      .once('value')
      .then(snap => snap.val());

    return eventItem;
  },
  async create(props) {
    const id = await admin.database()
      .ref('/events')
      .push(props)
      .then(({ key }) => key);

    await admin.database()
      .ref(`/events/${id}`)
      .update({ id });

    const eventItem = await admin.database()
      .ref(`/events/${id}`)
      .once('value')
      .then(snap => snap.val());

    return eventItem;
  },
  async signup({ id, player, username, deckID }) {
    await admin.database()
      .ref(`/events/${id}/players/${player}`)
      .set({ id: player, player, username, deckID });

    const playerReceipt = await admin.database()
      .ref(`/events/${id}/players/${player}`)
      .once('value')
      .then(snap => snap.val());

    return playerReceipt;
  },
  async pairings(id) {
    const players = await admin.database()
      .ref(`/events/${id}/players`)
      .once('value')
      .then(snap => Object.values(snap.val()));
    if (players.length < 2) return null;

    // Remove dropped players and sort by points (descending order)
    const sortedPlayers = players
      .filter(({ dropped }) => !dropped)
      .sort((a, b) => b.points - a.points);

    const pairings = [];
    const pairedPlayers = [];

    sortedPlayers.forEach(player => {
      // Set player defaults
      player.matches = player.matches || [];
      player.points = player.points || 0;
      player.opponents = player.opponents || [];

      // Calculate points ceiling
      const maxDiff = (Object.values(player.matches).length + 1) * 3;
      const [opponent] = sortedPlayers
      // Remove player from opponent selection
      .filter(({ id }) => id !== player.id)

      // Check if opponent has played before
      .filter(({ opponents = [] }) => !Object.values(opponents).includes(player))

      // Check if opponent isn't already paired or playing
      .filter(({ matches = [], opponents = [] }) =>
        Object.values(opponents).length === Object.values(matches).length &&
        Object.values(matches).length === Object.values(player.matches).length
      )

      // Pair within point ceiling
      .filter(({ points = 0 }) => Math.abs(points - player.points) <= maxDiff);

      // Verify players aren't already paired and mark them as paired
    	if (!pairedPlayers.includes(player)) {
    		sortedPlayers.forEach(async (entry, index) => {
    			if (entry === player) {
            pairedPlayers.push(player);
            sortedPlayers[index].opponents.push(opponent ? opponent.id : 'bye');
    			} else if (opponent && entry === opponent) {
            pairedPlayers.push(opponent);
            const oppIndex = sortedPlayers.indexOf(opponent);

            if (sortedPlayers[oppIndex].opponents) {
              sortedPlayers[oppIndex].opponents.push(player.id);
            } else {
              sortedPlayers[oppIndex].opponents = [player.id];
            }
    			}
    		});

        // Generate pairing
    		pairings.push({
          player1: player.id,
          player2: opponent ? opponent.id : 'bye',
        });
    	}
    });

    const droppedPlayers = players.filter(({ dropped }) => dropped);
    const updatedPlayers = {};
    sortedPlayers.concat(droppedPlayers).forEach(player => updatedPlayers[player.id] = player);

    await admin.database()
      .ref(`/events/${id}`)
      .update({ players: updatedPlayers });

    return pairings;
  },
  async report({ id, playerID, result }) {
    const player = await admin.database()
      .ref(`/events/${id}/players/${playerID}`)
      .once('value')
      .then(snap => snap.val());
    if (!player) return false;

    const { points = 0, matches = [], opponents = [] } = player;
    const [wins, losses, ties] = result.split('-');
    const opponentID = Object.values(opponents).length > 0 && Object.values(opponents).pop();
    if (!opponentID) throw Error('You are not in an active match.');

    const matchHistory = [
      ...Object.values(matches),
      {
        round: Object.values(matches).length + 1,
        record: `${wins}-${losses}-${ties}`,
        opponent: opponentID,
      },
    ];

    await admin.database()
      .ref(`/events/${id}/players/${playerID}`)
      .update({
        points: parseInt(points) + ((parseInt(wins) === 2 ? 3 : parseInt(wins) === 1 ? 1 : 0) + parseInt(ties)),
        matches: matchHistory,
      });

    const opponent = await admin.database()
      .ref(`/events/${id}/players/${opponentID}`)
      .once('value')
      .then(snap => snap.val());

    const { matches: oppMatches = [], points: oppPoints = 0 } = opponent;
    const opponentMatchHistory = [
      ...Object.values(oppMatches),
      {
        round: Object.values(oppMatches).length + 1,
        record: `${losses}-${wins}-${ties}`,
        opponent: playerID,
      }
    ];

    await admin.database()
      .ref(`/events/${id}/players/${opponentID}`)
      .update({
        points: parseInt(oppPoints) + ((parseInt(losses) === 2 ? 3 : parseInt(losses) === 1 ? 1 : 0) + parseInt(ties)),
        matches: opponentMatchHistory,
      });

    const activeEvent = await admin.database()
      .ref(`/events/${id}`)
      .once('value')
      .then(snap => snap.val());

    return activeEvent;
  },
  async drop({ id, playerID }) {
    const playerExists = await admin.database()
      .ref(`/events/${id}/players/${playerID}`)
      .once('value')
      .then(snap => snap.val());
    if (!playerExists) return false;

    await admin.database()
      .ref(`/events/${id}/players/${playerID}`)
      .update({ dropped: true });

    const player = await admin.database()
      .ref(`/events/${id}/players/${playerID}`)
      .once('value')
      .then(snap => snap.val());

    return player;
  },
  async delete(id) {
    const eventItem = await admin.database()
      .ref(`/events/${id}`)
      .once('value')
      .then(snap => snap.val());
    if (!eventItem) return false;

    await admin.database()
      .ref(`/events/${id}`)
      .remove();

    return eventItem;
  },
};

module.exports = events;
