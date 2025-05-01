// Image data - normally this would come from an API
const images = [
    {
        id: 1,
        src: 'https://media.istockphoto.com/id/1403500817/photo/the-craggies-in-the-blue-ridge-mountains.jpg?s=612x612&w=0&k=20&c=N-pGA8OClRVDzRfj_9AqANnOaDS3devZWwrQNwZuDSk=',
        title: 'Beautiful Nature',
        category: 'nature'
    },
    {
        id: 2,
        src: 'https://images.desenio.com/zoom/11636_2-38801.jpg?auto=compress%2Cformat&fit=max&w=3840',
        title: 'Mountain View',
        category: 'nature'
    },
    {
        id: 3,
        src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLGpKBU4oVS2tquhUmUpdtwXQBWPm3_pJAeA&s',
        title: 'City Lights',
        category: 'city'
    },
    {
        id: 4,
        src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3OeRlORfUaHhhjoV_Z7NgQn1Ta-8K8Sgj8A&s',
        title: 'Modern Architecture',
        category: 'city'
    },
    {
        id: 5,
        src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLWuVh2GVusM5hIveL17BCA9rrXzYmFI4tWA&s',
        title: 'Abstract Art',
        category: 'abstract'
    },
    {
        id: 6,
        src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRg4dn7oeSviL_fW20AbNJb2nyLKpvikY_seA&s',
        title: 'Colorful Patterns',
        category: 'abstract'
    },
    {
        id: 7,
        src: 'https://st4.depositphotos.com/40984728/41269/i/450/depositphotos_412690122-stock-photo-namib-desert-namibia-big-sand.jpg',
        title: 'Dense Forest',
        category: 'nature'
    },
    {
        id: 8,
        src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNMBYwpNLqBF5B0lQihDHUOl5ue9uNumXR2Q&s',
        title: 'Street Photography',
        category: 'city'
    }
];

// DOM Elements
const galleryEl = document.querySelector('.gallery');
const lightboxEl = document.getElementById('lightbox');
const lightboxImgEl = document.getElementById('lightboxImg');
const captionEl = document.getElementById('caption');
const closeEl = document.querySelector('.close');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const filterSelect = document.getElementById('filterSelect');

// State variables
let currentIndex = 0;
let filteredImages = [...images];

// Initialize the gallery
function initGallery() {
    renderGallery(filteredImages);
    setupEventListeners();
}

// Render the gallery based on the current filter
function renderGallery(imagesToRender) {
    galleryEl.innerHTML = '';
    
    if (imagesToRender.length === 0) {
        galleryEl.innerHTML = '<p class="no-images">No images found for this category.</p>';
        return;
    }
    
    imagesToRender.forEach((image, index) => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        galleryItem.dataset.index = index;
        
        galleryItem.innerHTML = `
            <img src="${image.src}" alt="${image.title}">
            <div class="title">${image.title}</div>
        `;
        
        galleryItem.addEventListener('click', () => {
            openLightbox(index);
        });
        
        galleryEl.appendChild(galleryItem);
    });
}

// Set up all event listeners
function setupEventListeners() {
    // Close lightbox
    closeEl.addEventListener('click', closeLightbox);
    lightboxEl.addEventListener('click', (e) => {
        if (e.target === lightboxEl) {
            closeLightbox();
        }
    });
    
    // Navigation buttons
    prevBtn.addEventListener('click', showPrevImage);
    nextBtn.addEventListener('click', showNextImage);
    
    // Filter dropdown
    filterSelect.addEventListener('change', filterGallery);
    
    // Keyboard navigation
    document.addEventListener('keydown', handleKeyPress);
}

// Open the lightbox with the selected image
function openLightbox(index) {
    currentIndex = index;
    updateLightboxImage();
    lightboxEl.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Prevent scrolling while lightbox is open
}

// Close the lightbox
function closeLightbox() {
    lightboxEl.style.display = 'none';
    document.body.style.overflow = ''; // Restore scrolling
}

// Update the lightbox with the current image
function updateLightboxImage() {
    const image = filteredImages[currentIndex];
    lightboxImgEl.src = image.src;
    captionEl.textContent = image.title;
}

// Show the previous image in the lightbox
function showPrevImage() {
    currentIndex = (currentIndex - 1 + filteredImages.length) % filteredImages.length;
    updateLightboxImage();
}

// Show the next image in the lightbox
function showNextImage() {
    currentIndex = (currentIndex + 1) % filteredImages.length;
    updateLightboxImage();
}

// Filter the gallery based on the selected category
function filterGallery() {
    const category = filterSelect.value;
    
    if (category === 'all') {
        filteredImages = [...images];
    } else {
        filteredImages = images.filter(image => image.category === category);
    }
    
    renderGallery(filteredImages);
}

// Handle keyboard navigation
function handleKeyPress(e) {
    if (lightboxEl.style.display === 'block') {
        switch (e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowLeft':
                showPrevImage();
                break;
            case 'ArrowRight':
                showNextImage();
                break;
        }
    }
}

// Initialize when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initGallery);
