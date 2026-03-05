document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initParticles();
    initScrollReveal();
    initLightbox();
});

function initNavbar() {
    const navbar = document.getElementById('navbar');
    const toggle = document.getElementById('navToggle');

    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });

    if (toggle) {
        toggle.addEventListener('click', () => {
            const links = navbar.querySelector('.nav-links');
            if (links) {
                links.classList.toggle('mobile-open');
            }
        });
    }

    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                e.preventDefault();
                const offset = 80;
                const top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top, behavior: 'smooth' });

                const links = navbar.querySelector('.nav-links');
                if (links) links.classList.remove('mobile-open');
            }
        });
    });
}

function initParticles() {
    const container = document.getElementById('particles');
    if (!container) return;

    const count = 60;
    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = -Math.random() * 8 + 's';
        particle.style.animationDuration = (4 + Math.random() * 5) + 's';
        const size = (2 + Math.random() * 4) + 'px';
        particle.style.width = size;
        particle.style.height = size;
        container.appendChild(particle);
    }
}

function initScrollReveal() {
    const elements = document.querySelectorAll('[data-aos]');
    if (!elements.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
    });

    elements.forEach((el, i) => {
        el.style.transitionDelay = (i % 3) * 0.1 + 's';
        observer.observe(el);
    });
}

function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;

    let activeEls = [];
    let timeouts = [];

    function cleanup() {
        timeouts.forEach(t => clearTimeout(t));
        timeouts = [];
        activeEls.forEach(el => el.remove());
        activeEls = [];
    }

    function delay(ms) {
        return new Promise(resolve => {
            const t = setTimeout(resolve, ms);
            timeouts.push(t);
        });
    }

    async function openLightbox(thumbImg) {
        cleanup();

        const src = thumbImg.src;
        const alt = thumbImg.alt;
        const thumbRect = thumbImg.getBoundingClientRect();
        const tw = thumbRect.width;
        const th = thumbRect.height;
        const tx = thumbRect.left;
        const ty = thumbRect.top;

        const maxW = window.innerWidth * 0.85;
        const maxH = window.innerHeight * 0.85;
        const natImg = new Image();
        const loaded = new Promise(r => { natImg.onload = r; });
        natImg.src = src;
        await loaded;
        const ratio = Math.min(maxW / natImg.naturalWidth, maxH / natImg.naturalHeight, 1);
        const fw = natImg.naturalWidth * ratio;
        const fh = natImg.naturalHeight * ratio;
        const fx = (window.innerWidth - fw) / 2;
        const fy = (window.innerHeight - fh) / 2;

        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';

        const slash = document.createElement('div');
        slash.className = 'lb-slash';
        slash.style.left = tx + 'px';
        slash.style.top = ty + 'px';
        slash.style.width = tw + 'px';
        slash.style.height = th + 'px';
        document.body.appendChild(slash);
        activeEls.push(slash);

        const halfTR = document.createElement('div');
        halfTR.className = 'lb-half';
        halfTR.style.left = tx + 'px';
        halfTR.style.top = ty + 'px';
        halfTR.style.width = tw + 'px';
        halfTR.style.height = th + 'px';
        halfTR.style.clipPath = 'polygon(0 0, 100% 0, 100% 100%)';
        const imgTR = document.createElement('img');
        imgTR.src = src;
        imgTR.alt = alt;
        imgTR.style.width = tw + 'px';
        imgTR.style.height = th + 'px';
        halfTR.appendChild(imgTR);
        document.body.appendChild(halfTR);
        activeEls.push(halfTR);

        const halfBL = document.createElement('div');
        halfBL.className = 'lb-half';
        halfBL.style.left = tx + 'px';
        halfBL.style.top = ty + 'px';
        halfBL.style.width = tw + 'px';
        halfBL.style.height = th + 'px';
        halfBL.style.clipPath = 'polygon(0 0, 100% 100%, 0 100%)';
        const imgBL = document.createElement('img');
        imgBL.src = src;
        imgBL.alt = alt;
        imgBL.style.width = tw + 'px';
        imgBL.style.height = th + 'px';
        halfBL.appendChild(imgBL);
        document.body.appendChild(halfBL);
        activeEls.push(halfBL);

        thumbImg.style.visibility = 'hidden';

        await delay(30);
        slash.classList.add('animate');

        await delay(150);
        const splitDist = tw * 0.3;
        halfTR.style.transition = 'transform 0.25s cubic-bezier(0.22, 1, 0.36, 1)';
        halfBL.style.transition = 'transform 0.25s cubic-bezier(0.22, 1, 0.36, 1)';
        halfTR.style.transform = 'translateX(' + splitDist + 'px)';
        halfBL.style.transform = 'translateX(' + (-splitDist) + 'px)';

        await delay(280);
        slash.remove();

        const dur = '0.35s';
        const ease = 'cubic-bezier(0.17, 0.89, 0.32, 1.28)';
        const transition = 'left ' + dur + ' ' + ease + ', top ' + dur + ' ' + ease +
            ', width ' + dur + ' ' + ease + ', height ' + dur + ' ' + ease +
            ', transform ' + dur + ' ' + ease;

        halfTR.style.transition = transition;
        halfBL.style.transition = transition;

        halfTR.style.left = fx + 'px';
        halfTR.style.top = fy + 'px';
        halfTR.style.width = fw + 'px';
        halfTR.style.height = fh + 'px';
        halfTR.style.transform = 'translateX(0)';
        imgTR.style.width = fw + 'px';
        imgTR.style.height = fh + 'px';

        halfBL.style.left = fx + 'px';
        halfBL.style.top = fy + 'px';
        halfBL.style.width = fw + 'px';
        halfBL.style.height = fh + 'px';
        halfBL.style.transform = 'translateX(0)';
        imgBL.style.width = fw + 'px';
        imgBL.style.height = fh + 'px';

        await delay(380);
        halfTR.remove();
        halfBL.remove();

        const final = document.createElement('div');
        final.className = 'lb-stage-final';
        final.style.left = fx + 'px';
        final.style.top = fy + 'px';
        final.style.width = fw + 'px';
        final.style.height = fh + 'px';
        const finalImg = document.createElement('img');
        finalImg.src = src;
        finalImg.alt = alt;
        final.appendChild(finalImg);
        document.body.appendChild(final);
        activeEls.push(final);

        requestAnimationFrame(() => final.classList.add('shake'));

        final.addEventListener('click', () => closeLightbox(thumbImg));
    }

    function closeLightbox(thumbImg) {
        cleanup();
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
        if (thumbImg) thumbImg.style.visibility = '';
    }

    document.querySelectorAll('.screenshot-card img').forEach(img => {
        img.addEventListener('click', () => openLightbox(img));
    });

    lightbox.querySelector('.lightbox-backdrop').addEventListener('click', () => {
        const hiddenThumb = document.querySelector('.screenshot-card img[style*="hidden"]');
        closeLightbox(hiddenThumb);
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            const hiddenThumb = document.querySelector('.screenshot-card img[style*="hidden"]');
            closeLightbox(hiddenThumb);
        }
    });
}
