# Navigation Flow Documentation

## Current Navigation Structure

### Landing Page Options:
1. **"Get Started"** button → User Registration/Login
2. **"User Sign In"** button → User Login 
3. **"Admin Login"** button → Admin Login Only

### Authentication Flow:

#### For Users (`isAdminMode = false`):
- Can toggle between **Login** and **Registration**
- Registration includes: First Name, Last Name, Email, Password, Confirm Password
- Login includes: Email, Password

#### For Admins (`isAdminMode = true`):
- **Login Only** - No registration option
- Simplified form with: Email, Password
- Red color scheme instead of blue
- "Admin Sign In" title
- "Access the admin dashboard" subtitle

### Post-Authentication Routing:
- **Users** → `/dashboard` (User Dashboard with tests and results)
- **Admins** → `/admin/dashboard` (Admin Dashboard with attempts management)

### File Organization:
```
src/pages/
├── Auth.tsx                 # Combined auth component (handles both user/admin)
├── LandingPage.tsx         # Landing page with navigation options
├── users/                  # User-specific pages
│   ├── Login.tsx          # Standalone user login (alternative)
│   ├── Register.tsx       # Standalone user registration (alternative)  
│   ├── Dashboard.tsx      # User dashboard
│   ├── Test.tsx           # Test taking interface
│   ├── Results.tsx        # User results view
│   └── index.ts           # Exports for clean imports
└── admin/                 # Admin-specific pages
    ├── Dashboard.tsx      # Admin dashboard
    ├── Attempts.tsx       # View all attempts
    ├── Review.tsx         # Review individual attempts
    └── index.ts           # Exports for clean imports
```

### API Structure:
```
src/api/
├── config.ts              # Axios configuration & token management
├── auth.ts                # login(), register(), logout() functions
├── user.ts                # User-specific API calls
└── admin.ts               # Admin-specific API calls
```

### How to Use:
1. **For regular users**: Click "Get Started" or "User Sign In" 
2. **For admins**: Click "Admin Login" for direct admin login
3. System automatically routes based on user role after authentication
