-- Test data for notes table
-- 100 realistic insert statements covering all note types

-- Text notes (20 entries)
INSERT INTO
    notes (title, data, type)
VALUES (
        'Daily Standup Notes',
        '{"content": "Sprint progress review - completed user authentication module, working on API endpoints. Blockers: waiting for database schema approval.", "tags": ["work", "standup"], "priority": "medium"}',
        'text'
    ),
    (
        'Meeting with Sarah',
        '{"content": "Discussed project timeline and deliverables. Next meeting scheduled for Friday.", "attendees": ["Sarah Johnson", "Mike Chen"], "action_items": ["Review mockups", "Update timeline"]}',
        'text'
    ),
    (
        'Book Recommendations',
        '{"content": "Clean Code by Robert Martin, The Pragmatic Programmer, Design Patterns", "category": "programming", "rating": 5}',
        'text'
    ),
    (
        'Grocery List Ideas',
        '{"content": "Organic vegetables, quinoa, salmon, Greek yogurt, berries, almonds", "store": "Whole Foods", "estimated_cost": 85}',
        'text'
    ),
    (
        'Weekend Plans',
        '{"content": "Saturday: hiking at Bear Mountain, Sunday: farmers market and meal prep", "weather_check": true, "backup_plans": ["Museum visit", "Movie night"]}',
        'text'
    ),
    (
        'Client Feedback Session',
        '{"content": "Client loves the new dashboard design. Requested minor color adjustments and faster loading times.", "client": "TechCorp Inc", "satisfaction": 9}',
        'text'
    ),
    (
        'Workout Routine Update',
        '{"content": "New 5-day split focusing on strength training. Added deadlifts and pull-ups to routine.", "duration": "6 weeks", "goals": ["Increase bench press", "Improve endurance"]}',
        'text'
    ),
    (
        'Recipe Collection',
        '{"content": "Mediterranean quinoa bowl, Thai green curry, homemade pizza dough recipe", "cuisine_types": ["Mediterranean", "Thai", "Italian"], "difficulty": "intermediate"}',
        'text'
    ),
    (
        'Travel Packing List',
        '{"content": "Passport, chargers, comfortable shoes, weather-appropriate clothing, first aid kit", "destination": "Europe", "duration": "2 weeks"}',
        'text'
    ),
    (
        'Investment Research Notes',
        '{"content": "Technology sector showing strong growth. Consider diversifying portfolio with international funds.", "risk_level": "moderate", "research_date": "2025-08-05"}',
        'text'
    ),
    (
        'Home Improvement Ideas',
        '{"content": "Kitchen backsplash, living room lighting, garden landscaping", "budget": 5000, "priority_order": ["kitchen", "lighting", "garden"]}',
        'text'
    ),
    (
        'Language Learning Progress',
        '{"content": "Completed Spanish A2 level. Working on conversational skills and past tense conjugations.", "language": "Spanish", "hours_studied": 120}',
        'text'
    ),
    (
        'Networking Event Contacts',
        '{"content": "Met several potential collaborators at the tech meetup. Exchange cards with 5 people.", "event": "Tech Innovators Meetup", "follow_up_needed": true}',
        'text'
    ),
    (
        'Car Maintenance Log',
        '{"content": "Oil change due next month. Brake pads need inspection. Tire rotation completed.", "mileage": 45000, "next_service": "2025-09-15"}',
        'text'
    ),
    (
        'Gift Ideas for Mom',
        '{"content": "Spa day voucher, cooking class, personalized photo album, gardening tools", "occasion": "Birthday", "budget": 200}',
        'text'
    ),
    (
        'Conference Takeaways',
        '{"content": "AI trends, microservices architecture, team collaboration best practices", "conference": "DevCon 2025", "speakers": ["Jane Doe", "John Smith"]}',
        'text'
    ),
    (
        'Podcast Recommendations',
        '{"content": "The Tim Ferriss Show, How I Built This, Planet Money, CodeNewbie", "genres": ["business", "technology", "entrepreneurship"]}',
        'text'
    ),
    (
        'Meditation Practice Log',
        '{"content": "15 minutes daily meditation. Noticing improved focus and reduced stress levels.", "streak_days": 30, "technique": "mindfulness"}',
        'text'
    ),
    (
        'Side Project Ideas',
        '{"content": "Weather app with ML predictions, expense tracker, habit formation app", "technologies": ["React Native", "Python", "TensorFlow"], "feasibility": "high"}',
        'text'
    ),
    (
        'Team Retrospective Notes',
        '{"content": "What went well: good communication, fast bug fixes. Improvements: better planning, more testing", "sprint": 15, "team_velocity": 85}',
        'text'
    );

-- Markdown notes (20 entries)
INSERT INTO
    notes (title, data, type)
