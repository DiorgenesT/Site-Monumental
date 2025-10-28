document.addEventListener('DOMContentLoaded', () => {
    gsap.registerPlugin(ScrollTrigger, Flip, ScrollToPlugin);
    lucide.createIcons();
    twemoji.parse(document.body, {
        folder: 'svg',
        ext: '.svg'
    });

    // ========== HERO BACKGROUND CANVAS ANIMATION ==========
    const canvas = document.getElementById('hero-background-canvas');
    const mainElement = document.querySelector('main');
    let animationFrameId;
    const logoImage = new Image();
    logoImage.crossOrigin = "Anonymous"; // Fix for tainted canvas
    let logoLoaded = false;
    const tintedLogos = {};
    const mouse = { x: undefined, y: undefined }; // Track mouse position

    logoImage.src = 'img/logo.png';
    logoImage.onerror = () => { 
        logoImage.src = 'https://placehold.co/100x100/ffffff/cccccc?text=Logo';
    };
    logoImage.onload = () => {
        logoLoaded = true;
        createTintedLogos();
        resizeCanvas(); 
    };


    if (canvas && mainElement) {
        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];

        function createTintedLogos() {
            const colors = {
                red: 'rgba(220, 38, 38, 0.4)',
                grey: 'rgba(209, 213, 219, 0.3)'
            };
            for (const key in colors) {
                const tintCanvas = document.createElement('canvas');
                tintCanvas.width = logoImage.width;
                tintCanvas.height = logoImage.height;
                const tintCtx = tintCanvas.getContext('2d');
                
                tintCtx.fillStyle = colors[key];
                tintCtx.fillRect(0, 0, tintCanvas.width, tintCanvas.height);
                tintCtx.globalCompositeOperation = 'destination-in';
                tintCtx.drawImage(logoImage, 0, 0);
                tintedLogos[key] = tintCanvas;
            }
        }

        function resizeCanvas() {
            width = canvas.width = mainElement.offsetWidth;
            height = canvas.height = mainElement.offsetHeight;
            if(logoLoaded) initParticles();
        }

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.size = Math.random() * 80 + 30; 
                this.speedX = (Math.random() - 0.5) * 0.3;
                this.speedY = (Math.random() - 0.5) * 0.3;
                this.rotation = Math.random() * Math.PI * 2;
                this.rotationSpeed = (Math.random() - 0.5) * 0.005;
                this.tint = Math.random() > 0.3 ? 'grey' : 'red';
                
                // Properties for interactivity
                this.originalSize = this.size;
                this.targetSize = this.originalSize;
                this.alpha = 0.5;
                this.originalAlpha = 0.5;
                this.targetAlpha = this.originalAlpha;
            }
            update() {
                // Movement logic
                this.x += this.speedX;
                this.y += this.speedY;
                this.rotation += this.rotationSpeed;

                if (this.x > width + this.size) this.x = -this.size;
                if (this.x < -this.size) this.x = width + this.size;
                if (this.y > height + this.size) this.y = -this.size;
                if (this.y < -this.size) this.y = height + this.size;
                
                // Interactivity logic
                if (mouse.x !== undefined && mouse.y !== undefined) {
                    const dx = this.x - mouse.x;
                    const dy = this.y - mouse.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < 100) { // Interaction radius
                        this.targetSize = this.originalSize * 1.5; // Grow 50%
                        this.targetAlpha = 1; // Become fully opaque
                    } else {
                        this.targetSize = this.originalSize;
                        this.targetAlpha = this.originalAlpha;
                    }
                } else {
                     this.targetSize = this.originalSize;
                     this.targetAlpha = this.originalAlpha;
                }

                // Easing for smooth transition
                this.size += (this.targetSize - this.size) * 0.1;
                this.alpha += (this.targetAlpha - this.alpha) * 0.1;
            }
            draw() {
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(this.rotation);
                ctx.globalAlpha = this.alpha;
                ctx.drawImage(tintedLogos[this.tint], -this.size / 2, -this.size / 2, this.size, this.size * (logoImage.height / logoImage.width));
                ctx.restore();
            }
        }

        function initParticles() {
            particles = [];
            // Increased number of particles
            let numberOfParticles = Math.floor((width * height) / 25000);
            for (let i = 0; i < numberOfParticles; i++) {
                particles.push(new Particle());
            }
        }
        
        function animate() {
            ctx.clearRect(0, 0, width, height);
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();
            }
            animationFrameId = requestAnimationFrame(animate);
        }

        window.addEventListener('resize', resizeCanvas);
        
        // Mouse move listener for interactivity
        canvas.addEventListener('mousemove', (event) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = event.clientX - rect.left;
            mouse.y = event.clientY - rect.top;
        });

        canvas.addEventListener('mouseleave', () => {
            mouse.x = undefined;
            mouse.y = undefined;
        });
    }

    // ANIMAÇÃO DE ABERTURA (SUAVIZADA)
    const loaderText = document.getElementById('loader-text');
    if (loaderText) {
        const text = loaderText.textContent;
        loaderText.innerHTML = '';
        text.split('').forEach(char => {
            const span = document.createElement('span');
            span.className = 'char';
            span.innerHTML = char === ' ' ? '&nbsp;' : char;
            loaderText.appendChild(span);
        });
        gsap.set(loaderText, { autoAlpha: 1 });
    }

    gsap.set("#main-content", { autoAlpha: 0 });
    gsap.set(".hero-h1, .hero-p, .hero-cta, .hero-image", { autoAlpha: 0, y: 20 });
    gsap.set("#header-wrapper", { autoAlpha: 0});
    gsap.set("#assistance-fab, #regulation-fab", { autoAlpha: 0 });
    // The CSS rule #loader-logo { opacity: 0; } handles the initial state.
    // This JS set is still good for defining the starting point for the animation.
    gsap.set("#loader-logo", { autoAlpha: 0, y: 20 });

    const headerWrapper = document.getElementById('header-wrapper');
    gsap.set(headerWrapper, { autoAlpha: 1 });
    const headerHeight = headerWrapper.offsetHeight;
    if(mainElement) mainElement.style.paddingTop = `${headerHeight}px`;
    gsap.set(headerWrapper, { autoAlpha: 0 });

    const tl = gsap.timeline({
        onComplete: () => {
            document.body.classList.remove('overflow-hidden');
            activateScrollTriggers();
            if (canvas && mainElement && !animationFrameId && logoLoaded) {
                animate();
            }
        }
    });

    tl.fromTo('#loader-text .char',
        { autoAlpha: 0, y: 20 },
        { autoAlpha: 1, y: 0, stagger: 0.05, duration: 1, ease: 'power3.out' }
    )
    .to('#loader-logo', { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power3.out' }, "-=0.5")
    .to('#loader', { duration: 1.2 }) // Pausa
    .to('#loader-text .char', {
        autoAlpha: 0,
        y: -20,
        stagger: 0.03,
        duration: 0.8,
        ease: 'power3.in'
    })
    .to('#loader-logo', {
        autoAlpha: 0,
        y: -20,
        duration: 0.8,
        ease: 'power3.in'
    }, "<")
    .to('#loader', { autoAlpha: 0, duration: 0.8, ease: 'power2.inOut', onComplete: () => { 
        const loader = document.getElementById('loader');
        if (loader) loader.style.display = 'none'; 
    }}, "-=0.5")
    .to('#main-content', { autoAlpha: 1, duration: 0.1 })
    .to('#header-wrapper', { autoAlpha: 1, duration: 0.8, ease: 'power3.out' }, "-=0.2")
    .to('.hero-h1, .hero-p, .hero-cta, .hero-image', { autoAlpha: 1, y: 0, duration: 1, stagger: 0.2, ease: 'power3.out' }, "<0.5")
    .to('#assistance-fab, #regulation-fab', { autoAlpha: 1, duration: 0.5 }, "<");

    function activateScrollTriggers() {

        // ANIMAÇÃO DO HEADER FIXO AO ROLAR
        ScrollTrigger.create({
            trigger: "body",
            start: "top -100px",
            end: 99999,
            toggleClass: {
                className: 'header-scrolled',
                targets: '#header-wrapper'
            }
        });

        // ANIMAÇÃO DA SEÇÃO SOBRE NÓS
        gsap.set('.about-title, .about-p1, .about-p2, .about-p3, .about-image', { autoAlpha: 0, y: 50 });
        ScrollTrigger.create({
            trigger: '#sobre-nos',
            start: 'top 70%',
            toggleActions: 'play none none none',
            once: true,
            onEnter: () => {
                gsap.timeline()
                .to('.about-title, .about-p1, .about-p2, .about-p3', { autoAlpha: 1, y: 0, duration: 1, stagger: 0.2, ease: 'power3.out' })
                .to('.about-image', { autoAlpha: 1, y: 0, duration: 1.2, ease: 'power3.out' }, '-=0.8');
            }
        });

        // ANIMAÇÃO DA SEÇÃO DE SERVIÇOS
        gsap.set('.services-title, .services-subtitle', { autoAlpha: 0, y: 50 });
        gsap.set('.service-card', { autoAlpha: 0, y: 100, rotationX: -90 });
        
        ScrollTrigger.create({
            trigger: '#servicos',
            start: 'top 75%',
            toggleActions: 'play none none none',
            once: true,
            onEnter: () => {
                gsap.timeline()
                .to('.services-title, .services-subtitle', { autoAlpha: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.2 })
                .to('.service-card', {
                    autoAlpha: 1,
                    y: 0,
                    rotationX: 0,
                    duration: 0.8,
                    stagger: 0.15,
                    ease: 'power3.out'
                }, '-=0.5');
            }
        });

        // ANIMAÇÃO DA SEÇÃO DE PLANOS
        gsap.set('.plans-content > *', { autoAlpha: 0, x: -50 });
        gsap.set('.benefits-content > *', { autoAlpha: 0, x: 50 });
        gsap.set('.benefit-item span', { autoAlpha: 0, x: -20 });

        const circles = gsap.utils.toArray('.benefit-icon-circle');
        const checks = gsap.utils.toArray('.benefit-icon-check');
        
        circles.forEach(circle => {
            const length = circle.getTotalLength();
            gsap.set(circle, { strokeDasharray: length, strokeDashoffset: length });
        });
        checks.forEach(check => {
            const length = check.getTotalLength();
            gsap.set(check, { strokeDasharray: length, strokeDashoffset: length });
        });
        
        ScrollTrigger.create({
            trigger: '#planos',
            start: 'top 70%',
            toggleActions: 'play none none none',
            once: true,
            onEnter: () => {
                gsap.timeline()
                    .to('.plans-content > *', { autoAlpha: 1, x: 0, stagger: 0.2, duration: 1, ease: 'power3.out' })
                    .to('.benefits-content > *', { autoAlpha: 1, x: 0, stagger: 0.2, duration: 1, ease: 'power3.out' }, "-=0.8")
                    .to(circles, { strokeDashoffset: 0, duration: 0.6, ease: 'power2.inOut', stagger: 0.2 }, "-=0.5")
                    .to(checks, { strokeDashoffset: 0, duration: 0.4, ease: 'power2.inOut', stagger: 0.2 }, "<0.3")
                    .to('.benefit-item span', { autoAlpha: 1, x: 0, duration: 0.5, ease: 'power2.out', stagger: 0.2 }, "<0.1");
            }
        });

        // ANIMAÇÃO DA SEÇÃO DE PARCEIROS (DEPOIMENTOS)
        gsap.set('.partners-title', { autoAlpha: 0, y: 50 });
        const testimonials = gsap.utils.toArray('.testimonial-card');
        let currentTestimonial = 0;

        gsap.set(testimonials, { autoAlpha: 0, rotationY: 90 });
        gsap.set(testimonials[0], { autoAlpha: 1, rotationY: 0 });

        function goToSlide(index, direction) {
            if (gsap.isTweening(testimonials)) return;

            const current = testimonials[currentTestimonial];
            const next = testimonials[index];

            const tl = gsap.timeline();
            tl.to(current, { rotationY: -90 * direction, autoAlpha: 0, duration: 0.5, ease: 'power2.in' })
              .set(next, { rotationY: 90 * direction })
              .to(next, { rotationY: 0, autoAlpha: 1, duration: 0.5, ease: 'power2.out' });

            currentTestimonial = index;
        }

        document.getElementById('next-testimonial').addEventListener('click', () => {
            const nextIndex = (currentTestimonial + 1) % testimonials.length;
            goToSlide(nextIndex, 1);
        });

        document.getElementById('prev-testimonial').addEventListener('click', () => {
            const prevIndex = (currentTestimonial - 1 + testimonials.length) % testimonials.length;
            goToSlide(prevIndex, -1);
        });
        
        ScrollTrigger.create({
            trigger: "#parceiros",
            start: 'top 70%',
            once: true,
            onEnter: () => {
                gsap.to('.partners-title', { autoAlpha: 1, y: 0, duration: 1, ease: 'power3.out' });
            }
        });


        // ANIMAÇÃO DA SEÇÃO COMO FUNCIONA (TIMELINE)
        gsap.set('.timeline-title, .timeline-subtitle', { autoAlpha: 0, y: 50 });
        gsap.set('.timeline-line-progress', { scaleY: 0 });
        
        const timelineItems = gsap.utils.toArray('.timeline-item');
        timelineItems.forEach(item => {
            const content = item.querySelector('.timeline-content');
            const dot = item.querySelector('.timeline-dot');
            const emoji = item.querySelector('.timeline-emoji');
            const isRight = item.children[0].classList.contains('md:flex-row-reverse');
            
            gsap.set(content, { autoAlpha: 0, x: isRight ? 50 : -50 });
            gsap.set(dot, { scale: 0 });
            if(emoji) {
                gsap.set(emoji, { scale: 0, rotation: -45 });
            }
        });

        const timelineMaster = gsap.timeline({
            scrollTrigger: {
                trigger: '#como-funciona',
                start: 'top 70%',
                toggleActions: 'play none none none',
                once: true
            }
        });

        timelineMaster.to('.timeline-title, .timeline-subtitle', {
            autoAlpha: 1,
            y: 0,
            duration: 1,
            stagger: 0.2,
            ease: 'power3.out'
        });

        gsap.to('.timeline-line-progress', {
            scaleY: 1,
            ease: 'none',
            scrollTrigger: {
                trigger: '#como-funciona .relative.max-w-4xl',
                start: 'top 50%',
                end: 'bottom 90%',
                scrub: true
            }
        });

        timelineItems.forEach(item => {
            const content = item.querySelector('.timeline-content');
            const dot = item.querySelector('.timeline-dot');
            const emoji = item.querySelector('.timeline-emoji');
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: item,
                    start: 'top 85%',
                    toggleActions: 'play none none none',
                    once: true,
                }
            });
            
            tl.to(dot, {
                scale: 1,
                duration: 0.5,
                ease: 'back.out(1.7)'
            })
            .to(content, {
                autoAlpha: 1,
                x: 0,
                duration: 0.8,
                ease: 'power3.out'
            }, '-=0.4');

            if (emoji) {
                tl.to(emoji, {
                    scale: 1,
                    rotation: 0,
                    duration: 0.8,
                    ease: 'elastic.out(1, 0.5)'
                }, "-=0.5");
            }
        });


        // ANIMAÇÃO DA SEÇÃO POR QUE ESCOLHER
        gsap.set('.why-us-title', { autoAlpha: 0, y: 50 });
        const reasonItems = gsap.utils.toArray('.reason-item');
        
        const whyUsTl = gsap.timeline({
            scrollTrigger: {
                trigger: '#porque-monumental',
                start: 'top 70%',
                toggleActions: 'play none none none',
                once: true
            }
        });

        whyUsTl.to('.why-us-title', { autoAlpha: 1, y: 0, duration: 1, ease: 'power3.out' });

        reasonItems.forEach((item) => {
            const cover = item.querySelector('.reveal-cover');
            const content = item.querySelector('.reason-content');

            const itemTl = gsap.timeline({
                scrollTrigger: {
                    trigger: item,
                    start: 'top 90%',
                    toggleActions: 'play none none none',
                    once: true
                }
            });

            itemTl.to(cover, {
                x: '101%',
                duration: 1,
                ease: 'power3.inOut'
            }).to(content, {
                autoAlpha: 1,
                duration: 0.1
            }, '-=0.7');
        });

        // ANIMAÇÃO DA SEÇÃO LOCALIZAÇÃO
        gsap.set('.location-title, .location-subtitle, .location-map-container, .location-info-content', { autoAlpha: 0, y: 50 });
        ScrollTrigger.create({
            trigger: '#localizacao',
            start: 'top 75%',
            once: true,
            onEnter: () => {
                gsap.timeline()
                    .to('.location-title, .location-subtitle', {
                        autoAlpha: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.2
                    })
                    .to('.location-map-container, .location-info-content', {
                        autoAlpha: 1, y: 0, duration: 1.2, ease: 'power3.out', stagger: 0.3
                    }, "-=0.8");
            }
        });


        // ANIMAÇÃO DA SEÇÃO DE NÚMEROS
        gsap.set('.numbers-title, .numbers-subtitle', { autoAlpha: 0, y: 50 });
        gsap.set('.number-item', { autoAlpha: 0, scale: 0.8 });

        ScrollTrigger.create({
            trigger: '#numeros',
            start: 'top 75%',
            once: true,
            onEnter: () => {
                gsap.timeline()
                    .to('.numbers-title, .numbers-subtitle', {
                        autoAlpha: 1,
                        y: 0,
                        duration: 1,
                        ease: 'power3.out',
                        stagger: 0.2
                    })
                    .to('.number-item', {
                        autoAlpha: 1,
                        scale: 1,
                        duration: 0.8,
                        ease: 'power3.out',
                        stagger: 0.15
                    }, "-=0.8");

                gsap.utils.toArray('.number-counter').forEach(counter => {
                    const target = +counter.dataset.target;
                    gsap.to(counter, {
                        innerText: target,
                        duration: 2.5,
                        ease: 'power3.out',
                        snap: { innerText: 1 },
                        onUpdate: function() {
                            counter.innerText = Math.ceil(this.targets()[0].innerText).toLocaleString('pt-BR');
                        }
                    });
                });
            }
        });

        // ANIMAÇÃO DA SEÇÃO FROTA PRÓPRIA
        gsap.set('.fleet-title-word, .fleet-p1, .fleet-item, .fleet-image-container', { autoAlpha: 0, y: 30 });
        gsap.set('.fleet-item-icon', { scale: 0, rotation: -90 });

        ScrollTrigger.create({
            trigger: '#frota-propria',
            start: 'top 70%',
            once: true,
            onEnter: () => {
                const fleetTl = gsap.timeline({ defaults: { duration: 1, ease: 'power3.out' } });
                fleetTl
                    .to('.fleet-image-container', { autoAlpha: 1, y: 0 }, 0)
                    .to('.fleet-title-word', { autoAlpha: 1, y: 0, stagger: 0.1 }, 0.5)
                    .to('.fleet-p1', { autoAlpha: 1, y: 0 }, 0.8)
                    .to('.fleet-item', { autoAlpha: 1, y: 0, stagger: 0.2 }, 1.0)
                    .to('.fleet-item-icon', { scale: 1, rotation: 0, stagger: 0.2, duration: 0.8, ease: 'back.out(1.7)' }, 1.1);
            }
        });

        // ANIMAÇÃO DA SEÇÃO QUERO SER PRESTADOR
        gsap.set('.provider-title, .provider-p1, .provider-item, .provider-cta, .provider-image-container', { autoAlpha: 0 });
        gsap.set('.provider-text-content', { x: -50 });
        gsap.set('.provider-image-container', { x: 50 });


        ScrollTrigger.create({
            trigger: '#quero-ser-prestador',
            start: 'top 70%',
            once: true,
            onEnter: () => {
                const providerTl = gsap.timeline({ defaults: { duration: 1.2, ease: 'power3.out' } });
                providerTl
                    .to('.provider-text-content, .provider-image-container', { autoAlpha: 1, x: 0 })
                    .fromTo('.provider-title, .provider-p1, .provider-item, .provider-cta', 
                        { autoAlpha: 0, y: 20 },
                        { autoAlpha: 1, y: 0, stagger: 0.2, duration: 1 },
                        "-=0.8"
                    );
            }
        });

        // ANIMAÇÃO DA NOVA SEÇÃO FAQ
        gsap.set('.faq-title, .faq-subtitle, .faq-item', {autoAlpha: 0, y: 50});
        ScrollTrigger.create({
            trigger: "#faq",
            start: 'top 75%',
            once: true,
            onEnter: () => {
                gsap.to('.faq-title, .faq-subtitle', {autoAlpha: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.2});
                gsap.to('.faq-item', {autoAlpha: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.15});
            }
        });


        // ANIMAÇÃO DA SEÇÃO CTA SONAR
        const ctaContainer = document.querySelector('.cta-sonar-container');
        if (ctaContainer) {
            gsap.set('.cta-title, .cta-subtitle, .cta-button', {autoAlpha: 0, y: 50});

            ScrollTrigger.create({
                trigger: ctaContainer,
                start: 'top 75%',
                toggleActions: 'play none none none',
                once: true,
                onEnter: () => {
                    // Animação do texto e botão
                    gsap.to('.cta-title, .cta-subtitle, .cta-button', {
                        autoAlpha: 1,
                        y: 0,
                        stagger: 0.2,
                        duration: 1,
                        ease: 'power3.out'
                    });

                    // Animação das ondas de sonar
                    for (let i = 0; i < 5; i++) {
                        const ripple = document.createElement('div');
                        ripple.className = 'cta-ripple';
                        ctaContainer.appendChild(ripple);

                        gsap.to(ripple, {
                            scale: 20,
                            opacity: 0,
                            duration: 4,
                            ease: 'power1.out',
                            delay: i * 0.8,
                            onComplete: () => ripple.remove()
                        });
                    }
                }
            });
        }
    }

    // LÓGICA DO BOTÃO FLUTUANTE DE ASSISTÊNCIA (FAB)
    const fabButton = document.getElementById('fab-main-button');
    const fabList = document.getElementById('fab-numbers-list');
    const fabPhoneIcon = document.getElementById('fab-icon-phone');
    const fabCloseIcon = document.getElementById('fab-icon-close');
    const fabNumberItems = gsap.utils.toArray('.fab-number-item');
    let isFabOpen = false;

    gsap.set(fabList, { autoAlpha: 0 });
    gsap.set(fabNumberItems, { autoAlpha: 0, y: 30 });

    const fabTl = gsap.timeline({ paused: true, reversed: true });
    fabTl.to(fabList, { autoAlpha: 1, duration: 0.2 })
         .to(fabNumberItems, {
             autoAlpha: 1,
             y: 0,
             stagger: 0.1,
             duration: 0.5,
             ease: 'power3.out'
         });

    fabButton.addEventListener('click', () => {
        isFabOpen = !isFabOpen;
        
        if (isFabOpen) {
            fabTl.play();
        } else {
            fabTl.reverse();
        }

        gsap.to(fabPhoneIcon, { opacity: isFabOpen ? 0 : 1, duration: 0.3 });
        gsap.to(fabCloseIcon, { opacity: isFabOpen ? 1 : 0, duration: 0.3 });
        gsap.to(fabButton, { rotation: isFabOpen ? 225 : 0, duration: 0.4, ease: 'power3.inOut' });
    });
    
    // LÓGICA DOS BOTÕES FLUTUANTES COM LABELS
    const assistanceFab = document.getElementById('assistance-fab');
    const regulationFab = document.getElementById('regulation-fab');
    const contactLabel = document.getElementById('fab-label-contact');
    const regulationLabel = document.getElementById('fab-label-regulation');

    // Set initial states for labels
    gsap.set(contactLabel, { autoAlpha: 0, x: 20 });
    gsap.set(regulationLabel, { autoAlpha: 0, x: -20 });

    // Animação para o botão de contato (direita)
    assistanceFab.addEventListener('mouseenter', () => {
        if (!isFabOpen) { // Only show label if the menu is not open
            gsap.to(contactLabel, { autoAlpha: 1, x: 0, duration: 0.3, ease: 'power2.out' });
        }
    });
    assistanceFab.addEventListener('mouseleave', () => {
        gsap.to(contactLabel, { autoAlpha: 0, x: 20, duration: 0.3, ease: 'power2.in' });
    });

    // Animação para o botão de regulamento (esquerda)
    regulationFab.addEventListener('mouseenter', () => {
        gsap.to(regulationLabel, { autoAlpha: 1, x: 0, duration: 0.3, ease: 'power2.out' });
    });
    regulationFab.addEventListener('mouseleave', () => {
        gsap.to(regulationLabel, { autoAlpha: 0, x: -20, duration: 0.3, ease: 'power2.in' });
    });

    // Hide contact label when its menu is open
    fabButton.addEventListener('click', () => {
        if (!isFabOpen) { // This is checking the state *before* the click logic flips it
            gsap.to(contactLabel, { autoAlpha: 0, x: 20, duration: 0.3, ease: 'power2.in' });
        }
    });


    // LÓGICA DO MODAL DE REGULAMENTO
    const regulationButton = document.getElementById('regulation-fab');
    const regulationModal = document.getElementById('regulation-modal');
    const modalPanel = document.getElementById('modal-panel');
    const closeModalBtn = document.getElementById('modal-close-btn');

    if (regulationButton && regulationModal && closeModalBtn && modalPanel) {
        const openModal = () => {
            regulationModal.classList.remove('hidden');
            gsap.fromTo(regulationModal, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 });
            gsap.fromTo(modalPanel, { scale: 0.9, y: -20, autoAlpha: 0 }, { scale: 1, y: 0, autoAlpha: 1, duration: 0.4, ease: 'power3.out' });
        };

        const closeModal = () => {
            gsap.to(modalPanel, { scale: 0.9, y: -20, autoAlpha: 0, duration: 0.3, ease: 'power2.in', onComplete: () => {
                 gsap.to(regulationModal, { autoAlpha: 0, duration: 0.2, onComplete: () => {
                    regulationModal.classList.add('hidden');
                 }});
            }});
        };

        regulationButton.addEventListener('click', openModal);
        closeModalBtn.addEventListener('click', closeModal);
        regulationModal.addEventListener('click', (e) => {
            if (e.target === regulationModal) {
                closeModal();
            }
        });
    }
    
    // LÓGICA DO MODAL DE PRIVACIDADE
    const privacyLink = document.getElementById('privacy-link');
    const privacyLinkBanner = document.getElementById('privacy-link-banner');
    const privacyModal = document.getElementById('privacy-modal');
    const privacyModalPanel = document.getElementById('privacy-modal-panel');
    const closePrivacyModalBtn = document.getElementById('privacy-modal-close-btn');

    if (privacyLink && privacyModal && closePrivacyModalBtn && privacyModalPanel) {
        const openPrivacyModal = (e) => {
            e.preventDefault();
            privacyModal.classList.remove('hidden');
            gsap.fromTo(privacyModal, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 });
            gsap.fromTo(privacyModalPanel, { scale: 0.9, y: -20, autoAlpha: 0 }, { scale: 1, y: 0, autoAlpha: 1, duration: 0.4, ease: 'power3.out' });
        };

        const closePrivacyModal = () => {
            gsap.to(privacyModalPanel, { scale: 0.9, y: -20, autoAlpha: 0, duration: 0.3, ease: 'power2.in', onComplete: () => {
                 gsap.to(privacyModal, { autoAlpha: 0, duration: 0.2, onComplete: () => {
                    privacyModal.classList.add('hidden');
                 }});
            }});
        };

        privacyLink.addEventListener('click', openPrivacyModal);
        privacyLinkBanner.addEventListener('click', openPrivacyModal);
        closePrivacyModalBtn.addEventListener('click', closePrivacyModal);
        privacyModal.addEventListener('click', (e) => {
            if (e.target === privacyModal) {
                closePrivacyModal();
            }
        });
    }

    // LÓGICA DO BANNER DE COOKIES
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptCookiesBtn = document.getElementById('accept-cookies');
    const declineCookiesBtn = document.getElementById('decline-cookies');

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

    function setCookie(name, value, days) {
        let expires = "";
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + "; path=/";
    }

    function hideCookieBanner() {
        gsap.to(cookieBanner, { autoAlpha: 0, y: 100, duration: 0.5, ease: 'power2.in', onComplete: () => {
            cookieBanner.style.display = 'none';
        }});
    }

    if (!getCookie('cookie_consent')) {
        gsap.set(cookieBanner, { display: 'block', autoAlpha: 0, y: 100 });
        gsap.to(cookieBanner, { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 2 });
    }

    acceptCookiesBtn.addEventListener('click', () => {
        setCookie('cookie_consent', 'accepted', 365);
        hideCookieBanner();
    });

    declineCookiesBtn.addEventListener('click', () => {
        hideCookieBanner();
    });


    // SMOOTH SCROLL FOR NAV LINKS
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') {
                gsap.to(window, {
                    duration: 1.5,
                    scrollTo: 0,
                    ease: 'power3.inOut'
                });
                return;
            }
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 100; 

                gsap.to(window, {
                    duration: 1.5,
                    scrollTo: {
                        y: targetElement,
                        offsetY: headerOffset
                    },
                    ease: 'power3.inOut'
                });
            }
        });
    });

    // Script para o input de arquivo
    const fileInput = document.getElementById('resume');
    const fileInputText = document.querySelector('.file-input-text');
    if (fileInput && fileInputText) {
        fileInput.addEventListener('change', () => {
            if (fileInput.files.length > 0) {
                fileInputText.textContent = fileInput.files[0].name;
            } else {
                fileInputText.textContent = 'Clique para selecionar o arquivo';
            }
        });
    }

    // LÓGICA DO ACCORDION FAQ
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Fecha todos os outros itens
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                    gsap.to(otherItem.querySelector('.faq-answer'), {
                        maxHeight: 0,
                        duration: 0.4,
                        ease: 'power2.inOut'
                    });
                }
            });

            // Abre ou fecha o item clicado
            if (isActive) {
                item.classList.remove('active');
                gsap.to(answer, {
                    maxHeight: 0,
                    duration: 0.4,
                    ease: 'power2.inOut'
                });
            } else {
                item.classList.add('active');
                gsap.to(answer, {
                    maxHeight: answer.scrollHeight,
                    duration: 0.5,
                    ease: 'power3.out'
                });
            }
        });
    });
});

