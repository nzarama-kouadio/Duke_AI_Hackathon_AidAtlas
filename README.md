# Aid Atlas

An interactive donation experience inspired by the GitHub globe. Aid Atlas lets
supporters see every act of generosity soar across a 3D Earth, from their home
country to the communities they champion. The home page features a live globe
that animates all donations in real-time and a personal globe that thanks the
donor with a spotlight arc and message.

## Features

- Real-time donation feed with animated arcs between donor and recipient
  countries
- Interactive, auto-rotating globes built with `react-globe.gl`
- Thank you card highlighting the latest donation with a personalized route
- Responsive, glassmorphism-inspired UI that matches the energy of the GitHub
  globe

## Getting Started

### Prerequisites

- Node.js 18+

### Installation

```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Development

Run the backend API (includes Socket.IO for live updates):

```bash
cd server
npm run dev
```

In a new terminal, run the frontend:

```bash
cd frontend
npm run dev
```

By default, the frontend expects the API at `http://localhost:4000`. Override it
with an environment variable:

```bash
# frontend/.env
VITE_API_URL=http://localhost:4000
```

Visit the Vite dev server URL printed in the terminal (typically
`http://localhost:5173`) to experience Aid Atlas.
