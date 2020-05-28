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

    const updatePlayer = async (playerID, props) => await admin.database()
      .ref(`/events/${id}/players/${playerID}`)
      .update(props);

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
    		sortedPlayers.forEach((entry, index) => {
    			if (entry === player) {
            pairedPlayers.push(player);
            sortedPlayers[index].opponents.push(opponent ? opponent.id : 'bye');

            updatePlayer(player.id, {
              opponents: player.opponents
                ? [...player.opponents, opponent || 'bye']
                : [opponent || 'bye']
            });
    			} else if (opponent && entry === opponent) {
            pairedPlayers.push(opponent);
            const oppIndex = sortedPlayers.indexOf(opponent);

            if (sortedPlayers[oppIndex].opponents) {
              sortedPlayers[oppIndex].opponents.push(player.id);
            } else {
              sortedPlayers[oppIndex].opponents = [player.id];
            }

            updatePlayer(opponent.id, {
              opponents: opponent.opponents
                ? [...opponent.opponents, player.id]
                : [player.id]
            });
    			}
    		});

        // Generate pairing
    		pairings.push({
          player1: player.id,
          player2: opponent ? opponent.id : 'bye',
        });
    	}
    });

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

    const matchHistory = [
      ...Object.values(matches),
      {
        round: Object.values(matches).length + 1,
        record: `${wins}-${losses}-${ties}`,
        opponent: Object.values(opponents)[Object.values(opponents).length - 1],
      },
    ];

    await admin.database()
      .ref(`/events/${id}/players/${playerID}`)
      .update({
        points: parseInt(points) + ((parseInt(wins) === 2 ? 3 : parseInt(wins) === 1 ? 1 : 0) + parseInt(ties)),
        matches: matchHistory,
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
