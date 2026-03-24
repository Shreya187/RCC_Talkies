/* =============================================
   RCC TALKIES — MAIN JAVASCRIPT
   ============================================= */

/* ============================================================
   1. 3D NEWSPAPER CANVAS BACKGROUND
   ============================================================ */
(function initNewspaperBg() {
  const canvas = document.getElementById('newspaper3D');
  const ctx = canvas.getContext('2d');
  
  let w, h;
  let mouseX = 0, mouseY = 0;
  let targetMouseX = 0, targetMouseY = 0;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);
  
  window.addEventListener('mousemove', (e) => {
    targetMouseX = (e.clientX - w / 2) / (w / 2); // -1 to 1
    targetMouseY = (e.clientY - h / 2) / (h / 2); // -1 to 1
  });

  const words = [
    'RCCIIT', 'JOURNALISM', 'TRUTH', 'MEDIA', 'RCC TALKIES', 'TECHTRIX', 'REGALIA',
    'ECONOMICS', 'INDUSTRY', 'BUSINESS', 'BREAKING', 'REPORTS', 'THE VOICE', 'DIGITAL',
    'STORIES', 'KOLKATA', 'CAMPUS', 'CHRONICLES', 'EDITORIAL', 'PRESS', 'DYNAMICS',
    'GLOBAL', 'TRENDS', 'INNOVATION', 'GOT FEST', 'EXPORTS', 'IMPORTS', 'MARKETS'
  ];

  const particles = Array.from({ length: 65 }, () => ({
    text: words[Math.floor(Math.random() * words.length)],
    x: (Math.random() - 0.5) * 2000,
    y: (Math.random() - 0.5) * 2000,
    z: Math.random() * 2000,
    size: 15 + Math.random() * 30,
    speedZ: -0.5 - Math.random() * 1.5,
    rot: Math.random() * Math.PI * 2,
    rotSpeed: (Math.random() - 0.5) * 0.01,
    opacity: 0.1 + Math.random() * 0.4,
    color: Math.random() > 0.8 ? '#c9a84c' : '#ffffff',
    isBreaking: Math.random() > 0.93
  }));

  function project(p) {
    const factor = 400 / (400 + p.z);
    const x = p.x * factor + w / 2;
    const y = p.y * factor + h / 2;
    return { x, y, scale: factor };
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    
    // Smooth mouse interaction
    mouseX += (targetMouseX - mouseX) * 0.05;
    mouseY += (targetMouseY - mouseY) * 0.05;

    // Sorting by depth for proper layering
    particles.sort((a, b) => b.z - a.z);

    particles.forEach(p => {
      p.z += p.speedZ;
      p.rot += p.rotSpeed;
      
      // Reset if too close
      if (p.z < -350) {
        p.z = 2000;
        p.x = (Math.random() - 0.5) * 2400;
        p.y = (Math.random() - 0.5) * 2400;
      }

      // Parallax offset
      const offsetX = mouseX * (150 * (1 - p.z / 2000));
      const offsetY = mouseY * (150 * (1 - p.z / 2000));

      const pos = project({
        x: p.x + offsetX * 200,
        y: p.y + offsetY * 200,
        z: p.z
      });

      if (pos.x < -200 || pos.x > w + 200 || pos.y < -100 || pos.y > h + 100) return;

      const alpha = p.opacity * (1 - p.z / 2000);
      ctx.save();
      ctx.translate(pos.x, pos.y);
      ctx.rotate(p.rot / 5);
      ctx.scale(pos.scale, pos.scale);
      
      // Focus effect (blur further words)
      const blur = Math.max(0, (p.z - 400) / 150);
      ctx.filter = `blur(${blur}px)`;
      
      ctx.globalAlpha = alpha;
      ctx.fillStyle = p.color;
      ctx.font = `${p.isBreaking ? '900' : '700'} ${p.size}px 'Playfair Display', serif`;
      
      if (p.isBreaking && Math.random() > 0.98) {
         // Glitch effect
         ctx.fillStyle = '#ff0000';
         ctx.fillText(p.text, Math.random()*4, Math.random()*4);
      } else {
         ctx.fillText(p.text, 0, 0);
      }
      
      // Add a subtle glow to golden words
      if (p.color === '#c9a84c') {
        ctx.shadowBlur = 15;
        ctx.shadowColor = 'rgba(201,168,76,0.6)';
        ctx.fillText(p.text, 0, 0);
      }

      ctx.restore();
    });

    requestAnimationFrame(draw);
  }
  draw();
})();