VALUES (
        'API Documentation Draft',
        '{"content": "# User Authentication API\n\n## Endpoints\n\n### POST /auth/login\n- **Description**: Authenticate user\n- **Parameters**: email, password\n- **Returns**: JWT token", "version": "1.0", "status": "draft"}',
        'markdown'
    ),
    (
        'Project README',
        '{"content": "# dm0nk\n\nA modern note-taking application built with Go and React.\n\n## Features\n- Real-time sync\n- Markdown support\n- Tag organization", "repository": "dm0nk", "last_updated": "2025-08-07"}',
        'markdown'
    ),
    (
        'Weekly Report Template',
        '{"content": "# Week of {{ date }}\n\n## Accomplishments\n- [ ] Task 1\n- [ ] Task 2\n\n## Challenges\n\n## Next Week Goals", "template": true, "category": "reporting"}',
        'markdown'
    ),
    (
        'Learning Notes: Go Concurrency',
        '{"content": "# Go Concurrency Patterns\n\n## Goroutines\nLightweight threads managed by Go runtime.\n\n```go\ngo func() {\n    fmt.Println(\"Hello from goroutine\")\n}()\n```", "subject": "programming", "level": "intermediate"}',
        'markdown'
    ),
    (
        'Product Requirements Document',
        '{"content": "# User Dashboard v2.0\n\n## Overview\nEnhanced dashboard with real-time analytics.\n\n## User Stories\n- As a user, I want to see my data in real-time\n- As an admin, I want to manage user permissions", "stakeholders": ["Product", "Engineering", "Design"]}',
        'markdown'
    ),
    (
        'Interview Preparation Guide',
        '{"content": "# Technical Interview Prep\n\n## Data Structures\n- Arrays and Lists\n- Hash Tables\n- Trees and Graphs\n\n## Algorithms\n- Sorting\n- Searching\n- Dynamic Programming", "position": "Software Engineer", "company": "TechCorp"}',
        'markdown'
    ),
    (
        'Meeting Minutes Template',
        '{"content": "# Meeting: {{ title }}\n**Date**: {{ date }}\n**Attendees**: {{ attendees }}\n\n## Agenda\n1. Item 1\n2. Item 2\n\n## Action Items\n- [ ] Action 1\n- [ ] Action 2", "template": true, "usage_count": 25}',
        'markdown'
    ),
    (
        'Code Review Checklist',
        '{"content": "# Code Review Checklist\n\n## Functionality\n- [ ] Code works as expected\n- [ ] Edge cases handled\n\n## Style\n- [ ] Follows coding standards\n- [ ] Clear variable names\n\n## Performance\n- [ ] No obvious performance issues", "team": "backend", "version": "2.1"}',
        'markdown'
    ),
    (
        'Database Migration Guide',
        '{"content": "# Database Migration Process\n\n## Pre-migration\n1. Backup current database\n2. Test migration on staging\n\n## Migration Steps\n1. Stop application\n2. Run migration scripts\n3. Verify data integrity\n4. Restart application", "environment": "production", "risk_level": "high"}',
        'markdown'
    ),
    (
        'Onboarding Checklist',
        '{"content": "# New Employee Onboarding\n\n## First Day\n- [ ] IT setup\n- [ ] HR paperwork\n- [ ] Team introductions\n\n## First Week\n- [ ] System access\n- [ ] Initial training\n- [ ] First project assignment", "department": "Engineering", "estimated_duration": "1 week"}',
        'markdown'
    ),
    (
        'Bug Report Template',
        '{"content": "# Bug Report\n\n## Description\nBrief description of the issue\n\n## Steps to Reproduce\n1. Step 1\n2. Step 2\n3. Step 3\n\n## Expected Behavior\nWhat should happen\n\n## Actual Behavior\nWhat actually happens\n\n## Environment\n- Browser:\n- OS:\n- Version:", "template": true, "severity": "medium"}',
        'markdown'
    ),
    (
        'Architecture Decision Record',
        '{"content": "# ADR-001: Database Choice\n\n## Status\nAccepted\n\n## Context\nWe need to choose a database for our application.\n\n## Decision\nWe will use PostgreSQL.\n\n## Consequences\n- Pros: ACID compliance, JSON support\n- Cons: More complex than NoSQL", "adr_number": 1, "status": "accepted"}',
        'markdown'
    ),
    (
        'Release Notes v2.1',
        '{"content": "# Release Notes - Version 2.1.0\n\n## New Features\n- Dark mode support\n- Improved search functionality\n- Export to PDF\n\n## Bug Fixes\n- Fixed login timeout issue\n- Resolved mobile responsiveness\n\n## Breaking Changes\nNone", "version": "2.1.0", "release_date": "2025-08-07"}',
        'markdown'
    ),
    (
        'Tutorial: Setting up CI/CD',
        '{"content": "# CI/CD Pipeline Setup\n\n## Prerequisites\n- GitHub repository\n- Docker installed\n\n## Steps\n1. Create `.github/workflows/ci.yml`\n2. Configure build steps\n3. Set up deployment\n\n```yaml\nname: CI\non: [push, pull_request]\njobs:\n  test:\n    runs-on: ubuntu-latest\n```", "tutorial_level": "beginner", "estimated_time": "30 minutes"}',
        'markdown'
    ),
    (
        'Security Guidelines',
        '{"content": "# Security Best Practices\n\n## Authentication\n- Use strong passwords\n- Implement 2FA\n- JWT token expiration\n\n## Data Protection\n- Encrypt sensitive data\n- Validate all inputs\n- Use HTTPS everywhere\n\n## Monitoring\n- Log security events\n- Monitor for anomalies", "compliance": "SOC2", "review_date": "2025-12-01"}',
        'markdown'
    ),
    (
        'Performance Optimization Notes',
        '{"content": "# Frontend Performance Optimization\n\n## Image Optimization\n- Use WebP format\n- Implement lazy loading\n- Optimize image sizes\n\n## JavaScript\n- Code splitting\n- Tree shaking\n- Minimize bundle size\n\n## CSS\n- Remove unused styles\n- Use CSS Grid/Flexbox", "impact": "page load 40% faster", "priority": "high"}',
        'markdown'
    ),
    (
        'Testing Strategy Document',
        '{"content": "# Testing Strategy\n\n## Unit Tests\n- Target 80% code coverage\n- Use Jest for JavaScript\n- Mock external dependencies\n\n## Integration Tests\n- API endpoint testing\n- Database integration\n\n## E2E Tests\n- Critical user journeys\n- Use Cypress for automation", "framework": "Jest + Cypress", "automation_percentage": 75}',
        'markdown'
    ),
    (
        'Deployment Runbook',
        '{"content": "# Production Deployment\n\n## Pre-deployment\n- [ ] Run all tests\n- [ ] Update documentation\n- [ ] Notify stakeholders\n\n## Deployment\n1. Create release branch\n2. Deploy to staging\n3. Run smoke tests\n4. Deploy to production\n\n## Post-deployment\n- Monitor metrics\n- Check error rates", "frequency": "weekly", "rollback_time": "5 minutes"}',
        'markdown'
    ),
    (
        'API Style Guide',
        '{"content": "# REST API Style Guide\n\n## Naming Conventions\n- Use nouns for resources\n- Use plural forms\n- Use kebab-case for URLs\n\n## HTTP Methods\n- GET: Retrieve data\n- POST: Create resource\n- PUT: Update resource\n- DELETE: Remove resource\n\n## Status Codes\n- 200: Success\n- 201: Created\n- 400: Bad Request\n- 404: Not Found\n- 500: Server Error", "team": "API", "version": "1.2"}',
        'markdown'
    ),
    (
        'Data Model Documentation',
        '{"content": "# Data Model v3.0\n\n## Users Table\n```sql\nCREATE TABLE users (\n  id UUID PRIMARY KEY,\n  email VARCHAR(255) UNIQUE,\n  created_at TIMESTAMP\n);\n```\n\n## Notes Table\n```sql\nCREATE TABLE notes (\n  id UUID PRIMARY KEY,\n  title VARCHAR(255),\n  data JSONB\n);\n```", "schema_version": "3.0", "last_migration": "2025-08-01"}',
        'markdown'
    );

