// Load API key from environment variable or prompt the user if not found
const API_KEY = process.env.GROQ_API_KEY || localStorage.getItem('GROQ_API_KEY');
const API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// DOM Elements
const modelSelect = document.getElementById('model-select');
const promptInput = document.getElementById('prompt-input');
const submitBtn = document.getElementById('submit-btn');
const clearBtn = document.getElementById('clear-btn');
const savePromptBtn = document.getElementById('save-prompt-btn');
const themeToggleBtn = document.getElementById('theme-toggle-btn');
const responseArea = document.getElementById('response-area');
const favoritesListEl = document.getElementById('favorites-list');
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const sidebar = document.querySelector('.sidebar');

// App State
let currentModel = 'llama3-8b-8192';
let savedPrompts = [];
let isDarkTheme = false;
let isMobileMenuOpen = false;

// Check if API key is available or prompt user to enter it
function checkApiKey() {
    if (!API_KEY) {
        const apiKeyPrompt = prompt('Please enter your Groq API key:');
        
        if (apiKeyPrompt) {
            // Save API key to localStorage for future use
            localStorage.setItem('GROQ_API_KEY', apiKeyPrompt);
            // Reload the page to use the new API key
            window.location.reload();
        } else {
            responseArea.innerHTML = `<p class="error">Error: API key not provided. You can get a Groq API key from <a href="https://console.groq.com/" target="_blank">https://console.groq.com/</a></p>`;
        }
    }
}

// Load saved preferences from localStorage
function loadSavedPreferences() {
    // Check API key first
    checkApiKey();
    
    // Load saved prompts
    const savedPromptsData = localStorage.getItem('savedPrompts');
    if (savedPromptsData) {
        savedPrompts = JSON.parse(savedPromptsData);
        renderSavedPrompts();
    }

    // Load preferred model
    const savedModel = localStorage.getItem('model');
    if (savedModel) {
        // Check if the saved model is still available in the select options
        const modelExists = Array.from(modelSelect.options).some(option => option.value === savedModel);
        
        if (modelExists) {
            currentModel = savedModel;
            modelSelect.value = currentModel;
        } else {
            // If model is no longer available, default to the first option
            currentModel = modelSelect.options[0].value;
            modelSelect.value = currentModel;
            // Update localStorage with new model
            savePreferences();
        }
    }

    // Load theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        isDarkTheme = true;
        document.body.classList.add('dark-theme');
        themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
    }
}

// Save preferences to localStorage
function savePreferences() {
    localStorage.setItem('savedPrompts', JSON.stringify(savedPrompts));
    localStorage.setItem('model', currentModel);
    localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');
}

