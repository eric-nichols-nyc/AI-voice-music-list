# 🔐 Security Lab

A hands-on Next.js 16 application for learning and demonstrating web security best practices. Each file is heavily annotated with interview-ready explanations of security concepts.

## 🎯 Goal

This project serves as a **learning playground** for understanding how to secure a Next.js application. It covers the essential security concepts that every full-stack developer should know, with working code examples and detailed explanations.

## 📚 Security Topics Covered

### 1. Authentication & Session Management

**File:** `app/api/login/route.ts`

- **Secure cookie configuration** — `httpOnly`, `secure`, `sameSite` flags
- **JWT tokens** — Server-side signing with secrets
- **Input validation** — Using Zod for type-safe validation
- **Credential handling** — Why plaintext passwords are dangerous
- **User enumeration prevention** — Generic error messages

**Key concepts:**

- Why `httpOnly` prevents XSS token theft
- How `sameSite` mitigates CSRF attacks
- Why secrets must never be in client-side code

### 2. CORS Protection

**File:** `proxy.ts`

- **Cross-Origin Resource Sharing** — Controlling which domains can access your API
- **Preflight requests** — Handling OPTIONS requests properly
- **Origin validation** — Blocking unauthorized origins

**Key concepts:**

- CORS only affects browser requests (curl/Postman bypass it)
- Full CORS requires both request blocking AND response headers
- Not a substitute for authentication

### 3. Security Headers

**File:** `next.config.js`

| Header                        | Prevents              |
| ----------------------------- | --------------------- |
| Content-Security-Policy (CSP) | XSS attacks           |
| X-Frame-Options               | Clickjacking          |
| X-Content-Type-Options        | MIME sniffing attacks |
| Referrer-Policy               | URL/data leakage      |

**Key concepts:**

- CSP is the most powerful security header
- Security headers are a defense-in-depth layer
- Zero implementation cost, high security value

### 4. Rate Limiting

**Files:** `lib/rate-limit.ts`, `app/api/rate-limit-demo/route.ts`

- **Brute force protection** — Limiting login attempts
- **DoS mitigation** — Preventing resource exhaustion
- **API abuse prevention** — Stopping scrapers and bots
- **Cost control** — Preventing runaway API bills

**Key concepts:**

- Different endpoints need different limits
- In-memory vs Redis vs Edge rate limiting
- 429 status code and Retry-After header

### 5. CSRF Protection

**Files:** `lib/csrf.ts`, `app/api/csrf-demo/route.ts`

- **Cross-Site Request Forgery** — Preventing unauthorized state changes
- **Double-Submit Cookie Pattern** — Stateless CSRF validation
- **Token generation & validation** — Using signed JWTs as CSRF tokens

**Key concepts:**

- Why `sameSite` cookies alone aren't always enough
- How CSRF attacks exploit automatic cookie sending
- Synchronizer Token vs Double-Submit Cookie patterns
- When to require CSRF tokens (POST, PUT, DELETE — not GET)

### 6. Secure Form Components

**Files:** `app/secure-form/page.tsx`, `app/secure-form/secure-transfer-form.tsx`

- **CSRF token integration** — Server generates, client submits, server validates
- **Client vs server validation** — Client for UX, server for security
- **React XSS protection** — Auto-escaping and dangerous patterns to avoid
- **Secure fetch requests** — Proper credentials and error handling

**Key concepts:**

- Why client-side validation is for UX, not security
- Never store tokens in localStorage (XSS vulnerable)
- How React auto-escapes output to prevent XSS
- Proper error handling that doesn't leak information

## 🚀 Getting Started

```bash
# Install dependencies
pnpm install

# Start the development server
pnpm dev
```

The app runs on **http://localhost:3005**

## 🧪 Test the Security Features

### Test Login Endpoint

```bash
# Successful login
curl -X POST http://localhost:3005/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"admin123"}'

# Failed login (wrong password)
curl -X POST http://localhost:3005/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"wrong"}'

# Validation error (invalid email)
curl -X POST http://localhost:3005/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"not-an-email","password":"test"}'
```

### Test Rate Limiting

```bash
# Hit the endpoint 15 times rapidly
for i in {1..15}; do
  curl -s http://localhost:3005/api/rate-limit-demo | jq
done

# First 10 succeed, then you get 429 errors
```

### Check Security Headers

```bash
# View all response headers
curl -I http://localhost:3005

# Look for:
# - Content-Security-Policy
# - X-Frame-Options: DENY
# - X-Content-Type-Options: nosniff
# - Referrer-Policy: strict-origin-when-cross-origin
```

### Test CSRF Protection

```bash
# Step 1: Get a CSRF token (saves cookie)
curl http://localhost:3005/api/csrf-demo -c cookies.txt

# Step 2: Extract token and submit with valid token (succeeds)
TOKEN=$(cat cookies.txt | grep csrf_token | awk '{print $7}')
curl -X POST http://localhost:3005/api/csrf-demo \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d "{\"csrf_token\":\"$TOKEN\",\"action\":\"transfer\",\"amount\":100}"

# Step 3: Submit WITHOUT token (fails - simulates CSRF attack!)
curl -X POST http://localhost:3005/api/csrf-demo \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"action":"transfer","amount":100}'
```

## 🔑 Mock Users

| Email          | Password | Role  |
| -------------- | -------- | ----- |
| admin@test.com | admin123 | admin |
| user@test.com  | user123  | user  |

## 📁 Project Structure

```
apps/security-lab/
├── app/
│   ├── api/
│   │   ├── login/
│   │   │   └── route.ts        # Auth with cookies, JWT, Zod validation
│   │   ├── rate-limit-demo/
│   │   │   └── route.ts        # Rate limiting demonstration
│   │   └── csrf-demo/
│   │       └── route.ts        # CSRF token validation demo
│   ├── layout.tsx
│   └── page.tsx
├── lib/
│   ├── rate-limit.ts           # Reusable rate limiter
│   └── csrf.ts                 # CSRF token generation & validation
├── proxy.ts                    # CORS protection (Next.js 16 proxy)
├── next.config.js              # Security headers
└── .env                        # JWT_SECRET (never commit!)
```

## 💡 Interview Talking Points

Each file contains detailed annotations with key interview talking points. When reviewing the code, look for:

1. **Why** each security measure exists (the attack it prevents)
2. **How** it works technically
3. **Trade-offs** and considerations
4. **Production** vs development differences

## 🔒 Security Checklist for Production

- [ ] Use HTTPS everywhere (add HSTS header)
- [ ] Rotate JWT secrets regularly
- [ ] Use Redis for rate limiting across instances
- [ ] Enable CSP reporting to catch violations
- [ ] Add Permissions-Policy header
- [ ] Implement proper logging and monitoring
- [ ] Use environment variables for all secrets
- [ ] Enable rate limiting at edge/CDN level
- [ ] Regular dependency updates (`pnpm audit`)

## 📖 Further Reading

- [OWASP Top 10](https://owasp.org/www-project-top-ten/) — Most critical web security risks
- [Next.js Security Headers](https://nextjs.org/docs/advanced-features/security-headers)
- [MDN Web Security](https://developer.mozilla.org/en-US/docs/Web/Security)
- [JWT Best Practices](https://auth0.com/blog/jwt-security-best-practices/)

---

Built with Next.js 16, React 19, and TypeScript.
