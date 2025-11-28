# 📋 SafeHub Project Backlog

This document outlines the comprehensive product backlog for **SafeHub** - a student counseling and development platform for La Consolacion University Philippines (LCUP).

---

## 📌 Legend

- **Priority Levels:**
  - 🔴 **Critical** - Must-have for core functionality
  - 🟠 **High** - Important for user experience
  - 🟡 **Medium** - Enhances functionality
  - 🟢 **Low** - Nice-to-have features

- **Status:**
  - ✅ Completed
  - 🔄 In Progress
  - ⏳ Planned
  - 💡 Backlog (Future consideration)

---

## 🔐 Epic 1: Authentication & User Management

### User Stories

| ID | Story | Priority | Status | Acceptance Criteria |
|----|-------|----------|--------|---------------------|
| AUTH-001 | As a user, I want to sign up with my email so I can access the platform | 🔴 Critical | ✅ Completed | Users can register with email/password via NextAuth + Supabase Auth |
| AUTH-002 | As a user, I want to sign in with my credentials so I can access my account | 🔴 Critical | ✅ Completed | Users can log in and are redirected to dashboard |
| AUTH-003 | As a user, I want to sign out securely so my session is terminated | 🔴 Critical | ✅ Completed | Session is invalidated on sign out |
| AUTH-004 | As an admin, I want to manage user roles (Student/Counselor/Admin) so users have appropriate access | 🔴 Critical | ✅ Completed | Admins can assign and modify user types |
| AUTH-005 | As a user, I want to complete onboarding to provide necessary profile information | 🟠 High | ✅ Completed | New users complete onboarding form with personal details |
| AUTH-006 | As a user, I want to recover my password if I forget it | 🟠 High | ⏳ Planned | Email-based password recovery flow |
| AUTH-007 | As a user, I want to add a recovery email for account security | 🟡 Medium | ✅ Completed | Users can set recovery email in profile |
| AUTH-008 | As an admin, I want to deactivate user accounts when needed | 🟠 High | ✅ Completed | Admins can deactivate accounts, preventing login |
| AUTH-009 | As a user, I want to toggle dark mode for better accessibility | 🟢 Low | ✅ Completed | Dark mode preference persists per user |
| AUTH-010 | As an admin, I want to view and search all registered users | 🟠 High | ✅ Completed | Admin dashboard shows user list with search/filter |

---

## 📅 Epic 2: Appointment Management

### User Stories

| ID | Story | Priority | Status | Acceptance Criteria |
|----|-------|----------|--------|---------------------|
| APPT-001 | As a student, I want to book an appointment with a counselor so I can get support | 🔴 Critical | ✅ Completed | Students can select counselor, date, time, and session preference |
| APPT-002 | As a student, I want to view my appointment history so I can track my sessions | 🔴 Critical | ✅ Completed | Students see list of past and upcoming appointments |
| APPT-003 | As a counselor, I want to view pending appointments so I can manage my schedule | 🔴 Critical | ✅ Completed | Counselors see appointments filtered by status |
| APPT-004 | As a counselor, I want to approve/reject appointments so I can control my availability | 🔴 Critical | ✅ Completed | Status changes to Approved/Cancelled with notification |
| APPT-005 | As a counselor, I want to mark appointments as completed so records are updated | 🔴 Critical | ✅ Completed | Status changes to Completed after session |
| APPT-006 | As a counselor, I want to mark "Did Not Attend" for no-shows | 🟠 High | ✅ Completed | Status changes to DidNotAttend with optional reason |
| APPT-007 | As a student, I want to choose between In-Person, Online, or Either session type | 🟠 High | ✅ Completed | Session preference is stored and displayed |
| APPT-008 | As a counselor, I want to set my available time slots so students can only book when I'm free | 🔴 Critical | ✅ Completed | Counselors configure availability per day of week |
| APPT-009 | As a counselor, I want to add notes to appointments for record-keeping | 🟠 High | ✅ Completed | Notes field available for each appointment |
| APPT-010 | As a student, I want to cancel my appointment with a reason | 🟠 High | ✅ Completed | Cancellation requires reason, status updates |
| APPT-011 | As a counselor, I want to schedule follow-up appointments | 🟠 High | ✅ Completed | Follow-up linked to original appointment with reason |
| APPT-012 | As a user, I want to view appointment logs for audit purposes | 🟡 Medium | ✅ Completed | Logs show status changes with timestamps |
| APPT-013 | As an admin, I want to view all appointments across the system | 🟠 High | ✅ Completed | Admin dashboard shows all appointments |
| APPT-014 | As a student, I want to rate and provide feedback after a completed session | 🟠 High | ✅ Completed | Rating (1-5) and evaluation form after completion |
| APPT-015 | As a counselor, I want to document actions taken during appointments | 🟠 High | ✅ Completed | Actions taken field for completed appointments |
| APPT-016 | As a user, I want to receive appointment reminders | 🟡 Medium | ✅ Completed | Notification sent before appointment time |
| APPT-017 | As a user, I want to see a weekly calendar view of appointments | 🟡 Medium | ✅ Completed | Calendar displays appointments by week |