-- Birthdays notes (10 entries)
INSERT INTO
    notes (title, data, type)
VALUES (
        'Family Birthdays 2025',
        '{"birthdays": [{"name": "Mom", "date": "1965-03-15", "age": 60, "gift_ideas": ["spa day", "jewelry"]}, {"name": "Dad", "date": "1962-07-22", "age": 63, "gift_ideas": ["books", "golf accessories"]}, {"name": "Sister Emma", "date": "1990-11-08", "age": 35, "gift_ideas": ["wine", "cooking class"]}], "reminders_set": true}',
        'birthdays'
    ),
    (
        'Work Colleagues Birthdays',
        '{"birthdays": [{"name": "Sarah from Marketing", "date": "1988-05-12", "department": "Marketing", "favorite_cake": "chocolate"}, {"name": "Mike the Designer", "date": "1992-09-18", "department": "Design", "coffee_preference": "oat milk latte"}], "office_celebrations": true}',
        'birthdays'
    ),
    (
        'Friends Birthday Calendar',
        '{"birthdays": [{"name": "Alex Chen", "date": "1991-02-14", "relationship": "college friend", "location": "Seattle"}, {"name": "Jordan Smith", "date": "1989-06-30", "relationship": "neighbor", "kids": 2}, {"name": "Taylor Johnson", "date": "1993-10-05", "relationship": "gym buddy", "interests": ["fitness", "nutrition"]}]}',
        'birthdays'
    ),
    (
        'Extended Family Birthdays',
        '{"birthdays": [{"name": "Aunt Linda", "date": "1958-01-20", "relationship": "aunt", "state": "California"}, {"name": "Cousin Michael", "date": "1995-08-14", "relationship": "cousin", "recent_graduate": true}, {"name": "Grandpa Joe", "date": "1940-12-03", "relationship": "grandfather", "health_notes": "doing well"}]}',
        'birthdays'
    ),
    (
        'Kids Birthday Party Planning',
        '{"birthdays": [{"name": "Nephew Tommy", "date": "2015-04-18", "age": 10, "theme": "dinosaurs", "guest_count": 15, "venue": "backyard"}, {"name": "Niece Lily", "date": "2017-12-25", "age": 8, "theme": "unicorns", "allergies": ["nuts"], "favorite_color": "purple"}]}',
        'birthdays'
    ),
    (
        'Neighbors Birthday Reminders',
        '{"birthdays": [{"name": "Mrs. Peterson", "date": "1955-03-28", "apartment": "3B", "favorite_flowers": "tulips"}, {"name": "The Johnson twins", "date": "2010-07-04", "ages": 15, "shared_interests": ["basketball", "video games"]}], "community_involved": true}',
        'birthdays'
    ),
    (
        'Online Friends Birthdays',
        '{"birthdays": [{"name": "Gaming buddy Jake", "date": "1994-09-12", "platform": "Discord", "timezone": "PST"}, {"name": "Book club Emma", "date": "1987-11-22", "platform": "Goodreads", "favorite_genre": "mystery"}], "virtual_celebrations": true}',
        'birthdays'
    ),
    (
        'Former Colleagues',
        '{"birthdays": [{"name": "Old boss Rachel", "date": "1975-02-08", "company": "TechStart Inc", "connection": "LinkedIn"}, {"name": "Intern David", "date": "1999-05-16", "current_role": "Software Engineer", "company": "Google"}], "professional_network": true}',
        'birthdays'
    ),
    (
        'Mentors and Teachers',
        '{"birthdays": [{"name": "Professor Williams", "date": "1968-10-11", "subject": "Computer Science", "university": "State University"}, {"name": "Career coach Maria", "date": "1972-01-30", "specialization": "tech careers", "sessions_completed": 10}]}',
        'birthdays'
    ),
    (
        'Pet Birthdays and Adoptions',
        '{"birthdays": [{"name": "Dog Max", "date": "2018-06-15", "breed": "Golden Retriever", "adoption_day": true}, {"name": "Cat Luna", "date": "2019-09-22", "breed": "Maine Coon", "favorite_treats": "salmon"}, {"name": "Fish Nemo", "date": "2023-03-10", "type": "Goldfish", "tank_size": "10 gallon"}]}',
        'birthdays'
    );

