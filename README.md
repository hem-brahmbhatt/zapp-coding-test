# Zapp Coding Test

https://github.com/user-attachments/assets/293f9f00-355a-4178-a479-b24cae7595d4

## Prerequisites

Before running this project, make sure you have the following installed:
- Node.js (v14 or higher)
- npm (Node Package Manager)

To install the dependencies, run the following command:

```bash
npm run install:all
```

## Start the project

_Note: Project was last tested using Node.js v20.12.2_

```bash
npm run build;
npm run start;
```

The app will be available at `http://localhost:5000`

Drag and drop the example.csv file to the drag and drop area to see the app in action.

## Testing
Tests coverage added for API routes and front-end store.

```bash
npm run test
```

Front-end component tests have not been written for the sake of time. If I were to include these tests, I would use:
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
- Every time the CSV is uploaded, new rows get added to the database. We don't check if the row already exists in the database by checking the SKU, again for ease of use, e.g. the user doesn't have to manually remove rows from the database before uploading a new CSV. I could check if the SKU already exists in the database and update any found rows, but this is a simple solution for now.
- Inventory list (i.e. the list of items in the database) is in descending order, so the latest items are at the top. The list is NOT paginated.
- Items uploaded to the server are immutable. Only new rows added via a CSV can be added/edited/removed. Additional API routes can be added to edit existing items, especially since empty values are allowed.
- Front-end is not responsive. Expects a desktop browser.
- Code structure, linting, formatting, modularity was prioritized over performance to allow for easier maintenance and for new features to be added more easily.
