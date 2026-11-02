// Nav: background on scroll + mobile menu
const nav = document.getElementById('nav');
const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 30);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

const menuBtn = document.getElementById('menuBtn');
const navLinks = document.getElementById('navLinks');
menuBtn.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', open);
});
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', false);
}));

// Reveal on scroll
const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('in'); revealObs.unobserve(e.target); }
    });
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

// Counters
const counterObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target, target = +el.dataset.target, start = performance.now(), dur = 1600;
        const tick = now => {
            const p = Math.min((now - start) / dur, 1);
            el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
            if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        counterObs.unobserve(el);
    });
}, { threshold: 0.6 });
document.querySelectorAll('.counter').forEach(el => counterObs.observe(el));

// Testimonial slider
const track = document.getElementById('tTrack');
if (track) {
    const step = () => track.querySelector('.t-card').offsetWidth + 22;
    document.getElementById('tNext').addEventListener('click', () => track.scrollBy({ left: step(), behavior: 'smooth' }));
    document.getElementById('tPrev').addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
}

// Neural network illustration
(function () {
    const svg = document.querySelector('.ai-visual svg');
    if (!svg) return;
    const ns = 'http://www.w3.org/2000/svg';
    const layers = [3, 5, 5, 2];
    const pts = layers.map((n, i) => Array.from({ length: n }, (_, j) => ({
        x: 70 + i * 87, y: 190 + (j - (n - 1) / 2) * 58
    })));
    const edges = svg.querySelector('.edges'), nodes = svg.querySelector('.nodes');
    let k = 0;
    for (let i = 0; i < pts.length - 1; i++) pts[i].forEach(a => pts[i + 1].forEach(b => {
        const l = document.createElementNS(ns, 'line');
        Object.entries({ x1: a.x, y1: a.y, x2: b.x, y2: b.y, class: 'edge' }).forEach(([key, v]) => l.setAttribute(key, v));
        edges.appendChild(l);
    }));
    pts.flat().forEach(p => {
        const c = document.createElementNS(ns, 'circle');
        Object.entries({ cx: p.x, cy: p.y, r: 9, class: 'node' }).forEach(([key, v]) => c.setAttribute(key, v));
        nodes.appendChild(c);
        const d = document.createElementNS(ns, 'circle');
        Object.entries({ cx: p.x, cy: p.y, r: 3.5, class: 'pulse' }).forEach(([key, v]) => d.setAttribute(key, v));
        d.style.animationDelay = (k++ * 0.17) % 2.6 + 's';
        nodes.appendChild(d);
    });
})();

// Contact form: submit to Netlify Forms without leaving the page
const form = document.getElementById('contactForm');
if (form) {
    const statusEl = document.getElementById('formStatus');
    form.addEventListener('submit', async e => {
        e.preventDefault();
        const btn = form.querySelector('button[type="submit"]');
        btn.disabled = true;
        statusEl.className = 'form-status';
        statusEl.textContent = 'Sending…';
        try {
            const res = await fetch('/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams(new FormData(form)).toString()
            });
            if (!res.ok) throw new Error(res.status);
            form.reset();
            statusEl.className = 'form-status ok';
            statusEl.textContent = "Thank you. We'll be in touch within one working day.";
        } catch {
            statusEl.className = 'form-status err';
            statusEl.textContent = 'Something went wrong. Please email akash@thequantelite.com or message us on WhatsApp.';
        } finally {
            btn.disabled = false;
        }
    });
}

const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();
