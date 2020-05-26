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
      .set({ id, player, username, deckID });

    const playerReceipt = await admin.database()
      .ref(`/events/${id}/players/${player}`)
      .once('value')
      .then(snap => snap.val());

    return playerReceipt;
  },
  async pair(id) {
    const players = await admin.database()
      .ref(`events/${id}/players`)
      .once('value')
      .then(snap => Object.values(snap.val()).sort((a, b) => a - b));

    const updatePlayer = async (playerID, props) => await admin.database()
      .ref(`/events/${id}/players/${playerID}`)
      .update(props);

    for (let player in players) {
      // Calculate points ceiling
      const maxDiff = (Object.values(player.matches).length + 1) * 3;
      const [opponent] = players
        // Remove player from opponent selection
        .filter(opp => opp.id && opp.id !== player.id)

        // Check if opponent has played before
        .filter(({ opponents = [] }) => !Object.values(opponents).includes(player))

        // Check if opponent isn't already paired or playing
        .filter(({ matches = [], opponents = [] }) =>
          Object.values(opponents).length === Object.values(matches).length &&
          Object.values(matches).length === Object.values(player.matches).length
        )

        // Pair within point ceiling
        .filter(({ points = 0 }) => Math.abs(points - player.points) <= maxDiff);

      // Append pairing or bye to player's opponent history
      updatePlayer(player.id, {
        opponents: player.opponents
          ? [...player.opponents, opponent || 'bye']
          : [opponent || 'bye']
      });

      if (opponent) {
        // Append pairing or bye to opponents's opponent history
        updatePlayer(opponent.id, {
          opponents: opponent.opponents
            ? [...opponent.opponents, player]
            : [player]
        });
      }
    }

    // Generate pairings, assigning player1 and player2 to later results
    const pairedPlayers = await admin.database()
      .ref(`events/${id}/players`)
      .once('value')
      .then(snap => Object.values(snap.val()).sort((a, b) => a - b));

    const pairings = [];

    pairedPlayers.forEach(player => {
      if (pairings.filter(({ player1, player2 }) => ![player1, player2].includes(player))) {
        return {
          player1: player,
          player2: player.opponents.pop(),
        };
      }
    });

    return pairings;
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
