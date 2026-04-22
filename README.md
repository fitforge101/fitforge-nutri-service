🔗 **Central Documentation:** [https://github.com/fitforge101/fitforge-app-docs](https://github.com/fitforge101/fitforge-app-docs)

# Nutrition Service

## Overview
The `nutrition-service` tracks daily dietary intake. It allows users to log meals (breakfast, lunch, dinner, snacks), specific food items, and macro-nutrient breakdowns (proteins, carbs, fats).

## Features
*   Log structured diet entries with total calories and macros.
*   Retrieve recent nutrition history (up to 30 entries).
*   Delete specific erroneous entries.
*   Protected by centralized JWT middleware.

## Tech Stack
*   Node.js
*   Express.js
*   MongoDB (Mongoose)

## API Endpoints
*   `GET /nutrition/diet/:userId` - Retrieve recent diet logs
*   `POST /nutrition/diet` - Create a new log entry
*   `DELETE /nutrition/diet/:entryId` - Delete an entry
*   `GET /health` - Healthcheck

## Example Request/Response

**POST `/nutrition/diet`**
*Request:*
```json
{
  "userId": "64a1b2c3d4e5f67890123456",
  "mealType": "breakfast",
  "totalCalories": 450,
  "foodItems": [
    { "name": "Oatmeal", "calories": 150, "proteinG": 5, "carbsG": 27, "fatG": 3 }
  ]
}
```

## Setup Instructions
1.  **Install Dependencies:**
    ```bash
    npm ci
    ```
2.  **Run Development Server:**
    ```bash
    npm run dev
    ```

## Environment Variables
*   `PORT` (Default: `5004`)
*   `MONGO_URI` (Default: `mongodb://mongo:27017/nutrition_db`)

## Folder Structure
```text
.
├── Dockerfile
├── package.json
└── src/
    ├── index.js
    ├── middleware/
    │   └── verifyToken.js
    ├── models/
    │   └── DietEntry.js
    └── routes/
        └── nutrition.js
```

## Deployment
This service includes a `Dockerfile` and is deployed natively in Kubernetes clusters using the FitForge organizational Helm charts.