// Save current prompt to saved prompts
function savePrompt() {
    const prompt = promptInput.value.trim();
    
    if (!prompt) {
        // Don't save empty prompts
        return;
    }
    
    // Check if this prompt is already saved
    if (!savedPrompts.includes(prompt)) {
        // Add to the beginning of the array to show newest first
        savedPrompts.unshift(prompt);
        
        // Limit to 10 saved prompts
        if (savedPrompts.length > 10) {
            savedPrompts.pop();
        }
        
        // Update saved prompts display
        renderSavedPrompts();
        
        // Save to localStorage
        savePreferences();

        // Show temporary success message
        const originalText = savePromptBtn.innerHTML;
        savePromptBtn.innerHTML = '<i class="fas fa-check"></i>';
        setTimeout(() => {
            savePromptBtn.innerHTML = originalText;
        }, 1500);
        
        // Show status notification
        showNotification('Prompt saved successfully!', 'success');
    }
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close"><i class="fas fa-times"></i></button>
    `;
    
    // Add to body
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Auto dismiss after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
    
    // Close button
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
}

// Toggle mobile menu
function toggleMobileMenu() {
    isMobileMenuOpen = !isMobileMenuOpen;
    
    if (isMobileMenuOpen) {
        sidebar.style.display = 'flex';
        setTimeout(() => {
            sidebar.classList.add('show');
        }, 10);
    } else {
        sidebar.classList.remove('show');
        setTimeout(() => {
            sidebar.style.display = 'none';
        }, 300);
    }
}

// Generate AI response
async function generateResponse(prompt) {
    try {
        // Get latest API key (may have been set in localStorage)
        const currentApiKey = process.env.GROQ_API_KEY || localStorage.getItem('GROQ_API_KEY');
        
        // Check if API key is set
        if (!currentApiKey) {
            checkApiKey();
            return;
        }
        
        // Set loading state
        responseArea.innerHTML = '<p class="loading">Generating response</p>';
        submitBtn.disabled = true;
        
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${currentApiKey}`
            },
            body: JSON.stringify({
                model: currentModel,
                messages: [
                    {
                        role: 'system',
                        content: 'You are a helpful AI assistant.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.7,
                max_tokens: 1024
            })
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            const errorMessage = errorData.error?.message || 'API request failed';
            
            // Check if it's a model error
            if (errorMessage.includes('model') && errorMessage.includes('decommissioned')) {
                // Display error in UI
                responseArea.innerHTML = `<p class="error">Error: ${errorMessage}</p>`;
                
                // Add button to switch to a valid model
                const switchButton = document.createElement('button');
                switchButton.textContent = 'Switch to a valid model';
                switchButton.classList.add('primary-btn');
                switchButton.addEventListener('click', () => {
                    // Switch to the first model option
                    modelSelect.value = modelSelect.options[0].value;
                    currentModel = modelSelect.value;
                    savePreferences();
                    // Try the request again
                    generateResponse(prompt);
                });
                
                responseArea.appendChild(switchButton);
            } else {
                throw new Error(errorMessage);
            }
            return;
        }
        
        const data = await response.json();
        const aiResponse = data.choices[0].message.content;
        
        // Display response
        responseArea.innerHTML = `<div class="response-content">${formatResponse(aiResponse)}</div>`;
        
        // Add copy button
        const copyButton = document.createElement('button');
        copyButton.innerHTML = '<i class="fas fa-copy"></i> Copy Response';
        copyButton.classList.add('copy-btn');
        copyButton.addEventListener('click', () => {
            navigator.clipboard.writeText(aiResponse);
            copyButton.innerHTML = '<i class="fas fa-check"></i> Copied!';
            setTimeout(() => {
                copyButton.innerHTML = '<i class="fas fa-copy"></i> Copy Response';
            }, 2000);
        });
        
        responseArea.appendChild(copyButton);
        
    } catch (error) {
        // If the error indicates an invalid API key
        if (error.message.includes('API key') || error.message.includes('authentication') || error.message.includes('Authorization')) {
            // Clear the stored API key
            localStorage.removeItem('GROQ_API_KEY');
            responseArea.innerHTML = `<p class="error">Error: Invalid API key. Please refresh the page to enter a new key.</p>`;
        } else {
            responseArea.innerHTML = `<p class="error">Error: ${error.message}</p>`;
        }
    } finally {
        submitBtn.disabled = false;
    }
}

