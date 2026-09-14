# Security Policy & Checklist - Refresh Breeze

## Implemented Security Measures

### 1. Environment Variables
- All credentials and sensitive tokens are isolated in `.env` files.
- `.env` and `.env.local` files are excluded from version control via `.gitignore`.
- `.env.example` templates provided without production secrets.
- No hardcoded secrets in repository code.

### 2. Authentication & Authorization
- Signed JWT token authentication for administrative endpoints.
- Password hashing with bcrypt (10 rounds).
- Express authentication middleware protecting admin routes.
- Tokens stored in localStorage on the client side with automated expiration handling.

### 3. Database Security
- Supabase Row Level Security (RLS) enabled on database tables.
- Supabase Service Role Key restricted exclusively to the backend server environment.
- Public anonymous key restricted to read operations where permitted.
- Foreign key constraints and UUID primary keys across relational tables.

### 4. API Security
- CORS configured with explicit domain whitelisting.
- Payload input validation and sanitization on incoming JSON and multipart forms.
- Generic error messages in production to avoid leaking system stack traces.

### 5. File Upload Security
- Strict file type checking (JPEG, PNG, WebP only).
- Payload size validation (max 50MB before compression).
- Automated Sharp image processing (recompression to WebP at 85% quality).
- Files uploaded directly to Supabase Storage buckets with authenticated write privileges.

### 6. Frontend Security
- Default React JSX escaping prevents Cross-Site Scripting (XSS).
- No use of eval() or untrusted HTML rendering.
- External links include `rel="noopener noreferrer"`.

---

## Security Audit Checklist

Before releasing to production, verify:
- [ ] All environment files are excluded from Git commits.
- [ ] Strong JWT secret configured (32+ randomized characters).
- [ ] Default admin credentials changed in production database.
- [ ] Row Level Security enabled on all Supabase tables.
- [ ] CORS whitelists only the production frontend domain.
- [ ] File upload size limits verified in API middleware.
- [ ] HTTPS enforced across domains.

---

## Incident Response

If credentials or keys are suspected to be compromised:
1. Immediately rotate:
   - `JWT_SECRET`
   - Supabase Service Key and Anon Key
   - Admin user passwords
2. Review access logs in the Supabase Dashboard.
3. Update environment variables in the hosting provider (Vercel / server) and redeploy.
4. Clear active sessions and invalidate outstanding JWT tokens.

---

## Reporting Vulnerabilities

If you discover a potential vulnerability:
- Do not open a public issue.
- Contact the development team privately to coordinate a responsible disclosure and patch.
