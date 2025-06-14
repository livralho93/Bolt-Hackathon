# Bolt-Hackathon
# **AI Itinerary PRD & Planning Document**

# TL;DR

AI Itinerary is designed to make group trip planning effortless, transparent, and fun. It solves the mess of coordinating accommodations, activities, and meals by giving groups a shared hub for organizing every detail, tracking costs, and syncing payments seamlessly. The product targets friends, families, and coworkers planning trips together, drawing on needs surfaced in the attached personas.  
---

## Goals

### Business Goals

* Launch a fully functional responsive web MVP for the hackathon, demonstrating seamless group trip coordination.  
* Validate demand by targeting 10+ active groups using the platform post-hackathon.  
* Garner positive user feedback (80%+ satisfaction rate from initial testers). "Easier than building a Google Sheet"

### User Goals

* Enable fast and clear setup of shared trips, minimizing confusion in group coordination.  
* Ensure every participant has visibility into itineraries and costs.  
* Centralize trip communication and planning so nothing is lost across multiple channels.  
* Make managing group expenses easy and transparent, reducing manual calculation and platform-hopping.  
* Create a delightful, inclusive experience—no one left out or overwhelmed.

### Non-Goals

* Supporting enterprise-grade features (e.g., complex permissions, API for third-party vendors).  
* Deep, custom travel booking integrations (airfare, hotels) for MVP.  
* In-app real-time chat (beyond pragmatic comment threads within trip content).  
* Integrations with payment apps such as Splitwise for MVP.

---

## User Stories

**Persona 1:** "The Planner" (e.g., Jess—Organizational Enthusiast, takes charge of details)

* As a Planner, I want to create a new group trip and add all participants, so that everyone is on the same page from the start.  
* As a Planner, I want to pre-fill dates and suggest initial accommodation options, so the group can weigh in.  
* As a Planner, I want to track each participant's RSVP and availability, so no one is scheduled for days they can't attend.  
* As a Planner, I want to assign activities/meals to participants, so the work of organizing is shared.  
* As a Planner, I want to review all trip costs by person, so I can keep the group's budget balanced.

**Persona 2:** "The Busy Joiner" (e.g., Alex—Wants involvement but limited time)

* As a Joiner, I want an easy way to sign in and see all my upcoming trips, so I never lose track.  
* As a Joiner, I want to quickly update my availability, so the group has accurate info.  
* As a Joiner, I want to view the trip's accommodations, activities, and meals, so I am prepared and feel included.  
* As a Joiner, I want to see exactly what I owe (and pay it easily), so I'm never surprised by costs.

---

## Technical Scope for Bolt MVP

## Pages & Components

## 1\. Home/Welcome Screen

* ## Create Trip" button

* Create "I already have an account" Button

## 2\. Create Trip Form

* ## Inputs: Name, Start Date, End Date, \#Participants

## 3\. Itinerary Page

* ## Trip name, start date, and number of participants displayed at the top

* ## Days auto-generated based on date range

* ## "Add Activity" button per day

* ## "Add Accomodation" button per day

* "Add Meal button" per day

## 4\. Add Activity Modal

* ## Inputs: Description, Location, Date, Cost (optional)

* ## Auto-tag "Added by \[name\]

## 5\. \*\*Invite Screen\*\*

* ## Once 1–2 activities are added, show shareable link or option to invite friends by input their emails

* ## Participant bubbles shown at the top of the itinerary page when others join

## Functional Requirements

* **Onboarding & Access (Priority: Critical)**  
  * Sign-in capability for trip participants  
  * Personalized landing page displaying user's upcoming trips  
  * Content visibility restricted to authenticated participants  
  * Create new trip: enter trip name, date range, and number of people  
  * Itinerary split by days based on selected range  
  * Each activity shows date, description, location, cost (optional), and who added it  
  * Participants can be invited via link or email  
  * Any participant can add/edit/reorder activities

* **Trip Management (Priority: Critical)**  
  * Circular image for each participant consisting of initials on color background; manual edit option.  
  * For each trip: list of participants with images shown at top; editable individual date ranges (default to trip dates).  
