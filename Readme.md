## Setup

1. npm install
2. Add .env with SUPABASE_URL, SUPABASE_KEY
3. npm run dev

## API

POST /api/v1/ask-jiji
Headers: x-userid: test123
Body: {"query": "RAG"}

## RLS

Queries table: Users see only their queries
Resources: Public read