/* ============================================================
   2. HERO PARTICLES
   ============================================================ */
(function initParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  for (let i = 0; i < 50; i++) {
    const dot = document.createElement('div');
    dot.style.cssText = `
      position:absolute;
      width:${1 + Math.random() * 3}px;
      height:${1 + Math.random() * 3}px;
      background:rgba(201,168,76,${0.1 + Math.random() * 0.4});
      border-radius:50%;
      left:${Math.random() * 100}%;
      top:${Math.random() * 100}%;
      animation: particleFade ${4 + Math.random() * 6}s ease-in-out infinite;
      animation-delay:${Math.random() * 5}s;
    `;
    container.appendChild(dot);
  }

  const style = document.createElement('style');
  style.textContent = `
    @keyframes particleFade {
      0%,100%{opacity:0;transform:translateY(0)}
      50%{opacity:1;transform:translateY(-30px)}
    }
  `;
  document.head.appendChild(style);
})();

/* ============================================================
   3. NAVBAR — SCROLL & HAMBURGER
   ============================================================ */
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// Close nav on link click (mobile)
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

/* ============================================================
   4. SCROLL ANIMATION — INTERSECTION OBSERVER
   ============================================================ */
const revealStyle = document.createElement('style');
revealStyle.textContent = `
  .reveal { opacity: 0; transform: translateY(30px); transition: opacity 0.7s ease, transform 0.7s ease; }
  .reveal.visible { opacity: 1; transform: translateY(0); }
  .reveal-left { opacity: 0; transform: translateX(-40px); transition: opacity 0.7s ease, transform 0.7s ease; }
  .reveal-left.visible { opacity: 1; transform: translateX(0); }
  .reveal-right { opacity: 0; transform: translateX(40px); transition: opacity 0.7s ease, transform 0.7s ease; }
  .reveal-right.visible { opacity: 1; transform: translateX(0); }
`;
document.head.appendChild(revealStyle);

// Add reveal classes to elements
const revealSelectors = [
  '.about-card', '.poster-card', '.magazine-card', '.report-card',
  '.event-main-card', '.ext-event-card', '.member-float-card',
  '.domain-card', '.faculty-card', '.college-grid', '.contact-grid',
  '.stat-card', '.section-title', '.section-label'
];

