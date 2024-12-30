// Custom cursor
const cursor = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');

document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    
    setTimeout(() => {
        cursorFollower.style.left = e.clientX + 'px';
        cursorFollower.style.top = e.clientY + 'px';
    }, 100);
});

// Hover effect for interactive elements
document.querySelectorAll('a, button, .music-card').forEach(link => {
    link.addEventListener('mouseenter', () => {
        cursor.classList.add('cursor-hover');
        cursorFollower.classList.add('cursor-hover');
    });

    link.addEventListener('mouseleave', () => {
        cursor.classList.remove('cursor-hover');
        cursorFollower.classList.remove('cursor-hover');
    });
});

// Mobile menu functionality
const menuBtn = document.querySelector('.menu-btn');
const navLinks = document.querySelector('.nav-links');
let menuOpen = false;

menuBtn.addEventListener('click', () => {
    if (!menuOpen) {
        menuBtn.classList.add('open');
        navLinks.classList.add('active');
        menuOpen = true;
    } else {
        menuBtn.classList.remove('open');
        navLinks.classList.remove('active');
        menuOpen = false;
    }
});

// Smooth scrolling with offset for header
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        const headerOffset = 100;
        const elementPosition = target.offsetTop;
        const offsetPosition = elementPosition - headerOffset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });

        // Close mobile menu if open
        if (menuOpen) {
            menuBtn.classList.remove('open');
            navLinks.classList.remove('active');
            menuOpen = false;
        }
    });
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero');
    const scrolled = window.pageYOffset;
    hero.style.transform = `translateY(${scrolled * 0.5}px)`;
});

// Initialize vanilla-tilt for 3D card effect
VanillaTilt.init(document.querySelectorAll("[data-tilt]"), {
    max: 25,
    speed: 400,
    glare: true,
    "max-glare": 0.5,
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            if (entry.target.classList.contains('stat-number')) {
                animateValue(entry.target);
            }
        }
    });
}, observerOptions);

// Observe all sections and animated elements
document.querySelectorAll('section, .music-card, .stat-number').forEach((section) => {
    observer.observe(section);
});

// Animate statistics
function animateValue(obj) {
    const value = parseInt(obj.textContent);
    let current = 0;
    const increment = value / 50;
    const duration = 1500;
    const step = duration / 50;

    const timer = setInterval(() => {
        current += increment;
        if (current >= value) {
            obj.textContent = value + (obj.textContent.includes('+') ? '+' : '');
            clearInterval(timer);
        } else {
            obj.textContent = Math.floor(current) + (obj.textContent.includes('+') ? '+' : '');
        }
    }, step);
}

// Header scroll effect with noise
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.style.background = 'rgba(0, 0, 0, 0.95)';
        header.classList.add('scrolled');
    } else {
        header.style.background = 'rgba(0, 0, 0, 0.9)';
        header.classList.remove('scrolled');
    }
});

// Play button hover effect
document.querySelectorAll('.play-btn').forEach(button => {
    button.addEventListener('mouseenter', function() {
        this.querySelector('i').classList.add('fa-spin');
    });

    button.addEventListener('mouseleave', function() {
        this.querySelector('i').classList.remove('fa-spin');
    });
});

// Glitch effect on hover for titles
document.querySelectorAll('[data-text]').forEach(element => {
    element.addEventListener('mouseenter', function() {
        this.classList.add('glitch-hover');
    });

    element.addEventListener('mouseleave', function() {
        this.classList.remove('glitch-hover');
    });
});

// Music player functionality
class MusicPlayer {
    constructor() {
        this.currentSongIndex = 0;
        this.isPlaying = false;
        this.lastVolume = 1;
        
        // Initialize SoundCloud Widget API
        this.widget = SC.Widget(document.querySelector('.soundcloud-player iframe'));
        this.initializePlayer();
        this.initializeControls();
    }

