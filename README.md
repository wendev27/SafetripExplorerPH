# 🛡️ SafeTrip Explorer PH

**Security-Focused Full-Stack Web Application**
**Next.js • TypeScript • PostgreSQL • Prisma**

---

# 📖 Overview

SafeTrip Explorer PH is a security-focused full-stack web application developed as part of our **Information Security** course.

Rather than focusing only on application features, this project was created to explore, implement, and evaluate modern web security concepts commonly used in secure software development.

Throughout development, we practiced secure authentication, authorization, session management, token-based security, secure API design, and common web security defenses while performing vulnerability assessments using OWASP testing tools.

The primary objective of this project was to better understand how secure web applications are designed, how common web vulnerabilities can be mitigated, and how security should be considered throughout the software development lifecycle.

---

# 🎯 Project Objectives

The objectives of this project were to:

* Practice secure authentication and authorization techniques.
* Implement modern JWT-based session management.
* Explore secure token lifecycle management.
* Apply secure password handling techniques.
* Learn Role-Based Access Control (RBAC).
* Protect web applications against common attack vectors.
* Perform vulnerability assessment using OWASP ZAP.
* Gain practical experience designing security-aware web applications.

---

# 🔐 Security Concepts Practiced

## Authentication

* JWT Authentication
* Access Tokens
* Refresh Tokens
* Refresh Token Rotation
* HTTP-only Cookies
* Secure Login & Logout
* Protected Routes

---

## Authorization

* Role-Based Access Control (RBAC)
* Protected API Endpoints
* Permission Validation

---

## Session Management

* Refresh Token Storage
* Session Tracking
* Device Information
* Token Expiration
* Session Lifecycle Management

---

## Secure Password Handling

* Password Hashing
* Password Verification
* No Plain-Text Password Storage

---

## Input Validation

* Server-side Validation
* Request Validation
* Email Validation
* Password Validation

---

## Web Security

* CSRF Protection
* HTTP Security Headers
* Secure Cookie Management
* OWASP Top 10 Awareness

---

## Security Testing

* OWASP ZAP Vulnerability Assessment
* Authentication Flow Testing
* Security Header Verification
* Protected Endpoint Testing

---

# 🛠️ Technologies Used

## Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS

## Backend

* Next.js API Routes
* Prisma ORM

## Database

* PostgreSQL

## Authentication

* JWT
* HTTP-only Cookies

## Security

* OWASP ZAP
* Role-Based Access Control (RBAC)
* Refresh Token Rotation

---

# 🏗️ Authentication Flow

```text
User Registration
        │
        ▼
Password Hashing
        │
        ▼
User Login
        │
        ▼
Credential Verification
        │
        ▼
Generate Access Token
        │
        ▼
Generate Refresh Token
        │
        ▼
Store Refresh Token
        │
        ▼
HTTP-only Cookie
        │
        ▼
Authenticated Requests
        │
        ▼
Access Token Expires
        │
        ▼
Refresh Token Validation
        │
        ▼
Issue New Access Token
        │
        ▼
Continue Secure Session
```

---

# 🧪 Security Evaluation

As part of the project, we explored and evaluated several security mechanisms commonly found in modern web applications.

Testing activities included:

* Authentication flow validation
* Authorization testing
* Protected endpoint verification
* Security header inspection
* Basic vulnerability assessment using OWASP ZAP

The objective was to understand how these security controls work together and identify areas for improvement during development.

---

# 📚 Lessons Learned

Developing this project significantly improved my understanding of secure web application development.

Some of the key lessons learned include:

* Authentication is more than simply implementing a login page.
* Authorization should always be separated from authentication.
* Session management plays a critical role in application security.
* Secure software should be designed with security considerations from the beginning rather than adding them after development.
* Security testing is an important part of the software development lifecycle.

This project also reinforced the importance of understanding how different security mechanisms work together to reduce common web application risks.

---

# 🚧 Project Scope

This project was developed primarily for educational purposes as part of an Information Security course.

The implementation focuses on practicing and understanding secure software development concepts rather than claiming production-level security.

Future improvements could include:

* Multi-Factor Authentication (MFA)
* Rate Limiting
* Account Lockout Policies
* Content Security Policy (CSP)
* Audit Logging
* Automated Security Testing
* Security Monitoring
* Refresh Token Revocation Lists

---

# 📌 Current Status

🎓 **Information Security Course Project**

SafeTrip Explorer PH demonstrates the practical application of modern authentication, authorization, secure session management, and web security concepts within a full-stack web application developed for academic and learning purposes.
