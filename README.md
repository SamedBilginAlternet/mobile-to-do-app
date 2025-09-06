

# To-Do App

## Overview
This project is a modern To-Do application. Users can create projects, add tasks to each project, and track the completion status of tasks. The app works on both mobile and web, with a user-friendly and stylish interface.

## Main Features
- User registration, login, and logout (Supabase Auth)
- Create, list, and delete projects
- Add, complete, and delete tasks for each project
- Profile screen and user info
- Modern and responsive design
- Easy navigation with Expo Router

## Usage Scenario
1. The user registers or logs in to the app.
2. After logging in, the user sees their own projects in the "Projects" tab.
3. The user can create a new project or view details by clicking on an existing project.
4. In the project detail, the user can add, complete, or delete tasks.
5. The user can view their info and log out in the Profile tab.

## Technical Details
- **Frontend:** React Native (Expo), TypeScript
- **Backend:** Supabase (database and authentication)
- **Navigation:** Expo Router
- **Design:** Custom UI components, modern colors and fonts

## Why This Project?
- Provides a real product experience, allowing users to easily manage their projects and tasks.
- Works seamlessly on mobile and web.
- Fast backend integration and secure authentication with Supabase.
- Code structure and file organization follow professional developer standards.

## Screens
- **Login/Register:** User authentication
- **Projects:** Project list, add new project
- **Project Detail:** Add, complete, delete tasks
- **Profile:** User info, logout

## Setup
1. Clone the repository and enter the directory.
2. Install dependencies with `npm install`.
3. Create a project in Supabase and add the required tables.
4. Start the app with `npx expo start`.

## Supabase Table Structure
- **projects:** id, title, description, user_id, created_at
- **tasks:** id, title, completed, project_id, created_at

## Contributing
All kinds of contributions and suggestions are welcome. You can send a pull request or open an issue.

---
This app is designed to provide a modern to-do list experience. Both code quality and user experience are prioritized.
