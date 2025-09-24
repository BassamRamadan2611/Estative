// Global variables
let activeCategory = 'developers';
let currentSlide = 0;
let slideInterval;



// Form data collection function
function collectFormData(form, category) {
    const now = new Date();
    const timestamp = now.toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short'
    });
    
    const formData = {
        expo_name: 'Estative Crypto Property Expo 2025',
        category: category.charAt(0).toUpperCase() + category.slice(1),
        timestamp: timestamp,
        from_name: '',
        from_email: '',
        from_phone: '',
        message: '',
        company_name: '',
        designation: '',
        user_agent: navigator.userAgent,
        referrer: document.referrer || 'Direct Access'
    };
    
    // Get all input values based on form type
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        const value = input.value.trim();
        if (value) {
            let fieldName = input.id.replace(/^(dev|broker|investor)-/, '');
            
            switch(fieldName) {
                case 'name':
                    formData.from_name = value;
                    break;
                case 'email':
                    formData.from_email = value;
                    break;
                case 'mobile':
                    formData.from_phone = value.replace(/[^\d+]/g, '');
                    break;
                case 'message':
                    formData.message = value.length > 500 ? value.substring(0, 500) + '...' : value;
                    break;
                case 'company':
                    formData.company_name = value;
                    break;
                case 'designation':
                    formData.designation = value;
                    break;
                default:
                    if (!formData[fieldName]) {
                        formData[fieldName] = value;
                    }
            }
        }
    });
    
    // Set default message if empty
    if (!formData.message || formData.message === '') {
        formData.message = 'Interested in attending the Estative Crypto Property Expo 2025';
    }
    
    // Add category-specific context
    switch(category) {
        case 'developers':
            formData.message = formData.message + '\n\n[Developer Registration - Interested in crypto property development opportunities]';
            break;
        case 'brokers':
            formData.message = formData.message + '\n\n[Broker Registration - Looking for brokerage opportunities in crypto properties]';
            break;
        case 'investors':
            formData.message = formData.message + '\n\n[Investor Registration - Seeking investment opportunities in crypto real estate]';
            break;
    }
    
    return formData;
}

// Node.js backend submission function
function sendViaNodeJS(formData) {
    return fetch("http://localhost:3000/submit-form", {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({ formData }),
    })
    .then(async (res) => {
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
    });
}

// Toast notification function
function showToast(message, type = 'success') {
    // Create toast if it doesn't exist
    let toast = document.getElementById('toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        toast.className = 'toast';
        toast.innerHTML = `
            <div class="flex items-center">
                <i id="toast-icon" class="mr-2"></i>
                <span id="toast-message"></span>
            </div>
        `;
        document.body.appendChild(toast);
    }
    
    const toastIcon = document.getElementById('toast-icon');
    const toastMessage = document.getElementById('toast-message');
    
    toast.className = `toast ${type}`;
    toastIcon.className = type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-triangle';
    toastMessage.textContent = message;
    
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Form validation function
function validateForm(form) {
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        const value = field.value.trim();
        if (!value) {
            isValid = false;
            field.classList.add('invalid');
            field.classList.remove('valid');
        } else {
            field.classList.remove('invalid');
            field.classList.add('valid');
        }
    });
    
    const emailField = form.querySelector('input[type="email"]');
    if (emailField && emailField.value.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailField.value)) {
            isValid = false;
            emailField.classList.add('invalid');
            emailField.classList.remove('valid');
        } else {
            emailField.classList.remove('invalid');
            emailField.classList.add('valid');
        }
    }
    
    return isValid;
}

// Countdown Update
function updateCountdown() {
    const targetDate = new Date('2025-10-11T10:00:00');
    const now = new Date();
    const difference = targetDate - now;
    let days = 0, hours = 0, minutes = 0;
    if (difference > 0) {
        days = Math.floor(difference / (1000 * 60 * 60 * 24));
        hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        minutes = Math.floor((difference / 1000 / 60) % 60);
    }
    const pad = num => String(num).padStart(2, '0');
    document.querySelectorAll('[id^="days"]').forEach(el => el.textContent = pad(days));
    document.querySelectorAll('[id^="hours"]').forEach(el => el.textContent = pad(hours));
    document.querySelectorAll('[id^="minutes"]').forEach(el => el.textContent = pad(minutes));
}

