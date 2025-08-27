// Currency Exchange Rates (simplified - in real app, use API)
const exchangeRates = {
    'RWF': { 'USD': 0.001, 'EUR': 0.0009, 'GBP': 0.0008, 'RWF': 1 },
    'USD': { 'RWF': 1000, 'EUR': 0.85, 'GBP': 0.73, 'USD': 1 },
    'EUR': { 'RWF': 1176, 'USD': 1.18, 'GBP': 0.86, 'EUR': 1 },
    'GBP': { 'RWF': 1370, 'USD': 1.37, 'EUR': 1.16, 'GBP': 1 }
};

// Current language
let currentLang = 'rw';

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    updateDateTime();
    setInterval(updateDateTime, 1000);
    updateCurrency();
    initializeSwiper();
    setupEventListeners();
});

// Update date and time
function updateDateTime() {
    const now = new Date();
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };

    document.getElementById('current-date').textContent = now.toLocaleDateString('en-US', options);
    document.getElementById('current-time').textContent = now.toLocaleTimeString();
}

// Language switcher
function changeLanguage() {
    const select = document.getElementById('languageSelect');
    currentLang = select.value;

    // Hide all language content
    document.querySelectorAll('.lang-content').forEach(el => {
        el.classList.remove('active');
    });

    // Show selected language content
    document.querySelectorAll(`[data-lang="${currentLang}"]`).forEach(el => {
        el.classList.add('active');
    });

    // Update search placeholder
    const searchInput = document.getElementById('search-input');
    const placeholders = {
        'rw': 'Shakisha inkuru n\'amakuru',
        'en': 'Search News & Stories',
        'fr': 'Rechercher Actualités',
        'sw': 'Tafuta Habari'
    };
    searchInput.placeholder = placeholders[currentLang];
}

// Currency converter
function updateCurrency() {
    const amount = parseFloat(document.getElementById('amount').value) || 1;
    const fromCurrency = document.getElementById('fromCurrency').value;
    const toCurrency = document.getElementById('toCurrency').value;

    const rate = exchangeRates[fromCurrency][toCurrency];
    const convertedAmount = (amount * rate).toFixed(2);

    document.getElementById('convertedAmount').textContent = convertedAmount;
}

// Currency event listeners
document.getElementById('amount').addEventListener('input', updateCurrency);
document.getElementById('fromCurrency').addEventListener('change', updateCurrency);
document.getElementById('toCurrency').addEventListener('change', updateCurrency);

// Initialize Swiper
function initializeSwiper() {
    let currentSlide = 0;
    const slides = document.querySelectorAll('.swiper-slide');
    const totalSlides = slides.length;

    // Create pagination dots
    const paginationContainer = document.querySelector('.swiper-pagination');
    paginationContainer.innerHTML = '';
    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('span');
        dot.className = 'swiper-pagination-bullet';
        if (i === 0) dot.classList.add('swiper-pagination-bullet-active');
        dot.addEventListener('click', () => goToSlide(i));
        paginationContainer.appendChild(dot);
    }

    function updateSlides() {
        const wrapper = document.querySelector('.swiper-wrapper');
        wrapper.style.transform = `translateX(-${currentSlide * 100}%)`;

        // Update pagination
        document.querySelectorAll('.swiper-pagination-bullet').forEach((dot, index) => {
            dot.classList.toggle('swiper-pagination-bullet-active', index === currentSlide);
        });
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateSlides();
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        updateSlides();
    }

    function goToSlide(index) {
        currentSlide = index;
        updateSlides();
    }

    // Event listeners for navigation buttons
    document.querySelector('.swiper-button-next').addEventListener('click', nextSlide);
    document.querySelector('.swiper-button-prev').addEventListener('click', prevSlide);

    // Auto-play
    setInterval(nextSlide, 5000);
}