-- Spaced repetition suite notes (10 entries)
INSERT INTO
    notes (title, data, type)
VALUES (
        'Spanish Vocabulary Deck',
        '{"cards": [{"front": "Hola", "back": "Hello", "difficulty": 1, "last_reviewed": "2025-08-05", "next_review": "2025-08-08"}, {"front": "Gracias", "back": "Thank you", "difficulty": 2, "last_reviewed": "2025-08-06", "next_review": "2025-08-10"}], "language": "Spanish", "total_cards": 150, "mastered": 45}',
        'spaced_rep_suite'
    ),
    (
        'Programming Concepts',
        '{"cards": [{"front": "What is polymorphism?", "back": "The ability of objects to take multiple forms", "category": "OOP", "difficulty": 3}, {"front": "Explain Big O notation", "back": "Mathematical notation describing algorithm efficiency", "category": "Algorithms", "difficulty": 4}], "subject": "Computer Science", "progress": 65}',
        'spaced_rep_suite'
    ),
    (
        'Medical Terminology',
        '{"cards": [{"front": "Hypertension", "back": "High blood pressure", "category": "Cardiovascular", "difficulty": 2}, {"front": "Bradycardia", "back": "Slow heart rate", "category": "Cardiovascular", "difficulty": 3}], "exam_prep": true, "exam_date": "2025-09-15", "cards_per_day": 20}',
        'spaced_rep_suite'
    ),
    (
        'Historical Dates and Events',
        '{"cards": [{"front": "1969", "back": "Moon landing", "category": "Space exploration", "difficulty": 1}, {"front": "1989", "back": "Fall of Berlin Wall", "category": "European history", "difficulty": 2}], "subject": "History", "study_goal": "comprehensive review"}',
        'spaced_rep_suite'
    ),
    (
        'Chemistry Formulas',
        '{"cards": [{"front": "H2O", "back": "Water", "category": "Basic compounds", "difficulty": 1}, {"front": "C6H12O6", "back": "Glucose", "category": "Organic chemistry", "difficulty": 3}], "course": "General Chemistry", "semester": "Fall 2025", "professor": "Dr. Smith"}',
        'spaced_rep_suite'
    ),
    (
        'French Conjugations',
        '{"cards": [{"front": "être (to be) - je", "back": "suis", "tense": "present", "difficulty": 2}, {"front": "avoir (to have) - nous", "back": "avons", "tense": "present", "difficulty": 2}], "language": "French", "level": "A2", "focus": "irregular verbs"}',
        'spaced_rep_suite'
    ),
    (
        'Geography Capital Cities',
        '{"cards": [{"front": "Australia", "back": "Canberra", "continent": "Oceania", "difficulty": 3}, {"front": "Canada", "back": "Ottawa", "continent": "North America", "difficulty": 2}], "category": "World Geography", "competition_prep": true}',
        'spaced_rep_suite'
    ),
    (
        'Music Theory Intervals',
        '{"cards": [{"front": "Perfect fifth from C", "back": "G", "category": "Intervals", "difficulty": 2}, {"front": "Major third from F", "back": "A", "category": "Intervals", "difficulty": 3}], "instrument": "Piano", "level": "Intermediate", "practice_daily": true}',
        'spaced_rep_suite'
    ),
    (
        'Legal Terms and Definitions',
        '{"cards": [{"front": "Habeas Corpus", "back": "Right to appear before a judge", "category": "Constitutional Law", "difficulty": 4}, {"front": "Mens Rea", "back": "Criminal intent", "category": "Criminal Law", "difficulty": 3}], "bar_exam_prep": true, "study_hours": 120}',
        'spaced_rep_suite'
    ),
    (
        'Japanese Hiragana Characters',
        '{"cards": [{"front": "あ", "back": "a", "stroke_count": 3, "difficulty": 1}, {"front": "き", "back": "ki", "stroke_count": 4, "difficulty": 2}], "writing_system": "Hiragana", "total_characters": 46, "mastered": 20, "daily_practice": 30}',
        'spaced_rep_suite'
    );

