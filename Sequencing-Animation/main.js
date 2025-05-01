const aliceTumbling = [
  { transform: 'translateY(0) scale(1)', opacity: 1, filter: 'blur(0px)' },
  { transform: 'translateY(-100px) scale(1.2)', opacity: 0.7, filter: 'blur(2px)' },
  { transform: 'translateY(0) scale(1)', opacity: 1, filter: 'blur(0px)' }
];

const aliceTiming = {
  duration: 2000,
  iterations: 1,
  fill: 'forwards',
  easing: 'cubic-bezier(0.42, 0, 0.58, 1)'
}

const alice1 = document.querySelector("#alice1");
const alice2 = document.querySelector("#alice2");
const alice3 = document.querySelector("#alice3");

// Add some initial styling
[alice1, alice2, alice3].forEach(alice => {
  alice.style.transformOrigin = 'center center';
  alice.style.transition = 'all 0.3s ease';
});

// Async/await approach with more interesting animations
async function animateAlices() {
  try {
    // First Alice: Bounce up with fade
    await alice1.animate(aliceTumbling, aliceTiming).finished;
    
    // Second Alice: Swing left and right with rotation
    await alice2.animate([
      { transform: 'translateX(0) rotate(0deg)', filter: 'sepia(0)' },
      { transform: 'translateX(100px) rotate(15deg)', filter: 'sepia(1)' },
      { transform: 'translateX(-100px) rotate(-15deg)', filter: 'sepia(0.5)' },
      { transform: 'translateX(0) rotate(0deg)', filter: 'sepia(0)' }
    ], {
      ...aliceTiming,
      duration: 2500
    }).finished;
    
    // Third Alice: Pulse with 3D flip
    await alice3.animate([
      { transform: 'perspective(500px) rotateY(0deg) scale(1)', boxShadow: '0 0 0 rgba(0,0,0,0)' },
      { transform: 'perspective(500px) rotateY(180deg) scale(1.5)', boxShadow: '0 10px 20px rgba(0,0,0,0.3)' },
      { transform: 'perspective(500px) rotateY(360deg) scale(1)', boxShadow: '0 0 0 rgba(0,0,0,0)' }
    ], {
      ...aliceTiming,
      duration: 3000,
      easing: 'ease-in-out'
    }).finished;
  } catch (error) {
    console.error(`Error animating Alices: ${error}`);
  }
}

animateAlices();
