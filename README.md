# PeopleDesk — Employee Management System

A responsive React employee and task management frontend with a minimal corporate UI and browser LocalStorage persistence.

## Requirements
- Node.js 18+ recommended
- npm

## Run locally
```bash
cd employee-management-system
npm install
npm run dev
```
Open the local URL printed by Vite (usually http://localhost:5173).

## Demo accounts
- Admin: `ankur@gmail.com` / `654321`
- Employee: `olivia@company.com` / `123456`
- Other seeded employees use password `123456`.

## Features
- Admin and employee login sessions
- Role-aware dashboard and navigation
- Employee create, edit, delete, search and status filter (admin)
- Task create, assign, edit and delete (admin)
- Employees can update their own task status
- Dashboard summaries and responsive layouts
- Seed data initialized once and persisted in LocalStorage

## LocalStorage keys
- `EMS Desk Employees`
- `EMS Desk Tasks`
- `EMS Desk Admin`
- `EMS Desk Session`

To reset the demo data, open browser DevTools → Application → Local Storage, delete the four keys above, then refresh.

## Important security note
This is a frontend demo. Authentication credentials and records are stored in LocalStorage and are not secure. Do not use real employee personal data or deploy this as a production authentication system without a secure backend, server-side authorization and proper password hashing.
