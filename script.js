// ============================================
// ROSE DAY WEBSITE - JAVASCRIPT
// ============================================

// Configuration
const CONFIG = {
    LOADING_DURATION: 3000,
    PARTICLE_COUNT: 100,
    PETAL_COUNT: 20,
    FIREWORK_PARTICLES: 100,
    HEART_COUNT: 30,
};

// Global State
let audioContext = null;
let isClicked = false;

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initAudio();
    createFloatingParticles();
    createFloatingPetals();
    setupEventListeners();
    hideLoadingScreen();
});

// ============================================
// LOADING SCREEN MANAGEMENT
// ============================================

/**
 * Hide loading screen and show main content
 */
function hideLoadingScreen() {
    setTimeout(() => {
        const loadingScreen = document.getElementById('loadingScreen');
        const mainContent = document.getElementById('mainContent');

        loadingScreen.style.animation = 'fadeOut 0.8s ease-out forwards';
        
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            mainContent.classList.remove('hidden');
        }, 800);
    }, CONFIG.LOADING_DURATION);
}

// ============================================
// AUDIO INITIALIZATION
// ============================================

/**
 * Initialize Web Audio API for background music and sound effects
 */
function initAudio() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        window.audioContext = audioContext;
        
        // Create ambient romantic background music
        playAmbientMusic();
    } catch (error) {
        console.log('Audio context not available:', error);
    }
}

/**
 * Generate ambient romantic music using Web Audio API
 */
function playAmbientMusic() {
    if (!window.audioContext) return;
    
    const ctx = window.audioContext;
    const now = ctx.currentTime;
    
    // Create a gentle ambient pad
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(146.83, now); // D3 note
    gain.gain.setValueAtTime(0.05, now);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start(now);
    osc.stop(now + 30);
}

/**
 * Play sparkle sound effect using Web Audio API
 */
function playSparkleSound() {
    if (!window.audioContext) return;
    
    const ctx = window.audioContext;
    const now = ctx.currentTime;
    
    // Create a high-pitched sparkle sound
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    
    osc.type = 'square';
    osc.frequency.setValueAtTime(1000, now);
    osc.frequency.exponentialRampToValueAtTime(2000, now + 0.1);
    
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
    
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start(now);
    osc.stop(now + 0.1);
}

/**
 * Play a soft chord for 'Let Me Think' feedback
 */
function playSoftChord() {
    if (!window.audioContext) return;
    const ctx = window.audioContext;
    const now = ctx.currentTime;
    const freqs = [261.63, 329.63, 392.00]; // C4, E4, G4
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.001, now);
    gain.connect(ctx.destination);

    freqs.forEach((f, i) => {
        const o = ctx.createOscillator();
        o.type = 'sine';
        o.frequency.setValueAtTime(f, now + i * 0.02);
        o.connect(gain);
        o.start(now + i * 0.02);
        o.stop(now + 1.6);
    });

    gain.gain.exponentialRampToValueAtTime(0.06, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.6);
}

/**
 * Play firework explosion sound
 */
function playExplosionSound() {
    if (!window.audioContext) return;
    
    const ctx = window.audioContext;
    const now = ctx.currentTime;
    
    // Create explosion-like sound using noise
    const buffer = ctx.createBuffer(1, ctx.sampleRate * 0.3, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < buffer.length; i++) {
        data[i] = Math.random() * 2 - 1;
    }
    
    const source = ctx.createBufferSource();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    
    source.buffer = buffer;
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
    
    source.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    
    source.start(now);
}

// ============================================
// PARTICLE EFFECTS
// ============================================

/**
 * Create floating heart particles in background
 */
function createFloatingParticles() {
    const container = document.getElementById('particleContainer');
    
    for (let i = 0; i < CONFIG.PARTICLE_COUNT; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.innerHTML = '♡';
        
        // Random starting position
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const duration = 8 + Math.random() * 12;
        const delay = Math.random() * 5;
        const tx = (Math.random() - 0.5) * 200;
        const ty = -Math.random() * 300 - 100;
        
        particle.style.cssText = `
            position: absolute;
            left: ${x}%;
            top: ${y}%;
            font-size: ${8 + Math.random() * 12}px;
            color: rgba(255, 105, 180, ${0.2 + Math.random() * 0.5});
            opacity: 0;
            pointer-events: none;
            --tx: ${tx}px;
            --ty: ${ty}px;
            animation: particleFloat ${duration}s linear ${delay}s infinite;
            text-shadow: 0 0 ${5 + Math.random() * 10}px rgba(255, 105, 180, 0.6);
        `;
        
        container.appendChild(particle);
    }
}

