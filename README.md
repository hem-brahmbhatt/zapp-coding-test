# Zapp Coding Test

## Prerequisites

Before running this project, make sure you have the following installed:
- Node.js (v14 or higher)
- npm (Node Package Manager)

To install the dependencies, run the following command:

```bash
npm run install:all
```

## Start the project

```bash
npm run build;
npm run start;
```

The app will be available at `http://localhost:5000`

Drag and drop the example.csv file to the drag and drop area to see the app in action.

## Testing
Only includes server tests, which can be run via the following.

```bash
cd server;
npm run test
```

Front-end tests have not been written for the sake of time. If I were to include these tests, I would use:
- react-testing-library
- jest

## Technologies used

On the front-end:
- React
- TypeScript
- TailwindCSS
- Zustand
  - API calls are handled in the store
- Zod
  - Validates the data + type inference

On the server:
- TypeScript
- Node.js
- Express
  - serves the REST API routes for /api/inventory. There's no need for anything more complex currently, e.g. graphql
  - serves the front-end app
- Better-sqlite3
  - In-memory SQLite database
- Zod
  - Validates the data + type inference
- Jest

## Assumptions
- Quantity can be negative to indicate whether the item has been oversold. Empty values for SKU, description and store are allowed for ease of use, with the intention of being filled out later.
- Items uploaded to the server are immutable. Only new rows added via a CSV can be added/edited/removed. Additional API routes can be added to edit existing items, especially since empty values are allowed.
- Front-end is not responsive. Expects a desktop browser.