    initializePlayer() {
        document.querySelectorAll('.play-btn').forEach(button => {
            button.addEventListener('click', () => {
                const card = button.closest('.music-card');
                const wasPlaying = this.isPlaying;
                
                // Reset all buttons
                document.querySelectorAll('.play-btn').forEach(btn => {
                    btn.innerHTML = '<i class="fas fa-play"></i> Play Now';
                    btn.closest('.music-card').classList.remove('playing');
                });

                if (!wasPlaying || this.currentCard !== card) {
                    this.currentCard = card;
                    button.innerHTML = '<i class="fas fa-pause"></i> Pause';
                    card.classList.add('playing');
                    this.isPlaying = true;
                    
                    // Play the SoundCloud track
                    if (button.dataset.track === 'flood-my-wrist') {
                        this.widget.load('https://soundcloud.com/deadsidee/flood-my-wrist', {
                            auto_play: true
                        });
                    }
                } else {
                    this.isPlaying = false;
                    this.widget.pause();
                }
            });
        });
    }

    initializeControls() {
        const playPauseBtn = document.querySelector('.play-pause-btn');
        const volumeSlider = document.querySelector('.volume-slider');
        const volumeIcon = document.querySelector('.volume-icon');

        // Initialize volume slider
        volumeSlider.value = 100;

        // Volume control
        volumeSlider.addEventListener('input', (e) => {
            const volume = e.target.value / 100;
            this.widget.setVolume(volume);
            this.updateVolumeIcon(volume);
        });

        // Volume icon click to mute/unmute
        volumeIcon.addEventListener('click', () => {
            if (volumeSlider.value > 0) {
                this.lastVolume = volumeSlider.value / 100;
                volumeSlider.value = 0;
                this.widget.setVolume(0);
                this.updateVolumeIcon(0);
            } else {
                volumeSlider.value = this.lastVolume * 100;
                this.widget.setVolume(this.lastVolume);
                this.updateVolumeIcon(this.lastVolume);
            }
        });

        // Play/Pause control
        playPauseBtn.addEventListener('click', () => {
            this.widget.toggle();
            this.isPlaying = !this.isPlaying;
            playPauseBtn.innerHTML = this.isPlaying ? 
                '<i class="fas fa-pause"></i>' : 
                '<i class="fas fa-play"></i>';
        });

        // Initialize widget events
        this.widget.bind(SC.Widget.Events.READY, () => {
            this.widget.getVolume(volume => {
                volumeSlider.value = volume * 100;
                this.updateVolumeIcon(volume);
            });
        });

        this.widget.bind(SC.Widget.Events.PLAY, () => {
            this.isPlaying = true;
            playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        });

        this.widget.bind(SC.Widget.Events.PAUSE, () => {
            this.isPlaying = false;
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        });
    }

    updateVolumeIcon(volume) {
        const volumeIcon = document.querySelector('.volume-icon');
        if (volume === 0) {
            volumeIcon.innerHTML = '<i class="fas fa-volume-mute"></i>';
        } else if (volume < 0.5) {
            volumeIcon.innerHTML = '<i class="fas fa-volume-down"></i>';
        } else {
            volumeIcon.innerHTML = '<i class="fas fa-volume-up"></i>';
        }
    }
}

// Initialize SoundCloud Widget API
document.addEventListener('DOMContentLoaded', () => {
    // Load SoundCloud Widget API
    const script = document.createElement('script');
    script.src = 'https://w.soundcloud.com/player/api.js';
    script.onload = () => {
        window.player = new MusicPlayer();
    };
    document.body.appendChild(script);
});

// Initialize bats when the document is loaded
document.addEventListener('DOMContentLoaded', () => {
    initBats();
});

// Bat Animation
function initBats() {
    const bats = document.querySelectorAll('.bat');
    
    bats.forEach(bat => {
        // Set random initial positions
        const startX = Math.random() * window.innerWidth;
        const startY = Math.random() * window.innerHeight;
        bat.style.left = `${startX}px`;
        bat.style.top = `${startY}px`;
        
        // Set random animation delays
        bat.style.animationDelay = `${Math.random() * 5}s`;
        
        // Add random movement
        setInterval(() => {
            const newX = Math.random() * window.innerWidth;
            const newY = Math.random() * window.innerHeight;
            bat.style.transition = 'all 5s ease-in-out';
            bat.style.left = `${newX}px`;
            bat.style.top = `${newY}px`;
            bat.style.transform = `rotate(${Math.random() * 360}deg)`;
        }, 5000 + Math.random() * 2000);
    });
} 