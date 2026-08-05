# Art Gallery — Frontend

React frontend for the Art Gallery web application. Browse artworks, view details, submit contact messages, and manage the gallery through an admin dashboard.

**Live site:** _add your Vercel URL here once deployed_
**Backend API:** https://art-gallery-api-production-683f.up.railway.app

## Features

- 🖼️ Public gallery with paginated artwork browsing
- 🔍 Individual artwork detail pages
- 🔐 Authentication (login/register) for admin access
- 🛠️ Admin dashboard to create, edit, and delete artworks
- 📬 Contact form
- 📱 Responsive design with Tailwind CSS

## Tech Stack

- **React** (Vite)
- React Router
- Tailwind CSS
- JWT-based auth (talks to the Spring Boot backend)

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/Kostia20034/art-gallery-frontend.git
   cd art-gallery-frontend/product-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables — create a `.env.local` file:
   ```
   VITE_API_URL=https://art-gallery-api-production-683f.up.railway.app
   ```
   (Omit this to fall back to the live backend URL configured in `src/config.js`.)

4. Run the dev server:
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173`.

### Build for production

```bash
npm run build
```

Output is generated in the `dist/` folder.

## Project Structure

```
product-frontend/
├── src/
│   ├── App.jsx              # Main app + routing
│   ├── Auth.jsx              # Login / register page
│   ├── Navbar.jsx            # Navigation bar
│   ├── config.js             # API base URL config
│   └── pages/
│       ├── Gallery.jsx          # Public artwork gallery
│       ├── ArtworkDetail.jsx    # Single artwork view
│       ├── AdminDashboard.jsx   # Admin CRUD interface
│       └── Contact.jsx          # Contact form
```

## Pages

| Route | Description | Access |
|---|---|---|
| `/` | Artwork gallery | Public |
| `/artwork/:id` | Artwork detail view | Public |
| `/contact` | Contact form | Public |
| `/login` | Login / register | Public |
| `/admin` | Admin dashboard (manage artworks) | Admin only |

## Deployment

Deployed on [Vercel](https://vercel.com), connected directly to this GitHub repository.

- **Root directory:** `product-frontend`
- **Framework preset:** Vite
- **Build command:** `npm run build`
- **Output directory:** `dist`

## License

This project is for portfolio/educational purposes.
