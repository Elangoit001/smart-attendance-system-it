# Smart Department Attendance & Fine Management System (IT Dept)

A full-stack MERN application designed for college departments to automate attendance tracking, leave management, and fine issuance for unauthorized absences.

## Key Features
- **Role-Based Dashboards**: Distinct interfaces for Students and Admins (HOD/Staff).
- **Unauthorized Leave Detection**: Automatically issues a fine if a student is absent without an approved Leave or OD.
- **Attendance Analytics**: Dynamic charts using Recharts for attendance trends.
- **Monthly Reports**: Generate and export attendance data as CSV.
- **Audit Logs**: Track critical administrative actions for accountability.
- **Premium UI**: Modern Glassmorphism design with Tailwind CSS.

## Prerequisites
- Node.js installed on your system.
- MongoDB Atlas account (configured in `.env`).

## Installation

### 1. Backend Setup
```bash
cd backend
npm install
node seed.js  # Populates IT department admin and students
node server.js
```
*Port: http://localhost:5000*

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev -- --port 3000
```
*Port: http://localhost:3000*

## Sample Credentials (IT Department)
### Admin (HOD)
- **Identifier**: `HOD001`
- **Password**: `HODPassword123`

### Student (Example)
- **Identifier**: `22IT3001`
- **Password**: `Student 101` (Formula: Name + Last 2 of Roll No)

## Technology Stack
- **Frontend**: React.js, Tailwind CSS, Lucide Icons, Recharts, Axios, React Router.
- **Backend**: Node.js, Express.js, MongoDB/Mongoose, JWT Authentication.
- **Database**: MongoDB Atlas.
