/* =============================================
   PORTFOLIO SCRIPTS — main.js
   Alex Chen · Frontend Engineer
   ============================================= */


/* ─────────────────────────────────────────────
   1. CUSTOM CURSOR
   Dual-layer animated cursor with hover states.
   Inner dot snaps immediately; outer ring lags
   behind via lerp for a smooth trailing effect.
───────────────────────────────────────────── */
const cursor     = document.getElementById('cursor');
const cursorRing = document.getElementById('cursor-ring');

let mouseX = 0, mouseY = 0;  // raw mouse position
let ringX  = 0, ringY  = 0;  // smoothed ring position

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

(function animateCursor() {
  // Dot follows mouse instantly
  cursor.style.left = mouseX + 'px';
  cursor.style.top  = mouseY + 'px';

  // Ring lerps toward mouse for smooth lag
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  cursorRing.style.left = ringX + 'px';
  cursorRing.style.top  = ringY + 'px';

  requestAnimationFrame(animateCursor);
})();

// Enlarge cursor when hovering interactive elements
const hoverTargets = 'a, button, .filter-btn, .cmd-pill, .project-card, .skill-card, .theme-toggle, .social-link';
document.querySelectorAll(hoverTargets).forEach((el) => {
  el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
});


/* ─────────────────────────────────────────────
   2. SCROLL PROGRESS BAR
   Thin accent line at the very top of the viewport
   that fills left-to-right as the user scrolls.
───────────────────────────────────────────── */
const progressBar = document.getElementById('progress');

window.addEventListener('scroll', () => {
  const scrolled    = window.scrollY;
  const totalHeight = document.body.scrollHeight - window.innerHeight;
  const percentage  = totalHeight > 0 ? scrolled / totalHeight : 0;
  progressBar.style.transform = `scaleX(${percentage})`;
});


/* ─────────────────────────────────────────────
   3. SCROLL REVEAL (IntersectionObserver)
   Elements with class "reveal" fade + slide up
   when they enter the viewport.
   Delay variants: reveal-delay-1/2/3 for stagger.
───────────────────────────────────────────── */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  },
  { threshold: 0.1 }
);

document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));


/* ─────────────────────────────────────────────
   4. PROJECT FILTER
   Filter project cards by category using data
   attributes. Active filter button is highlighted.
───────────────────────────────────────────── */
document.querySelectorAll('.filter-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    // Update active button state
    document.querySelectorAll('.filter-btn').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;

    document.querySelectorAll('.project-card').forEach((card) => {
      const match = filter === 'all' || card.dataset.category === filter;
      card.classList.toggle('hidden', !match);
    });
  });
});


/* ─────────────────────────────────────────────
   5. THEME TOGGLE (Dark / Light)
   Toggles the "light" class on <body> and the
   toggle button, flipping all CSS custom properties.
───────────────────────────────────────────── */
function toggleTheme() {
  document.body.classList.toggle('light');
  document.getElementById('themeToggle').classList.toggle('light');

  // Persist preference to localStorage
  const isLight = document.body.classList.contains('light');
  localStorage.setItem('portfolio-theme', isLight ? 'light' : 'dark');
}

// Restore saved theme on page load
(function restoreTheme() {
  const saved = localStorage.getItem('portfolio-theme');
  if (saved === 'light') {
    document.body.classList.add('light');
    document.getElementById('themeToggle').classList.add('light');
  }
})();