---

## 🎥 Epic 3: Video Counseling (WebRTC)

### User Stories

| ID | Story | Priority | Status | Acceptance Criteria |
|----|-------|----------|--------|---------------------|
| VIDEO-001 | As a user, I want to join a video call for online counseling sessions | 🔴 Critical | ✅ Completed | WebRTC peer-to-peer video call initiates |
| VIDEO-002 | As a user, I want to mute/unmute my microphone during calls | 🔴 Critical | ✅ Completed | Audio toggle works in real-time |
| VIDEO-003 | As a user, I want to turn my camera on/off during calls | 🔴 Critical | ✅ Completed | Video toggle works in real-time |
| VIDEO-004 | As a caller, I want to see call status (Pending/Accepted/Rejected/Ended) | 🟠 High | ✅ Completed | Status displayed and updated in real-time |
| VIDEO-005 | As a user, I want to end the call cleanly | 🔴 Critical | ✅ Completed | Call terminates for all participants |
| VIDEO-006 | As a user, I want secure TURN credentials for reliable connections | 🟠 High | ✅ Completed | TURN servers configured for NAT traversal |
| VIDEO-007 | As a user, I want to receive incoming call notifications | 🟠 High | ⏳ Planned | Real-time notification with accept/reject options |
| VIDEO-008 | As a user, I want to see "No Answer" status if call is not picked up | 🟡 Medium | ✅ Completed | Timeout results in No_Answer status |

---

## 💬 Epic 4: Chat & Messaging

### User Stories

| ID | Story | Priority | Status | Acceptance Criteria |
|----|-------|----------|--------|---------------------|
| CHAT-001 | As a user, I want to send direct messages to counselors/students | 🔴 Critical | ✅ Completed | Real-time messaging between users |
| CHAT-002 | As a user, I want to see my chat history | 🔴 Critical | ✅ Completed | Messages persist and load on chat open |
| CHAT-003 | As a user, I want to see when a chat was last active | 🟡 Medium | ✅ Completed | Last message timestamp displayed |
| CHAT-004 | As a user, I want group chat support for multi-party conversations | 🟡 Medium | ✅ Completed | GROUP chat type with multiple members |
| CHAT-005 | As a user, I want to see other users' online/offline status | 🟠 High | ✅ Completed | Status indicator shows Online/Offline |
| CHAT-006 | As a user, I want to start a video call directly from chat | 🟠 High | ✅ Completed | Call button in chat initiates video session |
| CHAT-007 | As a user, I want chat message notifications | 🟠 High | ⏳ Planned | Push/in-app notifications for new messages |
| CHAT-008 | As a user, I want to search through my messages | 🟢 Low | 💡 Backlog | Search functionality within chat history |

---

## 🤖 Epic 5: AI Chatbot & Automation

### User Stories

| ID | Story | Priority | Status | Acceptance Criteria |
|----|-------|----------|--------|---------------------|
| AI-001 | As a student, I want to chat with an AI assistant when no counselor is available | 🔴 Critical | ✅ Completed | AI responds via n8n workflows + Ollama |
| AI-002 | As a student, I want the AI to provide relevant mental health resources | 🟠 High | ✅ Completed | AI suggests hotlines, articles, and support resources |
| AI-003 | As an admin, I want to enable/disable the AI chatbot | 🟠 High | ✅ Completed | Toggle in AI management settings |
| AI-004 | As an admin, I want to manage AI presets (prompts, rules, examples) | 🟠 High | ✅ Completed | CRUD for AI presets with prompt configuration |
| AI-005 | As an admin, I want to configure AI tools (WebSearch, GetPosts, GetHotlines, QueryVault) | 🟠 High | ✅ Completed | Tool selection in AI settings |
| AI-006 | As an admin, I want to enable/disable MCP (Model Context Protocol) features | 🟡 Medium | ✅ Completed | MCP toggle and file management |
| AI-007 | As an admin, I want to upload documents to the AI knowledge base | 🟠 High | ✅ Completed | File upload with preview and vector storage |
| AI-008 | As an admin, I want to test AI responses in a sandbox environment | 🟡 Medium | ✅ Completed | Sandbox chat for testing AI behavior |
| AI-009 | As a student, I want my AI chat history to be saved | 🟡 Medium | ✅ Completed | Chat history persists per session |
| AI-010 | As a user, I want AI responses formatted with markdown | 🟢 Low | ✅ Completed | React-markdown renders AI responses |

