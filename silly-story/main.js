// 1. COMPLETE VARIABLE AND FUNCTION DEFINITIONS

const customName = document.getElementById('customname');
const randomize = document.querySelector('.randomize');
const story = document.querySelector('.story');
const storyText = document.querySelector('.story-text');

function randomValueFromArray(array){
  const random = Math.floor(Math.random()*array.length);
  return array[random];
}

// 2. RAW TEXT STRINGS

const storyTextContent = "It was 94 fahrenheit outside, so :insertx: went for a walk. When they got to :inserty:, they stared in horror for a few moments, then :insertz:. Bob saw the whole thing, but was not surprised — :insertx: weighs 300 pounds, and it was a hot day.";

const insertX = [
  "Quantum Explorer Zeta",
  "Commander Nebula",
  "Galactic Nomad Xion"
];

const insertY = [
  "the abandoned space station",
  "the quantum realm nexus",
  "the interstellar bazaar"
];

const insertZ = [
  "phased out of existence temporarily",
  "transformed into pure cosmic energy",
  "opened a wormhole with a mere thought"
];

// 3. EVENT LISTENER AND PARTIAL FUNCTION DEFINITION

randomize.addEventListener('click', result);

function result() {
  // Add loading animation to button
  randomize.textContent = "PROCESSING...";
  randomize.disabled = true;
  
  // Glitch effect animation on button
  randomize.classList.add('processing');
  
  // Small delay to show the loading state
  setTimeout(() => {
    let newStory = storyTextContent;
    const xItem = randomValueFromArray(insertX);
    const yItem = randomValueFromArray(insertY);
    const zItem = randomValueFromArray(insertZ);

    newStory = newStory.replaceAll(':insertx:', xItem);
    newStory = newStory.replaceAll(':inserty:', yItem);
    newStory = newStory.replaceAll(':insertz:', zItem);

    if(customName.value !== '') {
      const name = customName.value;
      newStory = newStory.replaceAll('Bob', name);
    }

    if(document.getElementById('uk').checked) {
      const weight = `${Math.round(300 * 0.0714286)} stone`;
      const temperature =  `${Math.round((94 - 32) * 5 / 9)} centigrade`;
      
      newStory = newStory.replaceAll('94 fahrenheit', temperature);
      newStory = newStory.replaceAll('300 pounds', weight);
    }

    // Add typewriter effect to story text
    typewriterEffect(newStory);
    
    // Reset button after story is shown
    setTimeout(() => {
      randomize.textContent = "Initialize Sequence";
      randomize.disabled = false;
      randomize.classList.remove('processing');
    }, 1000);
    
  }, 1000);
}

// Add typewriter effect
function typewriterEffect(text) {
  // First make the container visible
  story.classList.add('visible');
  
  // Clear any existing text
  storyText.textContent = '';
  
  // Set up counter and interval for typewriter effect
  let i = 0;
  const speed = 30; // typing speed in ms
  
  function type() {
    if (i < text.length) {
      storyText.textContent += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }
  
  // Start the typewriter effect
  setTimeout(type, 500);
}

// Add some interactivity for input field
customName.addEventListener('focus', function() {
  this.placeholder = '';
});

customName.addEventListener('blur', function() {
  if (!this.value) {
    this.placeholder = 'Enter subject name...';
  }
});

// Add extra CSS for the processing animation
document.head.insertAdjacentHTML('beforeend', `
  <style>
    .cosmic-button.processing {
      background: linear-gradient(90deg, var(--accent-color), var(--highlight));
      animation: glitch 0.5s infinite alternate;
    }
    
    @keyframes glitch {
      0% {
        text-shadow: 0.05em 0 0 rgba(255, 0, 0, 0.75), -0.05em -0.025em 0 rgba(0, 255, 0, 0.75), -0.025em 0.05em 0 rgba(0, 0, 255, 0.75);
      }
      15% {
        text-shadow: -0.05em -0.025em 0 rgba(255, 0, 0, 0.75), 0.025em 0.025em 0 rgba(0, 255, 0, 0.75), -0.05em -0.05em 0 rgba(0, 0, 255, 0.75);
      }
      50% {
        text-shadow: 0.025em 0.05em 0 rgba(255, 0, 0, 0.75), 0.05em 0 0 rgba(0, 255, 0, 0.75), 0 -0.05em 0 rgba(0, 0, 255, 0.75);
      }
      100% {
        text-shadow: -0.025em 0 0 rgba(255, 0, 0, 0.75), -0.025em -0.025em 0 rgba(0, 255, 0, 0.75), -0.025em -0.05em 0 rgba(0, 0, 255, 0.75);
      }
    }
  </style>
`);