// Carousel Functionality
function showSlide(index) {
    const slides = document.querySelectorAll('.carousel-item');
    const indicators = document.querySelectorAll('.carousel-indicator');
    const totalSlides = slides.length;

    slides.forEach(slide => {
        slide.classList.add('hidden');
        slide.classList.remove('active');
    });
    
    indicators.forEach(indicator => {
        indicator.classList.remove('active');
        indicator.classList.remove('bg-white');
        indicator.classList.add('bg-white/50');
    });
    
    slides[index].classList.remove('hidden');
    slides[index].classList.add('active');
    
    indicators[index].classList.add('active');
    indicators[index].classList.remove('bg-white/50');
    indicators[index].classList.add('bg-white');
    
    currentSlide = index;
}

function nextSlide() {
    const slides = document.querySelectorAll('.carousel-item');
    const totalSlides = slides.length;
    let nextIndex = (currentSlide + 1) % totalSlides;
    showSlide(nextIndex);
}

function prevSlide() {
    const slides = document.querySelectorAll('.carousel-item');
    const totalSlides = slides.length;
    let prevIndex = (currentSlide - 1 + totalSlides) % totalSlides;
    showSlide(prevIndex);
}

function initCarousel() {
    const indicators = document.querySelectorAll('.carousel-indicator');
    
    // Auto-advance slides
    slideInterval = setInterval(nextSlide, 5000);

    // Pause auto-advance on hover
    const carousel = document.getElementById('hero-carousel');
    carousel.addEventListener('mouseenter', () => {
        clearInterval(slideInterval);
    });
    
    carousel.addEventListener('mouseleave', () => {
        slideInterval = setInterval(nextSlide, 5000);
    });

    // Add event listeners to controls
    const nextButton = document.querySelector('.carousel-control-next');
    const prevButton = document.querySelector('.carousel-control-prev');
    
    if (nextButton) nextButton.addEventListener('click', nextSlide);
    if (prevButton) prevButton.addEventListener('click', prevSlide);

    // Add event listeners to indicators
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            showSlide(index);
        });
    });
}

// Fixed Accordion Functionality for All Categories
function initAccordions() {
    document.querySelectorAll('.accordion-header').forEach(header => {
        // Remove active classes from all accordions initially
        header.classList.remove('active');
        const targetId = header.getAttribute('data-accordion-target');
        const content = document.getElementById(targetId);
        if (content) {
            content.classList.remove('active');
            content.style.maxHeight = null;
        }
        
        // Remove any existing event listeners by cloning
        const newHeader = header.cloneNode(true);
        header.parentNode.replaceChild(newHeader, header);
    });

    // Re-attach event listeners to fresh elements
    document.querySelectorAll('.accordion-header').forEach(header => {
        header.addEventListener('click', function() {
            const targetId = this.getAttribute('data-accordion-target');
            const content = document.getElementById(targetId);
            if (!content) return;
            
            const isActive = content.classList.contains('active');
            
            // Toggle the clicked accordion
            if (isActive) {
                // Close the accordion
                this.classList.remove('active');
                content.classList.remove('active');
                content.style.maxHeight = null;
            } else {
                // Open the accordion
                this.classList.add('active');
                content.classList.add('active');
                content.style.maxHeight = content.scrollHeight + "px";
            }
        });
    });
}

// Category Selection
function switchCategory(category) {
    const categoryButtons = document.querySelectorAll('.category-btn');
    const forms = document.querySelectorAll('.form-category');
    const categoryInfos = document.querySelectorAll('.category-info');
    
    // Update active button
    categoryButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-category') === category) {
            btn.classList.add('active');
        }
    });
    
    // Show/hide forms
    forms.forEach(form => {
        if (form.id === `${category}-form`) {
            form.classList.remove('hidden');
            activeCategory = category;
        } else {
            form.classList.add('hidden');
        }
    });
    
    // Show/hide category info
    categoryInfos.forEach(info => {
        if (info.id === `${category}-info`) {
            info.classList.remove('hidden');
        } else {
            info.classList.add('hidden');
        }
    });
    
    // Reinitialize accordions for the new form
    setTimeout(() => {
        initAccordions();
    }, 10);
}