---

## 📰 Epic 6: Posts & Announcements

### User Stories

| ID | Story | Priority | Status | Acceptance Criteria |
|----|-------|----------|--------|---------------------|
| POST-001 | As an admin/counselor, I want to create posts with title, content, and images | 🔴 Critical | ✅ Completed | Posts saved to database with images |
| POST-002 | As a user, I want to view all published posts | 🔴 Critical | ✅ Completed | Posts displayed in feed format |
| POST-003 | As a user, I want to like/dislike posts | 🟡 Medium | ✅ Completed | Like/dislike counts update in real-time |
| POST-004 | As a user, I want to comment on posts | 🟡 Medium | ✅ Completed | Comments saved and displayed under posts |
| POST-005 | As an author, I want to edit my posts | 🟠 High | ✅ Completed | Authors can modify title, content, images |
| POST-006 | As an author, I want to delete my posts | 🟠 High | ✅ Completed | Posts removed with cascade delete |
| POST-007 | As a user, I want notifications for new posts | 🟡 Medium | ✅ Completed | NotificationType.NewPost triggered |
| POST-008 | As a student, I want to see posts on my dashboard | 🟠 High | ✅ Completed | Dashboard displays recent posts |

---

## 📞 Epic 7: Hotline Directory

### User Stories

| ID | Story | Priority | Status | Acceptance Criteria |
|----|-------|----------|--------|---------------------|
| HOT-001 | As a user, I want to view emergency hotline numbers | 🔴 Critical | ✅ Completed | Hotline cards display with contact info |
| HOT-002 | As an admin, I want to add hotline entries | 🟠 High | ✅ Completed | CRUD for hotline records |
| HOT-003 | As a user, I want to call hotlines directly from the app (mobile) | 🟠 High | ✅ Completed | Phone number links to dialer |
| HOT-004 | As an admin, I want to add hotline images/logos | 🟡 Medium | ✅ Completed | Image field in hotline records |
| HOT-005 | As a user, I want to visit hotline websites | 🟢 Low | ✅ Completed | Website links open in new tab |
| HOT-006 | As a user, I want AI to suggest relevant hotlines | 🟡 Medium | ✅ Completed | GetHotlines tool in AI responses |

---

## 📊 Epic 8: Dashboard & Analytics

### User Stories

| ID | Story | Priority | Status | Acceptance Criteria |
|----|-------|----------|--------|---------------------|
| DASH-001 | As a student, I want to see my upcoming appointments on the dashboard | 🔴 Critical | ✅ Completed | Dashboard shows next appointments |
| DASH-002 | As a student, I want to track my daily mood | 🟡 Medium | ✅ Completed | Mood tracker (Angry, Sad, Joy, Fear, Disgust, Skip) |
| DASH-003 | As a counselor, I want to see appointment statistics | 🟠 High | ✅ Completed | Charts showing appointment trends |
| DASH-004 | As an admin, I want to view system-wide analytics | 🟠 High | ✅ Completed | Admin dashboard with comprehensive stats |
| DASH-005 | As a counselor, I want to see appointment time series data | 🟡 Medium | ✅ Completed | Time-based charts for appointments |
| DASH-006 | As a user, I want to see recent posts on the dashboard | 🟡 Medium | ✅ Completed | DashboardPosts component displays feed |

---

## 📝 Epic 9: Forms Management

### User Stories

