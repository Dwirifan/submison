export default class aboutPage {
  async render() {
    return `
      <section id="mainContent" class="about container" style="padding: 2rem; max-width: 900px; margin: auto;">
        <div class="about-content" role="main" style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.7; color: #2c3e50;">
          
          <div class="hero-section" style="text-align: center; margin-bottom: 3rem; padding: 2rem; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 15px; color: white;">
            <h1 class="about-title" style="font-size: 2.5rem; margin-bottom: 1rem; font-weight: bold;">
              <i class="fas fa-book-heart" aria-hidden="true" style="margin-right: 0.75rem; color: #ffd700;"></i>
              StoryApp
            </h1>
            <p style="font-size: 1.2rem; margin-bottom: 0; opacity: 0.95;">
              Tempat di mana setiap momen menjadi cerita yang berkesan
            </p>
          </div>

          <div class="mission-section" style="margin-bottom: 3rem; padding: 2rem; background: #f8f9fa; border-radius: 12px; border-left: 5px solid #3498db;">
            <h2 style="font-size: 1.8rem; margin-bottom: 1rem; color: #2c3e50;">
              <i class="fas fa-heart" style="margin-right: 0.5rem; color: #e74c3c;"></i>
              Misi Kami
            </h2>
            <p style="margin-bottom: 1rem; font-size: 1.1rem;">
              StoryApp hadir untuk menghubungkan hati dan jiwa melalui cerita-cerita autentik. Kami percaya bahwa setiap orang memiliki kisah unik yang layak dibagikan dan dikenang selamanya.
            </p>
            <p style="margin-bottom: 0; font-style: italic; color: #7f8c8d;">
              "Karena hidup terlalu berharga untuk tidak dibagikan, dan setiap foto memiliki cerita yang menunggu untuk didengar."
            </p>
          </div>

          <div class="features-grid" style="margin-bottom: 3rem;">
            <h2 style="font-size: 1.8rem; margin-bottom: 2rem; text-align: center; color: #2c3e50;">
              <i class="fas fa-star" style="margin-right: 0.5rem; color: #f39c12;"></i>
              Fitur Unggulan
            </h2>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem;">
              
              <div class="feature-card" style="padding: 1.5rem; background: white; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); transition: transform 0.3s ease;">
                <div style="text-align: center; margin-bottom: 1rem;">
                  <i class="fas fa-camera-retro" style="font-size: 2.5rem; color: #9b59b6; margin-bottom: 0.5rem;"></i>
                </div>
                <h3 style="font-size: 1.2rem; margin-bottom: 0.5rem; text-align: center; color: #2c3e50;">Upload Foto Berkualitas</h3>
                <p style="text-align: center; color: #7f8c8d; margin: 0; font-size: 0.9rem;">
                  Bagikan momen terbaik dengan kualitas gambar yang jernih dan tajam
                </p>
              </div>

              <div class="feature-card" style="padding: 1.5rem; background: white; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); transition: transform 0.3s ease;">
                <div style="text-align: center; margin-bottom: 1rem;">
                  <i class="fas fa-map-marked-alt" style="font-size: 2.5rem; color: #e74c3c; margin-bottom: 0.5rem;"></i>
                </div>
                <h3 style="font-size: 1.2rem; margin-bottom: 0.5rem; text-align: center; color: #2c3e50;">Lokasi Otomatis</h3>
                <p style="text-align: center; color: #7f8c8d; margin: 0; font-size: 0.9rem;">
                  Tandai lokasi spesial di mana cerita Anda terjadi untuk kenangan yang lebih hidup
                </p>
              </div>

              <div class="feature-card" style="padding: 1.5rem; background: white; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); transition: transform 0.3s ease;">
                <div style="text-align: center; margin-bottom: 1rem;">
                  <i class="fas fa-feather-alt" style="font-size: 2.5rem; color: #27ae60; margin-bottom: 0.5rem;"></i>
                </div>
                <h3 style="font-size: 1.2rem; margin-bottom: 0.5rem; text-align: center; color: #2c3e50;">Tulis Cerita Indah</h3>
                <p style="text-align: center; color: #7f8c8d; margin: 0; font-size: 0.9rem;">
                  Ekspresikan perasaan dan pengalaman Anda dengan kata-kata yang bermakna
                </p>
              </div>

              <div class="feature-card" style="padding: 1.5rem; background: white; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); transition: transform 0.3s ease;">
                <div style="text-align: center; margin-bottom: 1rem;">
                  <i class="fas fa-users" style="font-size: 2.5rem; color: #3498db; margin-bottom: 0.5rem;"></i>
                </div>
                <h3 style="font-size: 1.2rem; margin-bottom: 0.5rem; text-align: center; color: #2c3e50;">Komunitas Hangat</h3>
                <p style="text-align: center; color: #7f8c8d; margin: 0; font-size: 0.9rem;">
                  Bergabung dengan komunitas pencerita yang saling menginspirasi
                </p>
              </div>

              <div class="feature-card" style="padding: 1.5rem; background: white; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); transition: transform 0.3s ease;">
                <div style="text-align: center; margin-bottom: 1rem;">
                  <i class="fas fa-shield-alt" style="font-size: 2.5rem; color: #f39c12; margin-bottom: 0.5rem;"></i>
                </div>
                <h3 style="font-size: 1.2rem; margin-bottom: 0.5rem; text-align: center; color: #2c3e50;">Privasi Terjaga</h3>
                <p style="text-align: center; color: #7f8c8d; margin: 0; font-size: 0.9rem;">
                  Kontrol penuh atas siapa yang bisa melihat cerita pribadi Anda
                </p>
              </div>

              <div class="feature-card" style="padding: 1.5rem; background: white; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); transition: transform 0.3s ease;">
                <div style="text-align: center; margin-bottom: 1rem;">
                  <i class="fas fa-clock" style="font-size: 2.5rem; color: #8e44ad; margin-bottom: 0.5rem;"></i>
                </div>
                <h3 style="font-size: 1.2rem; margin-bottom: 0.5rem; text-align: center; color: #2c3e50;">Timeline Kenangan</h3>
                <p style="text-align: center; color: #7f8c8d; margin: 0; font-size: 0.9rem;">
                  Lihat perjalanan hidup Anda dalam timeline yang terorganisir dengan baik
                </p>
              </div>
            </div>
          </div>

          <div class="why-storyapp" style="margin-bottom: 3rem; padding: 2rem; background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%); border-radius: 12px;">
            <h2 style="font-size: 1.8rem; margin-bottom: 1.5rem; text-align: center; color: #2c3e50;">
              <i class="fas fa-question-circle" style="margin-right: 0.5rem; color: #e67e22;"></i>
              Mengapa StoryApp?
            </h2>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem;">
              <div>
                <h3 style="color: #d35400; margin-bottom: 0.5rem;">🎯 Fokus pada Cerita</h3>
                <p style="margin: 0; color: #5d4e75;">Bukan hanya sekedar media sosial, tapi platform khusus untuk storytelling yang bermakna.</p>
              </div>
              <div>
                <h3 style="color: #d35400; margin-bottom: 0.5rem;">💝 Tanpa Algoritma Rumit</h3>
                <p style="margin: 0; color: #5d4e75;">Cerita Anda akan terlihat apa adanya, tanpa manipulasi algoritma yang membingungkan.</p>
              </div>
              <div>
                <h3 style="color: #d35400; margin-bottom: 0.5rem;">🌍 Jangkauan Global</h3>
                <p style="margin: 0; color: #5d4e75;">Bagikan cerita Anda ke seluruh dunia dan temukan inspirasi dari pencerita lainnya.</p>
              </div>
              <div>
                <h3 style="color: #d35400; margin-bottom: 0.5rem;">🎨 Interface Elegan</h3>
                <p style="margin: 0; color: #5d4e75;">Design yang bersih dan intuitif, fokus pada konten tanpa distraksi yang tidak perlu.</p>
              </div>
            </div>
          </div>

          <div class="about-credits" style="border-top: 2px solid #ecf0f1; padding-top: 2rem; text-align: center;">
            <h2 style="font-size: 1.5rem; margin-bottom: 1rem; color: #2c3e50;">
              <i class="fas fa-code" style="margin-right: 0.5rem; color: #3498db;"></i>
              Dibuat dengan ❤️ oleh
            </h2>
            <div style="display: inline-block; padding: 1.5rem; background: white; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
              <p style="display: flex; align-items: center; justify-content: center; margin-bottom: 0.5rem; font-size: 1.2rem; font-weight: bold;">
                <i class="fas fa-user-tie" aria-hidden="true" style="margin-right: 0.75rem; color: #2c3e50;"></i>
                Dwi Rif'an Kurniawan
              </p>
              <p class="credits-note" style="font-size: 0.85rem; color: #95a5a6; margin: 0; font-style: italic;">
                Proyek pertama dalam perjalanan Web Development Intermediate - 2024
              </p>
            </div>
          </div>

        </div>
      </section>

      <style>
        .feature-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.15) !important;
        }
        
        @media (max-width: 768px) {
          .hero-section h1 {
            font-size: 2rem !important;
          }
          .hero-section p {
            font-size: 1rem !important;
          }
          .features-grid {
            grid-template-columns: 1fr !important;
          }
        }
        
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
        
        .about-content > div {
          animation: fadeInUp 0.6s ease-out;
        }
      </style>
    `;
  }

  async afterRender() {
    const featureCards = document.querySelectorAll('.feature-card');
    
    featureCards.forEach(card => {
      card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-8px) scale(1.02)';
        this.style.transition = 'all 0.3s ease';
      });
      
      card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
      });
    });

    document.querySelectorAll('a[href^="#"]:not([href*="/"])').forEach(anchor => {
      const href = anchor.getAttribute('href');
      if (href && href.length > 1 && !href.includes('/')) {
        try {
          const target = document.querySelector(href);
          if (target) {
            anchor.addEventListener('click', function (e) {
              e.preventDefault();
              target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
              });
            });
          }
        } catch (error) {
          console.log('Invalid selector ignored:', href);
        }
      }
    });
  }
}