// Format the AI response with HTML
function formatResponse(text) {
    // Convert markdown-style code blocks to HTML
    text = text.replace(/```([a-z]*)([\s\S]*?)```/g, '<pre><code class="$1">$2</code></pre>');
    
    // Convert single line code
    text = text.replace(/`([^`]+)`/g, '<code>$1</code>');
    
    // Convert links
    text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
    
    // Convert headings
    text = text.replace(/^# (.*?)$/gm, '<h3>$1</h3>');
    text = text.replace(/^## (.*?)$/gm, '<h4>$1</h4>');
    text = text.replace(/^### (.*?)$/gm, '<h5>$1</h5>');
    
    // Convert lists
    text = text.replace(/^\* (.*?)$/gm, '<li>$1</li>');
    text = text.replace(/^- (.*?)$/gm, '<li>$1</li>');
    text = text.replace(/^(\d+)\. (.*?)$/gm, '<li>$2</li>');
    
    // Wrap lists in ul/ol tags
    text = text.replace(/<li>(.*?)<\/li>(?:\n<li>|$)/gs, function(match) {
        return '<ul>' + match + '</ul>';
    });
    
    // Convert line breaks
    text = text.replace(/\n\n/g, '<br><br>');
    text = text.replace(/\n/g, '<br>');
    
    return text;
}

// Render saved prompts
function renderSavedPrompts() {
    favoritesListEl.innerHTML = '';
    
    if (savedPrompts.length === 0) {
        favoritesListEl.innerHTML = '<p class="empty-state">No saved prompts yet.</p>';
        return;
    }
    
    savedPrompts.forEach(prompt => {
        const promptItem = document.createElement('div');
        promptItem.className = 'prompt-item';
        
        // Create a short version of the prompt for display
        const displayPrompt = prompt.length > 40 ? prompt.substring(0, 40) + '...' : prompt;
        
        promptItem.innerHTML = `
            <span title="${prompt}">${displayPrompt}</span>
            <button class="remove-prompt" data-prompt="${prompt}" aria-label="Remove prompt">×</button>
        `;
        favoritesListEl.appendChild(promptItem);
        
        // Add click event to prompt text
        promptItem.querySelector('span').addEventListener('click', () => {
            promptInput.value = prompt;
            // Scroll to prompt input on mobile
            if (window.innerWidth <= 768) {
                promptInput.scrollIntoView({ behavior: 'smooth' });
                toggleMobileMenu(); // Close sidebar after selecting a prompt
            }
        });
        
        // Add click event to remove button
        promptItem.querySelector('.remove-prompt').addEventListener('click', (e) => {
            e.stopPropagation();
            removePrompt(prompt);
        });
    });
}

// Remove prompt from saved prompts
function removePrompt(prompt) {
    const index = savedPrompts.indexOf(prompt);
    
    if (index !== -1) {
        savedPrompts.splice(index, 1);
    }
    
    // Update saved prompts display
    renderSavedPrompts();
    
    // Save to localStorage
    savePreferences();
}

// Toggle theme
function toggleTheme() {
    isDarkTheme = !isDarkTheme;
    document.body.classList.toggle('dark-theme', isDarkTheme);
    themeToggleBtn.innerHTML = isDarkTheme ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    savePreferences();
}

// Handle window resize for responsive design
function handleResize() {
    if (window.innerWidth > 768) {
        // Desktop view
        sidebar.style.display = 'flex';
        sidebar.classList.remove('show');
        isMobileMenuOpen = false;
    } else if (!isMobileMenuOpen) {
        // Mobile view with closed menu
        sidebar.style.display = 'none';
    }
}

// Event Listeners
submitBtn.addEventListener('click', () => {
    const prompt = promptInput.value.trim();
    if (prompt) {
        generateResponse(prompt);
    }
});

clearBtn.addEventListener('click', () => {
    promptInput.value = '';
    responseArea.innerHTML = '<p class="placeholder-text">Your AI-generated response will appear here after you submit a prompt.</p>';
});

savePromptBtn.addEventListener('click', savePrompt);

modelSelect.addEventListener('change', (e) => {
    currentModel = e.target.value;
    savePreferences();
});

themeToggleBtn.addEventListener('click', toggleTheme);

// Mobile menu toggle
if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);
}

// Add keyboard shortcuts
promptInput.addEventListener('keydown', (e) => {
    // Submit on Ctrl+Enter or Cmd+Enter
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        const prompt = promptInput.value.trim();
        if (prompt) {
            generateResponse(prompt);
        }
    }
});

// Handle window resize
window.addEventListener('resize', handleResize);

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (isMobileMenuOpen && window.innerWidth <= 768) {
        if (!sidebar.contains(e.target) && e.target !== mobileMenuBtn) {
            toggleMobileMenu();
        }
    }
});

// Initialize the app
loadSavedPreferences();
handleResize();
