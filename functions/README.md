# Videre Cloud Functions

## Decklists Methods

Path | Method | Parameters | Description
--- | --- | --- | ---
   /decklists | GET |*none* | Fetches all decklists, returning an object.
   /decklists/:id | GET | *none* | Fetches a single decklist by id, returning an object.
   /decklists/:id | POST | `name` `author` `platform (optional)` `deck` | Validates deck object: { mainboard, sideboard } and adds to registry or throws error on infractions, returning an object.
   /decklists/:id | DELETE | *none* | Fetches and deletes a decklist by id, returning an object.

## Leagues Methods

Path | Method | Parameters | Description
--- | --- | --- | ---
   /leagues | GET | *none* | Fetches all leagues, returning an object.
   /leagues/:id | GET | *none* | Fetches a single league by id, returning an object/
   /leagues/:id | POST | `name` `limit` `platform` | Fetches and updates a league by id, returning an object.
   /leagues/create/:id | POST | `name` `limit` `platform` | Generates and adds a league to the registry.
   /leagues/join/:id | POST | `name` `author` `platform` `deck` | Registers a user and a deck object: { mainboard, sideboard } to an active league, returning an object.
   /leagues/fire/:id | GET | *none* | Forcibly fires a league by id, returning a pairings object.
   /leagues/results/:id | POST | `result` | Records player scores object: { player1Wins, player2Wins, draws } on an active league.
