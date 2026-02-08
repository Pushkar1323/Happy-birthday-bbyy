// ============================================
// GLOBAL VARIABLES
// ============================================
let currentSlide = 0;
const totalSlides = 8;
let isBlowing = false;
let audioContext = null;
let analyser = null;
let microphone = null;
let blowCheckInterval = null;

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    initializeEffects();
    updateNavigation();
});

function initializeEffects() {
    createFloatingHearts();
    createBalloons();
    createSparkles();
}

// ============================================
// SLIDE NAVIGATION
// ============================================
function nextSlide() {
    if (currentSlide < totalSlides - 1) {
        const current = document.getElementById(`slide-${currentSlide + 1}`);
        current.classList.remove('active');
        current.classList.add('prev');
        
        currentSlide++;
        
        const next = document.getElementById(`slide-${currentSlide + 1}`);
        next.classList.remove('prev');
        next.classList.add('active');
        
        updateNavigation();
        
        // Final slide pe confetti
        if (currentSlide === totalSlides - 1) {
            setTimeout(() => createConfetti(), 500);
        }
    }
}

function prevSlide() {
    if (currentSlide > 0) {
        const current = document.getElementById(`slide-${currentSlide + 1}`);
        current.classList.remove('active');
        
        currentSlide--;
        
        const prev = document.getElementById(`slide-${currentSlide + 1}`);
        prev.classList.remove('prev');
        prev.classList.add('active');
        
        updateNavigation();
    }
}

function goToSlide(index) {
    // Remove all active/prev classes
    document.querySelectorAll('.slide').forEach((slide, i) => {
        slide.classList.remove('active', 'prev');
        if (i < index) {
            slide.classList.add('prev');
        }
    });
    
    currentSlide = index;
    document.getElementById(`slide-${currentSlide + 1}`).classList.add('active');
    
    updateNavigation();
    
    // Final slide pe confetti
    if (currentSlide === totalSlides - 1) {
        setTimeout(() => createConfetti(), 500);
    }
}

function updateNavigation() {
    // Update buttons
    document.getElementById('prevBtn').disabled = currentSlide === 0;
    document.getElementById('nextBtn').disabled = currentSlide === totalSlides - 1;
    
    // Update indicators
    document.querySelectorAll('.indicator').forEach((ind, i) => {
        ind.classList.toggle('active', i === currentSlide);
    });
}

// ============================================
// CANDLE BLOWING (OPTIMIZED - NO LAG)
// ============================================
async function startBlowing() {
    const blowBtn = document.getElementById('blowBtn');
    
    if (isBlowing) {
        stopBlowing();
        return;
    }
    
    try {
        // Request microphone access
        const stream = await navigator.mediaDevices.getUserMedia({ 
            audio: { 
                echoCancellation: false,
                noiseSuppression: false,
                autoGainControl: false
            } 
        });
        
        // Setup audio context
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        microphone = audioContext.createMediaStreamSource(stream);
        
        microphone.connect(analyser);
        analyser.fftSize = 64; // Small FFT for performance
        analyser.smoothingTimeConstant = 0.5;
        
        isBlowing = true;
        blowBtn.classList.add('listening');
        blowBtn.textContent = '🎤 Phook Maaro!';
        
        // Use setInterval instead of requestAnimationFrame (less CPU intensive)
        blowCheckInterval = setInterval(checkBlow, 100); // Check every 100ms
        
    } catch (err) {
        console.error('Microphone error:', err);
        alert('Microphone access chahiye! Please allow karo.');
    }
}

function checkBlow() {
    if (!isBlowing || !analyser) return;
    
    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(dataArray);
    
    // Calculate average volume
    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
        sum += dataArray[i];
    }
    const average = sum / dataArray.length;
    
    // Low threshold for easy blowing
    if (average > 30) {
        blowAllCandles();
    }
}

function blowAllCandles() {
    // Blow all candles at once
    for (let i = 1; i <= 5; i++) {
        const flame = document.getElementById(`flame-${i}`);
        if (flame) {
            flame.classList.add('blown');
        }
    }
    
    // Show success message
    setTimeout(() => {
        document.getElementById('successMessage').classList.add('show');
        document.getElementById('cakeInstruction').textContent = '✨ Wish Zaroor Poori Hogi! ✨';
        createConfetti();
        stopBlowing();
    }, 300);
}

function stopBlowing() {
    isBlowing = false;
    
    // Clear interval
    if (blowCheckInterval) {
        clearInterval(blowCheckInterval);
        blowCheckInterval = null;
    }
    
    // Close audio context
    if (audioContext) {
        audioContext.close();
        audioContext = null;
    }
    
    const blowBtn = document.getElementById('blowBtn');
    blowBtn.classList.remove('listening');
    blowBtn.textContent = '🎤 Phook Maaro!';
}

