# NextBeat Frontend

## Overview

The frontend of NextBeat is built using React, providing an interactive and dynamic user interface for managing and purchasing beats. This section of the application communicates with the backend through REST APIs, ensuring seamless data flow and user experience.

## Features

**Dynamic Beat Listing**:

- **Messaging Features**:
  - Implementaion of a messaging dashboaord allowing clients to interact.

**User Relationship Features**:

- users are able to follow each other.

- Displays a list of beats fetched from the backend.
- Supports filtering and sorting of beats for an improved user experience.
- **Cart Management**:
  - Add beats to a cart and view selected items.
- **Producer Dashboard**:
  -- Allows producers to manage their beats (upload and update) and order management.
- **Client Dashboard**:

  - Allows users to view , purchase and search for beats .

- **Payment and Checkout**:
  - Payment and checkout functionalities are in progress for processing purchases.
- **React Redux Integration**:
  - Utilizes Redux with the `createSlice` function for state management and efficient data handling across the application.
  - **UseAuth**:
  - Enable users to sign up as client and producer using jwt tokens.
    **Uploading beats**:

-The user producer is able to upload beats to the platform

## Completed Features

- **UseAuth**:
- Enable users to login as client and producer using jwt tokens.

**Dynamic Beat Listing**:

- Displays a list of beats fetched from the backend.
- Supports filtering and sorting for an improved user experience.

- **Client Dashboard**:

- Allows users to view , purchase and search for beats .

- **Cart Management**:
  - Add beats to a cart and view selected items.

**Uploading beats**:

-The user producer is able to upload beats to the platform

## Dependencies

The project uses the following npm packages:

- `@reduxjs/toolkit` ^2.3.0
- `axios` ^1.7.7
- `react` ^18.3.1
- `react-dom` ^18.3.1
- `react-redux` ^9.1.2
- `react-router-dom` ^6.28.0
- `redux` ^5.0.1
- `redux-thunk` ^3.1.0
- `tailwindcss`
- `vite`

## File Structure

```
frontend
├── README.md             # Project documentation
├── eslint.config.js      # ESLint configuration
├── index.html            # Main HTML file
├── node_modules          # Node.js modules
├── package-lock.json     # Dependency lock file
├── package.json          # Project dependencies and scripts
├── postcss.config.js     # PostCSS configuration
├── public                # Static assets
├── src                   # Source code
│   ├── App.css           # Application styles
│   ├── App.jsx           # Root application component
│   ├── assets            # Static assets (e.g., images, icons)
│   ├── components        # Reusable components
│   │   ├── AllBeatsPage  # Page to display all beats
│   │   ├── BeatCard      # Individual beat card component
│   │   ├── BeatDetails   # Detailed view of a specific beat
│   │   ├── Cart          # Cart functionality component
│   │   ├── CategoryBeats # List of beats in a category
│   │   ├── CategoryList  # List of categories
│   │   ├── CategoryPage  # Category-specific page
│   │   ├── LandingPage   # Home page component
│   │   ├── NavBar        # Navigation bar component
│   │   └── SearchResults # Display search results
│   ├── index.css         # Global styles
│   ├── main.jsx          # Entry point
│   └── store             # Redux store configuration
├── tailwind.config.js    # Tailwind CSS configuration
└── vite.config.js        # Vite configuration
```

## Getting Started

### Prerequisites

- Node.js (v18.x or later)
- npm

### Installation

1. Install dependencies:

   ```bash
   npm install

   ```

2. Configure Tailwind CSS:
   Ensure the `tailwind.config.js` and `postcss.config.js` are properly set up, and include the required paths for Tailwind to process.

3. Start the development server using Vite:

   ```bash
   npm run dev

   ```

4. Access the application at `http://localhost:8000/`.

## Contribution

Contributions are welcome! Fork the repository, create a new branch, and submit a pull request for review.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Contact

For questions or support, please contact jakatsa5@gmail.com
