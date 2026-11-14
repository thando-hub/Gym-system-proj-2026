# Authentication & Identity — Research Section

## 1. Introduction

For our Gym Management System, we built a role-based authentication system using ASP.NET Core Identity with JSON Web Tokens (JWT). This document explains what we researched and the decisions we made to protect the API and make sure users only get access to the features that match their role.

The system has three roles:

- Admin - manages gym members, personal trainers, and training programmes
- PersonalTrainer - manages their assigned members and their workout plans
- GymMember - views assigned workouts and updates task statuses

## 2. Why ASP.NET Identity

The assignment asked for role-based authentication using ASP.NET Identity, so that was our starting point. After looking into it, we went with ASP.NET Identity instead of writing our own user management or pulling in a third-party library. The reasons were:

- It's built into ASP.NET Core, so no extra dependencies
- It handles password hashing, salting, and lockout policies by default
- It has role management built in
- It plugs straight into EF Core, so users and roles live in the same database as the rest of our data
- It supports claims, which lets us put extra info into the token (user ID, email, role)

## 3. How We Implemented It

### 3.1 Custom User Class

We extended Identity's built-in IdentityUser class with our own ApplicationUser. This lets us add extra fields on top of what Identity already provides. The class lives in GymManagement.Core/Entities.

IdentityUser already gives us:

- Id (primary key)
- UserName and Email
- PasswordHash and SecurityStamp
- EmailConfirmed and PhoneNumber
- LockoutEnd and AccessFailedCount

Our ApplicationUser adds:

- FirstName (required, max 50 characters)
- LastName (required, max 50 characters)
- CreatedAt (set automatically to the current UTC time)

### 3.2 Database Context

Our ApplicationDbContext inherits from IdentityDbContext<ApplicationUser>. That one change makes EF Core create all the Identity tables for us alongside our own tables. The tables created are:

- AspNetUsers - stores user accounts
- AspNetRoles - stores roles (Admin, PersonalTrainer, GymMember)
- AspNetUserRoles - links users to their roles
- AspNetUserClaims - stores user claims
- AspNetUserLogins - stores external login providers
- AspNetUserTokens - stores authentication tokens

These are all created automatically when we run our EF Core migrations, so we didn't have to define them ourselves.

### 3.3 Identity Configuration

In Program.cs we registered Identity with some custom password rules and pointed it at our ApplicationDbContext. The rules we set are:

- Passwords must have at least one digit
- Passwords must have at least one lowercase letter
- Passwords must be at least 6 characters long
- Each email can only be registered once

We picked these because they give a reasonable balance between security and not annoying the user.

## 4. JWT Authentication

### 4.1 Why JWT

We went with JWT over cookie-based authentication for a few reasons:

- It's stateless, so the server doesn't need to remember sessions
- It scales well if we ever run multiple servers
- It's supported everywhere (React, mobile apps, etc.)
- The token carries the user's identity and roles inside it

Since our React frontend runs on a different port to the API, cookies would have needed extra configuration for cross-origin requests. JWT sidesteps that entirely.

### 4.2 Generating the Token

When a user logs in, the API builds a JWT containing the following claims:

- NameIdentifier - the user's unique ID (a GUID stored as a string)
- Email - the user's email
- Name - the user's full name
- Role - one or more roles belonging to the user

The token is signed using HMAC SHA-256 with a secret key from appsettings.json. It expires after 60 minutes, after which the user has to log in again. The secret key is long enough (over 32 characters) to satisfy the minimum requirement for HMAC SHA-256.

### 4.3 Validating the Token

Every request to a protected endpoint goes through the JWT Bearer middleware, which we configured in Program.cs. That middleware:

- Checks the token's signature using the same secret key
- Checks the issuer matches our API
- Checks the audience matches our client
- Checks the token hasn't expired
- Pulls the user's claims (including roles) out for the authorization step

If any of those checks fail, the API returns 401 Unauthorized straight away and the request never reaches the controller.

## 5. Role-Based Authorization

### 5.1 Seeding Roles

We seed the three roles (Admin, PersonalTrainer, GymMember) when the application starts up. This means the roles exist the first time the API runs, without us having to add them manually to the database.

The seeding function uses RoleManager to check if each role exists. If it doesn't, we create it. Because it runs every startup and checks first, it's safe to restart the API as many times as we want without creating duplicates.

The steps are:

1. Create a service scope from the running application
2. Resolve RoleManager from that scope
3. Loop through the list of role names
4. Check RoleExistsAsync before calling RoleCreateAsync so we don't create duplicates

### 5.2 Protecting Endpoints

We protect endpoints with the [Authorize] attribute. You can be specific about which roles are allowed:

- [Authorize] - any logged-in user
- [Authorize(Roles = "Admin")] - only Admins
- [Authorize(Roles = "Admin,PersonalTrainer")] - multiple roles

For example, the GET /api/auth/me endpoint uses [Authorize] so only logged-in users can reach it. It pulls the user's ID out of the token and returns their info.

If the token is missing or invalid, the API returns 401 Unauthorized. If the token is valid but the user doesn't have the role that's required, the API returns 403 Forbidden.

### 5.3 Role Claims

When someone logs in, their roles get added to the JWT as Role claims. During authorization, ASP.NET Core reads those claims to work out whether the user is allowed to hit the endpoint. This means we don't have to query the database on every request, since all the info we need is in the token.

Because the token is signed, the client can't change the roles after the fact. If they try to modify the claims, the signature won't match and the API will reject the token.

## 6. Why We Used UserManager Instead of DbContext

The lecture showed us how to build controllers that use DbContext directly. For plain data like Student, GymMember, and so on, that's exactly the right approach. But for anything to do with authentication, we used UserManager and RoleManager instead.

The reason is that Identity takes care of a lot of security-sensitive work that we really shouldn't be writing by hand:

- Password hashing - passwords get hashed with PBKDF2 and a per-user salt. Writing that manually is a bad idea.
- Email uniqueness - UserManager enforces the unique-email rule we set up
- Role assignment - RoleManager makes sure the role actually exists before assigning it
- Security stamps - these invalidate tokens when a user's security info changes

Using UserManager and RoleManager means we get the benefit of the security work Microsoft has already put into the framework. It also matches the assignment requirement to use ASP.NET Identity.

For the other controllers (GymMembers, PersonalTrainers, TrainingProgrammes, etc.), we're using DbContext directly, exactly like the lecture showed.

## 7. How the React Frontend Talks to the API

Our React frontend uses Axios with a request interceptor that automatically attaches the JWT to every API call. When someone logs in:

1. The login form sends the credentials to POST /api/auth/login
2. The API validates them and returns a JWT
3. The frontend stores the token in localStorage
4. Every request after that includes the header Authorization: Bearer followed by the token
5. The API validates the token and handles the request

If a request comes back with 401 Unauthorized (usually because the token has expired), the Axios response interceptor clears the stored token and sends the user back to the login page. That way they never get stuck on a page that needs a login they no longer have.

We also had to add a CORS policy in Program.cs so the React app (running on localhost:3000) is allowed to call the API (running on localhost:5049). The policy allows requests from localhost:3000 with any header and any method. Without it, the browser blocks the requests as cross-origin.

## 8. Conclusion

By using ASP.NET Identity with JWT and role-based authorization, we've built a solid base for the Gym Management System. It:

- Blocks unauthorized access to sensitive endpoints
- Makes sure each role only sees the features meant for them
- Works cleanly across multiple frontend clients
- Follows the standard way of doing authentication

The rest of the team can now build their features on top of this foundation, protecting their endpoints with the right [Authorize] attributes.