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
Only includes server tests.

```bash
cd server;
npm run test
```

If I were to include client tests, I would use:
- react-testing-library
- jest

## Technologies used

- React
- TypeScript
- TailwindCSS
- Zustand
  - API calls are handled in the store

On the server:
- TypeScript
- Node.js
- Express
  - serves the API routes
  - serves the front-end app
- Better-sqlite3
- Jest

