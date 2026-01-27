# Project: Next.js Torent Reminder Feature
## Goal
Add a reminder system to User and Admin dashboards that triggers alerts for rentals starting or ending within 24 hours and 5 hours, displayed via a new sidebar menu item with a notification indicator (red dot).

## Vetted Dependencies
- date-fns@^4.1.0 — Lightweight, robust date manipulation for calculating time windows (already installed).
- lucide-react@^0.562.0 — Consistent iconography for the new sidebar item (already installed).

## Structure
```
.
├── src
│   ├── actions
│   │   └── reminders.ts        # Server actions for reminder logic
│   ├── app
│   │   ├── (admin)
│   │   │   └── admin
│   │   │       └── reminders
│   │   │           └── page.tsx # Admin reminder view
│   │   └── (user)
│   │       └── (rent)
│   │           └── dashboard
│   │               └── reminders
│   │                   └── page.tsx # User reminder view
│   └── components
│       ├── admin-sidebar.tsx    # Update: Add Reminder menu + Badge
│       └── user-sidebar.tsx     # Update: Add Reminder menu + Badge
```

## Security
- **Authorization**: `getReminders` action must enforce role-based access control (Admin sees all/relevant, User sees only own).
- **Data Leakage**: Ensure user queries filter strictly by `userId`.
- **Validation**: Use strict date comparison to avoid timezone exploits.

## Lint
npm run lint