// Main initialization
document.addEventListener('DOMContentLoaded', function() {
    // Scrolled Navbar
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 0) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuToggle && mobileMenu) {
        mobileMenuToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            const isExpanded = mobileMenuToggle.getAttribute('aria-expanded') === 'true';
            mobileMenuToggle.setAttribute('aria-expanded', !isExpanded);
        });

        // Close mobile menu when clicking on a link
        document.querySelectorAll('#mobile-menu a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // Initialize Countdown
    updateCountdown();
    setInterval(updateCountdown, 60000);

    // Initialize Carousel
    initCarousel();
    showSlide(0);

    // Initialize Accordions
    initAccordions();

    // Category Selection Setup
    const categoryButtons = document.querySelectorAll('.category-btn');
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            switchCategory(category);
        });
    });

    // Nav Links Handler
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const category = this.getAttribute('data-category');
            switchCategory(category);
            
            document.querySelector('#contact').scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
            
            if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
            }
        });
    });

    // Form Validation and Submission
    const submitBtn = document.getElementById('submit-btn');
    const successMessage = document.getElementById('success-message');
    const errorMessage = document.getElementById('error-message');
    
    if (submitBtn) {
        submitBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            const activeForm = document.getElementById(`${activeCategory}-form`);
            if (!activeForm) {
                showToast('Form not found. Please select a category.', 'error');
                return;
            }
            
            if (!validateForm(activeForm)) {
                showToast('Please fill in all required fields correctly.', 'error');
                return;
            }
            
            // Show loading state
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Submitting...';
            submitBtn.disabled = true;
            
            // Collect and send data via Node.js
            const formData = collectFormData(activeForm, activeCategory);
            
            sendViaNodeJS(formData)
                .then(data => {
                    console.log("✅ Backend Response:", data);
                    
                    if (data.success) {
                        // Success handling
                        submitBtn.innerHTML = '<i class="fas fa-paper-plane mr-2"></i> Submit Registration';
                        submitBtn.disabled = false;
                        
                        if (successMessage) {
                            successMessage.classList.remove('hidden');
                        }
                        if (errorMessage) {
                            errorMessage.classList.add('hidden');
                        }
                        
                        showToast('Registration submitted successfully!');
                        
                        activeForm.reset();
                        
                        activeForm.querySelectorAll('.form-input').forEach(input => {
                            input.classList.remove('valid', 'invalid');
                        });
                        
                        if (successMessage) {
                            successMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                        }
                    } else {
                        throw new Error(data.error || 'Submission failed');
                    }
                })
                .catch(error => {
                    console.error("❌ Submission Error:", error);
                    
                    submitBtn.innerHTML = '<i class="fas fa-paper-plane mr-2"></i> Submit Registration';
                    submitBtn.disabled = false;
                    
                    if (errorMessage) {
                        errorMessage.classList.remove('hidden');
                    }
                    if (successMessage) {
                        successMessage.classList.add('hidden');
                    }
                    
                    showToast('Failed to submit registration. Please try again.', 'error');
                });
        });
    }
    
    // Real-time input validation
    document.addEventListener('input', function(e) {
        if (e.target.classList.contains('form-input')) {
            const value = e.target.value.trim();
            const isRequired = e.target.hasAttribute('required');
            
            if (isRequired && value) {
                e.target.classList.remove('invalid');
                e.target.classList.add('valid');
            } else if (isRequired && !value) {
                e.target.classList.remove('valid');
                e.target.classList.add('invalid');
            }
            
            if (e.target.type === 'email' && value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (emailRegex.test(value)) {
                    e.target.classList.remove('invalid');
                    e.target.classList.add('valid');
                } else {
                    e.target.classList.remove('valid');
                    e.target.classList.add('invalid');
                }
            }
        }
    });

    // Set default category
    switchCategory('developers');
    
    console.log('🚀 Estative Crypto Property Expo website loaded successfully!');



 const loadingScreen = document.getElementById('loading-screen');

if (loadingScreen) {
  // 1️⃣ As soon as the DOM is parsed, add `.show`
  // → The loading screen fades in (since CSS handles transition).
  loadingScreen.classList.add('show');

  // 2️⃣ After the whole page finishes loading (images, scripts, etc.)
  window.addEventListener('load', () => {
    setTimeout(() => {
      // Remove `.show` → triggers fade-out transition
      loadingScreen.classList.remove('show');

      // Add `.hidden` → (instant hide after transition finishes)
      loadingScreen.classList.add('hidden');
    }, 1000); // delay 1s before starting fade-out
  });
}


});