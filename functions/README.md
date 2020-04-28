# Videre Cloud Functions

## Decklists Methods

Path | Method | Parameters | Description
--- | --- | --- | ---
   /decklists/ | GET | *none* | Fetches all decklists, returning an object.
   /decklists/:id | GET | *none* | Fetches a single decklist by id, returning an object.
   /decklists/ | POST | `author` `mainboard` `sideboard` | Validates mainboard and sideboard and creates decklist object and adds to registry, returning an object.
   /decklists/:id | POST | `author` `mainboard` `sideboard` | Validates mainboard and sideboard and adds to registry or throws error on infractions, returning an object.
   /decklists/:id | DELETE | *none* | Fetches and deletes a decklist by id, returning an object.

## Leagues Methods

Path | Method | Parameters | Description
--- | --- | --- | ---
   /leagues/ | GET | *none* | Fetches all leagues, returning an object.
   /leagues/:id | GET | *none* | Fetches a single league by id, returning an object.
   /leagues/:id/players | GET | *none* | Fetches all players from a league by id, returning an object.
   /leagues/:id/players/:playerID | GET | *none* | Fetches a single player by league and player id, returning an object.
   /leagues/:id/players/:playerID | DELETE | *none* | Deletes a single player by league and player id, returning an object.
   /leagues/ | POST | `name` `limit` `platform` | Generates and adds a league to the registry.
   /leagues/:id | POST | `name` `limit` `platform` | Fetches and updates a league by id, returning an object.
   /leagues/join/:id | POST | `name` `username` `deckID` or `mainboard` and `sideboard` | Registers a user and a deck from deckID or mainboard and sideboard to an active league, returning an object.
   /leagues/fire/:id | GET | *none* | Forcibly fires a league by id, returning a pairings object.
   /leagues/results/:id | POST | `result` | Records player scores object: { player1Wins, player2Wins, draws } on an active league.

 ## Users Methods

 Path | Method | Parameters | Description
 --- | --- | --- | ---
   /users/ | GET | *none* | Fetches all users, returning an object.
   /users/:id | GET | *none* | Fetches a single user by id, returning an object.
   /users/ | POST | `name` `platforms` `roles` `decks` | Creates user and binds decks, returning an object.
   /users/:id | POST | `name` `platforms` `roles` `decks` | Updates user and binds decks by id, returning an object.
   /users/:id | DELETE | *none* | Fetches and deletes a user by id, returning an object.