-- Checklist notes (15 entries)
INSERT INTO
    notes (title, data, type)
VALUES (
        'Morning Routine Checklist',
        '{"items": [{"task": "Drink water", "completed": true, "time": "7:00 AM"}, {"task": "Exercise", "completed": false, "duration": "30 minutes"}, {"task": "Meditation", "completed": false, "duration": "10 minutes"}, {"task": "Healthy breakfast", "completed": false}], "routine_type": "daily", "streak": 15}',
        'checklist'
    ),
    (
        'Project Launch Checklist',
        '{"items": [{"task": "Finalize code review", "completed": true, "assignee": "John"}, {"task": "Update documentation", "completed": true, "assignee": "Sarah"}, {"task": "Deploy to staging", "completed": false, "assignee": "Mike"}, {"task": "Run integration tests", "completed": false, "estimated_time": "2 hours"}], "project": "User Dashboard v2", "deadline": "2025-08-15"}',
        'checklist'
    ),
    (
        'Home Cleaning Schedule',
        '{"items": [{"task": "Vacuum living room", "completed": true, "frequency": "weekly"}, {"task": "Clean bathroom", "completed": false, "frequency": "weekly"}, {"task": "Wash dishes", "completed": true, "frequency": "daily"}, {"task": "Dust furniture", "completed": false, "frequency": "bi-weekly"}], "schedule_type": "weekly", "last_completed": "2025-08-01"}',
        'checklist'
    ),
    (
        'Travel Packing Checklist',
        '{"items": [{"task": "Passport", "completed": true, "category": "documents"}, {"task": "Phone charger", "completed": true, "category": "electronics"}, {"task": "Comfortable shoes", "completed": false, "category": "clothing"}, {"task": "Toiletries", "completed": false, "category": "personal care"}], "trip": "Europe Vacation", "departure_date": "2025-08-20", "duration": "2 weeks"}',
        'checklist'
    ),
    (
        'Weekly Meal Prep',
        '{"items": [{"task": "Plan meals for the week", "completed": true}, {"task": "Create grocery list", "completed": true}, {"task": "Shop for ingredients", "completed": false, "estimated_time": "1 hour"}, {"task": "Prep vegetables", "completed": false}, {"task": "Cook proteins", "completed": false}], "budget": 80, "serves": 10, "prep_day": "Sunday"}',
        'checklist'
    ),
    (
        'Car Maintenance Checklist',
        '{"items": [{"task": "Check oil level", "completed": true, "frequency": "monthly"}, {"task": "Tire pressure check", "completed": false, "frequency": "monthly"}, {"task": "Brake inspection", "completed": false, "next_due": "2025-09-01"}, {"task": "Air filter replacement", "completed": false, "next_due": "2025-10-15"}], "vehicle": "Honda Civic 2020", "mileage": 45000}',
        'checklist'
    ),
    (
        'New Employee Onboarding',
        '{"items": [{"task": "IT setup completion", "completed": true, "department": "IT"}, {"task": "HR paperwork", "completed": true, "department": "HR"}, {"task": "Team introductions", "completed": false, "assigned_to": "Manager"}, {"task": "System access provisioning", "completed": false, "estimated_time": "1 day"}], "employee": "Alex Johnson", "start_date": "2025-08-10", "department": "Engineering"}',
        'checklist'
    ),
    (
        'Birthday Party Planning',
        '{"items": [{"task": "Send invitations", "completed": true, "deadline": "2025-08-01"}, {"task": "Order cake", "completed": true, "vendor": "Sweet Treats"}, {"task": "Decorate venue", "completed": false, "helpers": ["Mom", "Sister"]}, {"task": "Prepare games", "completed": false}], "event": "Tommy''s 10th Birthday", "date": "2025-08-15", "guest_count": 15}',
        'checklist'
    ),
    (
        'Gym Workout Checklist',
        '{"items": [{"task": "Warm-up (10 min)", "completed": true}, {"task": "Chest exercises", "completed": true, "sets": 4}, {"task": "Back exercises", "completed": false, "sets": 4}, {"task": "Cool down stretching", "completed": false, "duration": "10 minutes"}], "workout_type": "Upper body", "duration": "60 minutes", "difficulty": "intermediate"}',
        'checklist'
    ),
    (
        'Website Launch Checklist',
        '{"items": [{"task": "Domain registration", "completed": true, "provider": "GoDaddy"}, {"task": "SSL certificate setup", "completed": true}, {"task": "Content review", "completed": false, "reviewer": "Marketing team"}, {"task": "SEO optimization", "completed": false, "estimated_time": "4 hours"}], "website": "company-blog.com", "go_live_date": "2025-08-30"}',
        'checklist'
    ),
    (
        'Monthly Budget Review',
        '{"items": [{"task": "Review bank statements", "completed": true}, {"task": "Categorize expenses", "completed": true, "tool": "Mint"}, {"task": "Update savings goals", "completed": false}, {"task": "Plan next month budget", "completed": false}], "month": "August 2025", "savings_rate": 25, "financial_goal": "Emergency fund"}',
        'checklist'
    ),
    (
        'Garden Maintenance',
        '{"items": [{"task": "Water plants", "completed": true, "frequency": "daily"}, {"task": "Weed removal", "completed": false, "frequency": "weekly"}, {"task": "Fertilize roses", "completed": false, "season": "summer"}, {"task": "Prune bushes", "completed": false, "next_due": "2025-09-01"}], "garden_size": "medium", "season": "summer", "zone": "7a"}',
        'checklist'
    ),
    (
        'Study Session Checklist',
        '{"items": [{"task": "Review lecture notes", "completed": true, "duration": "30 minutes"}, {"task": "Complete practice problems", "completed": false, "count": 10}, {"task": "Flashcard review", "completed": false, "deck": "Spanish vocabulary"}, {"task": "Schedule next session", "completed": false}], "subject": "Calculus II", "exam_date": "2025-08-25", "study_goal": "A grade"}',
        'checklist'
    ),
    (
        'Event Photography Checklist',
        '{"items": [{"task": "Charge camera batteries", "completed": true}, {"task": "Clean camera lenses", "completed": true}, {"task": "Pack backup equipment", "completed": false}, {"task": "Scout venue location", "completed": false, "scheduled": "2025-08-12"}], "event": "Sarah''s Wedding", "date": "2025-08-20", "equipment": "Canon 5D Mark IV", "duration": "8 hours"}',
        'checklist'
    ),
    (
        'Apartment Moving Checklist',
        '{"items": [{"task": "Book moving company", "completed": true, "company": "City Movers"}, {"task": "Change address with post office", "completed": false, "deadline": "2025-08-15"}, {"task": "Transfer utilities", "completed": false, "services": ["electric", "internet", "gas"]}, {"task": "Pack non-essentials", "completed": false}], "move_date": "2025-08-30", "new_address": "123 Oak Street", "budget": 2000}',
        'checklist'
    );

