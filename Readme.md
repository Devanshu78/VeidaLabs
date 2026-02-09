# Learn with Jiji – Mock Backend API

**VeidaLabs Software Developer Hiring Assignment**

This repository contains a backend service that powers the **search & respond flow** for _Learn with Jiji_, an AI learning companion by VeidaLabs.  
The service accepts a user query, fetches relevant learning resources from Supabase (Postgres + Storage), and returns a structured response consumable by a frontend application.

> No real AI is used. Responses are mocked, as allowed by the assignment.

---

## Tech Stack

- **Node.js + Express**
- **PostgreSQL (Supabase)**
- **Supabase Storage** (PPT / Video links)
- **Zod** – request validation
- **dotenv** – environment configuration
- **pg** – PostgreSQL client

---

## Project Structure

veidalabsmockapi/

- index.js # Entry point, Express app & routes
- package.json # Project metadata & dependencies
- package-lock.json
- .env.example # Environment variable template
- README.md
- config/
  - postgres.config.js # PostgreSQL (Supabase) connection pool

node_modules/ # Installed dependencies

---

## API Overview

### Endpoint

POST /api/v1/ask-jiji

### Headers

| Key      | Value  | Required |
| -------- | ------ | -------- |
| x-userid | string | Yes      |

Auth is mocked using the `x-userid` header for simplicity.

### Request Body

```json
curl -X POST http://localhost:8000/api/v1/ask-jiji \
  -H "Content-Type: application/json" \
  -H "x-userid: test-user-id" \
  -d '{"query":"Explain RAG"}'
```

```json
{
  "success": true,
  "answer": "RAG (Retrieval-Augmented Generation) combines information retrieval with language generation. Jiji retrieves relevant PPTs/videos first, then generates personalized explanations.",
  "resources": [
    {
      "id": "1a628cbc-1bf4-430e-9890-5954f01c4d33",
      "title": "RAG Explained.ppt",
      "type": "ppt",
      "url": "https://project.pptx"
    },
    {
      "id": "92e80fb6-4de2-42e0-9ff6-450b00d3fbe1",
      "title": "AI Videos - RAG.mp4",
      "type": "video",
      "url": "https://project.mp4"
    }
  ],
  "query_logged": true
}
```

## Error Responses

- **400** – Invalid request body
- **500** – Internal server error

---

## How It Works

1. Client sends a query (`POST /api/v1/ask-jiji`)
2. Backend validates:
   - `x-userid` header
   - Request body using **Zod**
3. Query is logged into the `queries` table
4. Matching resources are fetched from the `resources` table using keyword search
5. A mocked answer is generated
6. A structured response is returned to the client

---

## Database Schema (Supabase / PostgreSQL)

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE queries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  query TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  type TEXT CHECK (type IN ('ppt', 'video')),
  url TEXT NOT NULL,
  keywords TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### Row Level Security (RLS)

```sql
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE queries ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users own profiles" ON profiles
FOR ALL USING (id = auth.uid());

CREATE POLICY "Users own queries" ON queries
FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Public read resources" ON resources
FOR SELECT USING (true);
```

## Supabase Storage

- Uses Supabase Storage to host learning resources
- Contains:
  - One sample **PPT**
  - One sample **Video** (or placeholder)
- Public URLs from Supabase Storage are stored in the `resources.url` field
- These URLs are returned directly in the API response for frontend consumption

---

## Authentication (Mocked)

- Authentication is mocked using a custom request header: `x-userid`
- Each request must include this header to identify the user
- The value of `x-userid` is used to associate queries with a user
- This simulates authenticated user behavior without full Supabase Auth integration

---

## Environment Variables

Create a `.env` file in the project root:

```env
PORT=3000
POSTGRES_HOST=your_supabase_host
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password
POSTGRES_DATABASE=postgres
```

## Running the Project Locally

1. Install dependencies:
2. Start the development server:

```bash
npm install
npm run dev
```

3. Server will run at: http://localhost:3000

## One Improvement With More Time

With additional time, the following improvements could be implemented:

- Implement **semantic search** using vector embeddings for more accurate results
- Integrate full **Supabase Auth** instead of mocked headers
- Add **pagination and ranking** for learning resources
- Add **automated API tests** using Jest or Supertest
- Introduce **rate limiting and request logging** for better security
