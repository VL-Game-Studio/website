# Videre Cloud Functions

## Decklists Methods

Path | Method | Parameters | Description
--- | --- | --- | ---
   /decklists | GET |*none* | Fetches all decklists, returning an object.
   /decklists/:id | GET | *none* | Fetches a single decklist by id, returning an object.
   /decklists/:id | POST | `name` `author` `platform (optional)` `decklist` | Validates decklist object: { mainboard, sideboard } and adds to registry or throws error on infractions, returning an object.
   /decklists/:id | DELETE | *none* | Fetches and deletes a decklist by id, returning an object.

## Leagues Methods

Path | Method | Parameters | Description
--- | --- | --- | ---
   /leagues/:platform | POST | `name` `author` `decklist` | Submits decklist object: { mainboard, sideboard } and joins active league, returning an object.
   /leagues/:league/:platform | POST | `score` | Records match score in active league, returning an object.
