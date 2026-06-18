const chapters = Array.from(document.querySelectorAll('.chapter'));
const root = document.documentElement;
const navLinks = Array.from(document.querySelectorAll('.nav-links a'));
const dots = document.querySelector('.progress-dots');
const menuButton = document.querySelector('.menu-button');
const navMenu = document.querySelector('.nav-links');
const loader = document.querySelector('.loader');
const traceCanvas = document.querySelector('.trace-canvas');
const traceContext = traceCanvas.getContext('2d');
const tracePoints = [];

if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

const hexToRgb = (hex) => {
    const value = hex.replace('#', '');
    return {
        r: parseInt(value.slice(0, 2), 16),
        g: parseInt(value.slice(2, 4), 16),
        b: parseInt(value.slice(4, 6), 16)
    };
};

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const mix = (from, to, progress) => from + (to - from) * progress;
const easeOut = (value) => 1 - Math.pow(1 - value, 3);

const mixColor = (from, to, progress) => {
    const start = hexToRgb(from);
    const end = hexToRgb(to);
    return `rgb(${Math.round(mix(start.r, end.r, progress))}, ${Math.round(mix(start.g, end.g, progress))}, ${Math.round(mix(start.b, end.b, progress))})`;
};

function traceAllowed() {
    return document.body.dataset.active === 'home';
}

chapters.forEach((chapter) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.setAttribute('aria-label', `Go to ${chapter.id}`);
    dot.addEventListener('click', () => {
        history.pushState(null, '', `#${chapter.id}`);
        window.scrollTo({ top: chapter.offsetTop, behavior: 'smooth' });
    });
    dots.appendChild(dot);
});

const dotButtons = Array.from(dots.querySelectorAll('button'));

function chapterProgress() {
    const scrollRange = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    return clamp(window.scrollY / scrollRange, 0, 1);
}

function activeChapterIndex() {
    const center = window.innerHeight * 0.5;
    let bestIndex = 0;
    let bestDistance = Infinity;

    chapters.forEach((chapter, index) => {
        const rect = chapter.getBoundingClientRect();
        const distance = Math.abs(rect.top + rect.height * 0.5 - center);
        if (distance < bestDistance) {
            bestDistance = distance;
            bestIndex = index;
        }
    });

    return bestIndex;
}

function updateScene() {
    const progress = chapterProgress();
    const scaled = progress * (chapters.length - 1);
    const index = Math.min(chapters.length - 2, Math.floor(scaled));
    const nextIndex = Math.min(chapters.length - 1, index + 1);
    const local = clamp(scaled - index, 0, 1);
    const active = activeChapterIndex();
    const current = chapters[index].dataset;
    const next = chapters[nextIndex].dataset;
    const activeId = chapters[active].id;

    document.body.dataset.active = activeId;
    root.style.setProperty('--scene-bg', mixColor(current.bg, next.bg, local));
    root.style.setProperty('--scene-ink', mixColor(current.ink, next.ink, local));
    root.style.setProperty('--scroll-progress', progress.toFixed(4));

    navLinks.forEach((link) => {
        link.classList.toggle('active', link.getAttribute('href') === `#${activeId}`);
    });

    chapters.forEach((chapter, chapterIndex) => {
        chapter.classList.toggle('is-active', chapterIndex === active);
    });

    dotButtons.forEach((dot, dotIndex) => {
        dot.classList.toggle('active', dotIndex === active);
    });
}

navLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
            event.preventDefault();
            history.pushState(null, '', link.getAttribute('href'));
            window.scrollTo({ top: target.offsetTop, behavior: 'smooth' });
        }

        navMenu.classList.remove('open');
        menuButton.setAttribute('aria-expanded', 'false');
    });
});

menuButton.addEventListener('click', () => {
    const open = navMenu.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(open));
});

function setVH() {
    root.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
}

