# FormCraft

A modern, drag-and-drop form builder application built with React, TypeScript, and Express.

## Features

- **Intuitive Form Builder**: Create forms using a drag-and-drop interface
- **Multiple Field Types**: Support for text, email, textarea, select, radio, and checkbox fields
- **Real-time Preview**: See your form as you build it
- **Form Management**: Create, edit, delete, and organize your forms
- **Response Collection**: Collect and view form submissions
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Data Storage**: Supports both MongoDB and local file storage

## Tech Stack

- **Frontend**: React 18, TypeScript, React Router 6, TailwindCSS
- **Backend**: Express.js, Node.js
- **Database**: MongoDB (with fallback to local storage)
- **Build Tool**: Vite
- **UI Components**: Radix UI primitives

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd formcraft
```

2. Install dependencies:

```bash
npm install
```

3. (Optional) Set up MongoDB:

```bash
# Create .env file
echo "MONGODB_URI=your_mongodb_connection_string" > .env
```

4. Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:8080`

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run test` - Run tests
- `npm run typecheck` - Run TypeScript checks

## Project Structure

```
├── client/                 # React frontend
│   ├── components/ui/      # Reusable UI components
│   ├── pages/             # Page components
│   ├── lib/               # Utilities
│   └── App.tsx            # Main app component
├── server/                # Express backend
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   └── storage/           # Fallback storage
├── shared/                # Shared TypeScript types
└── public/                # Static assets
```

## Features Overview

### Form Builder

- Drag and drop interface for adding form fields
- Configure field properties (label, placeholder, required, etc.)
- Support for multiple field types
- Real-time form preview

### Form Management

- View all created forms
- Edit existing forms
- Delete forms
- Form metadata (title, description, creation date)

### Response Collection

- Collect form submissions
- View submission data
- Export capabilities (planned)

## Storage Options

FormCraft supports two storage methods:

1. **MongoDB**: Production-ready database storage
2. **Local Storage**: File-based storage for development (automatic fallback)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License - see LICENSE file for details
