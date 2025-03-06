# RenoLoop

RenoLoop is a platform that connects property owners with renovation funding and future tenants in Marseille, France. The platform aims to transform deteriorating buildings into homes through a unique process, addressing the housing crisis while revitalizing urban spaces.

## 🏠 Project Overview

Marseille faces a significant housing challenge:
- 40,000+ deteriorating buildings in need of renovation
- 15,000+ families seeking affordable homes
- €140M available funding for renovations
- €35,000 average renovation support per property

RenoLoop bridges this gap by providing a comprehensive platform that:
1. Helps property owners register their deteriorated buildings
2. Connects them with renovation funding and grants
3. Manages the renovation process
4. Links property owners with pre-screened tenants

## ✨ Key Features

### For Property Owners
- Property registration and management
- Renovation funding application process
- Application management from potential tenants
- Renovation progress tracking
- Environmental impact statistics

### For Tenants
- Browse available properties
- Search for apartments based on preferences
- Submit housing applications
- Track application status

### For Administrators
- Manage all properties and applications
- User management
- Generate reports and analytics
- System-wide oversight

### Platform Features
- Role-based access control (Property Owner, Tenant, Administrator)
- Interactive property maps using Google Maps API
- AI-powered chatbot assistant for user support
- Real-time notifications
- Environmental impact tracking
- Responsive design for all devices

## 🛠️ Technology Stack

- **Frontend**: React with TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **State Management**: Zustand
- **Routing**: React Router
- **Backend**: Supabase (Authentication, Database, Storage)
- **Maps Integration**: Google Maps API
- **AI Assistant**: OpenRouter API with Google's Gemini model
- **Icons**: Lucide React

## 📋 Data Model

The application is built around these core entities:

- **Profiles**: User accounts with roles (property-owner, tenant, administrator)
- **Properties**: Buildings with details like address, status, and renovation needs
- **Applications**: Tenant applications for properties
- **Notifications**: System notifications for users

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Supabase account
- Google Maps API key
- OpenRouter API key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/renoloop.git
   cd renoloop
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```

4. Fill in your actual API keys and configuration values in the `.env` file:
   ```
   # Supabase Configuration
   VITE_SUPABASE_URL=your_supabase_url_here
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

   # Google Maps API
   VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

   # OpenRouter API
   VITE_OPENROUTER_API_KEY=your_openrouter_api_key_here
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open your browser and navigate to `http://localhost:5173`

## 📊 Database Setup

The application requires a Supabase database with the following tables:

- `profiles`: User profiles with roles
- `properties`: Property listings with details
- `applications`: Housing applications
- `notifications`: System notifications

You can find the SQL setup script in `supabase-setup.sql`.

## 🔧 Development

### Available Scripts

- `npm run dev`: Start the development server
- `npm run build`: Build the application for production
- `npm run lint`: Run ESLint to check for code issues
- `npm run preview`: Preview the production build locally

### Project Structure

- `/src`: Source code
  - `/assets`: Static assets like images
  - `/components`: Reusable UI components
    - `/ui`: Basic UI components (Button, Input, Card, etc.)
  - `/lib`: Library code (Supabase client, etc.)
  - `/pages`: Page components
  - `/services`: Service layer for API interactions
  - `/store`: State management with Zustand

## 🌍 Environmental Impact

RenoLoop tracks and displays the environmental impact of renovations, including:
- CO₂ emissions reduction
- Energy efficiency improvements
- Waste reduction metrics

This aligns with sustainable development goals and provides tangible metrics on the positive impact of building renovations.

## 🔒 Authentication and Security

The application uses Supabase for authentication with:
- Email/password authentication
- Role-based access control
- Protected routes for authenticated users
- Secure API calls with session management

## 📱 Responsive Design

RenoLoop is designed to work seamlessly across:
- Desktop computers
- Tablets
- Mobile devices

The UI adapts to different screen sizes while maintaining functionality and user experience.

## 🚀 Deployment

To deploy the application to production:

1. Build the application:
   ```bash
   npm run build
   ```

2. Deploy the contents of the `dist` directory to your hosting provider of choice (Vercel, Netlify, etc.)

3. Ensure your environment variables are properly set in your hosting environment.

## 📄 License

[MIT License](LICENSE)

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