function resizeTraceCanvas() {
    const ratio = window.devicePixelRatio || 1;
    traceCanvas.width = Math.floor(window.innerWidth * ratio);
    traceCanvas.height = Math.floor(window.innerHeight * ratio);
    traceCanvas.style.width = `${window.innerWidth}px`;
    traceCanvas.style.height = `${window.innerHeight}px`;
    traceContext.setTransform(ratio, 0, 0, ratio, 0, 0);
}

function drawTrace() {
    traceContext.clearRect(0, 0, window.innerWidth, window.innerHeight);

    for (let index = tracePoints.length - 1; index >= 0; index -= 1) {
        const point = tracePoints[index];
        point.life -= 0.018;

        if (point.life <= 0) {
            tracePoints.splice(index, 1);
            continue;
        }

        const size = 8 + point.life * 18;
        traceContext.beginPath();
        traceContext.arc(point.x, point.y, size, 0, Math.PI * 2);
        traceContext.strokeStyle = `rgba(8, 3, 87, ${point.life * 0.12})`;
        traceContext.lineWidth = 1.5;
        traceContext.stroke();
    }

    requestAnimationFrame(drawTrace);
}

function scrollToHash() {
    if (!window.location.hash) {
        return;
    }

    const target = document.querySelector(window.location.hash);
    if (target) {
        const top = target.offsetTop;
        window.scrollTo(0, top);
        document.documentElement.scrollTop = top;
        document.body.scrollTop = top;
        target.scrollIntoView({ block: 'start' });
        updateScene();
    }
}

setVH();
resizeTraceCanvas();
updateScene();
drawTrace();

setTimeout(scrollToHash, 50);
setTimeout(scrollToHash, 250);
setTimeout(scrollToHash, 800);
let hashRestoreAttempts = 0;
const hashRestoreTimer = window.setInterval(() => {
    hashRestoreAttempts += 1;
    scrollToHash();

    if (!window.location.hash || hashRestoreAttempts >= 8) {
        window.clearInterval(hashRestoreTimer);
    }
}, 180);

window.addEventListener('scroll', updateScene, { passive: true });
window.addEventListener('hashchange', () => setTimeout(scrollToHash, 0));
window.addEventListener('load', () => setTimeout(scrollToHash, 0));
window.addEventListener('pageshow', () => setTimeout(scrollToHash, 0));
window.addEventListener('pointermove', (event) => {
    const offsetX = event.clientX - window.innerWidth * 0.5;
    const offsetY = event.clientY - window.innerHeight * 0.5;
    const activePanel = document.querySelector('.chapter.is-active .chapter-inner');

    root.style.setProperty('--mouse-x', `${offsetX}px`);
    root.style.setProperty('--mouse-y', `${offsetY}px`);
    root.style.setProperty('--panel-tilt-x', `${clamp(offsetY / -90, -3, 3).toFixed(2)}deg`);
    root.style.setProperty('--panel-tilt-y', `${clamp(offsetX / 110, -3, 3).toFixed(2)}deg`);

    if (activePanel && traceAllowed()) {
        const panelRect = activePanel.getBoundingClientRect();
        const insidePanel = event.clientX >= panelRect.left
            && event.clientX <= panelRect.right
            && event.clientY >= panelRect.top
            && event.clientY <= panelRect.bottom;

        if (insidePanel) {
            tracePoints.push({
                x: event.clientX,
                y: event.clientY,
                life: 1
            });
        }
    }

    if (tracePoints.length > 26) {
        tracePoints.shift();
    }
});
window.addEventListener('resize', () => {
    setVH();
    resizeTraceCanvas();
    updateScene();
});

window.addEventListener('load', () => {
    setTimeout(() => {
        document.body.classList.add('is-loaded');
        if (loader) {
            loader.setAttribute('aria-hidden', 'true');
        }
    }, 650);
});

setTimeout(() => {
    document.body.classList.add('is-loaded');
}, 1400);