-- Trip notes (10 entries)
INSERT INTO
    notes (title, data, type)
VALUES (
        'Europe Backpacking Adventure',
        '{"destination": "Europe", "duration": "3 weeks", "countries": ["Germany", "France", "Italy", "Spain"], "budget": 3500, "accommodation": "hostels", "transport": "Eurail pass", "highlights": ["Oktoberfest", "Louvre", "Colosseum", "Sagrada Familia"], "packing_list": ["backpack", "comfortable shoes", "rain jacket"], "travel_dates": {"start": "2025-09-01", "end": "2025-09-22"}}',
        'trip'
    ),
    (
        'Tokyo Business Trip',
        '{"destination": "Tokyo, Japan", "purpose": "business conference", "duration": "5 days", "hotel": "Park Hyatt Tokyo", "flight": "UA847", "meetings": [{"company": "TechCorp", "date": "2025-08-15"}, {"company": "StartupXYZ", "date": "2025-08-16"}], "cultural_activities": ["Sushi dinner", "Temple visit"], "budget": 4000, "expenses_covered": "company"}',
        'trip'
    ),
    (
        'Family Vacation to Disney World',
        '{"destination": "Orlando, Florida", "duration": "1 week", "travelers": ["Me", "Spouse", "2 kids"], "accommodation": "Disney Resort", "park_tickets": "7-day hopper", "must_do": ["Space Mountain", "Character breakfast", "Fireworks show"], "budget": 5000, "travel_dates": {"start": "2025-12-20", "end": "2025-12-27"}, "special_occasions": ["Kids first Disney trip"]}',
        'trip'
    ),
    (
        'Weekend Camping Trip',
        '{"destination": "Yellowstone National Park", "duration": "3 days", "group_size": 4, "accommodation": "tent camping", "activities": ["hiking", "wildlife watching", "stargazing"], "gear_needed": ["sleeping bags", "camp stove", "bear spray"], "trails": ["Old Faithful", "Grand Prismatic Spring"], "budget": 800, "weather_concern": "possible rain"}',
        'trip'
    ),
    (
        'Wine Tasting in Napa Valley',
        '{"destination": "Napa Valley, California", "duration": "2 days", "purpose": "anniversary celebration", "wineries": ["Opus One", "Caymus", "Schramsberg"], "accommodation": "boutique B&B", "transportation": "rental car", "budget": 1200, "special_requests": ["dinner reservations", "couples massage"], "travel_dates": {"start": "2025-10-15", "end": "2025-10-17"}}',
        'trip'
    ),
    (
        'Ski Trip to Aspen',
        '{"destination": "Aspen, Colorado", "duration": "4 days", "season": "winter", "accommodation": "ski lodge", "lift_tickets": "multi-day pass", "equipment": "rental skis", "difficulty_level": "intermediate", "group": ["college friends reunion"], "budget": 2500, "après_ski": ["hot chocolate", "live music"], "travel_dates": {"start": "2025-01-20", "end": "2025-01-24"}}',
        'trip'
    ),
    (
        'Cultural Tour of Morocco',
        '{"destination": "Morocco", "duration": "10 days", "cities": ["Marrakech", "Fez", "Casablanca", "Chefchaouen"], "tour_type": "guided group tour", "group_size": 12, "highlights": ["Sahara Desert", "Atlas Mountains", "Medina markets"], "accommodation": "traditional riads", "budget": 2800, "dietary_restrictions": "vegetarian options", "vaccinations_needed": ["Hepatitis A"]}',
        'trip'
    ),
    (
        'Road Trip Pacific Coast Highway',
        '{"destination": "California Coast", "duration": "1 week", "route": "San Francisco to Los Angeles", "stops": ["Monterey", "Big Sur", "Hearst Castle", "Santa Barbara"], "vehicle": "convertible rental", "accommodation": "mix of hotels and camping", "budget": 2000, "must_see": ["Golden Gate Bridge", "McWay Falls", "Santa Monica Pier"], "playlist": "classic rock road trip"}',
        'trip'
    ),
    (
        'Solo Meditation Retreat',
        '{"destination": "Sedona, Arizona", "duration": "5 days", "purpose": "spiritual retreat", "accommodation": "wellness resort", "activities": ["daily meditation", "yoga classes", "nature walks"], "digital_detox": true, "budget": 1800, "goals": ["stress reduction", "mindfulness practice"], "packing": ["comfortable clothes", "journal", "meditation cushion"]}',
        'trip'
    ),
    (
        'Australian Wildlife Safari',
        '{"destination": "Australia", "duration": "2 weeks", "regions": ["Queensland", "Northern Territory"], "wildlife_focus": ["kangaroos", "koalas", "crocodiles", "Great Barrier Reef"], "accommodation": "eco-lodges", "activities": ["snorkeling", "bush walking", "Aboriginal cultural tours"], "budget": 6000, "best_season": "dry season", "gear": ["underwater camera", "binoculars", "sun protection"]}',
        'trip'
    );