revealSelectors.forEach(sel => {
  document.querySelectorAll(sel).forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${(i % 6) * 0.1}s`;
  });
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('visible');
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => observer.observe(el));

/* ============================================================
   5. MODALS
   ============================================================ */
function openModal(id) {
  document.getElementById(id).classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal(id) {
  document.getElementById(id).classList.remove('open');
  document.body.style.overflow = '';
}

function switchModal(closeId, openId) {
  closeModal(closeId);
  setTimeout(() => openModal(openId), 200);
}

// Close on overlay click
document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal(overlay.id);
  });
});

// Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.open').forEach(m => closeModal(m.id));
  }
});

/* ============================================================
   6. PDF MODAL
   ============================================================ */
function openPDFModal(type, name) {
  document.getElementById('pdfModalTitle').textContent =
    type === 'magazine' ? '📖 Magazine Reader' : '📋 Report Viewer';
  document.getElementById('pdfDocName').textContent = name;
  openModal('pdfModal');
}

/* ============================================================
   7. DOMAIN MEMBERS MODAL
   ============================================================ */
const domainData = {
  'Tech Team': [
    { name: 'Souvik Das', role: 'Lead Dev', icon: '👨‍💻' },
    { name: 'Ritika Paul', role: 'Frontend', icon: '👩‍💻' },
    { name: 'Ayan Biswas', role: 'Backend', icon: '👨‍💻' },
    { name: 'Priyanka Sen', role: 'UI/UX', icon: '👩‍💻' },
    { name: 'Debashis Roy', role: 'DevOps', icon: '👨‍💻' },
    { name: 'Ankita Ghosh', role: 'Mobile Dev', icon: '👩‍💻' },
  ],
  'Graphics Team': [
    { name: 'Nilanjana Roy', role: 'Lead Designer', icon: '👩‍🎨' },
    { name: 'Sayan Dutta', role: 'Illustrator', icon: '👨‍🎨' },
    { name: 'Moumita Bose', role: 'Video Editor', icon: '👩‍🎨' },
    { name: 'Arnab Sen', role: 'Motion', icon: '👨‍🎨' },
    { name: 'Tania Das', role: 'Branding', icon: '👩‍🎨' },
  ],
  'Content Team': [
    { name: 'Subhajit Roy', role: 'Editor', icon: '✍️' },
    { name: 'Rima Chatterjee', role: 'Reporter', icon: '✍️' },
    { name: 'Abir Mukherjee', role: 'Writer', icon: '✍️' },
    { name: 'Shreya Pal', role: 'Blogger', icon: '✍️' },
    { name: 'Kaushik Singh', role: 'Anchor', icon: '✍️' },
    { name: 'Puja Dey', role: 'Copywriter', icon: '✍️' },
    { name: 'Rahul Basu', role: 'Journalist', icon: '✍️' },
  ],
  'Photography Team': [
    { name: 'Arup Mondal', role: 'Lead Photographer', icon: '📷' },
    { name: 'Sanhita Roy', role: 'Videographer', icon: '📷' },
    { name: 'Brishti Das', role: 'Photo Editor', icon: '📷' },
    { name: 'Indranil Bose', role: 'Drone Operator', icon: '📷' },
  ],
  'Social Media Team': [
    { name: 'Shreyasi Datta', role: 'SM Head', icon: '📱' },
    { name: 'Tuhin Sarkar', role: 'Instagram', icon: '📱' },
    { name: 'Mousumi Paul', role: 'Facebook', icon: '📱' },
    { name: 'Sudipto Roy', role: 'YouTube', icon: '📱' },
    { name: 'Debasmita Sen', role: 'Twitter/X', icon: '📱' },
  ],
  'PR Team': [
    { name: 'Anirban Ghosh', role: 'PR Head', icon: '🤝' },
    { name: 'Sucheta Das', role: 'Outreach', icon: '🤝' },
    { name: 'Partha Sarathi', role: 'Sponsorship', icon: '🤝' },
    { name: 'Tanushree Pal', role: 'Collaboration', icon: '🤝' },
  ],
};

function openDomainModal(domain) {
  document.getElementById('domainModalTitle').textContent = `${domain} Members`;
  const grid = document.getElementById('domainMembersGrid');
  const members = domainData[domain] || [];
  grid.innerHTML = members.map(m => `
    <div class="domain-member-item">
      <div class="domain-member-avatar">${m.icon}</div>
      <div class="domain-member-name">${m.name}</div>
      <div class="domain-member-role">${m.role}</div>
    </div>
  `).join('');
  openModal('domainModal');
}

/* ============================================================
   8. EVENTS TAB SWITCHING
   ============================================================ */
function switchEventTab(tab) {
  document.querySelectorAll('.event-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.events-panel').forEach(p => p.classList.remove('active'));

  const activeTab = document.querySelector(`.event-tab[onclick*="${tab}"]`);
  const activePanel = document.getElementById(`${tab}-panel`);
  if (activeTab) activeTab.classList.add('active');
  if (activePanel) activePanel.classList.add('active');
}

/* ============================================================
   9. YEAR BUTTONS — EVENT NEWS
   ============================================================ */
const yearNewsData = {
  got: {
    2023: [
      { icon: '⚽', title: 'Football Finals', desc: 'CSE department wins the football championship in a thrilling final match.' },
      { icon: '🏏', title: 'Cricket Trophy', desc: 'An epic cricket showdown that went down to the last over.' },
      { icon: '🏃', title: 'Athletics Meet', desc: 'Students break records at the annual athletics track events.' },
    ],
    2024: [
      { icon: '🏐', title: 'Volleyball Championship', desc: 'ECE department stuns the crowd with their stunning play in the volleyball finals.' },
      { icon: '🎾', title: 'Table Tennis Open', desc: 'Solo and doubles table tennis tournament with 100+ participants.' },
      { icon: '🥊', title: 'Kabaddi League', desc: 'High-energy kabaddi matches captivate thousands in the stadium.' },
    ],
    2025: [
      { icon: '🏊', title: 'Swimming Meet', desc: 'New college record set in the 100m freestyle swimming event.' },
      { icon: '🤸', title: 'Gymnastics Display', desc: 'Breathtaking gymnastics performance by students at the main grounds.' },
      { icon: '🎯', title: 'Archery Contest', desc: 'First-ever archery tournament held at GOT with prizes for top 3 winners.' },
    ],
  },
  techtrix: {
    2023: [
      { icon: '💡', title: '24-Hour Hackathon', desc: '180 participants, 30 teams, 1 winner – the most intense hackathon in college history.' },
      { icon: '🤖', title: 'Robo-Wars', desc: 'Battle bots fight it out in the arena in an action-packed robotics competition.' },
      { icon: '🎯', title: 'Project Expo', desc: 'Final year projects showcased to industry judges from leading tech companies.' },
    ],
    2024: [
      { icon: '🔬', title: 'AI/ML Workshop', desc: 'Hands-on workshop on Artificial Intelligence and Machine Learning by Google engineers.' },
      { icon: '🌐', title: 'Web Dev Contest', desc: 'Web development challenge powered by 48 hours of code and creativity.' },
      { icon: '📡', title: 'IoT Showcase', desc: 'Smart device demonstrations and Internet-of-Things project presentations.' },
    ],
    2025: [
      { icon: '🚀', title: 'Space Tech Seminar', desc: 'ISRO scientist delivers keynote on space technology careers and opportunities.' },
      { icon: '🎮', title: 'Game Dev Jam', desc: '12-hour game development jam with prizes worth ₹1,00,000.' },
      { icon: '🛡️', title: 'Cybersecurity CTF', desc: 'Capture-the-flag cybersecurity competition with 200+ participants.' },
    ],
  },
  regalia: {
    2023: [
      { icon: '💃', title: 'Dance Battle', desc: 'Electrifying dance performances from all departments light up the main stage.' },
      { icon: '🎵', title: 'Music Night', desc: 'Live band performances and singing contests that echo through the campus.' },
      { icon: '🎪', title: 'Drama & Skit', desc: 'Award-winning dramatic performances that leave the audience in awe.' },
    ],
    2024: [
      { icon: '🎤', title: 'Celebrity Night', desc: 'Renowned Bollywood artist performs live, breaking the crowd into a frenzy.' },
      { icon: '🎨', title: 'Art Exhibition', desc: 'Student artwork displayed in a grand exhibition spanning 3 days.' },
      { icon: '👗', title: 'Fashion Show', desc: 'The college fashion show features traditional and contemporary themes.' },
    ],
    2025: [
      { icon: '🌟', title: 'Grand Finale', desc: 'Cultural fest grand finale featuring a surprise headlining act and fireworks.' },
      { icon: '🥁', title: 'Battle of Bands', desc: 'Six student bands compete in the electrifying Battle of Bands competition.' },
      { icon: '🎭', title: 'Theatre Festival', desc: 'Three acts performed back-to-back in the open-air amphitheatre.' },
    ],
  },
};

function switchYear(event, year, btn) {
  // Update active button
  btn.closest('.event-years').querySelectorAll('.year-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  // Update news grid
  const grid = document.getElementById(`${event}-news`);
  const news = yearNewsData[event][year] || [];
  grid.innerHTML = news.map(item => `
    <div class="news-item">
      <div class="news-img-placeholder">${item.icon}</div>
      <div class="news-text">
        <h4>${item.title}</h4>
        <p>${item.desc}</p>
      </div>
    </div>
  `).join('');
}

/* ============================================================
   10. MEMBERS TAB SWITCHING
   ============================================================ */
function switchMemberTab(tab) {
  document.querySelectorAll('.member-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.members-panel').forEach(p => p.classList.remove('active'));

  const activeTab = document.querySelector(`.member-tab[onclick*="${tab}"]`);
  const activePanel = document.getElementById(`${tab}-panel`);
  if (activeTab) activeTab.classList.add('active');
  if (activePanel) activePanel.classList.add('active');
}

/* ============================================================
   11. AUTH HANDLERS (UI-ONLY, no real backend)
   ============================================================ */
function handleGoogleAuth() {
  showToast('🔗 Google Auth not yet connected to backend.');
}

function handleLogin(e) {
  e.preventDefault();
  closeModal('loginModal');
  showToast('✅ Logged in successfully!');
}

function handleSignup(e) {
  e.preventDefault();
  closeModal('signupModal');
  showToast('🎉 Account created! Welcome to RCC Talkies.');
}

function handleAdminUpload(e) {
  e.preventDefault();
  const pass = document.getElementById('adminPass').value;
  if (pass !== 'admin123') {
    showToast('❌ Incorrect admin password!');
    return;
  }
  const title = document.getElementById('uploadTitle').value;
  const type = document.getElementById('uploadType').value;
  closeModal('adminUploadModal');
  showToast(`✅ ${type} "${title}" uploaded successfully!`);
}

/* ============================================================
   12. CONTACT FORM
   ============================================================ */
function handleFormSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('msgName').value;
  document.getElementById('contactForm').reset();
  showToast(`📬 Message sent by ${name}! We'll reply soon.`);
}

/* ============================================================
   13. TOAST NOTIFICATION
   ============================================================ */
function showToast(message, duration = 3000) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), duration);
}

