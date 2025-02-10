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
- The data is keyed by SKU. If rows with the same SKU are uploaded, the data will be overwritten.
- Both front-end and back-end validates that duplicate SKUs are not added in the same request.

- Inventory list (i.e. the list of items in the database) is in descending order, so the latest items are at the top. The following improvements would be needed to support a real API
    - Pagination
    - Parameterize the order
    - Sorting
    - Filtering

- Front-end is not responsive. Expects a desktop browser.

