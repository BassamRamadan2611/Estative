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
            updateCountdown();
            setInterval(updateCountdown, 60000); // Update every minute

            // Nav Links Handler
            const navLinks = document.querySelectorAll('.nav-link');
            const mobileMenu = document.getElementById('mobile-menu');
            navLinks.forEach(link => {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    const category = this.getAttribute('data-category');
                    const categoryBtn = document.querySelector(`.category-btn[data-category="${category}"]`);
                    if (categoryBtn) {
                        categoryBtn.click();
                    }
                    document.querySelector('#contact').scrollIntoView({ behavior: 'smooth' });
                    if (!mobileMenu.classList.contains('hidden')) {
                        mobileMenu.classList.add('hidden');
                    }
                });
            });

            // Form Elements
            const categoryButtons = document.querySelectorAll('.category-btn');
            const forms = document.querySelectorAll('.form-category');
            const submitBtn = document.getElementById('submit-btn');
            const successMessage = document.getElementById('success-message');
            
            // Create error message element if it doesn't exist
            let errorMessageEl = document.getElementById('error-message');
            if (!errorMessageEl) {
                errorMessageEl = document.createElement('div');
                errorMessageEl.id = 'error-message';
                errorMessageEl.className = 'error-message mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-center hidden';
                errorMessageEl.innerHTML = '<i class="fas fa-exclamation-circle text-2xl mb-2"></i>';
                const submitContainer = submitBtn.closest('div');
                if (submitContainer) {
                    submitContainer.appendChild(errorMessageEl);
                }
            }
            
            // Set first category as active by default
            let activeCategory = 'developers';
            
            // Category selection handler
            categoryButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const category = this.getAttribute('data-category');
                    
                    // Update active button styling
                    categoryButtons.forEach(btn => {
                        btn.classList.remove('active', 'bg-blue-200', 'text-blue-800', 'bg-green-200', 'text-green-800', 'bg-purple-200', 'text-purple-800');
                        // Reset to default styles (assuming bg-white or similar, adjust if needed)
                        btn.classList.add('bg-white', 'text-gray-600');
                    });
                    
                    // Add active styling based on category
                    switch(category) {
                        case 'developers':
                            this.classList.add('active', 'bg-blue-200', 'text-blue-800');
                            break;
                        case 'brokers':
                            this.classList.add('active', 'bg-green-200', 'text-green-800');
                            break;
                        case 'investors':
                            this.classList.add('active', 'bg-purple-200', 'text-purple-800');
                            break;
                    }
                    
                    // Show the corresponding form
                    forms.forEach(form => {
                        if (form.id === `${category}-form`) {
                            form.classList.remove('hidden');
                            activeCategory = category;
                        } else {
                            form.classList.add('hidden');
                        }
                    });
                    
                    console.log(`📋 Switched to ${category.charAt(0).toUpperCase() + category.slice(1)} form`);
                });
            });
            
            // Form submission handler - Node.js Backend
            submitBtn.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('🚀 Form submission started...');
                
                // Get the active form
                const activeForm = document.getElementById(`${activeCategory}-form`);
                if (!activeForm) {
                    showError('Form not found. Please select a category.');
                    return;
                }
                
                // Validate required fields
                let isValid = true;
                const requiredFields = activeForm.querySelectorAll('[required]');
                
                requiredFields.forEach(field => {
                    const value = field.value.trim();
                    if (!value) {
                        isValid = false;
                        field.classList.add('border-red-500');
                        field.classList.remove('border-green-500');
                        console.log(`❌ Missing required field: ${field.id}`);
                    } else {
                        field.classList.remove('border-red-500');
                        field.classList.add('border-green-500');
                    }
                });
                
                // Email validation
                const emailField = activeForm.querySelector('input[type="email"]');
                if (emailField && emailField.value.trim()) {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(emailField.value)) {
                        isValid = false;
                        emailField.classList.add('border-red-500');
                        emailField.classList.remove('border-green-500');
                        console.log(`❌ Invalid email: ${emailField.value}`);
                    } else {
                        emailField.classList.remove('border-red-500');
                        emailField.classList.add('border-green-500');
                    }
                }
                
                if (!isValid) {
                    showError('Please fill in all required fields with valid information');
                    console.log('❌ Form validation failed');
                    return;
                }
                
                console.log('✅ Form validation passed');
                
                // Collect form data
                const formData = collectFormData(activeForm, activeCategory);
                console.log('📋 Collected form data:', formData);
                
                // Send via Node.js backend
                sendViaNodeJS(formData);
            });
            
            // Collect form data for processing
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
                        // Extract base field name (remove category prefix)
                        let fieldName = input.id.replace(/^(dev|broker|investor)-/, '');
                        
                        switch(fieldName) {
                            case 'name':
                                formData.from_name = value;
                                break;
                            case 'email':
                                formData.from_email = value;
                                break;
                            case 'mobile':
                                formData.from_phone = value.replace(/[^\d+]/g, ''); // Clean phone number
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
                                // Add any other fields
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
            
            // Send form data using Node.js backend
            function sendViaNodeJS(formData) {
                console.log('📤 Sending via Node.js...');
                showLoading();
                hideMessages();
            
                fetch("http://localhost:3000/submit-form", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ formData }),
                })
                .then(res => res.json())
                .then(data => {
                    console.log("✅ Backend Response:", data);
            
                    if (data.success) {
                        showSuccess(`🎉 Registration Successful! Your information for the ${formData.expo_name} has been sent to our team.`);
                        resetForm();
                    } else {
                        showError(data.error || "Failed to send registration. Please try again later.");
                    }
                })
                .catch(err => {
                    console.error("❌ Error:", err);
                    showError("Error connecting to server. Please try again.");
                })
                .finally(() => {
                    hideLoading();
                });
            }
            
            // UI Helper Functions
            function showLoading() {
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Sending Registration...';
                submitBtn.disabled = true;
                submitBtn.classList.add('opacity-50', 'cursor-not-allowed', 'bg-gray-500', 'hover:bg-gray-500');
                submitBtn.classList.remove('bg-gradient-to-r', 'from-blue-600', 'to-purple-700', 'hover:from-blue-700', 'hover:to-purple-800');
                console.log('⏳ Loading state activated');
            }
            
            function hideLoading() {
                submitBtn.innerHTML = '<i class="fas fa-paper-plane mr-2"></i> Submit Registration';
                submitBtn.disabled = false;
                submitBtn.classList.remove('opacity-50', 'cursor-not-allowed', 'bg-gray-500', 'hover:bg-gray-500');
                submitBtn.classList.add('bg-gradient-to-r', 'from-blue-600', 'to-purple-700', 'hover:from-blue-700', 'hover:to-purple-800');
                console.log('✅ Loading state deactivated');
            }
            
            function showSuccess(message) {
                successMessage.innerHTML = `
                    <div class="flex flex-col items-center">
                        <i class="fas fa-check-circle text-4xl mb-3 text-green-600"></i>
                        <h3 class="text-xl font-semibold mb-2 text-green-800">Registration Successful!</h3>
                        <p class="text-green-700">${message}</p>
                        <p class="mt-2 text-sm text-green-600">Your details have been sent to the expo team</p>
                    </div>
                `;
                successMessage.classList.remove('hidden', 'bg-green-100');
                successMessage.classList.add('bg-green-50', 'border', 'border-green-200');
                setTimeout(() => {
                    successMessage.classList.add('show');
                }, 10);
                
                // Auto-hide after 8 seconds
                setTimeout(() => {
                    hideSuccess();
                }, 8000);
            }
            
            function showError(message) {
                errorMessageEl.innerHTML = `
                    <div class="flex flex-col items-center">
                        <i class="fas fa-exclamation-circle text-2xl mb-2 text-red-600"></i>
                        <h3 class="text-lg font-semibold mb-2 text-red-800">Submission Error</h3>
                        <p class="text-red-700">${message}</p>
                    </div>
                `;
                errorMessageEl.classList.remove('hidden');
                setTimeout(() => {
                    errorMessageEl.classList.add('show');
                }, 10);
                
                // Auto-hide after 6 seconds
                setTimeout(() => {
                    hideError();
                }, 6000);
            }
            
            function hideSuccess() {
                successMessage.classList.remove('show');
                setTimeout(() => {
                    successMessage.classList.add('hidden');
                    successMessage.classList.remove('bg-green-50', 'border', 'border-green-200');
                    successMessage.classList.add('bg-green-100');
                }, 300);
            }
            
            function hideError() {
                errorMessageEl.classList.remove('show');
                setTimeout(() => {
                    errorMessageEl.classList.add('hidden');
                }, 300);
            }
            
            function hideMessages() {
                successMessage.classList.remove('show');
                errorMessageEl.classList.remove('show');
                setTimeout(() => {
                    successMessage.classList.add('hidden');
                    errorMessageEl.classList.add('hidden');
                }, 300);
            }
            
            function resetForm() {
                // Reset current form
                const activeForm = document.getElementById(`${activeCategory}-form`);
                if (activeForm) {
                    activeForm.reset();
                    
                    // Remove all validation styling
                    activeForm.querySelectorAll('input, textarea').forEach(field => {
                        field.classList.remove('border-red-500', 'border-green-500');
                        field.classList.add('border-gray-300');
                    });
                    
                    console.log(`🔄 ${activeCategory} form reset`);
                }
                
                // Scroll to top of form
                const formContainer = document.querySelector('.form-container');
                if (formContainer) {
                    formContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
            }
            
            // Real-time input validation
            document.addEventListener('input', function(e) {
                const target = e.target;
                if ((target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') && 
                    target.closest('.form-category:not(.hidden)')) {
                    
                    const value = target.value.trim();
                    const isRequired = target.hasAttribute('required');
                    
                    // Required field validation
                    if (isRequired) {
                        if (value) {
                            target.classList.remove('border-red-500');
                            target.classList.add('border-green-500');
                        } else {
                            target.classList.remove('border-green-500');
                        }
                    }
                    
                    // Email validation
                    if (target.type === 'email' && value) {
                        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                        if (emailRegex.test(value)) {
                            target.classList.remove('border-red-500');
                            target.classList.add('border-green-500');
                        } else {
                            target.classList.remove('border-green-500');
                            target.classList.add('border-red-500');
                        }
                    }
                    
                    // Phone number formatting (optional)
                    if (target.type === 'tel' && value) {
                        // Remove non-digits except +
                        const cleanValue = value.replace(/[^\d+]/g, '');
                        if (cleanValue !== value) {
                            target.value = cleanValue;
                        }
                    }
                }
            });
            
            // Focus event - remove error styling
            document.addEventListener('focus', function(e) {
                const target = e.target;
                if ((target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') && 
                    target.closest('.form-category:not(.hidden)')) {
                    target.classList.remove('border-red-500');
                }
            }, true);
            
            // Initialize - show first form
            if (forms.length > 0) {
                forms[0].classList.remove('hidden');
                console.log('🚀 Form Integration Loaded');
                console.log('📧 Ready to send registrations to bassamramadan964@gmail.com');
                console.log('📋 Active category:', activeCategory);
            } else {
                console.error('❌ No forms found!');
            }
        });