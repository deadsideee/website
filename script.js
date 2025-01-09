// Initialize SoundCloud Widget
let widget;
let iframeElement = document.querySelector('#soundcloud-iframe');
let volumeSlider = document.querySelector('.volume-slider');
let volumeIcon = document.querySelector('.volume-icon');
let lastVolume = 100;

window.onload = function() {
    // Initialize SoundCloud Widget
    widget = SC.Widget(iframeElement);
    
    // Initialize volume control
    widget.bind(SC.Widget.Events.READY, function() {
        console.log('SoundCloud Widget Ready');
        widget.setVolume(100);
        
        // Volume slider event
        volumeSlider.addEventListener('input', function() {
            const volume = parseInt(this.value);
            console.log('Setting volume to:', volume);
            widget.setVolume(volume / 100); // Convert to 0-1 range for SoundCloud API
            updateVolumeIcon(volume);
        });

        // Volume icon click event (mute/unmute)
        volumeIcon.addEventListener('click', function() {
            if (volumeSlider.value > 0) {
                lastVolume = volumeSlider.value;
                volumeSlider.value = 0;
                widget.setVolume(0);
                updateVolumeIcon(0);
            } else {
                volumeSlider.value = lastVolume;
                widget.setVolume(lastVolume / 100);
                updateVolumeIcon(lastVolume);
            }
        });

        // Add play event listener to vinyl record
        const vinylRecord = document.querySelector('.vinyl-record');
        if (vinylRecord) {
            vinylRecord.addEventListener('click', function() {
                widget.toggle();
            });
        }
    });

    // Add error handling
    widget.bind(SC.Widget.Events.ERROR, function() {
        console.error('SoundCloud Widget Error');
    });
};

// Update volume icon based on volume level
function updateVolumeIcon(volume) {
    volumeIcon.className = 'fas';
    if (volume > 50) {
        volumeIcon.classList.add('fa-volume-up');
    } else if (volume > 0) {
        volumeIcon.classList.add('fa-volume-down');
    } else {
        volumeIcon.classList.add('fa-volume-mute');
    }
}

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

// Mobile menu
const menuBtn = document.querySelector('.menu-btn');
const navLinks = document.querySelector('.nav-links');
const socialLinks = document.querySelector('.social-links');

menuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    socialLinks.classList.toggle('active');
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
        this.initializeVolumeControl();
    }

    initializePlayer() {
        const vinylRecord = document.getElementById('vinyl-player');
        if (vinylRecord) {
            vinylRecord.addEventListener('click', () => {
                if (!this.isPlaying) {
                    this.widget.load('https://soundcloud.com/deadsidee/bam', {
                        auto_play: true,
                        show_artwork: false,
                        show_comments: false,
                        show_playcount: false,
                        show_user: false,
                        visual: false
                    });
                    this.isPlaying = true;
                    vinylRecord.style.animation = 'spin 2s linear infinite';
                } else {
                    this.widget.pause();
                    this.isPlaying = false;
                    vinylRecord.style.animation = 'none';
                }
            });

            // Add hover effect
            vinylRecord.addEventListener('mouseenter', () => {
                if (!this.isPlaying) {
                    vinylRecord.style.transform = 'scale(1.05)';
                    vinylRecord.style.boxShadow = '0 0 30px rgba(255, 0, 0, 0.4), 0 0 60px rgba(255, 0, 0, 0.2)';
                }
            });

            vinylRecord.addEventListener('mouseleave', () => {
                if (!this.isPlaying) {
                    vinylRecord.style.transform = 'scale(1)';
                    vinylRecord.style.boxShadow = '0 0 20px rgba(0, 0, 0, 0.8), 0 0 40px rgba(0, 0, 0, 0.6)';
                }
            });
        }
    }

    initializeVolumeControl() {
        const volumeSlider = document.querySelector('.volume-slider');
        const volumeControl = document.querySelector('.volume-control');
        const volumeIcon = document.querySelector('.volume-icon');

        // Initialize volume slider at max volume
        volumeSlider.value = 100;
        this.updateVolumeDisplay(100);
        
        // Set initial volume to maximum
        this.widget.setVolume(100);

        // Volume slider change
        volumeSlider.addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            this.updateVolumeDisplay(value);
            this.widget.setVolume(value);
        });

        // Volume icon click (mute/unmute)
        volumeIcon.addEventListener('click', () => {
            if (volumeSlider.value > 0) {
                this.lastVolume = volumeSlider.value;
                volumeSlider.value = 0;
            } else {
                volumeSlider.value = this.lastVolume || 100;
            }
            volumeSlider.dispatchEvent(new Event('input'));
        });

        // Initialize widget events
        this.widget.bind(SC.Widget.Events.READY, () => {
            this.widget.setVolume(100);
            volumeSlider.value = 100;
            this.updateVolumeDisplay(100);
        });

        // Handle track finish
        this.widget.bind(SC.Widget.Events.FINISH, () => {
            const vinylRecord = document.getElementById('vinyl-player');
            if (vinylRecord) {
                vinylRecord.style.animation = 'none';
                this.isPlaying = false;
            }
        });
    }

    updateVolumeDisplay(value) {
        const volumeControl = document.querySelector('.volume-control');
        const volumeIcon = document.querySelector('.volume-icon');
        
        // Update volume percentage display
        volumeControl.setAttribute('data-volume', `${value}%`);
        
        // Update volume icon
        if (value == 0) {
            volumeIcon.className = 'fas fa-volume-mute volume-icon';
        } else if (value < 50) {
            volumeIcon.className = 'fas fa-volume-down volume-icon';
        } else {
            volumeIcon.className = 'fas fa-volume-up volume-icon';
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