// Category filtering
function showCategory(category) {
    // Update active tab
    document.querySelectorAll('.category-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    event.target.classList.add('active');

    // Filter stories
    const stories = document.querySelectorAll('.story-card');
    stories.forEach(story => {
        if (category === 'all' || story.dataset.category === category) {
            story.style.display = 'block';
            story.style.animation = 'fadeInUp 0.6s ease';
        } else {
            story.style.display = 'none';
        }
    });
}

// Reference section
function showReference(source) {
    // Update active tab
    document.querySelectorAll('.reference-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    event.target.classList.add('active');

    // Update iframe source
    const iframe = document.getElementById('reference-frame');
    const sources = {
        'cnn': 'https://lite.cnn.com/',
        'bbc': 'https://www.bbc.com/news',
        'kigali': 'https://www.kigalitoday.com/',
        'newtimes': 'https://www.newtimes.co.rw/',
        'rba': 'https://www.rba.co.rw/'
    };

    iframe.src = sources[source];
}

// Setup event listeners
function setupEventListeners() {
    // Navigation functionality
    const navItems = document.querySelectorAll("#links_container li");
    const navLinks = document.querySelectorAll("#links_container li a");
    const navIcons = document.querySelectorAll("#links_container li svg path");

    navItems.forEach((item, index) => {
        item.addEventListener('click', function() {
            // Remove active class from all items
            navItems.forEach(nav => nav.classList.remove('nav_active'));
            navLinks.forEach(link => link.style.color = 'black');
            navIcons.forEach(icon => icon.style.fill = 'black');

            // Add active class to clicked item
            this.classList.add('nav_active');
            navLinks[index].style.color = 'var(--main-color-1)';
            navIcons[index].style.fill = 'var(--main-color-1)';
        });

        item.addEventListener('mouseover', function() {
            if (!this.classList.contains('nav_active')) {
                navLinks[index].style.color = 'var(--main-color-1)';
                navIcons[index].style.fill = 'var(--main-color-1)';
            }
        });

        item.addEventListener('mouseout', function() {
            if (!this.classList.contains('nav_active')) {
                navLinks[index].style.color = 'black';
                navIcons[index].style.fill = 'black';
            }
        });
    });

    // Search functionality
    document.getElementById('search-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch(this.value.trim());
        }
    });

    document.getElementById('searchbuttom').addEventListener('click', function() {
        const query = document.getElementById('search-input').value.trim();
        performSearch(query);
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Search functionality
function performSearch(query) {
    if (!query) {
        const messages = {
            'rw': 'Shyiramo ijambo ushaka gushakisha',
            'en': 'Please enter a search term',
            'fr': 'Veuillez entrer un terme de recherche',
            'sw': 'Tafadhali ingiza neno la utafutaji'
        };
        alert(messages[currentLang]);
        return;
    }

    const messages = {
        'rw': `Ushakisha: "${query}"`,
        'en': `Searching for: "${query}"`,
        'fr': `Recherche de: "${query}"`,
        'sw': `Kutafuta: "${query}"`
    };
    alert(messages[currentLang]);

    // Here you would typically implement actual search functionality
    // For demo purposes, we'll just highlight matching text
    highlightSearchResults(query);
}

// Highlight search results
function highlightSearchResults(query) {
    const stories = document.querySelectorAll('.story-card');
    stories.forEach(story => {
        const title = story.querySelector('.story-title');
        const excerpt = story.querySelector('.story-excerpt');

        if (title.textContent.toLowerCase().includes(query.toLowerCase()) ||
            excerpt.textContent.toLowerCase().includes(query.toLowerCase())) {
            story.style.border = '3px solid var(--main-color-1)';
            story.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
            story.style.border = '';
        }
    });

    // Remove highlight after 5 seconds
    setTimeout(() => {
        stories.forEach(story => {
            story.style.border = '';
        });
    }, 5000);
}

// Newsletter subscription
function subscribeNewsletter() {
    const email = document.getElementById('newsletter-email').value.trim();
    if (!email) {
        const messages = {
            'rw': 'Shyiramo email yawe',
            'en': 'Please enter your email',
            'fr': 'Veuillez entrer votre email',
            'sw': 'Tafadhali ingiza barua pepe yako'
        };
        alert(messages[currentLang]);
        return;
    }

    if (!isValidEmail(email)) {
        const messages = {
            'rw': 'Shyiramo email nziza',
            'en': 'Please enter a valid email',
            'fr': 'Veuillez entrer un email valide',
            'sw': 'Tafadhali ingiza barua pepe halali'
        };
        alert(messages[currentLang]);
        return;
    }

    const messages = {
        'rw': `Murakoze! Mwanditse newsletter yacu: ${email}`,
        'en': `Thank you! You've subscribed to our newsletter: ${email}`,
        'fr': `Merci! Vous vous êtes abonné à notre newsletter: ${email}`,
        'sw': `Asante! Umejiandikisha kwenye jarida letu: ${email}`
    };
    alert(messages[currentLang]);
    document.getElementById('newsletter-email').value = '';
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Load more content simulation
function loadMoreStories() {
    const storiesGrid = document.querySelector('#trending-stories');
    const newStories = [{
            title: {
                'rw': "Amakuru y'ubuvuzi bushya",
                'en': "New healthcare developments",
                'fr': "Nouveaux développements de santé",
                'sw': "Maendeleo mapya ya afya"
            },
            excerpt: {
                'rw': "Ivuriro rishya ryafunguye i Kigali...",
                'en': "New hospital opens in Kigali...",
                'fr': "Nouvel hôpital ouvert à Kigali...",
                'sw': "Hospitali mpya imefunguliwa Kigali..."
            },
            image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=200&fit=crop",
            category: "health"
        },
        {
            title: {
                'rw': "Igikorwa cy'ubufatanye",
                'en': "Cooperation initiative",
                'fr': "Initiative de coopération",
                'sw': "Mpango wa ushirikiano"
            },
            excerpt: {
                'rw': "Ubunyangamugayo bw'abana bushya...",
                'en': "New children's welfare program...",
                'fr': "Nouveau programme de bien-être des enfants...",
                'sw': "Mpango mpya wa ustawi wa watoto..."
            },
            image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400&h=200&fit=crop",
            category: "social"
        }
    ];

    newStories.forEach(story => {
        const articleElement = document.createElement('article');
        articleElement.className = 'story-card';
        articleElement.dataset.category = story.category;
        articleElement.innerHTML = `
                    <img src="${story.image}" alt="${story.title[currentLang]}" class="story-image">
                    <div class="story-content">
                        <h3 class="story-title">
                            <span class="lang-content ${currentLang === 'rw' ? 'active' : ''}" data-lang="rw">${story.title.rw}</span>
                            <span class="lang-content ${currentLang === 'en' ? 'active' : ''}" data-lang="en">${story.title.en}</span>
                            <span class="lang-content ${currentLang === 'fr' ? 'active' : ''}" data-lang="fr">${story.title.fr}</span>
                            <span class="lang-content ${currentLang === 'sw' ? 'active' : ''}" data-lang="sw">${story.title.sw}</span>
                        </h3>
                        <p class="story-excerpt">
                            <span class="lang-content ${currentLang === 'rw' ? 'active' : ''}" data-lang="rw">${story.excerpt.rw}</span>
                            <span class="lang-content ${currentLang === 'en' ? 'active' : ''}" data-lang="en">${story.excerpt.en}</span>
                            <span class="lang-content ${currentLang === 'fr' ? 'active' : ''}" data-lang="fr">${story.excerpt.fr}</span>
                            <span class="lang-content ${currentLang === 'sw' ? 'active' : ''}" data-lang="sw">${story.excerpt.sw}</span>
                        </p>
                        <div class="story-meta">
                            <span>
                                <span class="lang-content ${currentLang === 'rw' ? 'active' : ''}" data-lang="rw">Ubu</span>
                                <span class="lang-content ${currentLang === 'en' ? 'active' : ''}" data-lang="en">Now</span>
                                <span class="lang-content ${currentLang === 'fr' ? 'active' : ''}" data-lang="fr">Maintenant</span>
                                <span class="lang-content ${currentLang === 'sw' ? 'active' : ''}" data-lang="sw">Sasa</span>
                            </span>
                            <a href="#" class="read-more">
                                <span class="lang-content ${currentLang === 'rw' ? 'active' : ''}" data-lang="rw">Soma Byinshi</span>
                                <span class="lang-content ${currentLang === 'en' ? 'active' : ''}" data-lang="en">Read More</span>
                                <span class="lang-content ${currentLang === 'fr' ? 'active' : ''}" data-lang="fr">Lire Plus</span>
                                <span class="lang-content ${currentLang === 'sw' ? 'active' : ''}" data-lang="sw">Soma Zaidi</span>
                            </a>
                        </div>
                    </div>
                `;
        storiesGrid.appendChild(articleElement);
    });
}

// Infinite scroll
let isLoading = false;
window.addEventListener('scroll', () => {
    if (isLoading) return;

    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000) {
        isLoading = true;
        setTimeout(() => {
            // Uncomment to enable infinite scroll
            // loadMoreStories();
            isLoading = false;
        }, 1000);
    }
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            .swiper-wrapper {
                display: flex;
                transition: transform 0.5s ease;
            }
            
            .story-card {
                animation: fadeInUp 0.6s ease;
            }
            
            .breaking-news-content {
                white-space: nowrap;
            }
            
            @media (max-width: 768px) {
                .breaking-news-content {
                    white-space: normal;
                    animation: none;
                    text-align: center;
                }
            }
        `;
document.head.appendChild(style);

// Weather 
function updateWeather() {
    // This is a simulation - in real app, fetch from weather API
    const weather = {
        temperature: Math.floor(Math.random() * 10) + 20,
        condition: ['☀️ Sunny', '🌤️ Partly Cloudy', '🌧️ Rainy', '⛅ Cloudy'][Math.floor(Math.random() * 4)],
        humidity: Math.floor(Math.random() * 30) + 50,
        wind: Math.floor(Math.random() * 15) + 5
    };

    document.querySelector('.temperature').textContent = weather.temperature + '°C';
    document.querySelector('.weather-main div:last-child').textContent = weather.condition;
}

// Update weather every 10 minutes
setInterval(updateWeather, 600000);