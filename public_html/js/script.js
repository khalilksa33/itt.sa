document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Menu Toggle
    const menu = document.querySelector('#mobile-menu');
    const navLinks = document.querySelector('.nav-links');

    if (menu) {
        menu.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            menu.classList.toggle('is-active');
        });
    }

    // 2. Navbar Scroll Effect
    window.addEventListener('scroll', () => {
        const navbar = document.getElementById('navbar');
        if (navbar) {
            if (window.scrollY > 80) {
                navbar.style.background = 'rgba(10, 12, 16, 0.95)';
                navbar.style.padding = '0.8rem 5%';
            } else {
                navbar.style.background = 'rgba(10, 12, 16, 0.85)';
                navbar.style.padding = '1.2rem 5%';
            }
        }
    });

    // 3. Dynamic Price Selector and Card Animation
    document.querySelectorAll('.package-card').forEach(card => {
        const priceAmount = card.querySelector('.price-amount');
        
        card.querySelectorAll('.rate-tab').forEach(radio => {
            radio.addEventListener('change', (e) => {
                const newPrice = e.target.getAttribute('data-price');
                const currency = e.target.getAttribute('data-currency') || 'SAR';
                
                // Add fade effect during change
                priceAmount.style.opacity = 0;
                setTimeout(() => {
                    if (newPrice && parseInt(newPrice) > 0) {
                        priceAmount.innerText = `${parseInt(newPrice).toLocaleString()} ${currency}`;
                    } else {
                        priceAmount.innerText = 'N/A';
                    }
                    priceAmount.style.opacity = 1;
                }, 150);
            });
        });
    });

    // 4. Modal Triggers & Group Filtering
    const modal = document.getElementById('booking-modal');
    const modalClose = document.getElementById('modal-close');
    const bookingForm = document.getElementById('booking-form');
    const groupSelect = document.getElementById('booking-group');

    document.querySelectorAll('.btn-book').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const card = e.target.closest('.package-card');
            const pkgCode = card.getAttribute('data-package-code');
            const pkgName = card.getAttribute('data-package-name');
            const sharingType = card.querySelector('.rate-tab:checked').value;
            const price = card.querySelector('.rate-tab:checked').getAttribute('data-price');
            const currency = card.querySelector('.rate-tab:checked').getAttribute('data-currency') || 'SAR';

            // Populate Modal Form Hidden & Read-only Fields
            document.getElementById('booking-package-code').value = pkgCode;
            document.getElementById('modal-pkg-name').innerText = pkgName;
            document.getElementById('booking-sharing-type').value = sharingType;
            document.getElementById('booking-base-price').value = price;
            document.getElementById('modal-pkg-price').innerText = `${parseInt(price).toLocaleString()} ${currency}`;

            // Reset B2B sub-agent fields
            const subAgentSelect = document.getElementById('sub_agent_id');
            const bookingModeContainer = document.getElementById('booking-mode-container');
            const resalePriceContainer = document.getElementById('resale-price-container');
            const bookingModeSelect = document.getElementById('booking_mode');
            const resalePriceInput = document.getElementById('resale_price');
            const basePriceDisplay = document.getElementById('base-price-display');

            if (subAgentSelect) subAgentSelect.value = '';
            if (bookingModeContainer) bookingModeContainer.style.display = 'none';
            if (resalePriceContainer) resalePriceContainer.style.display = 'none';
            if (bookingModeSelect) bookingModeSelect.value = 'Standard';
            if (resalePriceInput) {
                resalePriceInput.value = '';
                resalePriceInput.removeAttribute('required');
            }
            if (basePriceDisplay) {
                basePriceDisplay.innerText = `${parseInt(price).toLocaleString()} PKR`;
            }

            // Filter groups dropdown based on package
            groupSelect.innerHTML = '<option value="" disabled selected>Select Available Departure Date...</option>';
            
            // Get groups data attribute from card
            const groupsData = JSON.parse(card.getAttribute('data-groups') || '[]');
            
            if (groupsData.length === 0) {
                const opt = document.createElement('option');
                opt.value = "";
                opt.disabled = true;
                opt.text = "No active departures for this package";
                groupSelect.appendChild(opt);
            } else {
                groupsData.forEach(grp => {
                    const opt = document.createElement('option');
                    opt.value = grp.group_code;
                    opt.text = `${grp.group_name} (${grp.departure_date})`;
                    groupSelect.appendChild(opt);
                });
            }

            // Open Modal
            modal.classList.add('active');
        });
    });

    // Close Modal
    if (modalClose) {
        modalClose.addEventListener('click', () => {
            modal.classList.remove('active');
            resetBookingForm();
        });
    }

    // Close Modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            resetBookingForm();
        }
    });

    // 5. Booking Form Submission (AJAX)
    if (bookingForm) {
        bookingForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const btnSubmit = bookingForm.querySelector('button[type="submit"]');
            const originalBtnText = btnSubmit.innerHTML;
            btnSubmit.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing...';
            btnSubmit.disabled = true;

            const formData = new FormData(bookingForm);
            
            try {
                const response = await fetch('process_booking.php', {
                    method: 'POST',
                    body: formData
                });
                
                const result = await response.json();
                
                if (response.ok && result.success) {
                    // Show success screen in modal
                    const modalBody = document.querySelector('.modal-content');
                    modalBody.innerHTML = `
                        <button class="modal-close" id="modal-close-success">&times;</button>
                        <div class="booking-success-box">
                            <i class="fa-solid fa-circle-check"></i>
                            <h3>Booking Registered!</h3>
                            <p>Thank you, <strong>${result.customer_name}</strong>.</p>
                            <p>Your booking request for <strong>${result.package_name}</strong> has been registered as Draft in our ERP system.</p>
                            <p>Our travel agents will contact you shortly for document verification.</p>
                            <button class="btn btn-primary" style="margin-top: 1.5rem;" onclick="location.reload()">Done</button>
                        </div>
                    `;
                    document.getElementById('modal-close-success').addEventListener('click', () => {
                        modal.classList.remove('active');
                        location.reload();
                    });
                } else {
                    alert('Error: ' + (result.message || 'Failed to submit booking.'));
                }
            } catch (err) {
                console.error(err);
                alert('Connection error: Failed to reach the server. Please try again.');
            } finally {
                btnSubmit.innerHTML = originalBtnText;
                btnSubmit.disabled = false;
            }
        });
    }

    function resetBookingForm() {
        if (bookingForm) {
            bookingForm.reset();
        }
    }

    // 6. Inquiry Form Submission (AJAX)
    const inquiryForm = document.getElementById('inquiry-form');
    if (inquiryForm) {
        inquiryForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const btnSubmit = inquiryForm.querySelector('button[type="submit"]');
            const originalBtnText = btnSubmit.innerHTML;
            btnSubmit.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Submitting...';
            btnSubmit.disabled = true;

            const formData = new FormData(inquiryForm);
            
            try {
                const response = await fetch('process_inquiry.php', {
                    method: 'POST',
                    body: formData
                });
                
                const result = await response.json();
                
                if (response.ok && result.success) {
                    const cardContent = document.querySelector('.inquiry-card');
                    cardContent.innerHTML = `
                        <div class="inquiry-success-box">
                            <i class="fa-solid fa-circle-check"></i>
                            <h3>Inquiry Submitted!</h3>
                            <p>Thank you, <strong>${result.lead_name}</strong>.</p>
                            <p>Your inquiry has been successfully logged as a Lead in our system.</p>
                            <p>Our Umrah consultation team will get back to you within 24 hours.</p>
                            <button class="btn btn-primary" style="margin-top: 1.5rem;" onclick="location.reload()">Done</button>
                        </div>
                    `;
                } else {
                    alert('Error: ' + (result.message || 'Failed to submit inquiry.'));
                }
            } catch (err) {
                console.error(err);
                alert('Connection error: Failed to reach the server. Please try again.');
            } finally {
                btnSubmit.innerHTML = originalBtnText;
                btnSubmit.disabled = false;
            }
        });
    }

    // 6.5. B2B Sub-Agent Fields Visibility Toggles
    const subAgentSelect = document.getElementById('sub_agent_id');
    const bookingModeContainer = document.getElementById('booking-mode-container');
    const resalePriceContainer = document.getElementById('resale-price-container');
    const bookingModeSelect = document.getElementById('booking_mode');
    const resalePriceInput = document.getElementById('resale_price');

    if (subAgentSelect) {
        subAgentSelect.addEventListener('change', (e) => {
            const hasAgent = e.target.value !== '';
            if (hasAgent) {
                bookingModeContainer.style.display = 'block';
                // Trigger booking mode check
                bookingModeSelect.dispatchEvent(new Event('change'));
            } else {
                bookingModeContainer.style.display = 'none';
                resalePriceContainer.style.display = 'none';
                if (resalePriceInput) {
                    resalePriceInput.value = '';
                    resalePriceInput.removeAttribute('required');
                }
            }
        });
    }

    if (bookingModeSelect) {
        bookingModeSelect.addEventListener('change', (e) => {
            const isReseller = e.target.value === 'Reseller';
            if (isReseller) {
                resalePriceContainer.style.display = 'block';
                if (resalePriceInput) {
                    resalePriceInput.setAttribute('required', 'required');
                    // Default value to current base price if empty
                    if (!resalePriceInput.value) {
                        resalePriceInput.value = document.getElementById('booking-base-price').value;
                    }
                }
            } else {
                resalePriceContainer.style.display = 'none';
                if (resalePriceInput) {
                    resalePriceInput.removeAttribute('required');
                }
            }
        });
    }

    // 6.7. Passport OCR Image Scanner & Eligibility Engine
    const scannerZone = document.getElementById('passport-scanner-zone');
    const fileInput = document.getElementById('passport-file-input');
    const scannerLaser = document.getElementById('scanner-laser');
    const scannerPrompt = document.getElementById('scanner-prompt');
    const scannerLoading = document.getElementById('scanner-loading');
    const eligibilityAlert = document.getElementById('eligibility-alert-container');
    const submitBtn = bookingForm ? bookingForm.querySelector('button[type="submit"]') : null;

    if (scannerZone && fileInput) {
        // Trigger file browser on click
        scannerZone.addEventListener('click', () => fileInput.click());

        // File Drag & Drop handlers
        ['dragenter', 'dragover'].forEach(eventName => {
            scannerZone.addEventListener(eventName, (e) => {
                e.preventDefault();
                scannerZone.style.borderColor = 'var(--accent)';
                scannerZone.style.background = 'rgba(197, 160, 89, 0.08)';
            }, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            scannerZone.addEventListener(eventName, (e) => {
                e.preventDefault();
                scannerZone.style.borderColor = 'var(--border-color)';
                scannerZone.style.background = 'rgba(10, 12, 16, 0.3)';
            }, false);
        });

        scannerZone.addEventListener('drop', (e) => {
            const dt = e.dataTransfer;
            const files = dt.files;
            if (files.length > 0) {
                processPassportFile(files[0]);
            }
        });

        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                processPassportFile(e.target.files[0]);
            }
        });
    }

    async function processPassportFile(file) {
        if (!file) return;

        // 1. Show Scanning animations
        if (scannerLaser) scannerLaser.classList.add('scanner-laser-active');
        if (scannerPrompt) scannerPrompt.style.display = 'none';
        if (scannerLoading) scannerLoading.style.display = 'block';
        if (eligibilityAlert) {
            eligibilityAlert.style.display = 'none';
            eligibilityAlert.innerHTML = '';
        }

        const formData = new FormData();
        formData.append('passport', file);

        try {
            const response = await fetch('process_passport_ocr.php', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (response.ok && result.success) {
                // 2. Auto-populate Form Fields
                const fields = {
                    'customer_name': result.customer_name,
                    'passport_number': result.passport_number,
                    'date_of_birth': result.date_of_birth,
                    'passport_expiry': result.passport_expiry
                };

                for (const [id, value] of Object.entries(fields)) {
                    const el = document.getElementById(id);
                    if (el) {
                        el.value = value;
                        // Flash success animation
                        el.classList.remove('field-autofilled');
                        void el.offsetWidth; // Trigger reflow to restart animation
                        el.classList.add('field-autofilled');
                    }
                }

                // 3. Evaluate Eligibility
                const today = new Date();
                const expiryDate = new Date(result.passport_expiry);
                const diffTime = expiryDate - today;
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                
                const birthDate = new Date(result.date_of_birth);
                let age = today.getFullYear() - birthDate.getFullYear();
                const m = today.getMonth() - birthDate.getMonth();
                if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                    age--;
                }

                if (eligibilityAlert) {
                    eligibilityAlert.style.display = 'block';
                    if (diffDays < 180) {
                        // Validity < 6 Months: Hard Error
                        eligibilityAlert.style.background = 'rgba(239, 68, 68, 0.1)';
                        eligibilityAlert.style.border = '1px solid rgba(239, 68, 68, 0.3)';
                        eligibilityAlert.style.color = '#fca5a5';
                        eligibilityAlert.innerHTML = `<i class="fa-solid fa-circle-xmark" style="margin-right: 6px;"></i> <strong>Ineligible:</strong> Passport expires in ${diffDays} days. A minimum of 6 months (180 days) validity is strictly required for Saudi visa endorsement.`;
                        if (submitBtn) submitBtn.disabled = true;
                    } else if (age < 18) {
                        // Minor check: Warning
                        eligibilityAlert.style.background = 'rgba(234, 179, 8, 0.1)';
                        eligibilityAlert.style.border = '1px solid rgba(234, 179, 8, 0.3)';
                        eligibilityAlert.style.color = '#fef08a';
                        eligibilityAlert.innerHTML = `<i class="fa-solid fa-circle-exclamation" style="margin-right: 6px;"></i> <strong>Eligibility Warning:</strong> Pilgrim is under 18 years old (${age} years). A guardian or mahram relationship must be attached in ERPNext.`;
                        if (submitBtn) submitBtn.disabled = false;
                    } else {
                        // Eligibility passed
                        eligibilityAlert.style.background = 'rgba(16, 185, 129, 0.1)';
                        eligibilityAlert.style.border = '1px solid rgba(16, 185, 129, 0.3)';
                        eligibilityAlert.style.color = '#a7f3d0';
                        eligibilityAlert.innerHTML = `<i class="fa-solid fa-circle-check" style="margin-right: 6px;"></i> <strong>Eligibility Passed:</strong> Passport is valid for ${diffDays} days (${Math.floor(diffDays/30)} months) and age check (${age} years) passed.`;
                        if (submitBtn) submitBtn.disabled = false;
                    }
                }
            } else {
                alert('OCR Error: ' + (result.message || 'Failed to read passport.'));
            }
        } catch (err) {
            console.error(err);
            alert('Connection error: Failed to reach the OCR parsing engine. Please try again.');
        } finally {
            // Restore scanning UI states
            if (scannerLaser) scannerLaser.classList.remove('scanner-laser-active');
            if (scannerPrompt) scannerPrompt.style.display = 'block';
            if (scannerLoading) scannerLoading.style.display = 'none';
        }
    }

    // 7. Pre-fill inquiry form from historical packages Inquire button
    document.querySelectorAll('.btn-inquire').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const card = e.target.closest('.package-card');
            const pkgName = card.getAttribute('data-package-name');
            const messageTextarea = document.getElementById('inquiry-message');
            if (messageTextarea) {
                messageTextarea.value = `I am interested in inquiring about the historical package: ${pkgName}. Please provide more details on similar upcoming packages.`;
            }
            const contactSection = document.getElementById('contact');
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // 8. Fetch & Render Dynamic Packages from MongoDB
    const packagesContainer = document.getElementById('dynamic-packages-container');
    const BACKEND_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'http://localhost:5000' : 'http://' + window.location.hostname + ':5000';

    const fallbackPackages = [
      {
        title: "Lahore VIP Umrah Package",
        city: "Lahore",
        price: "PKR 310,000",
        duration: "15 Days",
        description: "Experience absolute peace of mind with our signature Lahore VIP Package. Designed for comfort, offering premium 5-star accommodations right next to the holy Harams and executive transport services.",
        hotels: {
          makkah: "Makkah Clock Tower Hotel (5-Star)",
          madinah: "Madinah Front Hotel (5-Star)"
        },
        features: [
          "Direct flights from Lahore (LHE)",
          "Umrah Visa processing & insurance",
          "5-Star hotel stays close to Haram",
          "VIP private SUV transportation"
        ],
        image: "https://meezabgroup.com/wp-content/uploads/2025/07/Lahore-Group-Pkgs_page-0001.jpg"
      },
      {
        title: "Islamabad Elite Umrah Package",
        city: "Islamabad",
        price: "PKR 285,000",
        duration: "15 Days",
        description: "Our premium package out of Islamabad features selected 4-star properties providing an optimal mix of religious proximity and luxurious comfort at highly competitive rates.",
        hotels: {
          makkah: "Swissôtel Makkah (4-Star)",
          madinah: "Al Aqeeq Madinah Hotel (4-Star)"
        },
        features: [
          "Direct flights from Islamabad (ISB)",
          "Visa acquisition & ground logistics",
          "Comfortable 4-Star hotels within 300m",
          "Luxury shared air-conditioned coach transfers"
        ],
        image: "https://meezabgroup.com/wp-content/uploads/2025/07/Islamabad-Group-Pkg-_page-0001.jpg"
      }
    ];

    function renderPackages(packages) {
        if (!packagesContainer) return;
        if (!packages || packages.length === 0) {
            packages = fallbackPackages;
        }
        
        packagesContainer.innerHTML = '';
        
        packages.forEach(pkg => {
            const card = document.createElement('div');
            card.className = 'package-card';
            
            const featuresHtml = pkg.features.slice(0, 4).map(f => `<li><i class="fa-solid fa-circle-check"></i> ${f}</li>`).join('');
            const imageSrc = pkg.image ? (pkg.image.startsWith('http') ? pkg.image : BACKEND_URL + pkg.image) : '';
            
            card.innerHTML = `
                <div class="package-image-wrapper">
                    <img src="${imageSrc}" alt="${pkg.title}" class="package-img" onerror="this.src='https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?q=80&w=600'">
                    <div class="package-badge">${pkg.duration} - ${pkg.city}</div>
                    <div class="package-price-tag">${pkg.price}</div>
                </div>
                <div class="package-content">
                    <h3>${pkg.title}</h3>
                    <p class="package-desc">${pkg.description}</p>
                    <div class="package-hotels">
                        <div class="hotel-info">
                            <i class="fa-solid fa-hotel"></i>
                            <span>Makkah: <strong>${pkg.hotels.makkah}</strong></span>
                        </div>
                        <div class="hotel-info">
                            <i class="fa-solid fa-hotel"></i>
                            <span>Madinah: <strong>${pkg.hotels.madinah}</strong></span>
                        </div>
                    </div>
                    <ul class="package-features-list">
                        ${featuresHtml}
                    </ul>
                    <a href="#contact" class="btn btn-primary package-action-btn" data-pkg-title="${pkg.title}" data-pkg-duration="${pkg.duration}" data-pkg-price="${pkg.price}">
                        Inquire Now <i class="fa-solid fa-arrow-right"></i>
                    </a>
                </div>
            `;
            
            packagesContainer.appendChild(card);
        });

        // Add prefill handlers for inquiry form
        document.querySelectorAll('.package-action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const title = btn.getAttribute('data-pkg-title');
                const duration = btn.getAttribute('data-pkg-duration');
                const price = btn.getAttribute('data-pkg-price');
                
                const formService = document.querySelector('select[name="interest"]');
                const formMessage = document.querySelector('textarea[name="message"]');
                
                if (formService) formService.value = "Umrah";
                if (formMessage) {
                    formMessage.value = `Hi, I am interested in inquiring about the "${title}" (${duration}, Price: ${price}) package. Please send me full details and booking choices.`;
                }
                
                const contactSection = document.getElementById('contact');
                if (contactSection) {
                    contactSection.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }

    if (packagesContainer) {
        fetch(`${BACKEND_URL}/api/packages`)
          .then(res => {
              if (!res.ok) throw new Error("API status error");
              return res.json();
          })
          .then(data => renderPackages(data))
          .catch(err => {
              console.warn('Backend server unreachable, rendering fallback packages:', err);
              renderPackages(fallbackPackages);
          });
    }

    // 9. Intercept Inquiry Form and POST to MongoDB Backend
    const mainInquiryForm = document.getElementById('itt-contact-form');
    if (mainInquiryForm) {
        mainInquiryForm.addEventListener('submit', (e) => {
            const nameEl = mainInquiryForm.querySelector('input[name="full_name"]');
            const emailEl = mainInquiryForm.querySelector('input[name="email"]');
            const serviceEl = mainInquiryForm.querySelector('select[name="interest"]');
            const messageEl = mainInquiryForm.querySelector('textarea[name="message"]');
            
            const name = nameEl ? nameEl.value : '';
            const email = emailEl ? emailEl.value : '';
            const phone = 'N/A'; 
            const service = serviceEl ? serviceEl.value : 'General Inquiry';
            const message = messageEl ? messageEl.value : '';
            
            fetch(`${BACKEND_URL}/api/inquiries`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, phone, service, message })
            })
            .then(res => res.json())
            .then(data => console.log('Successfully saved inquiry to MongoDB:', data))
            .catch(err => console.error('MongoDB backend save failed:', err));
        });
    }
});