| ID | Story | Priority | Status | Acceptance Criteria |
|----|-------|----------|--------|---------------------|
| FORM-001 | As an admin, I want to create custom booking forms | 🔴 Critical | ✅ Completed | JSON schema-based form builder |
| FORM-002 | As an admin, I want to create evaluation forms | 🟠 High | ✅ Completed | Post-appointment evaluation schema |
| FORM-003 | As an admin, I want to create cancellation forms | 🟠 High | ✅ Completed | Cancellation reason form |
| FORM-004 | As an admin, I want to create registration/onboarding forms | 🟠 High | ✅ Completed | User onboarding form schema |
| FORM-005 | As a user, I want to fill out dynamic forms based on schemas | 🔴 Critical | ✅ Completed | Forms render from JSON schema |
| FORM-006 | As an admin, I want form responses stored with appointments | 🟠 High | ✅ Completed | appointmentData, evaluationData fields |

---

## 🔔 Epic 10: Notifications

### User Stories

| ID | Story | Priority | Status | Acceptance Criteria |
|----|-------|----------|--------|---------------------|
| NOTIF-001 | As a user, I want to receive appointment creation notifications | 🔴 Critical | ✅ Completed | NotificationType.AppointmentCreated |
| NOTIF-002 | As a user, I want to receive appointment status update notifications | 🔴 Critical | ✅ Completed | NotificationType.AppointmentUpdatedStatus |
| NOTIF-003 | As a user, I want to receive appointment schedule change notifications | 🟠 High | ✅ Completed | NotificationType.AppointmentUpdatedSchedule |
| NOTIF-004 | As a user, I want to receive appointment reminders | 🟠 High | ✅ Completed | NotificationType.AppointmentReminder |
| NOTIF-005 | As a user, I want to mark notifications as read | 🟡 Medium | ✅ Completed | isRead flag updates on interaction |
| NOTIF-006 | As a user, I want to see unread notification count | 🟡 Medium | ✅ Completed | Badge showing unread count |
| NOTIF-007 | As a user, I want push notifications on mobile | 🟢 Low | 💡 Backlog | Service worker + push notifications |
| NOTIF-008 | As a user, I want email notifications for important events | 🟡 Medium | ⏳ Planned | Email templates for notifications |

---

## 👥 Epic 11: Counselor Management

### User Stories

| ID | Story | Priority | Status | Acceptance Criteria |
|----|-------|----------|--------|---------------------|
| COUN-001 | As an admin, I want to view all counselors | 🟠 High | ✅ Completed | Counselor list with details |
| COUN-002 | As an admin, I want to manage counselor availability status | 🟠 High | ✅ Completed | Toggle counselor available flag |
| COUN-003 | As a counselor, I want to set my weekly availability schedule | 🔴 Critical | ✅ Completed | AvailableSlot CRUD per day |
| COUN-004 | As a student, I want to view available counselors | 🔴 Critical | ✅ Completed | Counselor picker shows available counselors |
| COUN-005 | As a student, I want to see counselor profiles | 🟡 Medium | ✅ Completed | Counselor details displayed |

---

## ⚙️ Epic 12: Settings & Preferences

### User Stories

| ID | Story | Priority | Status | Acceptance Criteria |
|----|-------|----------|--------|---------------------|
| SET-001 | As a user, I want to update my profile information | 🔴 Critical | ✅ Completed | Profile edit form saves changes |
| SET-002 | As a user, I want to update my guardian information | 🟠 High | ✅ Completed | Guardian details form |
| SET-003 | As a user, I want to change my password | 🟠 High | ⏳ Planned | Password change functionality |
| SET-004 | As a user, I want to toggle dark mode | 🟡 Medium | ✅ Completed | Dark mode preference persists |
| SET-005 | As a user, I want to manage notification preferences | 🟢 Low | 💡 Backlog | Granular notification settings |

---

## 🔧 Epic 13: Technical & Infrastructure

### User Stories

| ID | Story | Priority | Status | Acceptance Criteria |
|----|-------|----------|--------|---------------------|
| TECH-001 | As a developer, I want real-time database sync with Supabase | 🔴 Critical | ✅ Completed | Supabase realtime configured |
| TECH-002 | As a developer, I want WebSocket support for live features | 🔴 Critical | ✅ Completed | next-ws integrated |
| TECH-003 | As a developer, I want Redis for caching and session management | 🟠 High | ✅ Completed | Redis client configured |
| TECH-004 | As a developer, I want type-safe database queries with Prisma | 🔴 Critical | ✅ Completed | Prisma client with TypeScript |
| TECH-005 | As a developer, I want automated linting with ESLint | 🟡 Medium | ✅ Completed | ESLint configuration |
| TECH-006 | As a developer, I want Docker support for deployment | 🟠 High | ✅ Completed | Dockerfile configured |
| TECH-007 | As a developer, I want comprehensive API routes | 🔴 Critical | ✅ Completed | API routes for appointments, auth, user |
| TECH-008 | As a developer, I want form validation with Zod schemas | 🟠 High | ✅ Completed | ts-to-zod integration |
| TECH-009 | As a developer, I want automated tests | 🟠 High | ⏳ Planned | Test suite setup |
| TECH-010 | As a developer, I want CI/CD pipeline | 🟡 Medium | 💡 Backlog | GitHub Actions workflows |

