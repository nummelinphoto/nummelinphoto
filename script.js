// toggleMenu kan ligga utanför DOMContentLoaded så den är tillgänglig direkt
function toggleMenu() {
  const menu = document.getElementById('mobile-menu');
  menu.classList.toggle('show');  // Växla mellan att visa och dölja menyn

  const desktopMenu = document.getElementById('desktop-menu');
  if (menu.classList.contains('show')) {
    desktopMenu.style.display = 'none';  // Döljer desktopmenyn när hamburgarmenyn är öppen
  } else {
    desktopMenu.style.display = 'block';  // Visar desktopmenyn igen när hamburgarmenyn är stängd
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // Hamburgerknapp - toggle meny
  const hamburgerButton = document.querySelector('.hamburger');
  if (hamburgerButton) {
    hamburgerButton.addEventListener('click', toggleMenu);
  }

  // Lightbox-element
  const lightboxOverlay = document.getElementById('lightbox-overlay');
  const lightboxContent = document.getElementById('lightbox-content');
  const lightboxText = document.getElementById('lightbox-text');
  const closeBtn = document.querySelector('.close-btn');

  // Bilder - öppna i lightbox
  const images = document.querySelectorAll('.gallery-item');
  images.forEach(img => {
    img.addEventListener('click', () => {
      lightboxContent.innerHTML = `<img src="${img.src}" alt="" />`;
      lightboxText.textContent = img.getAttribute('data-text') || '';
      lightboxOverlay.style.display = 'flex';
    });
  });

  // Videor - öppna i lightbox
  document.querySelectorAll('.video-thumb').forEach(thumb => {
    thumb.addEventListener('click', () => {
      const videoSrc = thumb.dataset.videoSrc;
      const caption = thumb.dataset.text || '';
      lightboxContent.innerHTML = `<video src="${videoSrc}" controls autoplay style="max-width: 90vw; max-height: 80vh; border-radius: 10px;"></video>`;
      lightboxText.textContent = caption;
      lightboxOverlay.style.display = 'flex';
    });
  });

  // Stäng lightbox
  closeBtn.addEventListener('click', () => {
    lightboxOverlay.style.display = 'none';
    lightboxContent.innerHTML = '';
    lightboxText.textContent = '';
  });

  // Skrolla till nästa sektion när användaren klickar på menylänkar
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      document.querySelector(this.getAttribute('href')).scrollIntoView({
        behavior: 'smooth'
      });
    });
  });

  // Skrolla mellan sektionerna med musen
  const sections = document.querySelectorAll('.section');
  let currentSectionIndex = 0;

  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.5
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        currentSectionIndex = [...sections].indexOf(entry.target);
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));

  // Möjliggör skrollning upp och ner via musen
  window.addEventListener('wheel', (e) => {
    if (e.deltaY > 0) {
      if (currentSectionIndex < sections.length - 1) {
        currentSectionIndex++;
        sections[currentSectionIndex].scrollIntoView({ behavior: 'smooth' });
      }
    } else if (e.deltaY < 0) {
      if (currentSectionIndex > 0) {
        currentSectionIndex--;
        sections[currentSectionIndex].scrollIntoView({ behavior: 'smooth' });
      }
    }
  });

  // Lägg till en CSS-klass som markera sektionen som synlig i viewporten
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-viewport');
      } else {
        entry.target.classList.remove('in-viewport');
      }
    });
  }, { threshold: 0.5 });

  // Observera alla sektioner
  sections.forEach(section => sectionObserver.observe(section));
});

// Hamburger animation och aria-expanded
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.getElementById('mobile-menu');

hamburger?.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');

  // För tillgänglighet - aria-expanded
  const expanded = hamburger.getAttribute('aria-expanded') === 'true' || false;
  hamburger.setAttribute('aria-expanded', !expanded);
});

// Canvas-bakgrund med bollar
const canvas = document.getElementById('background-canvas');
const ctx = canvas.getContext('2d');

let width, height;
function resize() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

class Ball {
  constructor() {
    this.radius = 30 + Math.random() * 70;
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.vx = (Math.random() - 0.5) * 3;
    this.vy = (Math.random() - 0.5) * 3;
    this.color = `rgba(179, 255, 189, 0.7)`;  // vit lite transparent
  }

  draw() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.shadowColor = 'white';
    ctx.shadowBlur = 10;
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    if (this.x + this.radius > width || this.x - this.radius < 0) this.vx *= -1;
    if (this.y + this.radius > height || this.y - this.radius < 0) this.vy *= -1;
  }
}

const balls = [];
for (let i = 0; i < 4; i++) {
  balls.push(new Ball());
}

function animate() {
  ctx.clearRect(0, 0, width, height);
  balls.forEach(ball => {
    ball.update();
    ball.draw();
  });
  requestAnimationFrame(animate);
}
animate();

// När man klickar på en länk i mobilmenyn, stäng menyn
document.querySelectorAll('#mobile-menu a').forEach(link => {
  link.addEventListener('click', () => {
    const menu = document.getElementById('mobile-menu');
    const hamburger = document.querySelector('.hamburger');

    menu.classList.remove('show', 'open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');

    const desktopMenu = document.getElementById('desktop-menu');
    if (desktopMenu) {
      desktopMenu.style.display = 'block';
    }
  });
});
