import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout';
import './styles/theme.css';
import './styles/header.css';
import './styles/navbar.css';
import './styles/layout.css';
import './styles/pages.css';
import './styles/card-swap.css';

const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Experiences = lazy(() => import('./pages/Experiences'));
const Blogs = lazy(() => import('./pages/Blogs'));
const BlogDetail = lazy(() => import('./pages/BlogDetail'));
const Contact = lazy(() => import('./pages/Contact'));

const skills = [
  {
    title: 'Insightful Communicator',
    description: 'I translate complex technical concepts into clear insights that help teams align and make informed decisions during development.',
    img: '/images/card-skills/insightful-communicator.png'
  },
  {
    title: 'Strategic Thinker',
    description: 'I approach development with scalability and maintainability in mind, ensuring solutions remain effective as projects grow.',
    img: '/images/card-skills/strategic-thinker.png'
  },
  {
    title: 'Resilient Problem Architect',
    description: 'I break down complex issues into structured solutions and persist through debugging challenges until reliable outcomes are achieved.',
    img: '/images/card-skills/problem-architect.png'
  },
  {
    title: 'Adaptive Innovator',
    description: 'I quickly adapt to new tools and evolving requirements while exploring better approaches to improve performance and user experience.',
    img: '/images/card-skills/adaptive-innovator.png'
  },
  {
    title: 'Collaborative Catalyst',
    description: 'I actively contribute ideas, support teammates, and encourage open communication to maintain a productive development workflow.',
    img: '/images/card-skills/collaborative-catalyst.png'
  },
  {
    title: 'Meticulous Executor',
    description: 'I prioritize precision and attention to detail to ensure features are implemented accurately and consistently across scenarios.',
    img: '/images/card-skills/meticulous-executor.png'
  }
];

const workExperience = [
  {
    type: "Internship",
    date: "May 2024 - June 2024",
    companyName: "A2K Group",
    img : '/images/a2k_logo.jpg',
    role: 'UI / UX Designer Frontend Developer',
    description : "I gained hands-on experience in Frontend development and UI/UX design, contributing to the creation of user-centered interfaces. I proposed an innovative project idea, which was approved by the team, and was able to learn new frameworks and apply them effectively."
  }
];

const codingLanguages = [
  {
    name: 'JavaScript',
    img: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg'
  },
  {
    name: 'TypeScript',
    img: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg'
  },
  {
    name: 'React',
    img: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg'
  },
  {
    name: 'Angular',
    img: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/angularjs/angularjs-original.svg'
  },
  {
    name: 'Node.js',
    img: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg'
  },
  {
    name: 'Next.js',
    img: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg'
  },
  {
    name: 'PHP',
    img: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/php/php-original.svg'
  },
  {
    name: 'MySQL',
    img: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg'
  },
  {
    name: 'MongoDB',
    img: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mongodb/mongodb-original.svg'
  },
  {
    name: 'Dart',
    img: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/dart/dart-original.svg'
  },
  {
    name: 'Java',
    img: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg'
  },
  {
    name: 'Python',
    img: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg'
  },
  {
    name: 'HTML',
    img: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg'
  },
  {
    name: 'CSS',
    img: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg'
  }
];

const certificates = [
  {
    title: 'Legacy Responsive Web Design V8 Certification FCC',
    description: 'Covers HTML, CSS, and responsive web design principles for building adaptable websites - Issued September 2024',
    date: '5 September 2024',
    url: 'https://www.freecodecamp.org/certification/manabatalex/responsive-web-design',
    image: '/images/certificatesLogo/free_code_camp.png'
  },
  {
    title: 'Backend Development and APIs V8 Certification FCC',
    description: 'Covers building server-side applications, RESTful APIs, and handling data in backend development - Issued August 2025',
    date: '28 August 2025',
    url: 'https://www.freecodecamp.org/certification/manabatalex/back-end-development-and-apis',
    image: '/images/certificatesLogo/free_code_camp.png'
  },
  {
    title: 'Legacy JavaScript Algorithms and Data Structures V7 Certification FCC',
    description: 'Covers JavaScript fundamentals, data structures, and algorithmic problem-solving techniques - Issued July 2025',
    date: '16 July 2025',
    url: 'https://www.freecodecamp.org/certification/manabatalex/javascript-algorithms-and-data-structures',
    image: '/images/certificatesLogo/free_code_camp.png'
  },
  {
    title: 'Introduction to PHP SIMPLILEARN',
    description: 'Covers PHP syntax, server-side scripting, and building dynamic web pages - Issued Jan 2025',
    date: '21 Jan 2025',
    url: 'https://simpli-web.app.link/e/gqxD1g4CZ0b',
    image: '/images/certificatesLogo/simplilearn.jpg'
  },
  {
    title: 'Design Thinking for Beginners SIMPLILEARN',
    description: 'Covers the design thinking process, ideation techniques, and user-centered problem solving - Issued Jul 2025',
    date: '25 Jul 2025',
    url: 'https://simpli-web.app.link/e/G561BW1CZ0b',
    image: '/images/certificatesLogo/simplilearn.jpg'
  },
  {
    title: 'Introduction to Graphic Design; Basics of UI/UX SIMPLILEARN',
    description: 'Covers graphic design fundamentals, UI/UX basics, and visual communication principles - Issued Aug 2025',
    date: '21 Aug 2025',
    url: 'https://simpli-web.app.link/e/Ki843DYCZ0b',
    image: '/images/certificatesLogo/simplilearn.jpg'
  },
  {
    title: 'Content Marketing HUBSPOT',
    description: 'Covers content creation, marketing strategies, and optimizing campaigns for engagement - Issued  August 2025',
    date: '25 August 2025',
    url: 'https://app-na2.hubspot.com/academy/243405615/award-share/9206665/achievement-preview',
    image: '/images/certificatesLogo/hubspot.jpg'
  },
  {
    title: 'SEO HUBSPOT',
    description: 'Covers search engine optimization strategies, keyword research, and improving website ranking - Issued January 2026',
    date: '11 January 2026',
    url: 'https://app-na2.hubspot.com/academy/243405615/award-share/9157909/achievement-preview',
    image: '/images/certificatesLogo/hubspot.jpg'
  },
  {
    title: 'SEO II HUBSPOT',
    description: 'Covers advanced SEO techniques, analytics, and optimizing content for better search performance - Issued Febuary 2026',
    date: '4 Febuary 2026',
    url: 'https://app-na2.hubspot.com/academy/243405615/award-share/9108127/achievement-preview',
    image: '/images/certificatesLogo/hubspot.jpg'
  }
];

