# Anubhav AI - Gemini-Powered Chatbot

A modern, responsive AI chatbot built with Next.js 15, TypeScript, and Tailwind CSS, powered by Google's Gemini API with text-to-speech capabilities.

## ✨ Features

- 🤖 **AI-Powered**: Integrated with Google's Gemini API for intelligent responses
- 🎤 **Voice Input**: Speech-to-text functionality for hands-free interaction
- 🔊 **Text-to-Speech**: Browser-based audio output for AI responses
- 📱 **Mobile Responsive**: Optimized for all device sizes
- 🎨 **Modern UI**: Beautiful gradient design with smooth animations
- ⚡ **Real-time Chat**: Instant messaging with typing indicators
- 🌙 **Dark Mode**: Automatic dark/light theme support
- 🔧 **Modular Architecture**: Clean, maintainable component structure

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Google Gemini API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd anubhav-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   - Copy `.env.local` and add your Gemini API key:
   ```env
   GEMINI_API_KEY=your_actual_gemini_api_key_here
   ```
   - Get your API key from: https://makersuite.google.com/app/apikey

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
src/
├── app/
│   ├── api/chat/route.ts      # Gemini API integration
│   ├── globals.css            # Global styles
│   ├── layout.tsx             # Root layout
│   ├── page.tsx               # Main page
│   ├── loading.tsx            # Loading component
│   └── error.tsx              # Error boundary
├── components/
│   ├── ChatInterface.tsx      # Main chat container
│   └── chat/
│       ├── ChatHeader.tsx     # Header with branding
│       ├── ChatMessages.tsx   # Messages container
│       ├── MessageBubble.tsx  # Individual message
│       ├── ChatInput.tsx      # Input with voice support
│       └── TypingIndicator.tsx # Loading animation
└── types/
    └── chat.ts                # TypeScript interfaces
```

## 🎯 Key Components

### ChatInterface
Main container managing chat state and API communication.

### MessageBubble
Individual message component with text-to-speech functionality.

### ChatInput
Input component with voice recognition and send functionality.

### ChatHeader
Branded header with gradient text and icons.

## 🔧 Configuration

### Gemini API Settings
The API route (`src/app/api/chat/route.ts`) includes:
- Temperature: 0.7 (creativity level)
- Max tokens: 1024
- Safety settings for content filtering

### Text-to-Speech
Uses browser's built-in `speechSynthesis` API with:
- Rate: 0.9
- Pitch: 1.0
- Volume: 0.8

## 📱 Mobile Features

- Responsive design for all screen sizes
- Touch-optimized interface
- Mobile-friendly voice input
- Optimized message bubbles for small screens

## 🎨 Styling

- **Tailwind CSS 4** with custom theme
- **Gradient backgrounds** for visual appeal
- **Custom scrollbars** for better UX
- **Smooth animations** throughout
- **Dark mode support** with system preference detection

## 🚀 Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Connect to Vercel
3. Add `GEMINI_API_KEY` environment variable
4. Deploy

### Other Platforms
Ensure environment variables are set:
```env
GEMINI_API_KEY=your_gemini_api_key
```

## 🔒 Security

- API key stored securely in environment variables
- Content safety filters enabled
- Input validation and error handling
- No sensitive data in client-side code

## 🛠️ Development

### Available Scripts
- `npm run dev` - Development server
- `npm run build` - Production build
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Adding Features
The modular structure makes it easy to:
- Add new message types
- Implement user authentication
- Add file upload capabilities
- Integrate additional AI models

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
#   a n u b h a v - a i  
 #   a n u b h a v - a i  
 #   a n u b h a v - a i  
 