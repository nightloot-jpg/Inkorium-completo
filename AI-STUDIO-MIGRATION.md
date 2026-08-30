# AI Studio / Gemini removal

This branch removes the AI Studio/Gemini integration only.

- Hetzner Object Storage remains the media backend.
- Express + Multer remain in place for `/api/upload`.
- Supabase remains the application database/auth integration.
- Existing social-network functionality is intentionally preserved.
- `@google/genai`, Gemini environment configuration and AI Studio metadata are removed.
