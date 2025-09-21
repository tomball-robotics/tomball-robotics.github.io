# Tomball Robotics Website

Welcome to the official website for Tomball Robotics, FRC Team 7312! This application serves as our public face, showcasing our team, robots, events, sponsors, and community initiatives. It's built to be easily maintainable and updatable through a dedicated Admin Panel.

## Table of Contents

1.  [About the Project](#about-the-project)
2.  [Features](#features)
3.  [Tech Stack](#tech-stack)
4.  [Getting Started](#getting-started)
    *   [Prerequisites](#prerequisites)
    *   [Installation](#installation)
    *   [Running Locally](#running-locally)
5.  [Admin Panel](#admin-panel)
6.  [Deployment](#deployment)
    *   [GitHub Pages Deployment](#github-pages-deployment)
7.  [Supabase Integration](#supabase-integration)
8.  [Project Structure](#project-structure)
9.  [Contributing](#contributing)
10. [License](#license)

## About the Project

This website is designed to be a dynamic platform for Tomball Robotics, FRC Team 7312. It provides information about our team's history, current season, achievements, and the various ways our community can support us. A key aspect of this project is its user-friendly Admin Panel, which allows non-technical team members to update content without needing to touch the code.

## Features

*   **Dynamic Content Management**: All major content sections (News, Events, Robots, Team Members, Sponsors, Website Settings) are managed via an Admin Panel.
*   **Responsive Design**: Optimized for various screen sizes, from mobile devices to large desktops.
*   **Sponsor Showcase**: Dedicated pages for displaying and managing sponsors and sponsorship tiers.
*   **Event Tracking**: Integrates with The Blue Alliance (TBA) to automatically sync competition data and awards.
*   **Team & Robot Profiles**: Detailed sections for team members and our past robots.
*   **News & Updates**: A blog-like section for sharing team news and announcements.
*   **Unitybots Initiatives**: Highlights our community outreach and educational programs.
*   **Authentication**: Secure admin login using Supabase Auth.

## Tech Stack

*   **Frontend**: React (with TypeScript)
*   **Styling**: Tailwind CSS
*   **UI Components**: shadcn/ui (built on Radix UI)
*   **Routing**: React Router DOM
*   **State Management**: React Query (for data fetching and caching)
*   **Form Management**: React Hook Form with Zod for validation
*   **Animations**: Framer Motion
*   **Backend/Database/Auth**: Supabase
*   **Deployment**: GitHub Pages

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Before you begin, ensure you have the following installed:

*   **Node.js**: Version 18 or higher. You can download it from [nodejs.org](https://nodejs.org/).
*   **npm**: Node Package Manager, which comes with Node.js.
*   **Git**: For cloning the repository.

### Installation

1.  **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd tomball-robotics-website
    ```
    (Replace `<repository-url>` with the actual URL of your GitHub repository.)

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Set up Environment Variables**:
    Create a `.env.local` file in the root of your project and add the following:
    ```
    VITE_TBA_AUTH_KEY="YOUR_THE_BLUE_ALLIANCE_API_KEY"
    ```
    *   You can obtain a TBA API key by creating an account on [The Blue Alliance](https://www.thebluealliance.com/account) and generating a new API key. This key is required for syncing event data.

### Running Locally

To run the development server:

```bash
npm run dev
```

This will start the application, usually accessible at `http://localhost:8080`. The app will automatically reload if you make any changes to the source code.

## Admin Panel

The website features a comprehensive Admin Panel for content management.

*   **Access**: Navigate to `/login` on your local or deployed site.
*   **Credentials**: Use the administrator credentials configured in your Supabase project.
*   **Documentation**: A detailed "Help & Docs" section is available directly within the Admin Panel to guide you through updating various parts of the website.

## Deployment

This project is configured for deployment to GitHub Pages using the `gh-pages` package.

### GitHub Pages Deployment

To deploy the application to GitHub Pages:

1.  **Ensure your `package.json` has the `homepage` field**:
    This should point to your GitHub Pages URL. For example:
    ```json
    "homepage": "https://<YOUR_GITHUB_USERNAME>.github.io/<YOUR_REPO_NAME>/",
    ```
    (If you are deploying to a project page, replace `<YOUR_GITHUB_USERNAME>` and `<YOUR_REPO_NAME>` with your actual GitHub username and repository name. If deploying to a user/organization page, it would be `https://<YOUR_GITHUB_USERNAME>.github.io/`.)

2.  **Run the deploy script**:
    ```bash
    npm run deploy
    ```
    This command performs two main actions:
    *   `npm run build`: Compiles the React application into static files in the `dist` directory.
    *   `gh-pages -d dist`: Pushes the contents of the `dist` directory to the `gh-pages` branch of your GitHub repository.

3.  **Verify Deployment**:
    After the command completes, it might take a few minutes for GitHub Pages to update. You can then visit your `homepage` URL to see the live application.

## Supabase Integration

The application uses Supabase for:

*   **Authentication**: User login for the Admin Panel.
*   **Database**: Storing all dynamic content (events, sponsors, news, etc.).
*   **Storage**: Hosting uploaded images (e.g., robot photos, sponsor logos).

The Supabase client is initialized in `src/integrations/supabase/client.ts`.

## Project Structure

```
.
├── public/                 # Static assets (images, favicon)
├── src/
│   ├── assets/             # Static assets specific to components (e.g., banner CSS)
│   ├── components/         # Reusable React components
│   │   ├── admin/          # Components specifically for the Admin Panel forms/tables
│   │   └── ui/             # shadcn/ui components
│   ├── hooks/              # Custom React hooks
│   ├── integrations/       # External service integrations (Supabase, TBA)
│   ├── lib/                # Utility functions (e.g., `cn` for Tailwind class merging)
│   ├── pages/              # Main application pages
│   │   └── admin/          # Admin Panel specific pages/sections
│   ├── types/              # TypeScript type definitions for Supabase data models
│   ├── App.tsx             # Main application component, defines routes
│   ├── globals.css         # Global Tailwind CSS styles
│   └── main.tsx            # Entry point for the React application
├── .env.local              # Environment variables (ignored by Git)
├── package.json            # Project dependencies and scripts
├── postcss.config.js       # PostCSS configuration for Tailwind CSS
├── tailwind.config.ts      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
└── vite.config.ts          # Vite build tool configuration
```

## Contributing

We welcome contributions to improve the Tomball Robotics website! If you'd like to contribute:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/your-feature-name`).
3.  Make your changes.
4.  Commit your changes (`git commit -m 'Add new feature'`).
5.  Push to the branch (`git push origin feature/your-feature-name`).
6.  Open a Pull Request.

Please ensure your code adheres to the existing style and conventions.

## License

This project is licensed under the MIT License.