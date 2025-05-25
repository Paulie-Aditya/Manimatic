# Manimatic

Transform your ideas into stunning animations with AI.

## Overview

Manimatic is a Next.js application that allows users to generate animations from text descriptions using AI. Simply describe what you want to see, and Manimatic will create an animation for you.

## Features

- **Text-to-Animation**: Convert text descriptions into animated content
- **Real-time Generation**: See your animations as they're created
- **Multiple Formats**: Support for videos, GIFs, and images
- **Responsive Design**: Works on desktop and mobile devices
- **Clean Interface**: Simple, intuitive chat-based interface

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend animation generation service

### Installation

1. Clone the repository:
\`\`\`bash
git clone <repository-url>
cd manimatic
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Set up environment variables:
\`\`\`bash
cp .env.local.example .env.local
\`\`\`

Add your backend URL:
\`\`\`
NEXT_PUBLIC_BACKEND_URL=your_backend_url
\`\`\`

4. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. Enter a description of the animation you want to create
2. Click send or press Enter
3. Wait for your animation to be generated
4. View and interact with your animation in the chat interface

### Example Prompts

- "A butterfly flying through a magical forest"
- "A rocket launching into space with stars"
- "A character dancing in the rain"
- "A dragon soaring over mountains"

## Technology Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Icons**: Lucide React
- **Deployment**: Vercel (recommended)

## Project Structure

\`\`\`
manimatic/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── animation-message.tsx
│   └── chat.tsx
├── lib/                  # Utility functions and types
│   ├── types.ts
│   └── utils.ts
└── public/               # Static assets
\`\`\`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
