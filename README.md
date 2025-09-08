# 🎮 GameDen Membership System

A comprehensive membership management system for GameDen gaming center, featuring play session tracking, loyalty program, and advanced member management capabilities.

![GameDen](https://img.shields.io/badge/GameDen-Membership%20System-blue)
![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-3178C6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-5.4.2-646CFF?logo=vite)
![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?logo=supabase)

## ✨ Features

### 🏠 **Landing Page**
- Modern gaming-themed UI with glassmorphism effects
- Gaming station showcase (PS4, PS4 Pro)
- Responsive design with mobile navigation
- Enhanced animations and visual effects

### 👥 **Member Management**
- **Add Members:** Create new gaming memberships with OTP verification
- **Edit Members:** Update member information and validity periods
- **Delete Members:** Remove members with confirmation dialog
- **Search & Filter:** Find members by name, card number, phone, or email
- **Excel Export:** Download all member details in formatted Excel file

### 🎯 **Play Session Tracking**
- Record gaming sessions for members
- Automatic loyalty program (every 6th play is free)
- Play history viewing with detailed session logs
- Free play tracking and validation

### 🔐 **Admin Authentication**
- Secure admin login system
- Protected routes for member management
- Session management with Zustand

### 📊 **Reporting & Export**
- **Excel Export Feature:** Export all member data to Excel format
- Member statistics and play counts
- Validity tracking with expiration alerts
- Comprehensive member reports

## 🛠️ Technologies Used

- **Frontend:** React 18 with TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS with custom gaming theme
- **State Management:** Zustand
- **Routing:** React Router DOM
- **Backend:** Supabase (Database & Authentication)
- **Notifications:** React Hot Toast
- **Excel Export:** XLSX library
- **Icons:** Lucide React

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/[YOUR_USERNAME]/gamedenmem.git
   cd gamedenmem
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Database Setup**
   Run the Supabase migrations in the `supabase/migrations` folder

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Build for production**
   ```bash
   npm run build
   ```

## 📱 Usage

### For Admins:
1. **Login:** Access admin panel with credentials
2. **Manage Members:** Add, edit, delete gaming memberships
3. **Track Sessions:** Record play sessions and manage loyalty program
4. **Export Data:** Download member reports in Excel format
5. **Monitor Validity:** Track membership expiration dates

### For Customers:
1. **Book Sessions:** Online booking through integrated booking system
2. **View Information:** Check gaming station details and pricing
3. **Contact:** Easy access to contact information and location

## 🎮 Gaming Features

- **PlayStation 4:** Standard gaming at ₹50/hour
- **PlayStation 4 Pro:** Enhanced 4K gaming at ₹80/hour
- **Loyalty Program:** Every 6th play session is free
- **Flexible Booking:** Multiple time slots available daily
- **Premium Setup:** High-end consoles with 4K displays

## 📂 Project Structure

```
gamedenmem/
├── public/                 # Static assets
├── src/
│   ├── components/        # Reusable React components
│   ├── pages/            # Main page components
│   ├── context/          # React context providers
│   ├── store/            # Zustand state management
│   ├── types/            # TypeScript type definitions
│   └── index.css         # Global styles and animations
├── supabase/
│   └── migrations/       # Database migration files
└── package.json
```

## 🔧 Key Components

- **Home.tsx:** Landing page with gaming station showcase
- **ViewMembers.tsx:** Member management with Excel export
- **CreateMember.tsx:** New member registration with OTP
- **LoginModal.tsx:** Admin authentication
- **Navbar.tsx:** Navigation with logo and authentication

## 📈 Excel Export Features

- **Comprehensive Data:** All member details in one file
- **Formatted Output:** Professional Excel formatting
- **Auto-sizing:** Optimally sized columns
- **Date Formatting:** Human-readable date formats
- **Status Tracking:** Membership validity status
- **Play Analytics:** Session counts and free play calculations

## 🎨 Design Features

- **Gaming Theme:** Custom color schemes and gradients
- **Glassmorphism:** Modern glass-effect UI elements
- **Responsive Design:** Mobile-first approach
- **Animations:** Smooth transitions and hover effects
- **Gaming Fonts:** Orbitron and custom typography

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Contact

- **Gaming Center:** GameDen
- **Location:** Gobichettipalayam
- **Phone:** +91 93442 01886
- **Hours:** Monday - Sunday: 10:00 AM - 10:00 PM

---

**Built with ❤️ for the gaming community**