# Project Modern Cloud Functions

## Install and Run

Make sure you have nodejs installed. Install dependencies with:

```bash
npm install
```

Once it's done start up a local server with:

```bash
npm run dev
```

To run tests:

```bash
npm run test
```

## Public Methods

### Google Sheets Methods
Path | Method | Parameters | Description
--- | --- | --- | ---
   /sheets/ | GET | *none* | Fetches a sample event, for initial sheets' testing.

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

## Private Methods

Private methods require authorization via Discord secret in headers: `secret`.

### Events Methods

Path | Method | Parameters | Description
--- | --- | --- | ---
   /events/:id | POST | `name` `description` `time (date and time)` `platform` | Updates a single event by id, returning an object.
   /events/ | POST | `name` `description` `time (date and time)` `platform` | Creates an event, returning an event object.
   /events/signup/:id | POST | `name (optional)` `username` `mainboard` `sideboard` | Creates a player entry, returning a player receipt.
   /events/:id | DELETE | *none* | Fetches and deletes an event by id, returning an object.

### Decklists Methods

Path | Method | Parameters | Description
--- | --- | --- | ---
   /decklists/ | POST | `name (optional)` `author` `mainboard` `sideboard` | Validates mainboard and sideboard and creates decklist object and adds to registry, returning an object.
   /decklists/:id | POST | `name (optional)` `author` `mainboard` `sideboard` | Validates mainboard and sideboard and adds to registry or throws error on infractions, returning an object.
   /decklists/:id | DELETE | *none* | Fetches and deletes a decklist by id, returning an object.
