# MeowSwap Frontend

This is the frontend for **MeowSwap**, a cross-chain DeFi protocol focused on Dutch auctions and seamless swaps, with special support for the Tron blockchain. The frontend is built with React, Vite, and Tailwind CSS, providing a fast, modern, and responsive user experience.

---

## Folder Structure

```
frontend/
├── .gitignore
├── package.json
├── README.md
├── Frontend/
│   ├── .gitignore
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── README.md
│   ├── tailwind.config.js
│   ├── vite.config.js
│   ├── public/
│   │   └── unitedefi.png
│   └── src/
│       ├── App.css
│       ├── App.jsx
│       ├── index.css
│       ├── main.jsx
│       ├── components/
│       │   ├── Button.jsx
│       │   ├── Card.jsx
│       │   ├── ErrorBoundary.jsx
│       │   ├── Footer.jsx
│       │   ├── Help.jsx
│       │   ├── LoadingSpinner.jsx
│       │   ├── Navbar.jsx
│       │   ├── Toast.jsx
│       └── pages/
│           ├── Fusion.jsx
│           ├── FusionMaker.jsx
│           ├── FusionResolver.jsx
│           ├── HomePage.jsx
│           └── ...
```

---

## Key Technologies

- **React**: UI library for building interactive interfaces.
- **Vite**: Fast development server and build tool.
- **Tailwind CSS**: Utility-first CSS framework for rapid styling.
- **React Router**: Routing between pages.
- **Tron Integration**: UI and logic designed for Tron-centric swaps and auctions.

---

## Main Components

### 1. **Navbar**

- Displays the MeowSwap logo (`unitedefi.png`) and project name.
- Navigation links for Fusion+, Limit Orders, and Help.
- Responsive design with mobile menu.

### 2. **Footer**

- Shows MeowSwap branding and social links.
- Quick links to Privacy Policy, Terms, Documentation, and Support.

### 3. **HomePage**

- Landing page with hero section, platform stats, features, and calls to action.

### 4. **Fusion**

- Main interface for Dutch auction-based cross-chain swaps.
- Lets users choose between Maker and Resolver roles.

### 5. **FusionMaker**

- Form for creating cross-chain swap orders.
- Inputs for source/destination chain, tokens, and amounts.
- Tron chain IDs and addresses supported.

### 6. **FusionResolver**

- Interface for resolvers to fill orders and earn profit.

### 7. **Help Overlay**

- Modal for user help and FAQs.

---

## Styling

- Uses Tailwind CSS for all styling.
- Custom gradients, animations, and responsive layouts.
- Dark mode by default.

---

## Assets

- **Logo**: `public/unitedefi.png` (used for MeowSwap branding in Navbar and Footer).

---

## How to Run

### 1. Install Dependencies

```bash
cd frontend/Frontend
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

### 3. Build for Production

```bash
npm run build
```

### 4. Preview Production Build

```bash
npm run preview
```

---

## Configuration

- **index.html**: Sets up favicon and meta tags for MeowSwap.
- **tailwind.config.js**: Customizes Tailwind theme and animations.
- **postcss.config.js**: Integrates Tailwind and Autoprefixer.

---

## Tron Support

- The UI supports Tron chain IDs and addresses for cross-chain swaps.
- Forms and logic are designed to work with Tron-based smart contracts and assets.

---

## Customization

- Add new pages in `src/pages/`.
- Add new UI components in `src/components/`.
- Update theme and animations in `tailwind.config.js`.

---

## Contribution

1. Fork and clone the repo.
2. Create a feature branch.
3. Make changes and test locally.
4. Submit a pull request.

---

## License

MIT License © MeowSwap Team

---

## Contact

For support or questions, open an issue or contact
