<?php
require_once 'includes/config.php';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Partner With Us | Sub-Agent Registration | Insight Travel</title>
    <link rel="stylesheet" href="css/style.css?v=5">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        .register-container {
            max-width: 800px;
            margin: 0 auto;
            padding: 8rem 1.5rem 4rem;
        }
        .register-header {
            text-align: center;
            margin-bottom: 3rem;
        }
        .register-header h1 {
            font-size: 2.6rem;
            font-weight: 800;
            color: var(--white);
        }
        .register-header h1 span {
            color: var(--accent);
        }
        .register-header p {
            color: var(--text-muted);
            margin-top: 1rem;
            font-size: 1.05rem;
            max-width: 600px;
            margin-left: auto;
            margin-right: auto;
        }
        .register-card {
            background: var(--card-dark);
            border: 1px solid var(--border-color);
            border-radius: 20px;
            padding: 3rem;
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4);
            position: relative;
            overflow: hidden;
        }
        .register-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 4px;
            background: linear-gradient(90deg, var(--accent) 0%, rgba(255, 255, 255, 0.2) 100%);
        }
        .register-form-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1.5rem;
        }
        .form-group-full {
            grid-column: span 2;
        }
        @media (max-width: 768px) {
            .register-form-grid {
                grid-template-columns: 1fr;
            }
            .form-group-full {
                grid-column: span 1;
            }
            .register-card {
                padding: 2rem 1.5rem;
            }
        }
    </style>
</head>
<body>
    <?php include 'includes/navbar.php'; ?>

    <div class="register-container">
        <div class="register-header">
            <h1>Partner With <span>Insight Travel</span></h1>
            <p>Grow your pilgrimage business by becoming an authorized sub-agent. Access premium rates, real-time booking, and white-label tools instantly.</p>
        </div>

        <div class="register-card" id="registration-card-wrapper">
            <h3 style="font-size: 1.6rem; color: var(--white); margin-bottom: 2rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.75rem;">Agency Details Form</h3>
            
            <form id="agent-register-form">
                <div class="register-form-grid">
                    <div class="form-group">
                        <label for="agency_name">Agency / Company Name</label>
                        <input type="text" name="agency_name" id="agency_name" placeholder="Al-Basit Travel (Pvt) Ltd" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="contact_name">Primary Contact Person</label>
                        <input type="text" name="contact_name" id="contact_name" placeholder="Muhammad Ali" required>
                    </div>

                    <div class="form-group">
                        <label for="email">Business Email Address</label>
                        <input type="email" name="email" id="email" placeholder="contact@agency.com" required>
                    </div>

                    <div class="form-group">
                        <label for="phone">Phone / WhatsApp Number</label>
                        <input type="tel" name="phone" id="phone" placeholder="+92 300 1234567" required>
                    </div>

                    <div class="form-group">
                        <label for="license_no">Business License / Registration No (Optional)</label>
                        <input type="text" name="license_no" id="license_no" placeholder="DTS-LHR-9481">
                    </div>

                    <div class="form-group">
                        <label for="address">City & Country</label>
                        <input type="text" name="address" id="address" placeholder="Lahore, Pakistan" required>
                    </div>

                    <div class="form-group-full">
                        <label for="experience">Years of Experience in Hajj & Umrah Tourism</label>
                        <select name="experience" id="experience" required>
                            <option value="0">Less than 1 year</option>
                            <option value="1">1 - 2 Years</option>
                            <option value="3" selected>3 - 5 Years</option>
                            <option value="5">5 - 10 Years</option>
                            <option value="10">10+ Years</option>
                        </select>
                    </div>

                    <div class="form-group-full">
                        <label for="bio">Brief Agency Profile / Description</label>
                        <textarea name="bio" id="bio" rows="4" placeholder="Tell us about your agency, number of monthly pilgrims you handle, or any custom requirements you have..."></textarea>
                    </div>
                </div>

                <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 1.5rem; display: flex; align-items: center; justify-content: center; gap: 10px;">
                    <i class="fa-solid fa-paper-plane"></i> Submit Registration Application
                </button>
            </form>
        </div>
    </div>

    <!-- FOOTER -->
    <footer style="border-top: 1px solid var(--border-color); padding: 4rem 1.5rem 2rem; background: rgba(10, 12, 16, 0.5); text-align: center;">
        <a href="/" class="logo" style="display: inline-block; margin-bottom: 2rem;">INSIGHT <span>Travel</span></a>
        <p>&copy; 2026 Insight Travel and Tours. Based in Madinah Al-Munawarah. Powered by IICC IT Department. &bull; <a href="subagent_register.php" style="color: var(--text-muted); text-decoration: none;">Agent Registration</a> &bull; <a href="manage_packages.php" style="color: var(--text-muted); text-decoration: none;">Sales Portal</a></p>
    </footer>

    <script src="js/script.js?v=5"></script>
    <script>
        document.addEventListener('DOMContentLoaded', () => {
            const form = document.getElementById('agent-register-form');
            if (form) {
                form.addEventListener('submit', async (e) => {
                    e.preventDefault();
                    
                    const btn = form.querySelector('button[type="submit"]');
                    const originalBtnText = btn.innerHTML;
                    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Submitting Request...';
                    btn.disabled = true;
                    
                    const formData = new FormData(form);
                    
                    try {
                        const response = await fetch('process_subagent_registration.php', {
                            method: 'POST',
                            body: formData
                        });
                        
                        const result = await response.json();
                        
                        if (response.ok && result.success) {
                            const wrapper = document.getElementById('registration-card-wrapper');
                            wrapper.innerHTML = `
                                <div class="inquiry-success-box" style="text-align: center; padding: 2rem 0;">
                                    <i class="fa-solid fa-circle-check" style="font-size: 4.5rem; color: #4ade80; margin-bottom: 1.5rem; display: block;"></i>
                                    <h3 style="font-size: 1.8rem; color: var(--white); margin-bottom: 1rem;">Application Submitted!</h3>
                                    <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.7; max-width: 550px; margin: 0 auto 1.5rem;">
                                        Thank you, <strong>${result.agency_name}</strong>. Your partner request has been successfully registered. 
                                        Your unique agent registration reference is <strong style="color: var(--accent); font-family: monospace;">${result.agent_id}</strong>.
                                    </p>
                                    <div style="background: rgba(197, 160, 89, 0.08); padding: 1.2rem; border-radius: 8px; border: 1px solid var(--border-color); text-align: left; max-width: 500px; margin: 0 auto 2rem;">
                                        <div style="font-weight: 600; color: var(--white); margin-bottom: 5px;"><i class="fa-solid fa-circle-info" style="color: var(--accent); margin-right: 5px;"></i> What happens next?</div>
                                        <ol style="margin-left: 1.2rem; color: var(--text-muted); font-size: 0.9rem; line-height: 1.6;">
                                            <li>Our verification department will review your business details.</li>
                                            <li>An email containing your approval status and access keys will be dispatched.</li>
                                            <li>You can then start booking dynamic Umrah packages directly at agent commissions or reselling with custom rates.</li>
                                        </ol>
                                    </div>
                                    <a href="/" class="btn btn-primary">Return to Homepage</a>
                                </div>
                            `;
                        } else {
                            alert('Registration Error: ' + (result.message || 'Failed to submit application.'));
                        }
                    } catch (err) {
                        console.error(err);
                        alert('Connection error: Failed to reach the server. Please check your network and try again.');
                    } finally {
                        btn.innerHTML = originalBtnText;
                        btn.disabled = false;
                    }
                });
            }
        });
    </script>
</body>
</html>
