const { Router } = require('express');
const { users } = require('../persistence');

const router = new Router();

router.get('/', async (req, res) => {
  try {
    const allUsers = await users.fetchAll();

    return res.status(200).json(allUsers);
  } catch (error) {
    console.error(`GET /users >> ${error.stack}`);
    return res.status(500).json({ error: `An error occured while fetching users.` });
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const user = await users.fetch(id);
    if (!user) return res.status(404).json({ message: `User: ${id} was not found.` });

    return res.status(200).json(user);
  } catch (error) {
    console.error(`GET /users/${id} >> ${error.stack}`);
    return res.status(500).json({ error: `An error occured while fetching user: ${id}.` });
  }
});

router.post('/', async (req, res) => {
  const { name, platforms, roles, decks } = req.body;

  try {
    const user = await users.create({ name, platforms, roles, decks });

    return res.status(201).json(user);
  } catch (error) {
    console.error(`POST /users ({ name: ${name}, platforms: ${platforms}, decks: ${decks} }) >> ${error.stack}`);
    return res.status(500).json({ error: 'An error occured while creating user.' });
  }
});

router.post('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, platforms, roles, decks } = req.body;

  try {
    const user = await users.update({ id, name, platforms, roles, decks });

    return res.status(201).json(user);
  } catch (error) {
    console.error(`POST /users/${id} ({ name: ${name}, platforms: ${platforms}, decks: ${decks} }) >> ${error.stack}`);
    return res.status(500).json({ error: `An error occured while updating user: ${id}.` });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const user = await users.delete(id);

    return res.status(200).json(user);
  } catch (error) {
    console.error(`DELETE /users/${id} >> ${error.stack}`);
    return res.status(500).json({ error: `An error occured while deleting user: ${id}.` });
  }
});

module.exports = router;
