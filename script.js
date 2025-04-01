// When the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize the carousel with custom settings
    var heroSlider = document.getElementById('hero-slider');
    if (heroSlider) {
        var carousel = new bootstrap.Carousel(heroSlider, {
            interval: 6000,
            wrap: true,
            keyboard: true
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Adjust for fixed header
                    behavior: 'smooth'
                });
            }
        });
    });

    // Form validation and submission
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Basic form validation
            let isValid = true;
            const requiredFields = contactForm.querySelectorAll('[required]');
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('is-invalid');
                } else {
                    field.classList.remove('is-invalid');
                }
            });
            
            // Check email format
            const emailField = contactForm.querySelector('input[type="email"]');
            if (emailField && emailField.value.trim()) {
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailPattern.test(emailField.value.trim())) {
                    isValid = false;
                    emailField.classList.add('is-invalid');
                }
            }
            
            if (isValid) {
                // Form is valid, proceed with submission
                // In a real application, you would send data to server here
                alert('Thank you for your message! We will get back to you soon.');
                contactForm.reset();
            } else {
                alert('Please fill in all required fields correctly.');
            }
        });
    }

    // Navbar active state based on section scrolling
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    
    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            if (pageYOffset >= sectionTop && pageYOffset < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });

    // Animation on scroll
    const animateElements = document.querySelectorAll('.service-card, .feature-card, .value-card, .process-step, .testimonial-card, .team-card, .award-card, .case-study-card');
    
    function checkInView() {
        animateElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('animate');
            }
        });
    }
    
    window.addEventListener('scroll', checkInView);
    checkInView(); // Check on page load
    
    // Add animate class for CSS animations
    const style = document.createElement('style');
    style.textContent = `
        .service-card, .feature-card, .value-card, .process-step, .testimonial-card, .team-card, .award-card, .case-study-card {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.5s ease, transform 0.5s ease;
        }
        
        .service-card.animate, .feature-card.animate, .value-card.animate, .process-step.animate, .testimonial-card.animate, .team-card.animate, .award-card.animate, .case-study-card.animate {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);

    // Counter animation
    const counters = document.querySelectorAll('.counter');
    const speed = 200;

    function animateCounters() {
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target') || +counter.innerText;
            const count = +counter.innerText;
            const increment = target / speed;

            if (count < target) {
                counter.innerText = Math.ceil(count + increment);
                setTimeout(() => animateCounters(), 1);
            } else {
                counter.innerText = target;
            }
        });
    }

    // Set data-target attribute for counters
    counters.forEach(counter => {
        counter.setAttribute('data-target', counter.innerText);
        counter.innerText = '0';
    });

    // Intersection Observer for counters
    const counterSection = document.getElementById('statistics');
    if (counterSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        observer.observe(counterSection);
    }

    // Investment Calculator
    const calculateBtn = document.getElementById('calculateBtn');
    if (calculateBtn) {
        let growthChart = null;

        calculateBtn.addEventListener('click', function() {
            const initialInvestment = parseFloat(document.getElementById('initialInvestment').value) || 0;
            const monthlyContribution = parseFloat(document.getElementById('monthlyContribution').value) || 0;
            const investmentYears = parseInt(document.getElementById('investmentYears').value) || 0;
            const expectedReturn = parseFloat(document.getElementById('expectedReturn').value) || 0;
            
            // Calculate results
            const monthlyRate = expectedReturn / 100 / 12;
            const totalMonths = investmentYears * 12;
            const totalContributions = initialInvestment + (monthlyContribution * totalMonths);
            
            let futureValue = initialInvestment;
            const yearlyData = [initialInvestment];
            const labels = [0];
            
            for (let i = 1; i <= totalMonths; i++) {
                futureValue = (futureValue + monthlyContribution) * (1 + monthlyRate);
                
                // Store yearly data points for the chart
                if (i % 12 === 0) {
                    yearlyData.push(Math.round(futureValue));
                    labels.push(i / 12);
                }
            }
            
            const interestEarned = futureValue - totalContributions;
            
            // Update results on page
            document.getElementById('totalInvestment').textContent = '₹' + Math.round(totalContributions).toLocaleString();
            document.getElementById('interestEarned').textContent = '₹' + Math.round(interestEarned).toLocaleString();
            document.getElementById('finalAmount').textContent = '₹' + Math.round(futureValue).toLocaleString();
            
            // Create or update chart
            const ctx = document.getElementById('growthChart').getContext('2d');
            
            if (growthChart) {
                growthChart.destroy();
            }
            
            growthChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Investment Growth',
                        data: yearlyData,
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        borderColor: 'rgba(255, 255, 255, 1)',
                        borderWidth: 2,
                        pointBackgroundColor: 'rgba(255, 255, 255, 1)',
                        pointRadius: 4,
                        fill: true,
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    return '₹' + context.parsed.y.toLocaleString();
                                }
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: {
                                color: 'rgba(255, 255, 255, 0.1)'
                            },
                            ticks: {
                                color: 'rgba(255, 255, 255, 0.7)',
                                callback: function(value) {
                                    if (value >= 1000000) {
                                        return '₹' + (value / 1000000).toFixed(1) + 'M';
                                    } else if (value >= 1000) {
                                        return '₹' + (value / 1000).toFixed(0) + 'K';
                                    }
                                    return '₹' + value;
                                }
                            }
                        },
                        x: {
                            title: {
                                display: true,
                                text: 'Years',
                                color: 'rgba(255, 255, 255, 0.7)'
                            },
                            grid: {
                                color: 'rgba(255, 255, 255, 0.1)'
                            },
                            ticks: {
                                color: 'rgba(255, 255, 255, 0.7)'
                            }
                        }
                    }
                }
            });
        });
        
        // Trigger calculation on load
        calculateBtn.click();
    }
}); 