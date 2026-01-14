# Project: Car Image Gallery
## Goal
Implement a modern, functional image gallery with UploadThing integration for car management.

## Vetted Dependencies
- uploadthing@7.7.4 — Secure and easy-to-use file uploads.
- @uploadthing/react@7.3.3 — React components for UploadThing integration.
- lucide-react@0.562.0 — High-quality SVG icons for UI elements.
- sonner@2.0.7 — Clean toast notifications for upload status.

## Structure
```
src/
├── app/
│   └── (admin)/
│       └── admin/
│           └── (management)/
│               └── cars/
│                   └── page.tsx
└── db/
    ├── image.ts (New)
    └── schema.ts (Updated)
```

## Database Schema
- Table: `images` in [src/db/image.ts](src/db/image.ts)
- Fields: `id` (UUID), `url`, `name`, `key`, `createdAt`, `updatedAt`
- Exported from [src/db/schema.ts](src/db/schema.ts)

## Implementation Status
- [x] Database schema created
- [x] Gallery UI with UploadThing integration
- [x] Local state for image management
- [x] Delete functionality (per-image and clear all)
- [x] Toast notifications for upload status
- [ ] Database migration (pending)
- [ ] API endpoint for persistence (pending)

## Lint
npm run lint