* **Trip Content Management (Priority: High)**  
  * Three organizer modules per trip: Accommodations, Activities, Meals.  
  * In each section: add line items with unlimited-length description, date, location, cost, and participant subset.  
  * Default participant set to all; may edit per item.  
  * Real-time cost per person calculation for each line item.  
  * Ability to reorder line items via drag & drop.  
* **Expense Tracking & Payments (Priority: High)**  
  * Show total trip cost per participant (auto-calculated from items).  
  * Basic cost tracking and cost-per-person calculation per item (optional in MVP)  
  * Future-proof for integration into payment apps such as Splitwise  
* **Collaboration (Priority: Medium)**  
  * All participants are able to add, edit, or reorder line items within trip sections.  
  * Comments or suggestions on trip content (lightweight, non-chat).  
* **Platform Compatibility (Priority: Essential)**  
  * Responsive, consistent experience across web, iPhone, and Android.

---

## User Experience

**Entry Point & First-Time User Experience**

* When opening the app, user (the planner) lands into a welcome screen with two options either to create a trip or to access to their account if they already have one  
* The User creating a trip is guided through naming, date selection, and number of participants.  
* A dashboard is created with a Default, playful AI-generated image for the trip at the top. User (the planner) can start building the trip. The dashboard has three buttons: add accommodation, add an activity and add a meal/food (modules)  
* As the planner inputs accommodations, activities and meals, the dashboard displays the itinerary broken by day and modules  
* Once the planner has added 3-5 modules , a micro-interaction pops up to encourage the planner to invite friends to collaborate/or share the trips with friends.   
* If the user confirms, then they are invited to create a profile (account) and then to add the emails of their friends


  
**Core Experience**

* Step 1: User selects a trip from "My Trips."  
  * Clean dashboard with participant bubbles and trip details up top.  
  * UI echoes across devices for ease of use.  
* Step 2: Review and manage participant info.  
  * Each participant can edit their travel dates and avatar/image.  
  * Visual date range displayed; updates in real-time for everyone.  
* Step 3: Drill into trip content: Accommodations, Activities, Meals.  
  * Each section contains a sortable, additive list of items.  
  * Rich item entry: Description (unlimited), date, location, relevant participants.  
  * Costs auto-calculated and displayed per item; participant cost auto-updated.  
* Step 4: Cost Management  
  * Current total owed per participant visible in header/footer.  
* Step 5: Collaboration features  
  * Any participant can add items, suggest edits, or reorder plans.  
  * Light in-line commenting for discussion (no real-time chat for MVP).

**Advanced Features & Edge Cases**

* Error handling: If a participant's date range doesn't cover a scheduled item, prompt to adjust.  
* Handling trip overflows (more than, e.g., 12 participants shown as \+N bubble).

**UI/UX Highlights**

* High-contrast, intuitive icons/buttons and universal navigation.  
* Consistent experience: trip management flows identical across web and apps.  
* Clean, mobile-friendly layout with day-by-day trip breakdown  
* Participant avatars shown in circles with initials or images  
* Smooth, intuitive add/edit flow with modals  
* Real-time updates when trip is modified  
* Delightful, minimal UI for a friendly experience

---

## Narrative

Jess, the go-to planner in her friend group, is done juggling spreadsheets. She opens the app, creates a trip, adds trip name, dates, and starts entering activities that all her friends have already agreed on during the last potluck. After 2–3 entries, she invites friends via link or email. Alex, who's busy at work, joins from the link, immediately sees the trip's essentials: who's coming, the exact dates, and the latest plan for cabins, hikes, and shared dinners, and adds his favorite hike. Everyone contributes—no confusion, no stress

---

## Success Metrics

### User-Centric Metrics

