# ⚡ Electricity Record - Smart Meter Management System

A modern Progressive Web App (PWA) for managing electricity meter readings and bills with a beautiful, responsive interface.

![Electricity Record App](https://img.shields.io/badge/PWA-Ready-brightgreen) ![React](https://img.shields.io/badge/React-18.0-blue) ![Node.js](https://img.shields.io/badge/Node.js-16.0-green) ![MongoDB](https://img.shields.io/badge/MongoDB-5.0-orange)

## 🚀 Features

### 📱 Progressive Web App (PWA)

- **Install to Home Screen**: Users can install the app directly to their device
- **Offline Support**: Basic offline functionality with service worker
- **Push Notifications**: Ready for bill update notifications
- **Responsive Design**: Works perfectly on mobile, tablet, and desktop

### 🔐 User Management

- **Secure Authentication**: JWT-based login/registration system
- **Role-based Access**: Separate interfaces for users and administrators
- **Profile Management**: User profiles with meter information

### 📊 Meter Reading Management

- **Add Readings**: Easy meter reading entry with validation
- **View History**: Complete reading history with charts
- **Bill Calculation**: Automatic bill calculation based on readings
- **Data Export**: Export reading data for record keeping

### 👨‍💼 Admin Dashboard

- **User Management**: View and manage all registered users
- **Reading Overview**: Monitor all meter readings across users
- **System Analytics**: Dashboard with key metrics and insights

## 🛠️ Technology Stack

### Frontend

- **React 18** - Modern UI framework
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **CSS3** - Custom styling with animations
- **PWA** - Service worker, manifest, and install prompts

### Backend

- **Node.js** - Server runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing

## 📦 Installation

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud)
- Git

### Setup Instructions

1. **Clone the repository**

   ```bash
   git clone https://github.com/Shubhamkumarpatel70/electriccityrecord.git
   cd electriccityrecord
   ```

2. **Install dependencies**

   ```bash
   # Install backend dependencies
   npm install

   # Install frontend dependencies
   cd client
   npm install
   cd ..
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory:

   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/electricity-records
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   ADMIN_EMAIL=admin@power.local
   ADMIN_PASSWORD=Admin@1234
   ```

4. **Database Setup**

   ```bash
   # Start MongoDB (if running locally)
   mongod

   # Seed admin user
   npm run seed
   ```

5. **Start the Application**

   ```bash
   # Start both servers (recommended)
   npm run dev

   # Or start individually:
   # Backend: npm run server
   # Frontend: cd client && npm start
   ```

## 🌐 Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

### Default Admin Credentials

- **Email**: `admin@power.local`
- **Password**: `Admin@1234`

## 📱 PWA Installation

### Desktop (Chrome/Edge)

1. Visit the application
2. Look for the install icon in the address bar
3. Click "Install" to add to desktop

### Mobile (Chrome/Edge)

1. Visit the application
2. Tap the menu (⋮) and select "Add to Home Screen"
3. Follow the prompts to install

### Automatic Install Prompt

The app will show a beautiful install popup when:

- The app meets PWA criteria
- User hasn't already installed it
- Browser supports PWA installation

## 🎨 UI Features

### Modern Design

- **Gradient Themes**: Beautiful purple-blue gradients
- **Smooth Animations**: CSS transitions and keyframe animations
- **Responsive Layout**: Adapts to all screen sizes
- **Dark Mode Ready**: Prepared for future dark theme implementation

### User Experience

- **Intuitive Navigation**: Easy-to-use interface
- **Real-time Feedback**: Loading states and success messages
- **Form Validation**: Client and server-side validation
- **Error Handling**: Graceful error messages and recovery

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start both frontend and backend
npm run server       # Start backend server only
npm run client       # Start frontend only
npm run build        # Build frontend for production
npm run seed         # Create admin user
```

### Project Structure

```
electriccityrecord/
├── client/                 # React frontend
│   ├── public/            # Static files (PWA assets)
│   │   ├── manifest.json  # PWA manifest
│   │   ├── sw.js         # Service worker
│   │   └── icon.svg      # App icon
│   └── src/
│       ├── components/   # React components
│       ├── pages/        # Page components
│       └── utils/        # Utility functions
├── routes/               # Express routes
├── models/              # MongoDB models
├── middleware/          # Express middleware
└── server.js           # Main server file
```

## 🚀 Deployment

### Heroku Deployment

1. Create a Heroku account
2. Install Heroku CLI
3. Run the following commands:
   ```bash
   heroku create your-app-name
   heroku config:set MONGODB_URI=your-mongodb-uri
   heroku config:set JWT_SECRET=your-jwt-secret
   git push heroku main
   ```

### Vercel Deployment (Frontend)

1. Connect your GitHub repository to Vercel
2. Set build command: `cd client && npm install && npm run build`
3. Set output directory: `client/build`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Shubham Kumar Patel**

- GitHub: [@Shubhamkumarpatel70](https://github.com/Shubhamkumarpatel70)

## 🙏 Acknowledgments

- React team for the amazing framework
- MongoDB for the robust database
- PWA community for progressive web app standards
- All contributors and users of this project

---

⭐ **Star this repository if you find it helpful!**