/**
 * Create falling petal animation
 */
function createFloatingPetals() {
    const container = document.getElementById('petalContainer');
    
    for (let i = 0; i < CONFIG.PETAL_COUNT; i++) {
        const petal = document.createElement('div');
        petal.className = 'petal';
        petal.innerHTML = '🌹';
        
        // Random starting position
        const x = Math.random() * 100;
        const duration = 12 + Math.random() * 8;
        const delay = Math.random() * 8;
        const drift = (Math.random() - 0.5) * 200;
        
        petal.style.cssText = `
            position: absolute;
            left: ${x}%;
            top: -20px;
            font-size: ${12 + Math.random() * 8}px;
            opacity: 0.6;
            pointer-events: none;
            --drift: ${drift}px;
            animation: petalFall ${duration}s linear ${delay}s infinite;
            z-index: 10;
        `;
        
        container.appendChild(petal);
    }
}

// ============================================
// SPARKLE EFFECT (Rose Sparkles)
// ============================================

/**
 * Create sparkle animation around the rose
 */
function createRoseSparkles() {
    playSparkleSound();
    
    const roseContainer = document.querySelector('.rose-container');
    const rect = roseContainer.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Create multiple sparkles around the rose
    for (let i = 0; i < 20; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        sparkle.innerHTML = '✨';
        
        // Random angle around the rose
        const angle = (Math.PI * 2 * i) / 20;
        const distance = 150 + Math.random() * 100;
        
        const x = centerX + Math.cos(angle) * distance;
        const y = centerY + Math.sin(angle) * distance;
        
        sparkle.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            font-size: 20px;
            pointer-events: none;
            z-index: 300;
            animation: sparkle 0.8s ease-out forwards;
            opacity: 1;
        `;
        
        document.body.appendChild(sparkle);
        
        setTimeout(() => sparkle.remove(), 800);
    }
}

// ============================================
// FIREWORKS EFFECT
// ============================================

/**
 * Create fireworks explosion from center
 */
function createFireworks() {
    playExplosionSound();
    
    const container = document.getElementById('fireworksContainer');
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    // Determine colors for fireworks
    const colors = ['#ff1493', '#ff69b4', '#ffb6c1', '#ffc0cb', '#ffffff'];
    
    // Create multiple firework bursts
    for (let burst = 0; burst < 5; burst++) {
        setTimeout(() => {
            for (let i = 0; i < CONFIG.FIREWORK_PARTICLES; i++) {
                const firework = document.createElement('div');
                firework.className = 'firework';
                
                // Random direction
                const angle = (Math.PI * 2 * i) / CONFIG.FIREWORK_PARTICLES;
                const velocity = 3 + Math.random() * 5;
                const tx = Math.cos(angle) * velocity * 200;
                const ty = Math.sin(angle) * velocity * 200;
                
                const color = colors[Math.floor(Math.random() * colors.length)];
                firework.style.cssText = `
                    left: ${centerX}px;
                    top: ${centerY}px;
                    background: ${color};
                    --tx: ${tx}px;
                    --ty: ${ty}px;
                    animation: fireworkExplode 1.5s ease-out forwards;
                    box-shadow: 0 0 10px ${color};
                `;
                
                container.appendChild(firework);
                setTimeout(() => firework.remove(), 1500);
            }
        }, burst * 200);
    }
}

// ============================================
// HEART EXPLOSION
// ============================================

/**
 * Create heart explosion animation
 */
function createHeartExplosion() {
    const container = document.getElementById('heartExplosionContainer');
    
    for (let i = 0; i < CONFIG.HEART_COUNT; i++) {
        const heart = document.createElement('div');
        heart.className = 'heart';
        heart.innerHTML = '❤️';
        
        // Random starting position from center
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        
        const angle = (Math.PI * 2 * i) / CONFIG.HEART_COUNT;
        const velocity = 2 + Math.random() * 4;
        const tx = Math.cos(angle) * velocity * 300;
        const ty = Math.sin(angle) * velocity * 300;
        
        heart.style.cssText = `
            left: ${centerX}px;
            top: ${centerY}px;
            font-size: ${20 + Math.random() * 20}px;
            --tx: ${tx}px;
            --ty: ${ty}px;
            animation: heartExplode 2s ease-out forwards;
        `;
        
        container.appendChild(heart);
        setTimeout(() => heart.remove(), 2000);
    }
}

// ============================================
// CAMERA ZOOM EFFECT
// ============================================

/**
 * Apply camera zoom effect to content
 */
function applyZoomEffect() {
    const wrapper = document.querySelector('.content-wrapper');
    wrapper.style.animation = 'none';
    
    setTimeout(() => {
        wrapper.style.transition = 'transform 1.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
        wrapper.style.transform = 'scale(0.95)';
    }, 100);
}

// ============================================
// POPUP CARD MANAGEMENT
// ============================================

/**
 * Show popup card with glassmorphism effect
 */
function showPopupCard() {
    const popup = document.getElementById('popupCard');
    popup.classList.remove('hidden');
    
    setTimeout(() => {
        popup.classList.add('show');
    }, 50);
}

/**
 * Hide popup card
 */
function hidePopupCard() {
    const popup = document.getElementById('popupCard');
    popup.classList.remove('show');
    
    setTimeout(() => {
        popup.classList.add('hidden');
    }, 800);
}

// ============================================
// BUTTON CLICK HANDLER
// ============================================

/**
 * Main button click event - triggers all effects
 */
function onActionButtonClick() {
    if (isClicked) return;
    isClicked = true;
    
    // Disable button
    const button = document.getElementById('actionButton');
    button.disabled = true;
    button.style.opacity = '0.7';
    
    // Trigger all effects in sequence
    // 1. Rose sparkles (immediate)
    createRoseSparkles();
    
    // 2. Fireworks (after 300ms)
    setTimeout(() => {
        createFireworks();
    }, 300);
    
    // 3. Heart explosion (after 500ms)
    setTimeout(() => {
        createHeartExplosion();
    }, 500);
    
    // 4. Camera zoom effect (after 800ms)
    setTimeout(() => {
        applyZoomEffect();
    }, 800);
    
    // 5. Show popup card (after 1500ms)
    setTimeout(() => {
        showPopupCard();
    }, 1500);
}

// ============================================
// EVENT LISTENERS
// ============================================

/**
 * Setup all event listeners
 */
function setupEventListeners() {
    // Main action button
    const actionButton = document.getElementById('actionButton');
    actionButton.addEventListener('click', onActionButtonClick);
    
    // Close button
    const closeBtn = document.getElementById('closeBtn');
    closeBtn.addEventListener('click', () => {
        hidePopupCard();
        isClicked = false;
        const button = document.getElementById('actionButton');
        button.disabled = false;
        button.style.opacity = '1';
    });
    
    // Popup button actions
    const yesBtn = document.querySelector('.yes-btn');
    const noBtn = document.querySelector('.no-btn');
    
    yesBtn.addEventListener('click', () => {
        // Celebratory effects
        createHeartExplosion();
        createFireworks();
        playSparkleSound();

        // Close popup and then navigate to forever.html where a beautiful message is shown
        hidePopupCard();

        setTimeout(() => {
            // Navigate to the dedicated 'forever' page
            window.location.href = 'forever.html';
        }, 800);
    });

    noBtn.addEventListener('click', () => {
        // Close popup and show the short requested message; play soft chord and add petals
        hidePopupCard();

        // Play gentle chord to convey emotion
        playSoftChord();

        // Add an extra shower of petals for empathy
        createFloatingPetals();

        setTimeout(() => {
            showBeautifulMessage(
                'I\'ll Wait...',
                'Nahi jaan tum meri ho baby',
                '🌹'
            );
        }, 300);

        // Reset action button state after a short delay so user can try again
        setTimeout(() => {
            isClicked = false;
            const button = document.getElementById('actionButton');
            button.disabled = false;
            button.style.opacity = '1';
        }, 2500);
    });
    
    // Popup background click to close
    const popup = document.getElementById('popupCard');
    popup.addEventListener('click', (e) => {
        if (e.target === popup) {
            hidePopupCard();
            isClicked = false;
            const button = document.getElementById('actionButton');
            button.disabled = false;
            button.style.opacity = '1';
        }
    });
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Create a particle at specific position
 */
function createParticleAtPosition(x, y, emoji) {
    const particle = document.createElement('div');
    particle.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        font-size: 24px;
        pointer-events: none;
        z-index: 300;
        animation: particleFloat 2s ease-out forwards;
    `;
    particle.innerHTML = emoji;
    
    document.body.appendChild(particle);
    setTimeout(() => particle.remove(), 2000);
}

/**
 * Preload animation check - ensure smooth performance
 */
function checkPerformance() {
    const startTime = performance.now();
    
    // Create a test animation
    const test = document.createElement('div');
    test.style.animation = 'testAnim 1s';
    document.body.appendChild(test);
    
    const endTime = performance.now();
    const loadTime = endTime - startTime;
    
    console.log(`Animation setup time: ${loadTime.toFixed(2)}ms`);
    test.remove();
}

/**
 * Initialize application
 */
function initializeApp() {
    checkPerformance();
    console.log('Rose Day Website - Loaded successfully! 🌹');
}

// Call initialization when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

// ============================================
// RESPONSIVE ADJUSTMENTS
// ============================================

/**
 * Handle window resize for responsive behavior
 */
window.addEventListener('resize', () => {
    // Adjust particle container size
    const particleContainer = document.getElementById('particleContainer');
    if (particleContainer) {
        particleContainer.style.width = '100%';
        particleContainer.style.height = '100%';
    }
});

// ============================================
// KEYBOARD SHORTCUTS (Optional)
// ============================================

/**
 * Handle keyboard shortcuts
 */
document.addEventListener('keydown', (e) => {
    // Press Space to trigger action
    if (e.code === 'Space' && !isClicked) {
        e.preventDefault();
        const button = document.getElementById('actionButton');
        button.click();
    }
    
    // Press Escape to close popup
    if (e.code === 'Escape' && !document.getElementById('popupCard').classList.contains('hidden')) {
        const closeBtn = document.getElementById('closeBtn');
        closeBtn.click();
    }
});

console.log('%c🌹 Rose Day Website 🌹', 'color: #ff69b4; font-size: 20px; font-weight: bold;');
console.log('%cMade with love and romance!', 'color: #ff1493; font-size: 14px;');

/**
 * Show beautiful message overlay
 */
function showBeautifulMessage(title, message, emoji) {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.75);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        padding: 20px;
        animation: popupFadeIn 0.5s ease-out forwards;
    `;

    const messageBox = document.createElement('div');
    messageBox.style.cssText = `
        width: 100%;
        max-width: 680px;
        padding: 40px 36px;
        border-radius: 20px;
        background: rgba(255,255,255,0.06);
        backdrop-filter: blur(12px);
        text-align: center;
        box-shadow: 0 8px 32px rgba(31,38,135,0.37), 0 0 50px rgba(255,105,180,0.15);
        color: #fff;
    `;

    messageBox.innerHTML = `
        <div style="font-size: 56px; margin-bottom: 12px;">${emoji}</div>
        <h2 style="font-size: 30px; color: #ffd6e8; margin-bottom: 14px;">${title}</h2>
        <p style="font-size: 17px; color: rgba(255,255,255,0.95); line-height:1.7; white-space: pre-wrap;">${message}</p>
        <div style="margin-top:22px;"><button id="beautifulCloseBtn" style="padding:12px 34px; border-radius:24px; border:none; background:linear-gradient(90deg,#ff5da2,#ff9cc2); color:#fff; font-weight:700; cursor:pointer;">Close</button></div>
    `;

    overlay.appendChild(messageBox);
    document.body.appendChild(overlay);

    const closeButton = document.getElementById('beautifulCloseBtn');
    closeButton.addEventListener('click', () => {
        overlay.style.animation = 'fadeOut 0.4s ease-out forwards';
        setTimeout(() => overlay.remove(), 400);
    });

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            overlay.style.animation = 'fadeOut 0.4s ease-out forwards';
            setTimeout(() => overlay.remove(), 400);
        }
    });
}