/* ============================================================
   14. SMOOTH SCROLL OFFSET (for fixed navbar)
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ============================================================
   15. TYPEWRITER EFFECT ON HERO TAGLINE
   ============================================================ */
(function typewriter() {
  const el = document.querySelector('.hero-tagline');
  if (!el) return;
  const text = el.innerHTML;
  el.innerHTML = '';
  let i = 0;
  const timer = setInterval(() => {
    el.innerHTML = text.slice(0, i++);
    if (i > text.length) clearInterval(timer);
  }, 30);
})();

/* ============================================================
   16. COUNTER ANIMATION ON STATS
   ============================================================ */
function animateCounters() {
  document.querySelectorAll('.stat-num').forEach(el => {
    const raw = el.textContent.trim();
    const num = parseInt(raw.replace(/\D/g, ''));
    if (isNaN(num)) return;
    const suffix = raw.replace(/[0-9]/g, '');
    let start = 0;
    const duration = 1200;
    const step = num / (duration / 16);
    const timer = setInterval(() => {
      start = Math.min(start + step, num);
      el.textContent = Math.floor(start) + suffix;
      if (start >= num) clearInterval(timer);
    }, 16);
  });
}

// Trigger when college section is visible
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      animateCounters();
      statsObserver.disconnect();
    }
  });
}, { threshold: 0.5 });

