# 🏖️ Leave Management API

Leave Management API is a backend system for managing user leave requests, user onboarding, and profile management. Built with **Node.js**, **MongoDB**, and **JWT Authentication**, it supports user registration, login, leave applications, and profile updates.

---

## 🚀 Tech Stack

- **Backend Framework**: [Node.js](https://nodejs.org) + **NestJs**
- **Database**: MongoDB (via Mongoose)
- **Authentication**: JWT-based Authentication
- **Password Hashing**: bcrypt
- **Email**: Nodemailer for OTP email verification
- **Session Management**: Redis for OTP verification
- **Logging**: Winston for logging requests and errors
- **Validation**: DTOs and class-validator
- **Error Handling**: Custom error handling for leave management and user onboarding

---

## 📦 Installation

### Clone the repository
```bash
git clone https://github.com/akshat1app/LeaveManagement.git
cd LeaveManagement

Install dependencies
npm install

Run the app
npm run start:dev

🔐 Authentication
All protected routes require an Authorization: Bearer <token> header.

📂 API Endpoints
📁 Auth Module
Method | Endpoint | Description | Protected
POST | /users/api/v1/signup | Create a new user account | ❌
POST | /users/api/v1/login | Authenticate user and return token | ❌
POST | /users/api/v1/forget-password | Trigger password reset process | ❌
POST | /users/api/v1/send-otp | Resend OTP for verification | ❌
POST | /users/api/v1/verify-otp | Verify OTP sent to user | ❌
POST | /users/api/v1/reset-password | Reset user password | ❌

Note:
OTP should expire in 5 minutes from the time of generation.

📁 User Module
Method | Endpoint | Description | Protected
GET | /users/api/v1/profile | Retrieve user profile details | ✅
PATCH | /users/api/v1/profile | Update user profile (name, profile picture) | ✅

📁 Leave Management Module
Method | Endpoint | Description | Protected
POST | /users/api/v1/leave | Apply for a leave | ✅
GET | /users/api/v1/leave | Get all leave applications (filter by leave type, paginated) | ✅
GET | /users/api/v1/leave/:leaveId | Retrieve details of a specific leave request | ✅

Leave Management Business Rules:
A user can apply for only one leave on the same day
Users cannot apply for leave that is backdated by more than 3 days.
Each user is initialized with 6 leave days upon account creation.

📊 Business Rules
Leave Types:
The system includes two types of leave:
Planned Leave
Emergency Leave

Leave Initialization:
Upon user registration, each new user is initialized with 6 total leave days.

Leave Limits:
A user cannot apply for more than one leave on the same day.
Users cannot apply for leave that is backdated by more than 3 days.

Leave Balance:
Users can only apply for leaves if they have enough remaining leave days.

Leave Overlap:
The system ensures that users cannot apply for leave on the same day more than once.

Leave Application Validation:
If a leave application overlaps with an existing leave or violates any rule (such as backdating), the system will reject the request.

📁 Project Structure
src/
│
├── auth/           # Auth module (login, register, OTP, token, reset-password)
├── user/           # User profile management
├── leave/          # Leave management (apply, view, history)
├── common/         # Common utilities (error handling, logging)
├── config/         # Centralized app configurations
├── main.ts         # Entry point

🧑‍💻 Author
Akshat Srivastava
GitHub | LinkedIn
