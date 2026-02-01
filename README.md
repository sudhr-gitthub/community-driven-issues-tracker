
# Community Driven Issues Tracker 🏙️

A robust civic engagement platform enabling citizens to report local issues (like potholes, garbage, broken streetlights) with location tagging and AI-powered verification.

![CivicTracker Banner](https://via.placeholder.com/1200x300?text=Community+Driven+Issues+Tracker)

## 🌟 Key Features

- **📍 Geo-Tagging:** Pinpoint exact issue locations using an interactive map (Google Maps integration).
- **🤖 AI Verification:** Automatically detects if uploaded images/videos are real civic issues or fake/spam using **Google Gemini AI**.
- **🔐 Secure Authentication:** User accounts via Email, Username, or Phone Number with secure JWT, enabling issue ownership and management.
- **📸 Media Uploads:** Users can upload images and videos as evidence.
- **📊 Status Tracking:** Track the progress of reported issues (Reported, In Progress, Resolved).
- **📱 Responsive Design:** Built with React and Tailwind CSS for a seamless mobile and desktop experience.

## 🛠️ Tech Stack

### Frontend

- **React (Vite):** Fast, modern UI.
- **Tailwind CSS:** Responsive styling.
- **@react-google-maps/api:** Maps integration.
- **Axios:** API communication.

### Backend

- **Node.js & Express:** Scalable REST API.
- **Prisma ORM:** Database management.
- **PostgreSQL:** Relational database with **PostGIS** for location data.
- **Google Gemini API:** AI content analysis.
- **Supabase:** File storage (for evidence).

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- PostgreSQL (with PostGIS extension enabled)
- Google Maps API Key
- Google Gemini API Key
- Supabase Account (for bucket storage)

### 1. Clone the Repository

```bash
git clone https://github.com/sudhr-gitthub/community-driven-issues-tracker.git
cd community-driven-issues-tracker
```

### 2. Backend Setup

Navigate to the backend folder and install dependencies:

```bash
cd backend
npm install
```

Create a `.env` file in `backend/` and configure:

```env
PORT=3000
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?schema=public"
JWT_SECRET="your_super_secret_key"
GEMINI_API_KEY="your_google_gemini_key"
SUPABASE_URL="your_supabase_url"
SUPABASE_SERVICE_KEY="your_supabase_service_role_key"
```

Initialize the database:

```bash
npx prisma generate
npx prisma db push
```

Start the server:

```bash
npm run dev
```

### 3. Frontend Setup

Open a new terminal, navigate to the frontend folder:

```bash
cd frontend
npm install
```

Create a `.env` file in `frontend/` and configure:

```env
VITE_GOOGLE_MAPS_API_KEY="your_google_maps_api_key"
```

Start the application:

```bash
npm run dev
```

Visit `http://localhost:5173` to browse the app!

## 🧪 Deployment

### Frontend (GitHub Pages)

The frontend can be deployed to GitHub Pages (static hosting).

- Ensure `vite.config.ts` has the correct `base` path.
- Run `npm run deploy` from the `frontend` directory.

### Backend (Render/Railway)

The backend must be deployed to a Node.js hosting service like Render, Railway, or Heroku.

- Add your environment variables to the hosting dashboard.
- Ensure the database URL is accessible from the cloud.

## 🤝 Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

## 📄 License

This project is licensed under the MIT License.
=======
# Community-Driven Issues Tracker

A lightweight, community-first issue tracker designed to help open-source projects collect, prioritize, and organize contributions and feature requests from users and contributors.

Table of contents
- About
- Features
- How it works
- Quick start
  - Requirements
  - Local setup
- Usage
- Contributing
  - Reporting issues
  - Feature requests
  - Pull requests
- Roadmap
- License
- Contact

## About

This repository provides tooling, templates, and guidance for running a community-driven issues program. It's intended for maintainers who want to make it easier for contributors and users to propose, discuss, and track issues and feature requests.

## Features

- Issue templates for bugs, feature requests, and ideas
- Labels and workflows to triage and prioritize submissions
- Contribution guidelines and code of conduct
- Simple automation examples (GitHub Actions) for labeling and triage
- Examples of community voting and prioritization workflows

## How it works

1. Contributors open issues using the provided templates.
2. Maintainers and community members triage, label, and discuss.
3. Issues can be upvoted, linked, or converted into roadmap items or milestones.
4. Maintainers close, assign, or convert issues into pull requests as work progresses.

## Quick start

### Requirements
- Git
- Node.js >= 14 (only if running example automation scripts)
- A GitHub repository where you have maintainer access

### Local setup

1. Clone the repository:

   ```bash
   git clone https://github.com/sudhr-gitthub/community-driven-issues-tracker.git
   cd community-driven-issues-tracker
   ```

2. Review the .github/ISSUE_TEMPLATE and .github/ workflows if present.
3. Optionally install dependencies for example scripts:

   ```bash
   npm install
   ```

## Usage

- Open a new issue using one of the templates in .github/ISSUE_TEMPLATE.
- Use labels to categorize (bug, enhancement, discussion, good first issue).
- Use reactions (thumbs up) or a dedicated voting label to prioritize community requests.
- Maintain a roadmap.md (or use Projects) to track planned work.

## Contributing

We welcome contributions from everyone. Please follow these steps:

1. Read the CODE_OF_CONDUCT.md and CONTRIBUTING.md (if present).
2. Search existing issues before opening a new one.
3. When filing an issue, pick the most appropriate template and provide reproducible steps or a clear proposal for features.
4. For code changes, open a pull request with tests and a descriptive title.

### Reporting issues

Use the Bug Report template for reproducible crashes or incorrect behavior. Include environment, steps to reproduce, and expected vs actual results.

### Feature requests

Use the Feature Request template to explain the problem, proposed solution, and potential alternatives. Include examples or mockups if available.

### Pull requests

- Follow the repository's code style.
- Include tests for new behavior where applicable.
- Ensure CI passes before requesting review.

## Roadmap

This project focuses on providing maintainers with a solid starting point. Typical roadmap items:
- More automation for triage and labeling
- Templates for governance and decision logs
- Integration examples with Project boards and milestone automation

## License

This project is licensed under the MIT License. See LICENSE for details.

## Acknowledgements

Thanks to the open-source community for feedback and contributions.

## Contact

For questions, open an issue or contact the maintainer: https://github.com/sudhr-gitthub
