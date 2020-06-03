# Project Modern Cloud Functions

## Public Methods

### Sheets Methods
Path | Method | Parameters | Description
--- | --- | --- | ---
   /sheets/events | GET | *none* | Returns an HTML table of events' signup and matchup data.

### Machine Learning Methods
Path | Method | Parameters | Description
--- | --- | --- | ---
   /ml/ | GET | *none* | Fetches all event decks, parsing as an array of quantities and card names.

### Events Methods

Path | Method | Parameters | Description
--- | --- | --- | ---
   /events/ | GET | *none* | Fetches all events, returning an object.
   /events/:id | GET | *none* | Fetches a single event by id, returning an object.

### Decklists Methods

Path | Method | Parameters | Description
--- | --- | --- | ---
   /decklists/ | GET | *none* | Fetches all decklists, returning an object.
   /decklists/:id | GET | *none* | Fetches a single decklist by id, returning an object.

### Leagues Methods

Path | Method | Parameters | Description
--- | --- | --- | ---
   /leagues/ | GET | *none* | Fetches all league entries, returning an object.
   /leagues/:id | GET | *none* | Fetches a single league entry by id, returning an object.

## Private Methods

Private methods require authorization via Discord secret in headers: `secret`.

### Events Methods

Path | Method | Parameters | Description
--- | --- | --- | ---
   /events/:id | POST | `name` `description` `time (in milliseconds)` `platform` | Updates a single event by id, returning an object.
   /events/ | POST | `name` `description` `time (in milliseconds)` `platform` | Creates an event, returning an event object.
   /events/signup/:id | POST | `name (optional)` `username` `mainboard` `sideboard` | Creates a player entry, returning a player receipt.
   /events/fire/:id | GET | *none* | Fires an event to lockdown signup and enable pairings and other in-game actions.
   /events/pairings/:id | GET | *none* | Generates and returns pairings, assigning player 1 and player 2 for later results.
   /events/report/:id/:playerID | POST | `record` | Updates match history and generates performance track from record.
   /events/:id | DELETE | *none* | Fetches and deletes an event by id, returning an object.

### Decklists Methods

Path | Method | Parameters | Description
--- | --- | --- | ---
   /decklists/ | POST | `name (optional)` `author` `mainboard` `sideboard` | Validates mainboard and sideboard and creates decklist object and adds to registry, returning an object.
   /decklists/:id | POST | `name (optional)` `author` `mainboard` `sideboard` | Validates mainboard and sideboard and adds to registry or throws error on infractions, returning an object.
   /decklists/:id | DELETE | *none* | Fetches and deletes a decklist by id, returning an object.

### Leagues Methods

Path | Method | Parameters | Description
--- | --- | --- | ---
   /leagues/:id | POST | `id` `platforms (optional)` | Creates or updates a league entry with player id, and platforms, returning an object.
   /leagues/queue/:id | GET | *none* | Initiated league queue, generating and binding a league pairing.
   /leagues/queue/cancel/:id | GET | *none* | Cancels last league pairing.
   /leagues/report/:id | POST | `record` | Updates match history and generates performance track from record.
   /leagues/drop/:id | GET | *none* | Drops a league entry by id, recording matchup data, returning an object.
   /leagues/:id | DELETE | *none* | Fetches and deletes a league entry by id, returning an object.
