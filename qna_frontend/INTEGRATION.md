Frontend Integration Notes

Environment variables (copy .env.example to .env and adjust):
- REACT_APP_API_BASE_URL: Django backend API root, e.g., http://localhost:8000/api
- REACT_APP_WS_BASE_URL: WebSocket base, e.g., ws://localhost:8000/ws (kept for future real-time features)
- REACT_APP_SITE_URL: The public URL of this frontend (optional)

Auth:
- Login/Register POST requests call /auth/login/ and /auth/register/
- Logout POST request to /auth/logout/
- If backend issues a token in login response as { token: "<jwt>" }, it is stored in localStorage under authToken and sent as Authorization: Bearer in subsequent requests.
- If backend uses session cookies only, Authorization header is ignored but credentials: "include" ensures cookies are sent.

Chat flow endpoints:
- Ask: POST /chat/ask/ with { question, conversation_id? }
- List conversations: GET /chat/conversations/
- Conversation detail: GET /chat/conversations/{conversation_id}/

UI:
- Ocean Professional theme (blue/amber accents) with responsive layout:
  Header (logo + auth controls), Sidebar (conversation history), Chat panel, Footer.

Notes:
- WebSocket scaffolding exists in src/services/ws.js for future real-time updates.
- Update CORS/session config on backend as needed to accept requests from REACT_APP_SITE_URL.
