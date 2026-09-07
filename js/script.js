gsap.registerPlugin(ScrollTrigger);

/* ==========================================
   1. LENIS - SMOOTH SCROLL AMANTEIGADO
========================================== */
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    smooth: true,
});
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => { lenis.raf(time * 1000); });
gsap.ticker.lagSmoothing(0);

/* ==========================================
   2. CURSOR PERSONALIZADO ULTRA SUAVE
========================================== */
const cursorDot = document.querySelector('.cursor-dot');
const cursorFollower = document.querySelector('.cursor-follower');

const xToDot = gsap.quickTo(cursorDot, "x", {duration: 0.1, ease: "power3"});
const yToDot = gsap.quickTo(cursorDot, "y", {duration: 0.1, ease: "power3"});
const xToFollower = gsap.quickTo(cursorFollower, "x", {duration: 0.6, ease: "power3.out"});
const yToFollower = gsap.quickTo(cursorFollower, "y", {duration: 0.6, ease: "power3.out"});

window.addEventListener("mousemove", (e) => {
    xToDot(e.clientX); yToDot(e.clientY);
    xToFollower(e.clientX); yToFollower(e.clientY);
});

const hoverElements = document.querySelectorAll('a, button, .split-side');
hoverElements.forEach(el => {
    el.addEventListener('mouseenter', () => cursorFollower.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => cursorFollower.classList.remove('cursor-hover'));
});

/* ==========================================
   3. HERO & PARALLAX
========================================== */
const tlHero = gsap.timeline({ delay: 0.2 });
tlHero.to(".pre-title", { y: "0%", duration: 1, ease: "power4.out" })
      .to(".hero-title span", { y: "0%", duration: 1.2, stagger: 0.15, ease: "power4.out" }, "-=0.8")
      .to(".hero-date", { y: "0%", duration: 1, ease: "power4.out" }, "-=0.8");

gsap.to(".hero-image", {
    yPercent: 30, ease: "none",
    scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true }
});

/* ==========================================
   4. A MAGIA: ZOOM NO OLHAR + HISTÓRIA HORIZONTAL
========================================== */
if (window.innerWidth > 1024) { // Habilita a complexidade só em telas grandes
    
    const portalSection = document.querySelector('.story-portal-section');
    const horizontalContainer = document.querySelector('.story-horizontal');
    
    // Cria a Master Timeline travada (pinned)
    const portalTl = gsap.timeline({
        scrollTrigger: {
            trigger: portalSection,
            start: "top top",
            // A altura do pin precisa cobrir o zoom + a rolagem lateral inteira
            end: () => `+=${window.innerHeight * 2 + horizontalContainer.scrollWidth}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true
        }
    });

    // FASE 1: O Zoom Absurdo na Imagem e Fade Out
    portalTl.to(".the-eye-layer", {
        scale: 20,              // Aumenta a imagem 20 vezes
        filter: "blur(20px)",   // Desfoca simulando lente de câmera
        opacity: 0,             // Fica transparente
        duration: 2,
        ease: "power2.in"
    }, 0); // Inicia no tempo 0

    // FASE 1.5: A História Cresce do Fundo
    portalTl.to(".story-inside-layer", {
        scale: 1,
        opacity: 1,
        duration: 1.5,
        ease: "power2.out"
    }, 0.5); // Começa enquanto o olho ainda está dando zoom

    // FASE 2: O Scroll Horizontal da História (O Rolo de Filme)
    portalTl.to(horizontalContainer, {
        x: () => -(horizontalContainer.scrollWidth - window.innerWidth),
        duration: 4, // Dura bastante tempo para o usuário ler enquanto rola
        ease: "none"
    }, 2); // Inicia depois que a fase de zoom acaba
    
    // Parallax Interno das fotos da história
    const hImgs = gsap.utils.toArray('.h-img');
    hImgs.forEach(img => {
        gsap.to(img, {
            x: "15%",
            ease: "none",
            scrollTrigger: {
                trigger: portalSection,
                start: "top top",
                end: () => `+=${window.innerHeight * 2 + horizontalContainer.scrollWidth}`,
                scrub: 1
            }
        });
    });
}

/* ==========================================
   5. FADE UP GERAL
========================================== */
const fadeElements = document.querySelectorAll('.fade-up');
fadeElements.forEach(el => {
    gsap.fromTo(el, { y: 60, opacity: 0 }, { 
        y: 0, opacity: 1, duration: 1.2, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none reverse" }
    });
});

/* ==========================================
   6. CONTAGEM REGRESSIVA
========================================== */
const weddingDate = new Date("Nov 15, 2027 16:00:00").getTime();
setInterval(() => {
    const now = new Date().getTime();
    const distance = weddingDate - now;

    if (distance > 0) {
        document.getElementById("dias").innerText = Math.floor(distance / (1000 * 60 * 60 * 24)).toString().padStart(2, '0');
        document.getElementById("horas").innerText = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString().padStart(2, '0');
        document.getElementById("minutos").innerText = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
        document.getElementById("segundos").innerText = Math.floor((distance % (1000 * 60)) / 1000).toString().padStart(2, '0');
    }
}, 1000);