// ============================================
// FLOATING HEARTS
// ============================================
function createFloatingHearts() {
    const container = document.getElementById('heartsContainer');
    const hearts = ['❤️', '💕', '💖', '💗', '💓', '💝', '💘'];
    
    setInterval(() => {
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.fontSize = (Math.random() * 15 + 20) + 'px';
        heart.style.animationDuration = (Math.random() * 3 + 4) + 's';
        
        container.appendChild(heart);
        
        // Remove after animation
        setTimeout(() => heart.remove(), 6000);
    }, 800);
}

// ============================================
// BALLOONS
// ============================================
function createBalloons() {
    const container = document.getElementById('balloons');
    const balloonEmojis = ['🎈', '🎈', '🎈', '🎈'];
    const colors = ['red', 'blue', 'yellow', 'green', 'pink', 'purple'];
    
    for (let i = 0; i < 8; i++) {
        const balloon = document.createElement('div');
        balloon.className = 'balloon';
        balloon.textContent = '🎈';
        balloon.style.left = (10 + Math.random() * 80) + '%';
        balloon.style.bottom = (Math.random() * 30 + 70) + '%';
        balloon.style.animationDelay = (Math.random() * 3) + 's';
        balloon.style.opacity = '0.7';
        
        container.appendChild(balloon);
    }
}

// ============================================
// SPARKLES
// ============================================
function createSparkles() {
    const container = document.getElementById('sparklesContainer');
    
    setInterval(() => {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle-item';
        sparkle.textContent = '✨';
        sparkle.style.left = Math.random() * 100 + 'vw';
        sparkle.style.top = Math.random() * 100 + 'vh';
        sparkle.style.animationDuration = (Math.random() * 1 + 1.5) + 's';
        
        container.appendChild(sparkle);
        
        setTimeout(() => sparkle.remove(), 2500);
    }, 400);
}

// ============================================
// CONFETTI
// ============================================
function createConfetti() {
    const container = document.getElementById('confettiContainer');
    const colors = ['#ff6b6b', '#4ecdc4', '#ffe66d', '#95e1d3', '#f38181', '#aa96da', '#ffd93d', '#ff9ff3'];
    
    for (let i = 0; i < 100; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            
            // Random properties
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.width = (Math.random() * 10 + 5) + 'px';
            confetti.style.height = (Math.random() * 10 + 5) + 'px';
            confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
            
            const duration = Math.random() * 2 + 2;
            confetti.style.animationDuration = duration + 's';
            
            container.appendChild(confetti);
            
            // Remove after animation
            setTimeout(() => confetti.remove(), duration * 1000);
        }, i * 30);
    }
}

// ============================================
// MUSIC TOGGLE
// ============================================
function toggleMusic() {
    const music = document.getElementById('bgMusic');
    const btn = document.getElementById('musicBtn');
    
    if (music.paused) {
        music.play();
        btn.textContent = '🔊';
    } else {
        music.pause();
        btn.textContent = '🎵';
    }
}

// ============================================
// KEYBOARD NAVIGATION
// ============================================
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === ' ') {
        nextSlide();
    } else if (e.key === 'ArrowLeft') {
        prevSlide();
    }
});

// ============================================
// TOUCH/SWIPE NAVIGATION
// ============================================
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

document.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
}, { passive: true });

function handleSwipe() {
    const diff = touchStartX - touchEndX;
    const threshold = 50;
    
    if (Math.abs(diff) > threshold) {
        if (diff > 0) {
            nextSlide(); // Swipe left = next
        } else {
            prevSlide(); // Swipe right = prev
        }
    }
}

// ============================================
// PHOTO ERROR HANDLING
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    const mainPhoto = document.getElementById('mainPhoto');
    if (mainPhoto) {
        mainPhoto.onerror = function() {
            // If photo not found, show placeholder
            this.src = 'data:image/svg+xml,' + encodeURIComponent(`
                <svg xmlns="http://www.w3.org/2000/svg" width="280" height="350" viewBox="0 0 280 350">
                    <rect fill="#ffe4e1" width="280" height="350"/>
                    <text x="140" y="160" text-anchor="middle" fill="#e91e63" font-size="60">📸</text>
                    <text x="140" y="200" text-anchor="middle" fill="#e91e63" font-size="14" font-family="Arial">Photo Add Karo!</text>
                    <text x="140" y="220" text-anchor="middle" fill="#999" font-size="12" font-family="Arial">photos/appu.jpg</text>
                </svg>
            `);
        };
    }
});