---

## 🚀 Future Enhancements Backlog

### Priority Features for Next Sprint

| ID | Feature | Description | Priority |
|----|---------|-------------|----------|
| FUT-001 | Multi-language Support | i18n for Filipino/English | 🟡 Medium |
| FUT-002 | SMS Notifications | Twilio integration for SMS reminders | 🟠 High |
| FUT-003 | Calendar Integration | Google/Outlook calendar sync | 🟡 Medium |
| FUT-004 | Mobile App | React Native companion app | 🟠 High |
| FUT-005 | Report Generation | PDF reports for appointments/analytics | 🟡 Medium |
| FUT-006 | Counselor Ratings Dashboard | Aggregated rating analytics | 🟢 Low |
| FUT-007 | Waiting Room | Virtual waiting room before video calls | 🟡 Medium |
| FUT-008 | Screen Sharing | Share screen during video sessions | 🟡 Medium |
| FUT-009 | File Attachments | Share files in chat/appointments | 🟡 Medium |
| FUT-010 | Appointment Rescheduling | Easy reschedule flow | 🟠 High |
| FUT-011 | Bulk User Import | CSV import for student registration | 🟢 Low |
| FUT-012 | Audit Logs | Comprehensive system audit trail | 🟡 Medium |
| FUT-013 | Two-Factor Authentication | Enhanced security with 2FA | 🟠 High |
| FUT-014 | Offline Support | PWA with offline capabilities | 🟢 Low |
| FUT-015 | Analytics Export | Export analytics data to CSV/Excel | 🟢 Low |

---

## 📈 Sprint Planning Guide

### Sprint Configuration
- **Sprint Duration**: 2 weeks
- **Story Point Scale**: Fibonacci (1, 2, 3, 5, 8, 13)
- **Recommended Sprint Capacity**: 20-30 story points (adjust based on team size and velocity)

### Story Point Reference
| Points | Effort Level | Example |
|--------|--------------|---------|
| 1 | Trivial | Simple UI text change |
| 2 | Small | Add new field to form |
| 3 | Medium | New API endpoint |
| 5 | Large | New page with CRUD operations |
| 8 | Extra Large | Complex feature with multiple components |
| 13 | Epic-level | Requires breakdown into smaller stories |

### Suggested Sprint Structure

**Sprint 1: Core Stability** (~18 pts)
- AUTH-006: Password recovery flow (5 pts)
- NOTIF-008: Email notifications setup (5 pts)
- TECH-009: Initial test suite setup (8 pts)

**Sprint 2: Enhanced Communication** (~15 pts)
- VIDEO-007: Incoming call notifications (5 pts)
- CHAT-007: Chat message notifications (5 pts)
- SET-003: Password change feature (5 pts)

**Sprint 3: Future Features** (~21 pts)
- FUT-002: SMS notifications integration (8 pts)
- FUT-010: Appointment rescheduling flow (8 pts)
- FUT-005: Report generation (5 pts)

---

## 📝 Backlog Management

### Ownership & Responsibilities
- **Product Owner**: Responsible for prioritizing and refining the backlog
- **Development Team**: Responsible for estimating stories and providing technical input
- **Scrum Master**: Facilitates backlog refinement sessions

### Update Frequency
- **Sprint Planning**: Review and prioritize items at the start of each sprint
- **Backlog Refinement**: Weekly sessions to add details and estimates to upcoming items
- **Retrospective**: Update status and add learnings after each sprint

### Process Guidelines
1. **Status Updates**: Update item status immediately when work begins or completes
2. **Priority Changes**: Discuss with Product Owner before changing priorities
3. **New Items**: Add to backlog with initial priority and acceptance criteria
4. **Technical Debt**: Track separately and allocate ~20% of sprint capacity

---

*Document Created: November 2025*
*Project: SafeHub - Student Counseling Platform*
*Organization: La Consolacion University Philippines (LCUP)*
*Version: 1.0*
