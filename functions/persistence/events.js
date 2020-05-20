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
    const event = await admin.database()
      .ref(`/events/${id}`)
      .once('value')
      .then(snap => snap.val());

    return event;
  },
  async create(props) {
    const id = await admin.database()
      .ref('/events')
      .push(props)
      .then(({ key }) => key);

    await admin.database()
      .ref(`/events/${id}`)
      .update({ id });

    const event = await admin.database()
      .ref(`/events/${id}`)
      .once('value')
      .then(snap => snap.val());

    return event;
  },
  async delete(id) {
    const event = await admin.database()
      .ref(`/events/${id}`)
      .once('value')
      .then(snap => snap.val());
    if (!event) return false;

    await admin.database()
      .ref(`/events/${id}`)
      .remove();

    return event;
  },
};

module.exports = events;