const statsEl = document.querySelector('.college-stats');
if (statsEl) statsObserver.observe(statsEl);

/* ============================================================
   17. ACTIVE NAV LINK HIGHLIGHT ON SCROLL
   ============================================================ */
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY + 100;
  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');
    const link = document.querySelector(`.nav-link[href="#${id}"]`);
    if (link) {
      if (scrollY >= top && scrollY < top + height) {
        link.style.color = 'var(--gold)';
      } else {
        link.style.color = '';
      }
    }
  });
}, { passive: true });

/* ============================================================
   18. CLUBS MODAL
   ============================================================ */
const clubsData = {
  rcctalkies: {
    name: 'RCC Talkies',
    tagline: 'Official Journalism Club of RCCIIT',
    logo: 'assets/images/rcc-logo.png',
    desc: 'RCC Talkies is the official journalism and media club of RCCIIT. We cover campus news, conduct interviews, publish magazines, create event posters, and maintain an active social media presence. From sports fests to tech events, we are the voice of the college.',
    events: [
      { icon: '📰', title: 'Magazine Launch 2024', desc: 'Launch of our flagship print magazine covering all major campus highlights of the year.' },
      { icon: '🎤', title: 'Interview Series', desc: 'Exclusive interviews with faculty, achievers, and industry guests visiting campus.' },
      { icon: '📸', title: 'Regalia Coverage', desc: 'Full photographic and video coverage of the cultural festival Regalia 2024.' },
      { icon: '🏆', title: 'GOT Sports Coverage', desc: 'Live reporting and photography from every match of the annual sports fest GOT.' },
      { icon: '💻', title: 'TechTrix Live Blog', desc: 'Real-time updates and highlight reels from RCCIIT\'s annual tech fest TechTrix.' },
      { icon: '🌐', title: 'Social Media Growth', desc: 'Grew Instagram to 5000+ followers with dedicated event reels and campus videos.' },
    ]
  },
  rcctechz: {
    name: 'RCC Techz',
    tagline: 'Technology & Coding Club of RCCIIT',
    logo: 'assets/images/rcctechz-logo.png',
    desc: 'RCC Techz is the premier technology and coding club of RCCIIT. We organize competitive programming contests, hackathons, workshops on emerging technologies, and sessions on web development, cloud computing, and open-source contribution.',
    events: [
      { icon: '💻', title: 'CodeFest 2024', desc: 'Annual coding competition with 200+ participants across multiple programming domains.' },
      { icon: '🌐', title: 'Web Dev Bootcamp', desc: 'Intensive 5-day bootcamp on full-stack web development with React and Node.js.' },
      { icon: '☁️', title: 'Cloud Computing Workshop', desc: 'Google Cloud & AWS hands-on workshop for students interested in cloud careers.' },
      { icon: '🤖', title: 'AI/ML Hackathon', desc: '36-hour hackathon focused on building real-world AI/ML solutions.' },
      { icon: '🔓', title: 'Open Source Sprint', desc: 'Collaborative open-source contribution drive for GitHub beginners and enthusiasts.' },
      { icon: '🏅', title: 'Competitive Programming', desc: 'Weekly CP sessions with practice rounds on Codeforces, LeetCode and HackerRank.' },
    ]
  },
  ignitex: {
    name: 'Ignitex',
    tagline: 'Innovation & Entrepreneurship Club',
    logo: 'assets/images/ignitex-logo.png',
    desc: 'Ignitex is RCCIIT\'s innovation and entrepreneurship club that ignites the startup spirit in students. We conduct ideathons, startup pitch competitions, design thinking workshops, and connect students with industry mentors and VCs.',
    events: [
      { icon: '💡', title: 'Ideathon 2024', desc: '48-hour idea marathon where student teams pitch innovative startup solutions.' },
      { icon: '🚀', title: 'Startup Weekend', desc: 'Weekend-long event where teams build product MVPs and present to real investors.' },
      { icon: '🎨', title: 'Design Thinking Workshop', desc: 'Workshop on human-centred design and problem solving with real case studies.' },
      { icon: '🤝', title: 'Mentor Connect', desc: 'Panel of industry professionals and startup founders mentoring student teams.' },
      { icon: '📊', title: 'Business Plan Contest', desc: 'Students present comprehensive business plans judged by investors and professors.' },
      { icon: '🌱', title: 'Social Innovation Drive', desc: 'Building solutions for social problems using tech – environment, health and education.' },
    ]
  },
  gdg: {
    name: 'GDG RCCIIT',
    tagline: 'Google Developer Group on Campus',
    logo: 'assets/images/gdg-logo.png',
    desc: 'GDG RCCIIT (Google Developer Group) is the official on-campus chapter of Google Developer Groups. We run study jams, Google Cloud workshops, Android development sessions, and help students prepare for Google certifications and careers at Google.',
    events: [
      { icon: '🔵', title: 'Google I/O Extended', desc: 'Campus viewing and discussion event for Google\'s annual developer conference I/O.' },
      { icon: '☁️', title: 'Cloud Study Jam', desc: 'Free Google Cloud training with hands-on labs and certification vouchers for all.' },
      { icon: '📱', title: 'Android Dev Workshop', desc: 'Building Android apps from scratch using Kotlin and Android Studio.' },
      { icon: '🧠', title: 'TensorFlow Study Group', desc: 'Regular sessions on machine learning with TensorFlow and Google Colab.' },
      { icon: '🏆', title: 'Solution Challenge 2024', desc: 'RCCIIT team participates in Google\'s annual Solution Challenge to solve UN SDGs.' },
      { icon: '🔥', title: 'Firebase Bootcamp', desc: 'Hands-on bootcamp to build real-time apps using Google Firebase platform.' },
    ]
  },
  artculture: {
    name: 'Art & Culture Club',
    tagline: 'Creative Arts & Cultural Activities Club',
    logo: 'assets/images/artculture-logo.png',
    desc: 'The Art & Culture Club of RCCIIT is the creative heart of the campus. We celebrate artistic expression through painting, music, dance, drama, and photography. We organize cultural showcases, competitions, and represent the college in inter-college cultural fests.',
    events: [
      { icon: '🎭', title: 'Drama Night 2024', desc: 'Stunning theatrical performances by students showcasing tales of courage and love.' },
      { icon: '🎨', title: 'Art Exhibition', desc: 'Annual student art exhibition featuring paintings, sketches and digital artworks.' },
      { icon: '💃', title: 'Dance Showcase', desc: 'Classical and contemporary dance performances by the club at Regalia\'s main stage.' },
      { icon: '🎵', title: 'Music Fiesta', desc: 'Inter-department singing competition featuring classical, folk and Western genres.' },
      { icon: '📷', title: 'Photography Contest', desc: 'Campus photography contest with themes of nature, portrait and street photography.' },
      { icon: '🎪', title: 'Inter-College Cultural Fest', desc: 'Team represents RCCIIT at leading inter-college cultural competitions across Kolkata.' },
    ]
  }
};