-- Journal notes (10 entries)
INSERT INTO
    notes (title, data, type)
VALUES (
        'Reflection on Career Growth',
        '{"date": "2025-08-07", "mood": "contemplative", "content": "Been thinking about my career trajectory lately. The promotion to Senior Developer has been rewarding but challenging. Learning to mentor junior developers while managing my own workload. Grateful for the supportive team environment.", "themes": ["career", "growth", "mentorship"], "goals": ["improve leadership skills", "better work-life balance"]}',
        'journal'
    ),
    (
        'Gratitude Practice - August Week 1',
        '{"date": "2025-08-05", "mood": "grateful", "content": "Three things I''m grateful for today: 1) Successful project deployment without major issues, 2) Lunch with an old friend who''s doing well, 3) Perfect weather for evening walk in the park. Small moments like these remind me to appreciate the present.", "practice_type": "gratitude", "consistency": "daily for 2 weeks"}',
        'journal'
    ),
    (
        'Learning Spanish - Progress Update',
        '{"date": "2025-08-06", "mood": "motivated", "content": "Completed my 100th day of Spanish practice! Finally feeling confident in basic conversations. Had my first 10-minute chat entirely in Spanish with my language exchange partner. Still struggle with past tense conjugations but progress is visible.", "learning_milestone": "100 days", "challenges": ["past tense", "listening comprehension"], "achievements": ["10-minute conversation"]}',
        'journal'
    ),
    (
        'Weekend Hiking Adventure',
        '{"date": "2025-08-03", "mood": "energized", "content": "Conquered the Bear Mountain trail today - 8 miles with stunning views at the summit. Started early to beat the heat and crowds. Met a friendly group of hikers from Germany who shared trail snacks. These solo adventures always leave me feeling recharged and connected to nature.", "activity": "hiking", "distance": "8 miles", "location": "Bear Mountain", "social_interactions": "German hikers"}',
        'journal'
    ),
    (
        'Mindfulness Meditation Insights',
        '{"date": "2025-08-04", "mood": "peaceful", "content": "30-minute morning meditation session brought unexpected clarity about a work situation that''s been stressing me. Realized I''ve been overthinking the client''s feedback. Sometimes stepping back and breathing is the best problem-solving technique.", "meditation_duration": "30 minutes", "insights": ["work stress perspective", "overthinking awareness"], "techniques": ["breathing focus", "body scan"]}',
        'journal'
    ),
    (
        'Family Dinner Reflections',
        '{"date": "2025-08-02", "mood": "content", "content": "Sunday dinner with the family was exactly what I needed. Mom made her famous lasagna, and we spent hours talking about everything and nothing. Dad''s recovery from surgery is going well. These regular gatherings are precious - need to prioritize them more.", "family_time": "Sunday dinner", "special_notes": ["Dad''s recovery", "Mom''s lasagna"], "resolution": "prioritize family time"}',
        'journal'
    ),
    (
        'Book Club Discussion Thoughts',
        '{"date": "2025-08-01", "mood": "intellectually stimulated", "content": "Tonight''s book club discussion of ''Atomic Habits'' was fascinating. Everyone shared personal stories about habit formation. Sarah''s approach to morning routines inspired me to restructure mine. Planning to implement the ''habit stacking'' technique for reading more.", "book": "Atomic Habits", "key_takeaway": "habit stacking", "inspiration_source": "Sarah''s morning routine", "action_plan": "restructure morning routine"}',
        'journal'
    ),
    (
        'Creative Writing Breakthrough',
        '{"date": "2025-07-30", "mood": "accomplished", "content": "Finally broke through the writer''s block that''s been plaguing me for weeks. Wrote 2,000 words of my short story today. The character''s voice suddenly became clear during my coffee shop writing session. Environment really matters for creativity.", "creative_project": "short story", "word_count": 2000, "breakthrough_location": "coffee shop", "realization": "environment affects creativity"}',
        'journal'
    ),
    (
        'Workout Routine Evolution',
        '{"date": "2025-07-29", "mood": "determined", "content": "Switching from cardio-focused to strength training is showing results. Added 10 pounds to my bench press this month. The consistency is key - haven''t missed a workout in 3 weeks. Feeling stronger both physically and mentally.", "fitness_focus": "strength training", "achievement": "10 pounds bench press increase", "streak": "3 weeks consistent", "mental_impact": "increased confidence"}',
        'journal'
    ),
    (
        'Life Balance Assessment',
        '{"date": "2025-07-28", "mood": "reflective", "content": "Taking stock of how I''m spending my time. Work is fulfilling but consuming 60+ hours weekly. Social life has taken a backseat. Need to set better boundaries and schedule friend time like I schedule meetings. Life is more than career achievements.", "concern": "work-life balance", "issue": "60+ hour work weeks", "neglected_area": "social relationships", "action_needed": "better boundaries", "perspective": "life beyond career"}',
        'journal'
    );

