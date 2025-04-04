# FataPlus - Agricultural Marketplace Platform

FataPlus is a comprehensive agricultural marketplace platform designed to connect farmers, sellers, and buyers in Madagascar. The platform enables sustainable agriculture through technology, providing tools for trade, knowledge sharing, and community building.

## Project Structure

The project has been reorganized and cleaned up. The main application is now in the `fataplus-nextjs` directory, which contains a Next.js application deployed to Vercel.

## Core Functions

### 🌱 Marketplace
- **Product Listings**: Farmers can showcase and sell their agricultural products
- **Search & Filters**: Find products by category, location, price, and more
- **Order Management**: Track orders from placement to delivery
- **Payment Integration**: Secure payment processing with multiple options
- **Rating System**: Build trust through user reviews and ratings

### 👨‍🌾 Community
- **Discussion Forums**: Share knowledge and best practices
- **Real-time Updates**: Instant notifications for new posts and interactions
- **Q&A Platform**: Ask questions and get answers from experienced farmers
- **Marketplace Announcements**: Post buying/selling intentions

### 📚 Learning Resources
- **Farming Techniques**: Educational content on sustainable farming
- **Market Insights**: Data on pricing trends and demand
- **Weather Information**: Localized weather forecasts for farming decisions
- **Crop Calendars**: Seasonal planting and harvesting guides

### 📱 Progressive Web App
- **Offline Support**: Use core features without internet connection
- **Installable**: Add to home screen for app-like experience

## Technology Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: PocketBase with PostgreSQL
- **Authentication**: PocketBase Authentication
- **Deployment**: Vercel
- **CI/CD**: GitHub Actions

## Getting Started

1. Navigate to the `fataplus-nextjs` directory:
   ```bash
   cd fataplus-nextjs
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

The application is deployed to Vercel at [https://fataplus-2d91nt6op-fataplus.vercel.app](https://fataplus-2d91nt6op-fataplus.vercel.app).

## License

This project is licensed under the MIT License - see the LICENSE file for details.
