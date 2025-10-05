# TODO: Implement Lecturer Rating Notification System

## Steps to Complete

- [x] Add notifications table to db/db.sql
- [x] Update backend/index.js: Modify /api/ratings POST endpoint to create notification for lecturer when rated
- [x] Update backend/index.js: Add GET /api/notifications endpoint to fetch notifications for logged-in user
- [x] Update frontend/src/components/LecturerDashboard.js: Add state and useEffect to fetch notifications
- [x] Update frontend/src/components/LecturerDashboard.js: Add notification display section in the dashboard
- [x] Update frontend/src/components/LecturerDashboard.js: Add popup/modal for new notifications
- [x] Run database migration to apply the new notifications table
- [x] Test the system by rating a lecturer and verifying the notification appears on lecturer dashboard