function openClubModal(clubId) {
  const club = clubsData[clubId];
  if (!club) return;

  document.getElementById('clubModalLogo').src = club.logo;
  document.getElementById('clubModalName').textContent = club.name;
  document.getElementById('clubModalTagline').textContent = club.tagline;
  document.getElementById('clubModalDesc').textContent = club.desc;

  const grid = document.getElementById('clubEventsGrid');
  grid.innerHTML = club.events.map(ev => `
    <div class="club-event-item">
      <div class="club-event-img">${ev.icon}</div>
      <div class="club-event-info">
        <h4>${ev.title}</h4>
        <p>${ev.desc}</p>
      </div>
    </div>
  `).join('');

  openModal('clubModal');
}
document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".about-card");

  cards.forEach((card) => {

    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = (y - centerY) / 18;
      const rotateY = (centerX - x) / 18;

      card.style.transform = `
        perspective(800px)
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
        translateY(-6px)
      `;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = `
        perspective(800px)
        rotateX(0deg)
        rotateY(0deg)
        translateY(0px)
      `;
    });

  });
});
async function handleFormSubmit(event) {
  event.preventDefault(); // ❗ stop page reload

  const name = document.getElementById("msgName").value;
  const email = document.getElementById("msgEmail").value;
  const phone = document.getElementById("msgPhone").value;
  const message = document.getElementById("msgText").value;

  // validation
  if (!name || !email || !message) {
    alert("Please fill all required fields ❗");
    return;
  }

  // insert into Supabase
  const { error } = await supabaseClient
    .from("contacts")
    .insert([
      {
        full_name: name,
        email: email,
        phone: phone,
        message: message
      }
    ]);

  if (error) {
    alert("Error ❌ " + error.message);
    console.log(error);
  } else {
    alert("Message sent successfully 🚀");

    // clear form
    document.getElementById("contactForm").reset();
  }
}
document.getElementById("signupForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = e.target.querySelector('input[type="text"]').value;
  const email = e.target.querySelector('input[type="email"]').value;
  const password = e.target.querySelector('input[type="password"]').value;

  const { data, error } = await supabaseClient.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: name }
    }
  });

  if (error) {
    alert(error.message);
  } else {
    alert("Signup successful 🎉 Check your email");
  }
});
document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = e.target.querySelector('input[type="email"]').value;
  const password = e.target.querySelector('input[type="password"]').value;

  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    alert(error.message);
  } else {
    alert("Login successful 🎉");
    location.reload();
  }
});
document.addEventListener("DOMContentLoaded", () => {

  async function checkUser() {
    const { data: { user } } = await supabaseClient.auth.getUser();
    return user;
  }

  async function updateNavbar() {
    const user = await checkUser();
    const nav = document.querySelector(".nav-auth");

    if (user) {
      nav.innerHTML = `
        <span style="color:#c9a84c;">👤 ${user.email}</span>
        <button onclick="logout()">Logout</button>
      `;
    }
  }

  updateNavbar();

  // make logout global (important for onclick)
  window.logout = async function () {
    await supabaseClient.auth.signOut();
    location.reload();
  };

});
function openModal(id) {
  document.getElementById(id).style.display = "block";
}

function closeModal(id) {
  document.getElementById(id).style.display = "none";
}
function switchToLogin() {
  closeModal('signupModal');
  openModal('loginModal');
}
document.querySelector(".google-btn").addEventListener("click", async () => {
  const { error } = await supabaseClient.auth.signInWithOAuth({
    provider: "google"
  });

  if (error) {
    alert(error.message);
  }
});
supabaseClient.auth.onAuthStateChange((event, session) => {
  if (session) {
    updateNavbar();
  }
});
async function signInWithGoogle() {
  const { data, error } = await supabaseClient.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: 'http://127.0.0.1:5500'
    }
  });

  if (error) console.error(error);
}

