# Videre Cloud Functions

## Decklists Methods

Path | Method | Parameters | Description
--- | --- | --- | ---
   /decklists/ | GET | *none* | Fetches all decklists, returning an object.
   /decklists/:id | GET | *none* | Fetches a single decklist by id, returning an object.
   /decklists/ | POST | `name (optional)` `author` `mainboard` `sideboard` | Validates mainboard and sideboard and creates decklist object and adds to registry, returning an object.
   /decklists/:id | POST | `name (optional)` `author` `mainboard` `sideboard` | Validates mainboard and sideboard and adds to registry or throws error on infractions, returning an object.
   /decklists/:id | DELETE | *none* | Fetches and deletes a decklist by id, returning an object.

## Leagues Methods

Path | Method | Parameters | Description
--- | --- | --- | ---
   /leagues/ | GET | *none* | Fetches all league entries for every format and platform, returning an object.
   /leagues/:format | GET | *none* | Fetches all league entries by format, returning an object.
   /leagues/:format/:platform | GET | *none* | Fetches all league entries by format and platform, returning an object.
   /leagues/:format/:platform/:id | GET | *none* | Fetches a single league entry by id, returning an object.
   /leagues/:format/:platform/:id | POST | `id` `deckID` `points` `matches` `opponents` | Creates or updates a league entry with player id, deckid, points, and match history, returning an object.
   /leagues/pair/:format/:platform/:id | GET | *none* | Generates and binds next league pairing.
   /leagues/report/:format/:platform/:id | POST | `record` | Updates match history and generates performance track from record.
   /leagues/:format/:platform/:id | DELETE | *none* | Fetches and deletes a league entry by id, returning an object.

## Players Methods

Path | Method | Parameters | Description
--- | --- | --- | ---
   /players/ | GET | *none* | Fetches all players, returning an object.
   /players/:id | GET | *none* | Fetches a single player by id, returning an object.
   /players/:id | POST | `name` `platforms` | Creates or updates player with optional id, Discord name, and platforms, returning an object.
   /players/:id | DELETE | *none* | Fetches and deletes a player by id, returning an object.

## Results Methods

Path | Method | Parameters | Description
--- | --- | --- | ---
   /results/ | GET | *none* | Fetches all results, returning an object.
   /results/:id | GET | *none* | Fetches a single result by id, returning an object.
   /results/ | POST | `id` `deckID` `matches` | Creates a result with player id, deckid, and match history, returning an object.
   /results/:id | POST | `id` `deckID` `matches` | Updates a result with player id, deckid, and match history, returning an object.
   /results/:id | DELETE | *none* | Fetches and deletes a result by id, returning an object.
