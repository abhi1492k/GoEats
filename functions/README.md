# Functions: Auth

This folder contains simple Netlify Functions implementing a minimal signup/login flow used for demo/testing.

Endpoints (HTTP POST):

- /.netlify/functions/signup  -> body: { name, email, password }
- /.netlify/functions/login   -> body: { email, password }

Responses:
- 201 (signup): { token, user }
- 200 (login): { token, user }
Use the JWT token returned in the Authorization header for protected requests (not implemented here).

Notes:
- Passwords are hashed using bcryptjs and stored in `data/users.json` (file-based storage; not for production).
- Set `JWT_SECRET` in Netlify environment variables for production.
