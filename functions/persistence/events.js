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
