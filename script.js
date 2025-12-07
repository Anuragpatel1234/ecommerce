let currentSlideIndex = 0;
const slides = document.querySelectorAll('.hero-slide');
const dots = document.querySelectorAll('.dot');

function showSlide(index) {
    // Remove active class from all slides and dots
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    // Add active class to current slide and dot
    slides[index].classList.add('active');
    dots[index].classList.add('active');
}

function nextSlide() {
    currentSlideIndex = (currentSlideIndex + 1) % slides.length;
    showSlide(currentSlideIndex);
}

function currentSlide(index) {
    currentSlideIndex = index;
    showSlide(currentSlideIndex);
}

// Auto slide every 5 seconds
setInterval(nextSlide, 5000);

// Currency Dropdown
function toggleCurrencyDropdown() {
    const dropdown = document.querySelector('.currency-dropdown');
    const menu = document.getElementById('currencyMenu');
    dropdown.classList.toggle('active');
    menu.classList.toggle('show');
}

function selectCurrency(currency) {
    const selector = document.querySelector('.currency-selector');
    selector.innerHTML = `${currency} <i class="fa-solid fa-chevron-down"></i>`;
    toggleCurrencyDropdown();
}

// Close dropdown when clicking outside
document.addEventListener('click', function(event) {
    const dropdown = document.querySelector('.currency-dropdown');
    const menu = document.getElementById('currencyMenu');
    if (dropdown && !dropdown.contains(event.target)) {
        dropdown.classList.remove('active');
        menu.classList.remove('show');
    }
});
