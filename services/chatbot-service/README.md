# AutoVerge Chatbot Service

Run this local chatbot microservice which exposes `/api/chat`.

Environment variables:
- `MONGODB_URI` — MongoDB connection string (defaults to mongodb://localhost:27017/autoverge)
- `OPENAI_API_KEY` — (optional) OpenAI API key for smarter responses

Install and run:

```bash
cd AutoVerge-platform/services/chatbot-service
npm install
npm run dev
```

Frontend integration:
- If running frontend dev server on a different port, either set a proxy in the frontend `package.json` to forward `/api` to `http://localhost:5050`, or call the full URL `http://localhost:5050/api/chat`.

Notes:
- The service expects a `vehicles` collection in the MongoDB database; the recommendation and comparison services query that collection.
- Chat history saved in `chathistories` collection via `ChatHistory` model.
