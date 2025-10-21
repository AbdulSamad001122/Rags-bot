# RAGs Bot Frontend

This is the frontend for the RAGs Bot application, built with React, Vite, and Tailwind CSS.

## Features

- Beautiful animated landing page as the main route (/)
- Responsive design that works on all device sizes
- Smooth animations using Framer Motion
- Integration with Clerk for authentication
- PDF processing workflow

## Main Routes

- `/` - Landing page (main entry point)
- `/createbot` - Create a new chatbot from a PDF
- `/showbots` - View all created chatbots
- `/chat/:botName` - Chat with a specific bot

## Technologies Used

- React 18
- Vite
- Tailwind CSS
- Framer Motion (for animations)
- Clerk (for authentication)
- React Router DOM (for routing)

## Development

To run the frontend locally:

```bash
npm install
npm run dev
```

The application will be available at http://localhost:5173

## Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.
