# API Structure for Aptitude Test System

## File Structure
```
src/
├── api/
│   ├── config.ts          # Basic axios configuration & token management
│   ├── auth.ts           # Authentication endpoints (login, register, logout)
│   ├── admin.ts          # Admin endpoints (templates, attempts, marking)
│   └── user.ts           # User endpoints (tests, attempts, profile)
├── components/
│   ├── admin/            # Admin UI components
│   ├── user/             # User UI components
│   └── common/           # Shared components
└── pages/
    ├── Login.tsx         # Uses auth.ts
    ├── Register.tsx      # Uses auth.ts
    ├── AdminDashboard.tsx # Uses admin.ts
    └── UserDashboard.tsx  # Uses user.ts
```

## API Configuration Strategy

### 1. `src/api/config.ts` - Base Configuration
- Axios instance with base URL
- Token storage and retrieval
- Request/response interceptors
- Error handling utilities

### 2. `src/api/auth.ts` - Authentication
- login(email, password)
- register(name, email, password)
- logout()
- getCurrentUser()

### 3. `src/api/admin.ts` - Admin Functions
- getTestTemplates()
- createTestTemplate(data)
- getTestAttempts(templateId)
- markAttempt(attemptId, score, approved)
- getTestResults(templateId)

### 4. `src/api/user.ts` - User Functions  
- getAvailableTests()
- startTest(testId)
- submitAnswer(testId, questionId, answer)
- finishTest(testId)
- getUserAttempts()

## Usage Pattern

### In Components:
```tsx
// Simple direct import and use
import { login } from '../api/auth';
import { getTestTemplates } from '../api/admin';
import { startTest } from '../api/user';

// In component
const handleLogin = async () => {
  try {
    const user = await login(email, password);
    // Handle success
  } catch (error) {
    // Handle error
  }
};
```

### Token Management:
- Automatic token injection via interceptors
- Automatic logout on 401 errors
- Simple localStorage management

## Benefits:
1. ✅ Direct function calls - no complex hooks
2. ✅ Clear separation of concerns
3. ✅ Easy to maintain and debug
4. ✅ Simple error handling
5. ✅ No over-engineering
