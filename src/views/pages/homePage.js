export default class HomePage {
  constructor() {
    this.userName = null;
    this.isLoggedIn = false;
  }

  checkLoginStatus() {
    const token = localStorage.getItem("token");
    const name = localStorage.getItem("name");
    
    this.isLoggedIn = !!token;
    this.userName = name;
  }

  async render() {
    this.checkLoginStatus();

    const greetingSection = this.isLoggedIn && this.userName 
      ? `<div class="welcome-message">
           <h2 class="welcome-text">
             <i class="fas fa-star"></i> 
             Selamat datang kembali, ${this.userName}! 
             <span class="welcome-subtitle">Siap melanjutkan petualangan literasi?</span>
           </h2>
         </div>`
      : '';

    const ctaButtons = this.isLoggedIn 
      ? `<a href="#/stories" class="cta-button">
           <i class="fas fa-book-open"></i> 
           <span class="button-text">
             <strong>Jelajahi Cerita</strong>
             <small>Temukan petualangan baru</small>
           </span>
         </a>
         <a href="#/stories/add" class="cta-button cta-button--primary">
           <i class="fas fa-feather-alt"></i> 
           <span class="button-text">
             <strong>Mulai Menulis</strong>
             <small>Wujudkan imajinasimu</small>
           </span>
         </a>`
      : `<a href="#/login" class="cta-button">
           <i class="fas fa-sign-in-alt"></i> 
           <span class="button-text">
             <strong>Masuk ke Akun</strong>
             <small>Akses semua fitur</small>
           </span>
         </a>
         <a href="#/register" class="cta-button cta-button--primary">
           <i class="fas fa-user-plus"></i> 
           <span class="button-text">
             <strong>Gabung Sekarang</strong>
             <small>100% gratis selamanya</small>
           </span>
         </a>`;

    const heroStats = this.isLoggedIn 
      ? `<div class="hero-stats">
           <div class="stat-item">
             <i class="fas fa-book"></i>
             <span class="stat-number">1000+</span>
             <span class="stat-label">Cerita Tersedia</span>
           </div>
           <div class="stat-item">
             <i class="fas fa-users"></i>
             <span class="stat-number">5000+</span>
             <span class="stat-label">Pencerita Aktif</span>
           </div>
           <div class="stat-item">
             <i class="fas fa-heart"></i>
             <span class="stat-number">50K+</span>
             <span class="stat-label">Cerita Disukai</span>
           </div>
         </div>`
      : `<div class="hero-features">
           <div class="feature-item">
             <i class="fas fa-mobile-alt"></i>
             <h4>Akses Dimana Saja</h4>
             <p>Baca dan tulis cerita kapan pun, dimana pun</p>
           </div>
           <div class="feature-item">
             <i class="fas fa-users"></i>
             <h4>Komunitas Aktif</h4>
             <p>Ribuan pencerita dan pembaca siap berinteraksi</p>
           </div>
           <div class="feature-item">
             <i class="fas fa-gem"></i>
             <h4>100% Gratis</h4>
             <p>Tidak ada biaya tersembunyi, selamanya gratis</p>
           </div>
         </div>`;

    return `
      <section id="mainContent" class="container">
        <div class="home-content">
          ${greetingSection}
          <div class="hero-section">
            <h1 class="home-title">
              <span class="title-highlight">Jelajahi Dunia Tanpa Batas</span>
              <span class="title-main">Melalui Cerita</span>
            </h1>
            <p class="home-subtitle">
              ${this.isLoggedIn 
                ? 'Lanjutkan perjalanan literasi yang menakjubkan bersama komunitas pencerita terbaik Indonesia'
                : 'Platform digital untuk membaca, menulis, dan berbagi cerita dari seluruh Indonesia'
              }
            </p>
            <div class="cta-container">
              ${ctaButtons}
            </div>
          </div>
          ${heroStats}
          <div class="inspiration-quote">
            <blockquote>
              <i class="fas fa-quote-left"></i>
              <p>"Setiap orang punya cerita yang layak dibagikan. Apa ceritamu hari ini?"</p>
              <i class="fas fa-quote-right"></i>
            </blockquote>
          </div>
          ${!this.isLoggedIn ? `
            <div class="bottom-cta">
              <h3>Siap Memulai Petualangan?</h3>
              <p>Bergabunglah dengan ribuan pencerita lainnya dan mulai berbagi cerita terbaikmu</p>
              <a href="#/register" class="btn-secondary">
                <i class="fas fa-rocket"></i> Mulai Sekarang
              </a>
            </div>
          ` : ''}
        </div>
      </section>
      ${this.isLoggedIn ? `
        <div class="floating-actions">
          <button class="fab-main" title="Menu Cepat">
            <i class="fas fa-plus"></i>
          </button>
          <div class="fab-menu">
            <a href="#/stories/add" class="fab-item" title="Tulis Cerita Baru">
              <i class="fas fa-pen"></i>
            </a>
            <a href="#/stories" class="fab-item" title="Jelajahi Cerita">
              <i class="fas fa-search"></i>
            </a>
            <a href="#/profile" class="fab-item" title="Profil Saya">
              <i class="fas fa-user"></i>
            </a>
          </div>
        </div>
      ` : ''}
    `;
  }

  setupEventListeners() {
    if (this.isLoggedIn) {
      const fabMain = document.querySelector('.fab-main');
      const fabMenu = document.querySelector('.fab-menu');
      
      if (fabMain && fabMenu) {
        let isMenuOpen = false;
        
        fabMain.addEventListener('click', () => {
          isMenuOpen = !isMenuOpen;
          fabMenu.classList.toggle('fab-menu--open', isMenuOpen);
          fabMain.classList.toggle('fab-main--rotated', isMenuOpen);
        });

        document.addEventListener('click', (e) => {
          if (!e.target.closest('.floating-actions') && isMenuOpen) {
            isMenuOpen = false;
            fabMenu.classList.remove('fab-menu--open');
            fabMain.classList.remove('fab-main--rotated');
          }
        });
      }
    }

    this.setupAnimations();
  }

  setupAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.hero-section, .hero-stats, .hero-features, .inspiration-quote, .bottom-cta');
    animatedElements.forEach(el => {
      el.classList.add('animate-ready');
      observer.observe(el);
    });
  }

  async afterRender() {
    this.setupEventListeners();
    setTimeout(() => {
      document.querySelector('.home-content')?.classList.add('loaded');
    }, 100);
  }

  refresh() {
    this.checkLoginStatus();
    const mainContent = document.getElementById('mainContent');
    if (mainContent) {
      this.render().then(html => {
        mainContent.outerHTML = html;
        this.afterRender();
      });
    }
  }

  getRandomQuote() {
    const quotes = [
      "Setiap orang punya cerita yang layak dibagikan. Apa ceritamu hari ini?",
      "Biarkan imajinasimu mengalir bebas melalui kata-kata.",
      "Cerita terbaik lahir dari pengalaman yang paling sederhana.",
      "Menulis adalah cara untuk membuat waktu berhenti.",
      "Setiap kata yang kamu tulis adalah jejak yang akan dikenang."
    ];
    
    return quotes[Math.floor(Math.random() * quotes.length)];
  }
}
