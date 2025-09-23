# SmartSlot Customer Application

A modern, responsive React.js customer-facing application for the SmartSlot booking system. This application allows customers to view available dates, select time slots, and complete their bookings with a seamless user experience.

## 🚀 Features

- **Interactive Calendar View** - Monthly calendar with available/unavailable date indicators
- **Time Slot Selection** - 30-minute intervals organized by time periods (morning, afternoon, evening, night)
- **Smart Booking Form** - Real-time validation for customer details
- **Confirmation Flow** - Professional success modal with booking details
- **Responsive Design** - Mobile-first approach that works on all screen sizes
- **Real-time Updates** - Shows slot availability and prevents double booking

## 🛠️ Tech Stack

- **React 18+** - Modern React with hooks
- **Vite** - Fast build tool and development server
- **CSS3** - Custom CSS with Grid/Flexbox layouts
- **JavaScript ES6+** - Modern JavaScript features

## 📱 Component Architecture

```
src/
├── components/
│   ├── Calendar.jsx & Calendar.css          # Interactive monthly calendar
│   ├── TimeSlots.jsx & TimeSlots.css        # Time slot selection grid
│   ├── BookingForm.jsx & BookingForm.css    # Customer details form
│   └── ConfirmationModal.jsx & ConfirmationModal.css  # Success confirmation
├── hooks/
│   └── useBookingData.js                     # Custom hook for booking logic
├── utils/
│   └── dateUtils.js                          # Date manipulation utilities
├── App.jsx & App.css                         # Main application component
└── main.jsx                                  # Application entry point
```

## 🎨 Design Features

- **Professional UI** - Blue gradient design theme (#667eea to #764ba2)
- **Smooth Animations** - Fade-in effects and hover transitions
- **Visual Feedback** - Clear states for available/booked/selected slots
- **Accessibility** - ARIA labels and keyboard navigation support
- **Loading States** - Professional loading indicators during operations

## 📋 Booking Flow

1. **Date Selection** - Customer selects an available date from the calendar
2. **Time Selection** - Available 30-minute slots are displayed for the selected date
3. **Customer Details** - Form collects name, email, phone, and optional notes
4. **Confirmation** - Success modal shows booking details and next steps

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ and npm
- Modern web browser

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd SmartSlotCustomerSide
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:5173
   ```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📊 Mock Data Structure

The application uses mock data to simulate API responses:

```javascript
// Available dates (admin-configured)
const availableDates = new Set([
  '2025-09-25', '2025-09-26', '2025-09-30',
  '2025-10-01', '2025-10-05', '2025-10-10'
]);

// Booked slots structure
const bookedSlots = new Map([
  ['2025-09-25', new Map([
    ['14:00', { customer: 'John Doe', email: 'john@email.com' }],
    ['15:30', { customer: 'Jane Smith', email: 'jane@email.com' }]
  ])]
]);
```

## 📱 Responsive Breakpoints

- **Mobile**: < 768px (single column, stacked layout)
- **Tablet**: 768px - 1024px (adjusted spacing)
- **Desktop**: > 1024px (full layout with optimal spacing)

## 🔧 Configuration

### Time Slots
- **Interval**: 30 minutes
- **Range**: 12:00 AM to 11:30 PM (48 slots per day)
- **Display**: 12-hour format with AM/PM

### Calendar Navigation
- **Restriction**: Current month and future months only
- **Visual Indicators**: Available, booked, selected, and past date states

## 🎯 Key Features

### Calendar Component
- Monthly view with navigation controls
- Visual date states (available/unavailable/selected/past)
- Responsive grid layout
- Legend for date states

### Time Slots Component
- Organized by time periods (Morning, Afternoon, Evening, Night)
- Available slot count indicators
- Smooth selection animations
- Responsive grid layout

### Booking Form Component
- Real-time form validation
- Required field indicators
- Professional error messaging
- Booking summary display

### Confirmation Modal Component
- Success animation with checkmark
- Complete booking details
- Next steps guidance
- Contact information

## 🌟 Professional Features

- **Loading States** - Smooth loading indicators during operations
- **Error Handling** - Graceful error messages and fallbacks
- **Form Validation** - Real-time validation with helpful error messages
- **Accessibility** - Proper ARIA labels and keyboard navigation
- **SEO Ready** - Semantic HTML structure

## 📞 Support

For questions or support, contact:
- Email: support@smartslot.com
- Phone: (555) 123-4567

## 📄 License

This project is licensed under the MIT License.

---

*Built with ❤️ using React.js and Vite*+ Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
