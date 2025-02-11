# Zapp Coding Test
The brief:

_We’ve got some data in a CSV file and we want to transfer it over to a database and add validation and checks to any changes made to the data. We should be able to add/edit/delete any rows added._

https://github.com/user-attachments/assets/e23c4a58-f2a2-488f-ba96-734072ebcbed


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
- Vitest
  - Tests the store and API calls

On the server:
- TypeScript
- Node.js
- Express
  - serves the front-end app
  - serves the REST API routes for /api/inventory. If the front-end were more complex requiring different shapes of data, I would expose a graphql endpoint.
- Better-sqlite3
  - Uses an in-memory SQLite database. The table is created on startup.
  - A single table is used to store the inventory data, since there's no need for anything more complex
  - Uses prepared statements instead of an ORM, since the data is simple. In a production environment, I would use an ORM to manage the database schema and interact with the database.
- Zod
  - Validates the data + type inference
- Jest
  - Tests the API routes

## Assumptions
- SKU is a mandatory value that must be provided, and of the format correct format. Quantity can be negative to indicate whether the item has been oversold. Empty values for description and store are allowed for ease of use, with the intention of being filled out later.
- The data is keyed by SKU. If rows with the same SKU are uploaded, the data will be overwritten. In production, we would want to put limits in place for bulk updates across multiple rows.
- Both front-end and back-end validates that duplicate SKUs are not added in the same request.
- Inventory list (i.e. the list of items in the database) is in descending order, so the latest items are at the top. 
- The following API improvements would be needed to support a real use case:
    - Pagination
    - Parameterize the order
    - Sorting
    - Filtering
- Front-end is not responsive for the sake of time. Try to run this on a desktop browser.

