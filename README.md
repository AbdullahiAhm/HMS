# Hotel Management System (HMS)

A web-based Hotel Management System built as a final semester project for the Bachelor of Business Information Technology (BBIT) course.

## Author

**Zakaria Ahmed**

## Project Overview

This system provides a comprehensive solution for managing hotel operations including:

- **Dashboard** – Real-time overview of hotel KPIs, occupancy, and revenue
- **Room Management** – Add, edit, and track room status (available, occupied, reserved, cleaning, maintenance)
- **Booking Management** – Create and manage guest reservations, check-ins, and check-outs
- **Billing & Payments** – Generate bills, record payments via cash, card, or M-Pesa
- **Customer Management** – Maintain guest profiles with VIP tracking
- **Housekeeping** – Assign and track cleaning/maintenance tasks
- **Reports & Analytics** – Revenue trends, occupancy rates, and room distribution charts

## Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** – Build tool and dev server
- **Tailwind CSS** – Utility-first CSS framework
- **shadcn/ui** – Accessible component library (Radix UI primitives)
- **Recharts** – Data visualization / charts
- **React Router** – Client-side routing
- **Lucide React** – Icon library

### Project Structure

```
├── public/                  # Static assets
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/              # Base UI components (Button, Card, Dialog, etc.)
│   │   └── Layout.tsx       # Main application layout with sidebar
│   ├── data/
│   │   └── mockData.ts      # Sample data for development/demo
│   ├── pages/               # Route-level page components
│   │   ├── Dashboard.tsx
│   │   ├── Rooms.tsx
│   │   ├── Bookings.tsx
│   │   ├── Billing.tsx
│   │   ├── Customers.tsx
│   │   ├── Housekeeping.tsx
│   │   └── Reports.tsx
│   ├── types/
│   │   └── hotel.ts         # TypeScript type definitions
│   ├── lib/
│   │   └── utils.ts         # Utility functions
│   ├── App.tsx              # Root component with routing
│   ├── main.tsx             # Application entry point
│   └── index.css            # Global styles and design tokens
├── package.json
├── tailwind.config.ts
├── vite.config.ts
└── tsconfig.json
```

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>

# Navigate to project directory
cd hotel-management-system

# Install dependencies
npm install

# Start the development server
npm run dev
```

The application will be available at `http://localhost:8080`.

### Build for Production

```bash
npm run build
```

### Run Tests

```bash
npm test
```

## License

This project is developed for academic purposes as part of the BBIT programme.
