# Manabat - Professional Portfolio SPA

A modern, fully responsive React Single Page Application (SPA) portfolio built with React 19, Vite, and React Router. Features a professional design with light/dark theme support, smooth animations, and a fixed navigation layout.

## 🚀 Features

- **React 19.2.0** - Latest React with modern hooks and features
- **Vite** - Lightning-fast build tool and development server
- **React Router v7.13.0** - Smooth client-side routing
- **Theme System** - Light/Dark mode with persistent storage
- **Responsive Design** - Mobile-first approach with CSS variables
- **Smooth Animations** - Page transitions and interaction effects
- **Professional UI** - Modern design with semantic HTML
- **Contact Form** - Integrated with Formspree for email submissions
- **Google Fonts** - Lato and Montserrat typography

## 📁 Project Structure

```
src/
├── components/
│   ├── Header.jsx          # Top fixed header with logo, social links, theme toggle
│   ├── Navbar.jsx          # Bottom fixed pill-shaped navigation bar
│   └── Layout.jsx          # Main layout wrapper component
├── context/
│   └── ThemeContext.jsx    # Theme management with React Context API
├── pages/
│   ├── Home.jsx            # Hero section with featured projects
│   ├── About.jsx           # Skills, bio, and expertise showcase
│   ├── Experiences.jsx     # Work experience timeline
│   ├── Blogs.jsx           # Blog posts listing
│   ├── BlogDetail.jsx      # Individual blog post view
│   ├── Contact.jsx         # Contact form with Formspree integration
│   ├── Projects.jsx        # Portfolio projects grid
│   └── Resume.jsx          # Resume/CV display
├── styles/
│   ├── theme.css           # CSS variables and theme definitions
│   ├── header.css          # Header component styles
│   ├── navbar.css          # Navigation bar styles
│   ├── layout.css          # Layout component styles
│   ├── pages.css           # All pages and components styling
│   └── index.css           # Global reset and base styles
├── App.jsx                 # Main app component with routing
├── main.jsx                # React entry point
└── index.css               # Global styles
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 16.0 or higher
- npm or yarn

### Steps

1. **Clone or navigate to the project**
   ```bash
   cd website-react-manabat-portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```
   Note: The `--legacy-peer-deps` flag is used because @formspree/react hasn't updated for React 19 yet.

3. **Start development server**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5173`

4. **Build for production**
   ```bash
   npm run build
   ```

5. **Preview production build**
   ```bash
   npm run preview
   ```

6. **Run linter**
   ```bash
   npm run lint
   ```

## 📋 Pages & Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | Home | Hero section with featured projects |
| `/about` | About | Skills, expertise, and bio information |
| `/experiences` | Experiences | Work experience timeline |
| `/blogs` | Blogs | Blog posts listing page |
| `/blogs/:id` | BlogDetail | Individual blog post view |
| `/contact` | Contact | Contact form with Formspree |
| `/projects` | Projects | Portfolio projects grid |
| `/resume` | Resume | Resume/CV display |

## 🎨 Theme System

The app includes a complete theme system using CSS variables:

### Theme Toggle
- Click the moon/sun icon in the header to switch between light and dark modes
- Theme preference is saved to localStorage
- Auto-applies theme on page load

### CSS Variables

Light Theme Variables:
```css
--text-primary: #1a1a1a
--text-secondary: #666666
--bg-primary: #ffffff
--bg-secondary: #f5f5f5
--accent-color: #6366f1
```

Dark Theme Variables:
```css
--text-primary: #ffffff
--text-secondary: #b0b0b0
--bg-primary: #1a1a1a
--bg-secondary: #2d2d2d
--accent-color: #818cf8
```

## 📧 Contact Form Setup

The Contact page uses Formspree for email submissions. To enable it:

1. Visit [Formspree.io](https://formspree.io)
2. Sign up or log in
3. Create a new form
4. Copy your form ID
5. Update the form ID in `src/pages/Contact.jsx`:
   ```jsx
   const [state, handleSubmit] = useForm('YOUR_FORM_ID_HERE');
   ```

Without a valid Formspree ID, the form will show an error when submitted.

## 🎯 Key Components

### Header Component
- Fixed position at the top
- Logo and social media links
- Theme toggle button  
- Download resume button
- Responsive design

### Navbar Component
- Fixed position at the bottom center
- Pill-shaped design with rounded corners
- 7 navigation links with active state styling
- Slide-up animation on load
- Responsive and mobile-friendly

### Layout Component
- Wraps all pages with Header and Navbar
- Auto-scrolls to top on page navigation
- Implements page transition animations

## 🎬 Animations

- **Page Transitions**: 0.5s fade-in animation
- **Navbar Slide-up**: 0.6s animation on initial load
- **Link Hover Effects**: Smooth color and transform transitions
- **Element Hover**: Subtle scale and shadow effects

## 📱 Responsive Breakpoints

- **Desktop**: Full layout (1200px+)
- **Tablet**: 768px - 1199px
- **Mobile**: Below 768px
- **Small Mobile**: Below 480px

## 🎨 Color Palette

### Primary Colors
- **Accent**: #6366f1 (Indigo)
- **Accent Light**: #e0e7ff

### Neutral Colors
- **Text Primary**: Adapts to theme (#1a1a1a light, #ffffff dark)
- **Text Secondary**: #666666 (light), #b0b0b0 (dark)
- **Background**: Adapts to theme

## 🔧 Dependencies

### Core
- **react**: ^19.2.0
- **react-dom**: ^19.2.0
- **react-router-dom**: ^7.13.0
- **vite**: ^7.3.1

### Extended Features
- **react-slick**: ^0.30.2 (carousel support)
- **slick-carousel**: ^1.8.1
- **@formspree/react**: ^2.5.1 (contact form)

### Development
- **eslint**: ^9.39.1
- **@vitejs/plugin-react**: ^5.1.1

## 🚨 Important Notes

1. **Placeholder Content**: All pages contain placeholder content and should be customized with real information
2. **Social Links**: Update social media URLs in Header.jsx
3. **Contact Information**: Update contact details in Contact.jsx
4. **Blog Posts**: Update or replace sample blog post data in Blogs.jsx and BlogDetail.jsx
5. **Resume Content**: Customize resume information in Resume.jsx
6. **Project Information**: Update projects in Projects.jsx and Home.jsx

## 🎯 Customization Guide

### Change Accent Color
Edit `src/styles/theme.css`:
```css
:root {
  --accent-color: #your-color;
  --accent-light: #lighter-shade;
}
```

### Update Social Media Links
Edit `src/components/Header.jsx` and update the social media URLs:
```jsx
<a href="https://your-facebook-url">
```

### Add/Remove Navigation Links
Edit `src/components/Navbar.jsx` navItems array:
```jsx
const navItems = [
  { path: '/your-path', label: 'Your Label' },
];
```

### Change Typography
The app uses:
- **Headings**: Montserrat (imported from Google Fonts)
- **Body**: Lato (imported from Google Fonts)

Update in `src/styles/theme.css` to use different fonts.

## 🔍 Performance Tips

- Vite provides instant module replacement (HMR)
- CSS is scoped using component-specific files
- Images use placeholder colors (no heavy assets)
- Semantic HTML for better accessibility
- Mobile-first responsive design

## 📄 License

This project is open source and available for personal and commercial use.

## 🤝 Support

For issues or questions:
1. Check the file structure matches the documentation
2. Ensure all dependencies are installed correctly
3. Clear browser cache if styles don't update
4. Check browser console for any error messages

---

**Last Updated**: March 4, 2026  
**Version**: 1.0.0  
**Built with**: React 19 + Vite + React Router v7
