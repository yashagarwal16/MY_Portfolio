// JARVIS Portfolio - Advanced AI Interface


class JARVISPortfolio {
    constructor() {
        this.isInitialized = false;
        this.voiceEnabled = false;
        this.currentSection = 'home';
        this.particles = [];
        this.matrixChars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
        this.init();
    }

    async init() {
        console.log('🤖 Initializing Yash Agarwal Portfolio System...');
        
        // Wait for DOM
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.start());
        } else {
            this.start();
        }
    }

    async start() {
        // Initialize all systems
        this.initLoadingSequence();
        this.initMatrixBackground();
        this.initParticleSystem();
        this.initNavigation();
        this.initTypingEffect();
        this.initScrollEffects();
        this.initVoiceRecognition();
        this.initAIAssistant();
        this.initHUDElements();
        this.initInteractiveElements();
        this.initNotificationSystem();
        
        // Start loading sequence
        setTimeout(() => {
            this.completeLoading();
        }, 3000);
        
        console.log('✅ Yash Portfolio System Online');
    }

    initLoadingSequence() {
        const loadingScreen = document.querySelector('.jarvis-loading');
        const progressBar = document.querySelector('.progress-bar');
        
        // Simulate system initialization
        const loadingSteps = [
            'Initializing Neural Networks...',
            'Loading AI Modules...',
            'Connecting to Database...',
            'Calibrating Sensors...',
            'System Ready'
        ];
        
        let currentStep = 0;
        const loadingText = document.querySelector('.loading-text');
        
        const stepInterval = setInterval(() => {
            if (currentStep < loadingSteps.length) {
                loadingText.textContent = loadingSteps[currentStep];
                this.showNotification('YASH', loadingSteps[currentStep]);
                currentStep++;
            } else {
                clearInterval(stepInterval);
            }
        }, 600);
    }

    completeLoading() {
        const loadingScreen = document.querySelector('.jarvis-loading');
        loadingScreen.classList.add('hidden');
        
        // Initialize entrance animations
        this.triggerEntranceAnimations();
        
        // Show welcome message
        setTimeout(() => {
            this.showNotification('YASH', 'Welcome back, Sir. All systems operational.');
            this.initAIGreeting();
        }, 1000);
        
        this.isInitialized = true;
    }

    initMatrixBackground() {
        const canvas = document.createElement('canvas');
        canvas.className = 'matrix-canvas';
        document.querySelector('.matrix-bg').appendChild(canvas);
        
        const ctx = canvas.getContext('2d');
        
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        
        const columns = Math.floor(canvas.width / 20);
        const drops = Array(columns).fill(1);
        
        const drawMatrix = () => {
            ctx.fillStyle = 'rgba(10, 10, 10, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            ctx.fillStyle = '#00d4ff';
            ctx.font = '15px Orbitron';
            
            for (let i = 0; i < drops.length; i++) {
                const text = this.matrixChars[Math.floor(Math.random() * this.matrixChars.length)];
                ctx.fillText(text, i * 20, drops[i] * 20);
                
                if (drops[i] * 20 > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        };
        
        setInterval(drawMatrix, 50);
    }

    initParticleSystem() {
        const particlesContainer = document.querySelector('.particles');
        if (!particlesContainer) return;
        
        const createParticle = () => {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDuration = (Math.random() * 10 + 5) + 's';
            particle.style.animationDelay = Math.random() * 2 + 's';
            
            particlesContainer.appendChild(particle);
            
            setTimeout(() => {
                particle.remove();
            }, 15000);
        };
        
        // Create particles periodically
        setInterval(createParticle, 500);
    }

    initNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        const menuToggle = document.querySelector('.menu-toggle');
        const navMenu = document.querySelector('.nav-menu');
        
        // Mobile menu toggle
        if (menuToggle) {
            menuToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                menuToggle.classList.toggle('active');
            });
        }
        
        // Navigation with JARVIS feedback
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    // Update active link
                    navLinks.forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                    
                    // Smooth scroll with JARVIS feedback
                    const sectionName = targetId.replace('#', '');
                    this.showNotification('YASH', `Navigating to ${sectionName} section...`);
                    
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    this.currentSection = sectionName;
                }
            });
        });
        
        // Scroll spy
        window.addEventListener('scroll', () => {
            this.updateActiveNavigation();
        });
    }

    updateActiveNavigation() {
        const sections = document.querySelectorAll('.jarvis-section[id]');
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
                
                if (this.currentSection !== sectionId) {
                    this.currentSection = sectionId;
                    this.updateHUDInfo();
                }
            }
        });
    }

    initTypingEffect() {
        const typingElement = document.querySelector('.typing-text');
        if (!typingElement) return;
        
        const texts = [
            'AI Engineer',
            'Data Scientist',
            'Full Stack Developer',
            'DevOps Specialist',
            'Machine Learning Expert',
            'Cloud Architect'
        ];
        
        let textIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        
        const typeText = () => {
            const currentText = texts[textIndex];
            
            if (isDeleting) {
                typingElement.textContent = currentText.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typingElement.textContent = currentText.substring(0, charIndex + 1);
                charIndex++;
            }
            
            let typeSpeed = isDeleting ? 50 : 100;
            
            if (!isDeleting && charIndex === currentText.length) {
                typeSpeed = 2000;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % texts.length;
                typeSpeed = 500;
            }
            
            setTimeout(typeText, typeSpeed);
        };
        
        typeText();
    }

    initScrollEffects() {
        // Intersection Observer for animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                    
                    // Trigger specific animations
                    if (entry.target.classList.contains('skill-progress')) {
                        this.animateSkillBar(entry.target);
                    }
                    
                    if (entry.target.classList.contains('stat-number')) {
                        this.animateCounter(entry.target);
                    }
                    
                    if (entry.target.classList.contains('project-card')) {
                        this.animateProjectCard(entry.target);
                    }
                }
            });
        }, observerOptions);
        
        // Observe elements
        const animatedElements = document.querySelectorAll('.skill-panel, .project-card, .contact-card, .about-panel');
        animatedElements.forEach(el => observer.observe(el));
        
        const skillBars = document.querySelectorAll('.skill-progress');
        const counters = document.querySelectorAll('.stat-number');
        
        skillBars.forEach(bar => observer.observe(bar));
        counters.forEach(counter => observer.observe(counter));
    }

    animateSkillBar(progressBar) {
        const progress = progressBar.getAttribute('data-progress');
        setTimeout(() => {
            progressBar.style.width = progress + '%';
        }, 300);
    }

    animateCounter(element) {
        const target = parseInt(element.getAttribute('data-count'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current);
        }, 16);
    }

    animateProjectCard(card) {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, Math.random() * 300);
    }

    initVoiceRecognition() {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            console.log('Speech recognition not supported');
            return;
        }
        
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.recognition = new SpeechRecognition();
        
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
        this.recognition.lang = 'en-US';
        
        const voiceIndicator = document.querySelector('.voice-indicator');
        
        if (voiceIndicator) {
            voiceIndicator.addEventListener('click', () => {
                this.toggleVoiceRecognition();
            });
        }
        
        this.recognition.onstart = () => {
            this.voiceEnabled = true;
            voiceIndicator?.classList.add('active');
            this.showNotification('Yash', 'Listening...');
        };
        
        this.recognition.onend = () => {
            this.voiceEnabled = false;
            voiceIndicator?.classList.remove('active');
        };
        
        this.recognition.onresult = (event) => {
            const command = event.results[0][0].transcript.toLowerCase();
            this.processVoiceCommand(command);
        };
    }

    toggleVoiceRecognition() {
        if (this.voiceEnabled) {
            this.recognition.stop();
        } else {
            this.recognition.start();
        }
    }

    processVoiceCommand(command) {
        console.log('Voice command:', command);
        
        if (command.includes('home')) {
            this.navigateToSection('home');
        } else if (command.includes('about')) {
            this.navigateToSection('about');
        } else if (command.includes('skills')) {
            this.navigateToSection('skills');
        } else if (command.includes('projects')) {
            this.navigateToSection('projects');
        } else if (command.includes('contact')) {
            this.navigateToSection('contact');
        } else if (command.includes('hello') || command.includes('hi')) {
            this.showNotification('Yash', 'Hello! How can I assist you today?');
        } else {
            this.showNotification('Yash', 'Command not recognized. Try saying "home", "about", "skills", "projects", or "contact".');
        }
    }

    navigateToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
            this.showNotification('Yash', `Navigating to ${sectionId} section.`);
        }
    }

    initAIAssistant() {
        const aiAssistant = document.querySelector('.ai-assistant');
        if (!aiAssistant) return;
        
        // Show assistant periodically with helpful tips
        const tips = [
            'Use voice commands to navigate the portfolio.',
            'Hover over elements to see interactive effects.',
            'All systems are running optimally.',
            'Ready to assist with any inquiries.',
            'Portfolio data updated in real-time.'
        ];
        
        let tipIndex = 0;
        
        setInterval(() => {
            if (!aiAssistant.classList.contains('active')) {
                const message = aiAssistant.querySelector('.ai-message');
                message.textContent = tips[tipIndex];
                tipIndex = (tipIndex + 1) % tips.length;
                
                aiAssistant.classList.add('active');
                
                setTimeout(() => {
                    aiAssistant.classList.remove('active');
                }, 4000);
            }
        }, 15000);
    }

    initHUDElements() {
        // Create HUD elements
        const hudElements = [
            { position: 'hud-top-left', content: 'SYS: ONLINE' },
            { position: 'hud-top-right', content: 'PWR: 100%' },
            { position: 'hud-bottom-left', content: 'NET: CONNECTED' },
            { position: 'hud-bottom-right', content: 'AI: ACTIVE' }
        ];
        
        hudElements.forEach(hud => {
            const element = document.createElement('div');
            element.className = `hud-element ${hud.position}`;
            element.innerHTML = `
                <div class="status-indicator">
                    <span class="status-dot"></span>
                    ${hud.content}
                </div>
            `;
            document.body.appendChild(element);
        });
        
        // Update HUD periodically
        setInterval(() => {
            this.updateHUDInfo();
        }, 5000);
    }

    updateHUDInfo() {
        const hudElements = document.querySelectorAll('.hud-element');
        const currentTime = new Date().toLocaleTimeString();
        
        hudElements.forEach((element, index) => {
            const statusIndicator = element.querySelector('.status-indicator');
            
            switch (index) {
                case 0:
                    statusIndicator.innerHTML = `<span class="status-dot"></span>TIME: ${currentTime}`;
                    break;
                case 1:
                    statusIndicator.innerHTML = `<span class="status-dot"></span>SEC: ${this.currentSection.toUpperCase()}`;
                    break;
                case 2:
                    statusIndicator.innerHTML = `<span class="status-dot"></span>USR: ACTIVE`;
                    break;
                case 3:
                    statusIndicator.innerHTML = `<span class="status-dot"></span>MODE: PORTFOLIO`;
                    break;
            }
        });
    }

    initInteractiveElements() {
        // Add interactive effects to all clickable elements
        const interactiveElements = document.querySelectorAll('.jarvis-btn, .project-card, .skill-panel, .contact-card');
        
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                this.playHoverSound();
                element.style.filter = 'brightness(1.2)';
            });
            
            element.addEventListener('mouseleave', () => {
                element.style.filter = 'brightness(1)';
            });
            
            element.addEventListener('click', () => {
                this.playClickSound();
                this.createRippleEffect(element, event);
            });
        });
        
        // Add scan effect to panels
        const panels = document.querySelectorAll('.about-panel, .skill-panel, .contact-card');
        panels.forEach(panel => {
            panel.addEventListener('mouseenter', () => {
                this.addScanEffect(panel);
            });
        });
    }

    createRippleEffect(element, event) {
        const ripple = document.createElement('div');
        ripple.style.position = 'absolute';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'rgba(0, 212, 255, 0.6)';
        ripple.style.transform = 'scale(0)';
        ripple.style.animation = 'ripple 0.6s linear';
        ripple.style.pointerEvents = 'none';
        
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        
        element.style.position = 'relative';
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    addScanEffect(element) {
        const scanLine = document.createElement('div');
        scanLine.style.position = 'absolute';
        scanLine.style.top = '0';
        scanLine.style.left = '0';
        scanLine.style.width = '100%';
        scanLine.style.height = '2px';
        scanLine.style.background = 'linear-gradient(90deg, transparent, var(--jarvis-cyan), transparent)';
        scanLine.style.animation = 'scan-sweep 1s ease-in-out';
        scanLine.style.pointerEvents = 'none';
        
        element.style.position = 'relative';
        element.appendChild(scanLine);
        
        setTimeout(() => {
            scanLine.remove();
        }, 1000);
    }

    playHoverSound() {
        // Create audio context for UI sounds
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.1);
    }

    playClickSound() {
        if (!this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(1200, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(600, this.audioContext.currentTime + 0.1);
        gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.1);
    }

    initNotificationSystem() {
        this.notificationQueue = [];
        this.isShowingNotification = false;
    }

    showNotification(title, message, duration = 3000) {
        this.notificationQueue.push({ title, message, duration });
        
        if (!this.isShowingNotification) {
            this.processNotificationQueue();
        }
    }

    processNotificationQueue() {
        if (this.notificationQueue.length === 0) {
            this.isShowingNotification = false;
            return;
        }
        
        this.isShowingNotification = true;
        const { title, message, duration } = this.notificationQueue.shift();
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'YASH-notification';
        notification.innerHTML = `
            <div class="notification-header">
                <i class="fas fa-robot notification-icon"></i>
                <span class="notification-title">${title}</span>
            </div>
            <div class="notification-message">${message}</div>
        `;
        
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Hide notification
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
                this.processNotificationQueue();
            }, 300);
        }, duration);
    }

    initAIGreeting() {
        const greetings = [
            'Good to see you again, Sir.',
            'All systems are functioning within normal parameters.',
            'How may I assist you today?',
            'Portfolio systems are online and ready.',
            'Welcome to the YASH interface.'
        ];
        
        const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
        
        setTimeout(() => {
            this.showNotification('YASH', randomGreeting, 4000);
        }, 2000);
    }

    triggerEntranceAnimations() {
        // Animate hero elements
        const heroElements = document.querySelectorAll('.hero-content > *');
        heroElements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                element.style.transition = 'all 0.8s ease';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 200);
        });
        
        // Animate avatar
        const avatar = document.querySelector('.jarvis-avatar');
        if (avatar) {
            avatar.style.opacity = '0';
            avatar.style.transform = 'scale(0.8)';
            
            setTimeout(() => {
                avatar.style.transition = 'all 1s ease';
                avatar.style.opacity = '1';
                avatar.style.transform = 'scale(1)';
            }, 800);
        }
    }

    // Project filtering
    initProjectFiltering() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        const projectCards = document.querySelectorAll('.project-card');
        
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.getAttribute('data-filter');
                
                // Update active filter
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Filter projects with JARVIS feedback
                this.showNotification('YASH', `Filtering projects: ${filter}`);
                
                projectCards.forEach(card => {
                    const category = card.getAttribute('data-category');
                    const shouldShow = filter === 'all' || category === filter;
                    
                    if (shouldShow) {
                        card.style.display = 'block';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 100);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }

    // Form handling with JARVIS feedback
    initFormHandler() {
        const form = document.getElementById('contactForm');
        if (!form) return;
        
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            // Show processing state
            submitBtn.innerHTML = '<i class="fas fa-cog fa-spin"></i> <span>Processing...</span>';
            submitBtn.disabled = true;
            
            this.showNotification('YASH', 'Processing your message...');
            
            try {
                // Simulate form submission
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                this.showNotification('YASH', 'Message transmitted successfully. Awaiting response.');
                form.reset();
                
                // Add success effect
                this.addSuccessEffect(form);
                
            } catch (error) {
                this.showNotification('YASH', 'Transmission failed. Please retry.');
            } finally {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }

    addSuccessEffect(element) {
        element.style.border = '1px solid var(--jarvis-green)';
        element.style.boxShadow = '0 0 20px var(--jarvis-green)';
        
        setTimeout(() => {
            element.style.border = '1px solid var(--jarvis-blue)';
            element.style.boxShadow = 'none';
        }, 2000);
    }

    // Real-time data simulation
    initRealTimeData() {
        const dataElements = document.querySelectorAll('.data-fill');
        
        setInterval(() => {
            dataElements.forEach(element => {
                const randomWidth = Math.random() * 40 + 60; // 60-100%
                element.style.width = randomWidth + '%';
            });
        }, 3000);
    }

    // System diagnostics
    runDiagnostics() {
        const diagnostics = [
            'Running system diagnostics...',
            'Checking neural network integrity...',
            'Validating data connections...',
            'Testing user interface responsiveness...',
            'All systems operational.'
        ];
        
        diagnostics.forEach((message, index) => {
            setTimeout(() => {
                this.showNotification('YASH', message);
            }, index * 1000);
        });
    }

    // Easter eggs and special commands
    initEasterEggs() {
        let konamiCode = [];
        const konamiSequence = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // ↑↑↓↓←→←→BA
        
        document.addEventListener('keydown', (e) => {
            konamiCode.push(e.keyCode);
            
            if (konamiCode.length > konamiSequence.length) {
                konamiCode.shift();
            }
            
            if (JSON.stringify(konamiCode) === JSON.stringify(konamiSequence)) {
                this.activateEasterEgg();
                konamiCode = [];
            }
        });
    }

    activateEasterEgg() {
        this.showNotification('YASH', 'Easter egg activated! Initiating special mode...');
        
        // Add special effects
        document.body.style.filter = 'hue-rotate(180deg)';
        
        setTimeout(() => {
            document.body.style.filter = 'none';
            this.showNotification('YASH', 'Special mode deactivated. Returning to normal operations.');
        }, 5000);
    }

    // Performance monitoring
    monitorPerformance() {
        const observer = new PerformanceObserver((list) => {
            list.getEntries().forEach((entry) => {
                if (entry.entryType === 'navigation') {
                    console.log(`Page load time: ${entry.loadEventEnd - entry.loadEventStart}ms`);
                }
            });
        });
        
        observer.observe({ entryTypes: ['navigation'] });
    }

    // Cleanup
    destroy() {
        if (this.recognition) {
            this.recognition.stop();
        }
        
        if (this.audioContext) {
            this.audioContext.close();
        }
        
        console.log('🤖 YASH Portfolio System Shutdown');
    }
}

// Initialize JARVIS Portfolio
const jarvisPortfolio = new JARVISPortfolio();

// Add CSS animations for ripple effect
const rippleStyles = document.createElement('style');
rippleStyles.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    @keyframes scan-sweep {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
    }
`;
document.head.appendChild(rippleStyles);

// Global error handling
window.addEventListener('error', (e) => {
    console.error('YASH System Error:', e.error);
    jarvisPortfolio.showNotification('YASH', 'System error detected. Running diagnostics...');
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    jarvisPortfolio.destroy();
});

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { JARVISPortfolio };
}