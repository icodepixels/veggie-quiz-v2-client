This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

--------------------


The API will be available at `http://localhost:8000`

## API Endpoints

### Authentication

#### Create User
- **POST** `/users`
- **Description**: Create a new user account
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "username": "testuser"
  }
  ```
- **Response**: User details including ID and creation timestamp

#### Login
- **POST** `/token`
- **Description**: Get authentication token using email
- **Request Body**:
  ```json
  {
    "email": "user@example.com"
  }
  ```
- **Response**:
  ```json
  {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "bearer"
  }
  ```
- **Note**: Token is valid for 1 year

#### Get Current User
- **GET** `/users/me`
- **Description**: Get details of currently authenticated user
- **Headers**: `Authorization: Bearer <token>`
- **Response**: User details

### Quizzes

#### Get All Quizzes
- **GET** `/quizzes`
- **Description**: Get all available quizzes with their questions
- **Response**: Array of quizzes with their questions

#### Get Quiz Categories
- **GET** `/quiz-categories`
- **Description**: Get all unique quiz categories
- **Response**:
  ```json
  {
    "categories": ["Geography", "History", "Science"]
  }
  ```

#### Create Quiz
- **POST** `/quizzes`
- **Description**: Create a new quiz with questions
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "quiz": {
      "name": "Sample Quiz",
      "description": "A sample quiz",
      "image": "https://example.com/image.jpg",
      "category": "General",
      "difficulty": "Easy"
    },
    "questions": [
      {
        "question_text": "What is the capital of France?",
        "choices": ["London", "Berlin", "Paris", "Madrid"],
        "correct_answer_index": 2,
        "explanation": "Paris is the capital of France",
        "category": "Geography",
        "difficulty": "Easy",
        "image": "https://example.com/paris.jpg"
      }
    ]
  }
  ```
- **Response**: Created quiz with questions

#### Get Single Quiz
- **GET** `/quizzes/{quiz_id}`
- **Description**: Get a specific quiz by ID
- **Response**: Quiz details with questions

#### Delete Quiz
- **DELETE** `/quizzes/{quiz_id}`
- **Description**: Delete a quiz and its questions
- **Headers**: `Authorization: Bearer <token>`
- **Response**: Success message

### Quiz Results

#### Save Quiz Result
- **POST** `/quiz-results`
- **Description**: Save a user's quiz result
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "quiz_id": 1,
    "score": 85.5,
    "correct_answers": 8,
    "total_questions": 10
  }
  ```
- **Response**: Saved quiz result details

#### Get User's Quiz Results
- **GET** `/quiz-results`
- **Description**: Get all quiz results for the current user
- **Headers**: `Authorization: Bearer <token>`
- **Response**: Array of quiz results

## Data Models

### Quiz
```json
{
  "id": 1,
  "name": "Sample Quiz",
  "description": "A sample quiz",
  "image": "https://example.com/image.jpg",
  "category": "General",
  "difficulty": "Easy",
  "created_at": "2024-05-01T12:00:00Z",
  "questions": [
    {
      "id": 1,
      "question_text": "What is the capital of France?",
      "choices": ["London", "Berlin", "Paris", "Madrid"],
      "correct_answer_index": 2,
      "explanation": "Paris is the capital of France",
      "category": "Geography",
      "difficulty": "Easy",
      "image": "https://example.com/paris.jpg"
    }
  ]
}
```

### Quiz Result
```json
{
  "id": 1,
  "user_id": 1,
  "quiz_id": 1,
  "score": 85.5,
  "correct_answers": 8,
  "total_questions": 10,
  "created_at": "2024-05-01T12:30:00Z"
}
```

## Security Notes

1. Never commit your `.env` file to version control
2. Use HTTPS in production
3. Keep your SECRET_KEY secure and complex
4. Tokens are valid for 1 year - consider implementing token refresh if needed

## Error Handling

The API uses standard HTTP status codes:
- 200: Success
- 400: Bad Request
- 401: Unauthorized
- 404: Not Found
- 500: Internal Server Error

Error responses include a detail message explaining the error.