-- Bookmarks notes (5 entries)
INSERT INTO
    notes (title, data, type)
VALUES (
        'Programming Learning Resources',
        '{"bookmarks": [{"title": "Free Code Camp", "url": "https://freecodecamp.org", "category": "tutorials", "description": "Free coding bootcamp with certificates"}, {"title": "LeetCode", "url": "https://leetcode.com", "category": "practice", "description": "Algorithm and data structure problems"}, {"title": "MDN Web Docs", "url": "https://developer.mozilla.org", "category": "reference", "description": "Comprehensive web development documentation"}], "total_count": 25, "last_updated": "2025-08-07"}',
        'bookmarks'
    ),
    (
        'Design Inspiration Collection',
        '{"bookmarks": [{"title": "Dribbble", "url": "https://dribbble.com", "category": "inspiration", "description": "Design portfolio platform"}, {"title": "Behance", "url": "https://behance.net", "category": "inspiration", "description": "Creative portfolio showcase"}, {"title": "Material Design", "url": "https://material.io", "category": "guidelines", "description": "Google''s design system"}], "focus": "UI/UX design", "tags": ["design", "inspiration", "portfolio"]}',
        'bookmarks'
    ),
    (
        'Productivity and Self-Improvement',
        '{"bookmarks": [{"title": "Notion", "url": "https://notion.so", "category": "productivity", "description": "All-in-one workspace for notes and planning"}, {"title": "Todoist", "url": "https://todoist.com", "category": "task management", "description": "Advanced task and project management"}, {"title": "Headspace", "url": "https://headspace.com", "category": "wellness", "description": "Meditation and mindfulness app"}], "purpose": "personal development", "priority": "high"}',
        'bookmarks'
    ),
    (
        'Financial and Investment Resources',
        '{"bookmarks": [{"title": "Mint", "url": "https://mint.com", "category": "budgeting", "description": "Personal finance management tool"}, {"title": "Vanguard", "url": "https://vanguard.com", "category": "investing", "description": "Low-cost index fund investing"}, {"title": "YNAB", "url": "https://youneedabudget.com", "category": "budgeting", "description": "Zero-based budgeting methodology"}], "financial_goal": "early retirement", "review_frequency": "monthly"}',
        'bookmarks'
    ),
    (
        'Travel Planning Resources',
        '{"bookmarks": [{"title": "Skyscanner", "url": "https://skyscanner.com", "category": "flights", "description": "Flight comparison and booking"}, {"title": "Booking.com", "url": "https://booking.com", "category": "accommodation", "description": "Hotel and apartment reservations"}, {"title": "TripAdvisor", "url": "https://tripadvisor.com", "category": "reviews", "description": "Travel reviews and recommendations"}], "upcoming_trip": "Europe 2025", "budget_tools": ["Skyscanner price alerts", "Booking.com deals"]}',
        'bookmarks'
    );