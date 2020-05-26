# Project Modern Cloud Functions

## Public Methods

### Events Methods

Path | Method | Parameters | Description
--- | --- | --- | ---
   /events/ | GET | *none* | Fetches all events, returning an object.
   /events/:id | GET | *none* | Fetches a single event by id, returning an object.
   /events/ | POST | `name` `description` `time` `date` `platform` | Creates an event, returning an event object.
   /events/signup/:id | POST | `name` `username` `deckID` or `mainboard` `sideboard` | Generates and assigns a decklist to a player, adding player to the player queue, returning a player receipt.
   /events/pair/:id | GET | *none* | Generates and returns pairings, assigning player 1 and player 2 for later results.
   /events/report/:id | POST | `record` | Updates match history and generates performance track from record.
   /events/:id | DELETE | *none* | Fetches and deletes an event by id, returning an object.

### Decklists Methods

Path | Method | Parameters | Description
--- | --- | --- | ---
   /decklists/ | GET | *none* | Fetches all decklists, returning an object.
   /decklists/:id | GET | *none* | Fetches a single decklist by id, returning an object.
   /decklists/ | POST | `name (optional)` `author` `mainboard` `sideboard` | Validates mainboard and sideboard and creates decklist object and adds to registry, returning an object.
   /decklists/:id | POST | `name (optional)` `author` `mainboard` `sideboard` | Validates mainboard and sideboard and adds to registry or throws error on infractions, returning an object.
   /decklists/:id | DELETE | *none* | Fetches and deletes a decklist by id, returning an object.

## Private Methods

### Leagues Methods

Path | Method | Parameters | Description
--- | --- | --- | ---
   /leagues/ | GET | *none* | Fetches all league entries for every format and platform, returning an object.
   /leagues/:id | GET | *none* | Fetches a single league entry by id, returning an object.
   /leagues/:id | POST | `id` `format` `platform` `deckID` | Creates or updates a league entry with player id, format, platform, and deckid, returning an object.
   /leagues/pair/:id | GET | *none* | Generates and binds next league pairing.
   /leagues/report/:id | POST | `record` | Updates match history and generates performance track from record.
   /leagues/:id | DELETE | *none* | Fetches and deletes a league entry by id, returning an object.

### Players Methods

Path | Method | Parameters | Description
--- | --- | --- | ---
   /players/ | GET | *none* | Fetches all players, returning an object.
   /players/:id | GET | *none* | Fetches a single player by id, returning an object.
   /players/:id | POST | `name` `platforms` | Creates or updates player with optional id, Discord name, and platforms, returning an object.
   /players/:id | DELETE | *none* | Fetches and deletes a player by id, returning an object.

### Results Methods

Path | Method | Parameters | Description
--- | --- | --- | ---
   /results/ | GET | *none* | Fetches all results, returning an object.
   /results/:id | GET | *none* | Fetches a single result by id, returning an object.
   /results/ | POST | `id` `deckID` `matches` | Creates a result with player id, deckid, and match history, returning an object.
   /results/:id | POST | `id` `deckID` `matches` | Updates a result with player id, deckid, and match history, returning an object.
   /results/:id | DELETE | *none* | Fetches and deletes a result by id, returning an object.
