# Manimatic

Manimatic is a web application that generates mathematical animations using natural language prompts. It leverages Gemini AI to transform text descriptions into Manim code which is then rendered into animations.

## Features

- **AI-Powered Animation Generation**: Convert natural language to mathematical animations
- **Persistent Chat Interface**: Keep track of your animation history and build upon previous prompts
- **Clean UI/UX**: Simple, intuitive interface focused on user experience

## Tech Stack

### Backend

- **Python Flask**: API endpoints and server functionality
- **Gemini API**: Natural language processing and code generation
- **Manim**: Mathematical animation engine
- **MongoDB**: Storing chat histories and user data
- **Cloudinary**: Object storage for rendered animations

### Frontend

- **Next.js**: React framework for building the user interface
- **TailwindCSS**: Utility-first CSS framework
- **Shadcn UI**: Component library for a consistent design system

## System Architecture

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│             │      │             │      │             │
│  Frontend   │─────▶│   Backend   │─────▶│   Gemini    │
│  (Next.js)  │      │   (Flask)   │      │     API     │
│             │      │             │      │             │
└─────────────┘      └─────────────┘      └─────────────┘
                            │                    │
                            ▼                    │
                     ┌─────────────┐             │
                     │             │             │
                     │   MongoDB   │             │
                     │             │             │
                     └─────────────┘             │
                            ▲                    │
                            │                    │
                     ┌─────────────┐             │
                     │             │             │
                     │    Manim    │◀────────────┘
                     │             │
                     └─────────────┘
                            │
                            ▼
                     ┌─────────────┐
                     │             │
                     │ Cloudinary  │
                     │             │
                     └─────────────┘
```

## Flow

### Backend Flow

1. Frontend makes API request with user prompt
2. Backend validates user authentication and permission limits
3. Prompt undergoes safety checks via Gemini
4. Gemini processes valid prompt and generates Manim code
5. Backend executes Manim code to produce MP4 animation
6. Animation is uploaded to Cloudinary
7. URL is returned to frontend for display
8. Chat history is stored in MongoDB for context preservation

### Frontend Flow

1. User navigates to homepage with project overview
2. User logs in/signs up (or uses demo credentials)
3. User enters prompts in chat interface
4. Rendered animations are displayed in the chat
5. Chat history persists for continued interaction

## Development Setup

### Prerequisites

- Python 3.8+
- Node.js 14+
- MongoDB
- Cloudinary account
- Gemini API key
- FFmpeg

### Backend Setup

```bash
# Clone the repository
git clone https://github.com/Paulie-Aditya/Manimatic.git
cd Manimatic/backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set environment variables
export FLASK_APP=app.py
export FLASK_ENV=development
export GEMINI_API_KEY=your_api_key
export MONGODB_URI=your_mongodb_uri
export CLOUDINARY_URL=your_cloudinary_url

# Run the server
flask run
```

### Frontend Setup

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install

# Set environment variables
# Create a .env.local file with:
NEXT_PUBLIC_API_URL=http://localhost:5000

# Run the development server
npm run dev
```

## Todo / Future Work

- [ ] Implement comprehensive safety checks for user prompts
- [ ] Add user plan management with different tiers
- [ ] Optimize Manim code execution for faster rendering
- [ ] Implement admin dashboard for monitoring
- [ ] Add more examples and templates for common animations

## Safety Considerations

Currently, the project has basic safety implementations, but a more robust system is needed to ensure:

1. User prompts don't contain malicious content
2. Generated Manim code is safe to execute on the server
3. Resource utilization is properly managed to prevent abuse

⚠️ **Important**: For production deployment, additional security measures must be implemented to prevent code execution vulnerabilities.

## License

[MIT](LICENSE)

## Contributors

- [Aditya Paul](https://github.com/Paulie-Aditya)