* % of invited participants who sign in and join a trip (Target: \>85%)  
* Number of trips fully planned (all sections filled, costs split) per week   
* User satisfaction score from post-trip survey (Target: \>80% of test users say it's easier to plan a trip with our app then creating a Google Sheet)

### Business Metrics

* Total number of trips created within 30 days of hackathon  
* User retention rate 2 weeks after first trip (Target: 60%+ users create a second trip within 90 days of the first one. 

### Technical Metrics

* Cross-platform visual QA score (Goal: no critical issues)  
* Uptime/reliability during hackathon demo/live test (Target: \>99%)  
* Error/bug rate from user reported issues (Target: \<1 per 10 active users)

### Tracking Plan

* Trip creation/ join events  
* Participant sign-in/sign-up/conversion  
* Item add/edit/delete/reorder actions  
* Cost editing  
* Comments added/suggested activities

---

## Technical Considerations

### Technical Needs

* Modern web front end (mobile-first design)  
* Simple back-end for authentication, trip, participant, and content data; role-based access for privacy.

### Data Storage & Privacy

* Store all content in secure, privacy-compliant storage (encrypted personal info, images, audit logs).  
* Restrict trip data visibility to authenticated, added participants only.  
* Simple "delete my account/data" option in product.

### Scalability & Performance

* Designed to comfortably handle 10–20 active trips/groups concurrently in MVP.  
* Lightweight, efficient app for quick loading and offline-resilient UI for mobile.

### Potential Challenges

* Cross-platform UX consistency with small engineering team.  
* Smooth participant onboarding (especially mobile signups) with minimal friction.

---

## **3-Person Team Division (Updated)**

### **Mimi - Person 1: Authentication & Trip Management Foundation**

**Responsibilities:**

* User authentication system (Google OAuth + email/password)  
* "My Trips" dashboard  
* Trip creation flow and basic trip data management
* User profile management  
* Database schema design and setup
* Initial project architecture and shared state setup

**Key Screens:** Landing/Sign-in, Dashboard, Create Trip, Profile

**Deliverables for Team:**
* Supabase setup with auth and core database schema
* Zustand stores for auth and trip data
* Base component library structure
* Trip creation and basic trip management

### **Avril - Person 2: Trip Content & Line Item Management**

**Responsibilities:**

* Trip detail page with tabbed interface (Accommodations, Activities, Meals)
* Line item CRUD operations (Create, Read, Update, Delete)
* Line item data management and organization
* Content editing and reordering functionality

**Key Screens:** Trip Overview, Add/Edit Line Item modals, all 3 tab views

**Dependencies from Mimi:** 
* Trip data structure and API
* Participant data access
* Base UI components

**Deliverables for Emily:**
* Line item data for cost calculations
* Content structure for participant filtering

### **Emily - Person 3: Collaboration Features & User Experience**

**Responsibilities:**

* Trip invitation and sharing system (shareable links, email invites)
* Participant management within trips (editing dates, avatars, participant display)
* Real-time cost calculations and expense summaries
* Participant filtering and assignment for line items
* Overall UI/UX polish and responsive design
* Cross-component state coordination

**Key Features:** Invite system, Participant management, Cost calculations, UI polish

**Dependencies:** 
* **From Mimi:** User auth state, trip ownership, base components
* **From Avril:** Line item data structure for cost calculations

**Integration Points:**
* **Mimi → Avril:** Trip data, participant list, auth state
* **Mimi → Emily:** User auth state, trip ownership, participant data
* **Avril → Emily:** Line item data for cost calculations and participant assignments
* **Emily → Both:** Shared UI components, participant updates, cost totals

---

## **Requirements** {#requirements}

* Provide a simple, clear way for groups to coordinate trips together. 

* Landing page shows upcoming trips  
* New trips can be added on trips page  
* A circular graphic is associated with the trip and with each participant.   
* A date range is shown for each participant, default to the trip dates.  
* When a trip is selected, all participants are displayed at the top of the page.  
* Participants can edit their dates (default is trip dates) and images.  
* The total trip cost for each participant is shown (calculated from the line items for the trip)  
* The trip has 3 content sections: accommodations, activities, meals   
* Line items can be added beneath each section  
* All trip participants can add line items   
* The following content entries are associated with each line item: Description (unlimited length), Date, Location, Cost, Participants (default to all trip participants)  
* The Cost per person is calculated and displayed with each line item  
* Line items can be reordered, edited, or deleted