const projects = [
  {
    name: 'PURESTRENGTH LABS',
    stack: ['HTML', 'CSS', 'JavaScript'],
    description: 'GitHub-hosted website that provides detailed information on workout supplements, including protein and creatine. It allows users to compare nutritional content and make informed decisions to support their fitness goals.',
    img: '/images/projects-cover-photos/PureStrengthLabs.png',
    url: 'https://alexdossss.github.io/PURESTRENGTHLABS/'
  },
  {
    name: 'IMMFI NGO WEBSITE',
    stack: ['React', 'CSS', 'Express', 'Tailwind', 'MongoDB'],
    description: 'A project in partnership with the Inocencio Magtoto Memorial Foundation, Inc. (IMMFI), a nonprofit organization dedicated to supporting children with disabilities in Pampanga. The website showcases the foundation’s mission, history, and programs, providing an accessible platform for community engagement and awareness.',
    img: '/images/projects-cover-photos/Immfiwebsite.png',
    url: 'https://immfi.org/'
  },
  {
    name: 'Sharesource',
    stack: ['React', 'Node.js', 'Express', 'MongoDB'],
    description: 'Sharesource is a web application school project that allows users to share, view, and interact with notes in PDF, Word, or Google Docs formats, including bookmarking, rating, and commenting. It also features a collaborative space with embedded Google Docs, enabling real-time teamwork and document editing within the app.',
    img: '/images/projects-cover-photos/share_source.png',
    url: 'https://github.com/GR4C3FR/Sharesource.git'
  },
  {
    name: 'StudyHub',
    stack: ['React', 'Node.js', 'Express', 'Chart.js', 'Open AI API','MongoDB'],
    description: 'A web application designed for dedicated study sessions, allowing users to access, share, and collaborate on notes. It features AI-powered automatic flashcard generation, mock quizzes, and a Pomodoro timer, enabling interactive learning, time management, and seamless collaboration among students.',
    img: '/images/projects-cover-photos/study_hub.png',
    url: 'https://github.com/alexdossss/study-hub.git'
  },
  {
    name: 'CrabKing',
    stack: ['HTML', 'CSS'],
    description: 'A client-based mockup website created for a seafood restaurant, designed to showcase its menu, ambiance, and services. The project focused on delivering a clean and visually appealing interface that effectively represents the brand and engages potential customers.',
    img: '/images/projects-cover-photos/crab_king.png',
    url: 'https://miggyyypinpan.github.io/CrabKing/'
  },
  {
    name: 'Endless Charms',
    stack: ['Node', 'Express', 'MongoDB'],
    description: 'A client-based ecommerce project developed to showcase and sell a curated collection of charms and jewelry. The site focuses on providing a smooth and user-friendly shopping experience for online customers.',
    img: '/images/projects-cover-photos/endless_charms.png',
    url: 'https://endlesscharms.store'
  },
];

const App = () => {
  return (
    <ThemeProvider>
      <Router>
        <Layout>
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route path="/" element={<Home projects={projects} certificates={certificates} workExp={workExperience} codingLanguages={codingLanguages} />} />
              <Route path="/about" element={<About skills={skills} codingLanguages={codingLanguages} />} />
              <Route path="/experiences" element={<Experiences projects={projects} workExp={workExperience} certificates={certificates}/>} />
              <Route path="/blogs" element={<Blogs />} />
              <Route path="/blogs/:id" element={<BlogDetail />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </Suspense>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default React.memo(App);