/* ─────────────────────────────────────────────
   6. RESUME DOWNLOAD
   Generates a plain-text resume and triggers a
   file download. Replace with a real PDF link.
───────────────────────────────────────────── */
function downloadResume(e) {
  e.preventDefault();

  const resumeText = [
    'ALEX CHEN — Frontend Engineer',
    '================================',
    '',
    'Contact',
    '-------',
    'Email:    alex.chen@email.com',
    'GitHub:   github.com/alexchen',
    'LinkedIn: linkedin.com/in/alexchen',
    'Website:  alexchen.dev',
    '',
    'Summary',
    '-------',
    '6 years building immersive web experiences at the intersection of',
    'engineering and design. Specialist in Svelte/SvelteKit, TypeScript,',
    'WebGL, and performance optimization.',
    '',
    'Experience',
    '----------',
    '2023–now   Senior Frontend Engineer — Vercel (contract)',
    '2021–2023  Frontend Lead            — Luma AI',
    '2019–2021  Frontend Engineer        — Linear',
    '2018–2019  Junior Developer         — Stripe',
    '',
    'Core Skills',
    '-----------',
    'Frameworks : Svelte/Kit, React, Vue 3, Astro',
    'Animation  : GSAP, Motion One, Framer Motion',
    '3D / WebGL : Three.js, R3F, GLSL shaders',
    'Tooling    : TypeScript, Vite, Vitest, Playwright',
    '',
    'Education',
    '---------',
    'B.Sc. Computer Science — UC Berkeley, 2018',
  ].join('\n');

  const blob = new Blob([resumeText], { type: 'text/plain' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = 'alex-chen-resume.txt';
  a.click();
  URL.revokeObjectURL(url);
}


/* ─────────────────────────────────────────────
   7. CONTACT FORM
   Client-side validation + success feedback.
   Replace the console.log with a real API call
   (e.g. Resend, EmailJS, Formspree) as needed.
───────────────────────────────────────────── */
function handleSubmit() {
  const nameEl    = document.getElementById('fname');
  const emailEl   = document.getElementById('femail');
  const subjectEl = document.getElementById('fsubject');
  const msgEl     = document.getElementById('fmsg');
  const formMsg   = document.getElementById('formMsg');

  const name    = nameEl.value.trim();
  const email   = emailEl.value.trim();
  const subject = subjectEl.value.trim();
  const message = msgEl.value.trim();

  // Reset border states
  [nameEl, emailEl].forEach((el) => (el.style.borderColor = ''));

  // Basic validation
  let valid = true;
  if (!name)  { nameEl.style.borderColor  = 'var(--red)'; valid = false; }
  if (!email || !email.includes('@')) {
    emailEl.style.borderColor = 'var(--red)';
    valid = false;
  }
  if (!valid) return;

  // TODO: Replace with real API call
  console.log('Form submission:', { name, email, subject, message });

  // Show success message
  formMsg.classList.add('show');

  // Clear all fields
  [nameEl, emailEl, subjectEl, msgEl].forEach((el) => (el.value = ''));

  // Hide success message after 5 seconds
  setTimeout(() => formMsg.classList.remove('show'), 5000);
}


/* ─────────────────────────────────────────────
   8. INTERACTIVE TERMINAL
   A fully functional in-page terminal.
   Supports: help, about, skills, experience,
   contact, stack, fun, clear.
   Click suggestion pills or type directly.
───────────────────────────────────────────── */

/** All recognised commands and their output lines. */
const terminalCommands = {
  help: () => [
    `<span style="color:var(--accent)">Available commands:</span>`,
    `  <span style="color:var(--green)">about</span>      — Who I am`,
    `  <span style="color:var(--green)">skills</span>     — Technical skills`,
    `  <span style="color:var(--green)">experience</span> — Work history`,
    `  <span style="color:var(--green)">contact</span>    — How to reach me`,
    `  <span style="color:var(--green)">stack</span>      — Favourite tech stack`,
    `  <span style="color:var(--green)">fun</span>        — Something unexpected`,
    `  <span style="color:var(--green)">clear</span>      — Clear the terminal`,
  ],

  about: () => [
    `Frontend engineer focused on <span style="color:var(--accent)">Svelte</span>, performance, and motion design.`,
    `6 years building web products. Based in San Francisco.`,
    `Open to: <span style="color:var(--green)">full-time</span> + <span style="color:var(--green)">freelance</span>`,
  ],

  skills: () => [
    `<span style="color:var(--accent)">Frameworks:</span>  Svelte/Kit, React, Vue 3, Astro`,
    `<span style="color:var(--purple)">Animation:</span>   GSAP, Motion One, Svelte transitions`,
    `<span style="color:var(--green)">3D / WebGL:</span>  Three.js, R3F, GLSL shaders`,
    `<span style="color:var(--amber)">Tooling:</span>     TypeScript, Vite, Vitest, Playwright`,
  ],

  experience: () => [
    `<span style="color:var(--accent)">2023–now </span>  Senior Frontend @ Vercel (contract)`,
    `<span style="color:var(--accent)">2021–2023</span>  Frontend Lead @ Luma AI`,
    `<span style="color:var(--accent)">2019–2021</span>  Frontend Engineer @ Linear`,
    `<span style="color:var(--accent)">2018–2019</span>  Junior Developer @ Stripe`,
  ],

  contact: () => [
    `Email:    <span style="color:var(--accent)">alex.chen@email.com</span>`,
    `GitHub:   <span style="color:var(--accent)">github.com/alexchen</span>`,
    `Twitter:  <span style="color:var(--accent)">@alexchendev</span>`,
    `Calendar: <span style="color:var(--accent)">cal.com/alexchen</span>`,
  ],

  stack: () => [
    `<span style="color:var(--purple)">The dream stack (2025):</span>`,
    `  SvelteKit + TypeScript + Vite`,
    `  TailwindCSS v4 + Motion One`,
    `  Cloudflare Workers + D1`,
    `  Playwright for e2e testing`,
  ],

  fun: () => [
    `<span style="color:var(--amber)">Fun facts:</span>`,
    `  • I once optimised a canvas to render 1M particles at 60fps`,
    `  • I use Vim. But I do use the mouse sometimes. (don't tell anyone)`,
    `  • My Lighthouse score obsession is a diagnosable condition`,
    `  • I've written GLSL shaders for a cooking recipe app. Worth it.`,
  ],

  clear: () => {
    clearTerminal();
    return []; // no output lines after clearing
  },
};

/** Remove all lines from the terminal body. */
function clearTerminal() {
  document.getElementById('itBody').innerHTML = '';
}

/** Append a single HTML line to the terminal body. */
function appendLine(html) {
  const body = document.getElementById('itBody');
  const div  = document.createElement('div');
  div.className   = 'it-line';
  div.innerHTML   = html;
  body.appendChild(div);
  body.scrollTop  = body.scrollHeight; // auto-scroll to bottom
}

/**
 * Execute a terminal command by name.
 * Prints the prompt + command, then each output line.
 * Unknown commands print an error hint.
 */
function runCmd(rawInput) {
  const cmd = rawInput.trim().toLowerCase();

  // Echo the prompt + typed command
  appendLine(
    `<span style="color:var(--green)">alex@portfolio:~$</span> ${cmd}`
  );

  if (cmd === '') {
    // Empty enter — just show a new prompt line
    return;
  }

  if (terminalCommands[cmd]) {
    const lines = terminalCommands[cmd]();
    lines.forEach((line) =>
      appendLine(`<span style="color:var(--text2)">${line}</span>`)
    );
  } else {
    appendLine(
      `<span style="color:var(--red)">command not found: ${cmd}</span>` +
      ` — try <span style="color:var(--accent)">help</span>`
    );
  }

  // Blank spacer line between commands
  appendLine('&nbsp;');

  // Clear the input field
  document.getElementById('itInput').value = '';
}

// Handle Enter key in the terminal input
document.getElementById('itInput').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    runCmd(e.target.value);
  }
});

// Auto-run "help" on page load so the terminal isn't empty
setTimeout(() => runCmd('help'), 400);
