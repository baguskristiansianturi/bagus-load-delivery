# Data Repositories

**Status:** target data-access layer; repository extraction has not started.

Owns domain queries and mutations that currently live inside page controllers. Repositories use the singleton from `src/lib/supabase/client.js`; they do not render HTML, access the DOM or own route state.

Extract by domain (for example profiles, feed, directory, marketplace, trips) only after documenting the query contract and testing permissions, empty/error states and affected routes.
