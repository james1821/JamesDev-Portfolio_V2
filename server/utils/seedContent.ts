import type { PortfolioContent } from '#shared/types'

/**
 * Bootstrap content. Serves two purposes: the site renders on a fresh clone
 * before Firebase is wired up, and `/api/seed` writes this into Firestore so
 * the admin starts with real records instead of empty collections.
 */
export const seedContent: PortfolioContent = {
  personal: {
    name: 'Mark James Espinosa',
    title: 'Full-Stack Web Developer',
    summary:
      'Full-stack web developer with 2+ years building, optimising and maintaining production web applications. I work across Vue, Nuxt, Laravel and PHP, with a focus on performance profiling, OAuth integrations and turning Figma files into interfaces that hold up on real devices.',
    photo: 'https://i.ibb.co/Jj4zk9jg/Screenshot-2026-06-07-112058.png',
    email: 'jamesespinosamark@gmail.com',
    linkedin: 'https://www.linkedin.com/in/mark-james-e-4b8146241',
    github: 'https://github.com/james1821',
    resume: '/resume/MarkJamesEspinosa_Resume.pdf',
    location: 'Philippines · Remote',
    availability: 'Open to full-stack roles',
  },
  skills: [
    { id: 'vue', name: 'Vue 3', category: 'Frontend', order: 1, icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg' },
    { id: 'nuxt', name: 'Nuxt', category: 'Frontend', order: 2, icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nuxtjs/nuxtjs-original.svg' },
    { id: 'react', name: 'React', category: 'Frontend', order: 3, icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
    { id: 'tailwind', name: 'Tailwind CSS', category: 'Frontend', order: 4, icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg' },
    { id: 'laravel', name: 'Laravel', category: 'Backend', order: 5, icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/laravel/laravel-original.svg' },
    { id: 'node', name: 'Node.js', category: 'Backend', order: 6, icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg' },
    { id: 'supabase', name: 'Supabase', category: 'Backend', order: 7, icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/supabase/supabase-original.svg' },
    { id: 'firebase', name: 'Firebase', category: 'Backend', order: 8, icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg' },
    { id: 'mysql', name: 'MySQL', category: 'Database', order: 9, icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg' },
    { id: 'mongodb', name: 'MongoDB', category: 'Database', order: 10, icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg' },
    { id: 'typescript', name: 'TypeScript', category: 'Languages', order: 11, icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg' },
    { id: 'javascript', name: 'JavaScript', category: 'Languages', order: 12, icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg' },
    { id: 'php', name: 'PHP', category: 'Languages', order: 13, icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg' },
    { id: 'git', name: 'Git', category: 'Tooling', order: 14, icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg' },
    { id: 'vite', name: 'Vite', category: 'Tooling', order: 15, icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vitejs/vitejs-original.svg' },
    { id: 'figma', name: 'Figma', category: 'Tooling', order: 16, icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg' },
  ],
  experience: [
    {
      id: 'posbang',
      company: 'Posbang Corporation',
      companyLogo: 'https://media.licdn.com/dms/image/v2/C560BAQE8o9Tx-vMghA/company-logo_200_200/company-logo_200_200/0/1644997964200?e=1782345600&v=beta&t=kZsi72mY6gcsoSfpjT0CTjxCYvvhZGKFJpPu25iBJdY',
      role: 'Web Developer',
      startDate: '2024',
      endDate: 'Present',
      description:
        'Build and maintain internal tooling and the company e-commerce platform. Optimised the PrestaShop-based camera rental system, shipped new features against a Laravel API, and built the Witty Manager V2 and V3 frontends in Vue, Nuxt and Tailwind.',
      tech: ['Nuxt', 'Vue', 'TypeScript', 'Tailwind CSS', 'Laravel', 'PHP', 'MySQL', 'PrestaShop'],
      order: 1,
    },
    {
      id: 'freelance',
      company: 'Freelance',
      companyLogo: 'https://i.ibb.co/jv7MNFS1/Screenshot-2026-06-09-111001.png',
      role: 'Web Developer',
      startDate: '2023',
      endDate: 'Present',
      description:
        'Design and ship websites and web apps for startups and small businesses end to end — scoping, interface design, implementation and deployment.',
      tech: ['Nuxt', 'React', 'Tailwind CSS', 'Supabase', 'Git'],
      order: 2,
    },
    {
      id: 'iphitech',
      company: 'iPhiTech IT and Digital Solutions',
      companyLogo: 'https://media.licdn.com/dms/image/v2/D560BAQEt-kZgv0XgXA/company-logo_200_200/company-logo_200_200/0/1690506291969/iphitech_logo?e=1782345600&v=beta&t=eWkew-fXcAUOccl_c6-Kcisk4rNX4iB1syR4RVd6Z3M',
      role: 'Web Developer Intern',
      startDate: 'Feb 2023',
      endDate: 'Jun 2023',
      description:
        'Turned UI/UX mockups into responsive marketing pages and storefronts using WordPress, Elementor and Shopify alongside hand-written HTML, CSS and JavaScript.',
      tech: ['HTML/CSS', 'JavaScript', 'WordPress', 'Elementor', 'Shopify'],
      order: 3,
    },
  ],
  projects: [
    {
      id: 'honey-flower-shop',
      title: 'Handmade by Honey',
      description:
        'An e-commerce store for handcrafted and fresh flower arrangements. Customers get order customisation and a guided checkout; the owner gets a dashboard for products, customers, promo codes, analytics and shipping rules.',
      image: 'https://i.ibb.co/nqPBDRhC/Screenshot-2026-06-10-084335.png',
      tech: ['Nuxt', 'Supabase', 'PostgreSQL', 'Tailwind CSS'],
      demo: 'https://honey-flower-shop-v2-5srb.vercel.app',
      github: 'https://github.com/james1821/honey-flower-shop-V2/',
      featured: true,
      order: 1,
    },
    {
      id: 'witty-manager-v3',
      title: 'Witty Manager V3',
      description:
        'Rebuilt the product frontend from Figma in Nuxt 3 and Tailwind, working against a Node.js API layer. Used SSR, composables and layouts to keep the module structure maintainable as the surface area grew.',
      image: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=1000&q=75',
      tech: ['Nuxt 3', 'TypeScript', 'Tailwind CSS', 'Node.js'],
      demo: '',
      github: '',
      featured: true,
      order: 2,
    },
    {
      id: 'witty-manager-v2',
      title: 'Witty Manager V2',
      description:
        'Added Google OAuth 2.0 sign-in through a Laravel API and shipped a Quick Menu that cut navigation depth to frequently used tools. Redesigned the login, signup and home screens for consistency across the platform.',
      image: 'https://i.ibb.co/4nkfLm0m/Screenshot-2026-06-09-134144.png',
      tech: ['Vue 2', 'TypeScript', 'Tailwind CSS', 'Laravel', 'MySQL'],
      demo: '',
      github: '',
      featured: false,
      order: 3,
    },
  ],
  currentWork: [
    {
      id: 'portfolio-v3',
      title: 'This portfolio, v3',
      description: 'Rebuilding on Nuxt 4 with a Firebase-backed CMS and a retrieval-grounded assistant.',
      image: 'https://i.ibb.co/nqPBDRhC/Screenshot-2026-06-10-084335.png',
      active: true,
      order: 1,
    },
  ],
  certifications: [
    {
      id: 'fcc-js',
      title: 'JavaScript Algorithms and Data Structures',
      issuer: 'freeCodeCamp',
      issuerLogo: 'https://media.licdn.com/dms/image/v2/C4E0BAQGLKj3JHcof0w/company-logo_100_100/company-logo_100_100/0/1630639684997/free_code_camp_logo?e=1782950400&v=beta&t=ynYTRff6UfAIT6yBLXuPB5YYjP40qZKJIkwz1gt5clo',
      date: 'July 2023',
      description:
        'Covers sorting and searching, linked lists, trees, graphs and dynamic programming, assessed through implementation challenges.',
      link: 'https://www.freecodecamp.org/certification/fcc71a9be58-9e3e-4387-86d9-7387e9390675/javascript-algorithms-and-data-structures',
      order: 1,
    },
    {
      id: 'hackerrank-react',
      title: 'React (Basic)',
      issuer: 'HackerRank',
      issuerLogo: 'https://hrcdn.net/fcore/assets/brand/logo-new-white-green-a5cb16e0ae.svg',
      date: 'August 2023',
      description: 'Component composition, hooks and state management, assessed by timed coding tasks.',
      link: 'https://www.hackerrank.com/certificates/0dc11c5d1ddb',
      order: 2,
    },
  ],
}
