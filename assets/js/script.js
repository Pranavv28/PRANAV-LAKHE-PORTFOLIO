/**
 * Pranav Lakhe Portfolio — Interactive Scripts
 * Stack: Vanilla ES6+ JavaScript
 * Features: 3D Wireframe Canvas, 3D Stacked Deck, Card Tilt, Lightbox, CGPA Counter, EmailJS Integration
 */

(() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  const $ = (selector, parent = document) => parent.querySelector(selector);
  const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

  /* -------------------------------------------------------------
   * 1. CONFIGURATION: EmailJS & Themes
   * ----------------------------------------------------------- */
  const EMAILJS_CONFIG = {
    publicKey: 'YOUR_PUBLIC_KEY',   // Replace with your EmailJS Public Key
    serviceId: 'YOUR_SERVICE_ID',   // Replace with your EmailJS Service ID
    templateId: 'YOUR_TEMPLATE_ID'   // Replace with your EmailJS Template ID
  };

  const THEMES = [
    { id: 'emerald', name: 'Quantum Emerald', desc: 'Mint & Sage', swatch: '#A7F3D0' },
    { id: 'pearl', name: 'Minimal Pearl', desc: 'Pure Silk', swatch: '#E4E4E7' },
    { id: 'violet', name: 'Plasma Violet', desc: 'Lavender Aura', swatch: '#DDD6FE' },
    { id: 'amber', name: 'Solar Amber', desc: 'Golden Hour', swatch: '#FDE68A' },
    { id: 'cyan', name: 'Arctic Cyan', desc: 'Glacial Breeze', swatch: '#BAE6FD' },
    { id: 'rose', name: 'Sunset Rose', desc: 'Cashmere Peach', swatch: '#FECDD3' }
  ];

  // Set current year in footer
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* -------------------------------------------------------------
   * 1B. AESTHETIC THEME SWITCHER & AUTO MORPH
   * ----------------------------------------------------------- */
  const themeToggleBtn = $('#themeToggleBtn');
  const themeDropdown = $('#themeDropdown');
  const themeOptionsContainer = $('#themeOptions');
  const themeAutoToggle = $('#themeAutoToggle');

  let currentTheme = localStorage.getItem('pranav_portfolio_theme') || 'emerald';
  let isAutoMorphActive = localStorage.getItem('pranav_portfolio_automorph') === 'true';
  let autoMorphTimer = null;

  const applyTheme = (themeId) => {
    currentTheme = themeId;
    document.documentElement.dataset.theme = themeId;
    localStorage.setItem('pranav_portfolio_theme', themeId);

    // Update active state in dropdown
    if (themeOptionsContainer) {
      $$('.theme-opt-btn', themeOptionsContainer).forEach(btn => {
        btn.classList.toggle('active', btn.dataset.themeId === themeId);
      });
    }
  };

  // Render Theme Buttons inside Dropdown
  if (themeOptionsContainer) {
    themeOptionsContainer.innerHTML = '';
    THEMES.forEach(t => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `theme-opt-btn ${t.id === currentTheme ? 'active' : ''}`;
      btn.dataset.themeId = t.id;
      btn.innerHTML = `
        <span class="theme-swatch" style="background-color: ${t.swatch};"></span>
        <span class="theme-name">${t.name}</span>
      `;
      btn.addEventListener('click', () => {
        applyTheme(t.id);
        // Disable auto morph when user manually chooses
        if (isAutoMorphActive) toggleAutoMorph(false);
      });
      themeOptionsContainer.appendChild(btn);
    });
  }

  // Toggle Dropdown
  if (themeToggleBtn && themeDropdown) {
    themeToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isHidden = themeDropdown.hidden;
      themeDropdown.hidden = !isHidden;
      themeToggleBtn.setAttribute('aria-expanded', String(isHidden));
    });

    document.addEventListener('click', (e) => {
      if (!themeDropdown.hidden && !themeDropdown.contains(e.target) && !themeToggleBtn.contains(e.target)) {
        themeDropdown.hidden = true;
        themeToggleBtn.setAttribute('aria-expanded', 'false');
      }
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !themeDropdown.hidden) {
        themeDropdown.hidden = true;
        themeToggleBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Auto Morph Functionality
  const cycleNextTheme = () => {
    const currentIndex = THEMES.findIndex(t => t.id === currentTheme);
    const nextIndex = (currentIndex + 1) % THEMES.length;
    applyTheme(THEMES[nextIndex].id);
  };

  const toggleAutoMorph = (forceState) => {
    isAutoMorphActive = typeof forceState === 'boolean' ? forceState : !isAutoMorphActive;
    localStorage.setItem('pranav_portfolio_automorph', String(isAutoMorphActive));

    if (themeAutoToggle) {
      themeAutoToggle.classList.toggle('active', isAutoMorphActive);
    }

    if (isAutoMorphActive) {
      if (!autoMorphTimer) {
        autoMorphTimer = setInterval(cycleNextTheme, 12000);
      }
    } else {
      if (autoMorphTimer) {
        clearInterval(autoMorphTimer);
        autoMorphTimer = null;
      }
    }
  };

  if (themeAutoToggle) {
    themeAutoToggle.addEventListener('click', () => toggleAutoMorph());
  }

  // Initialize theme and auto-morph
  applyTheme(currentTheme);
  if (isAutoMorphActive) {
    toggleAutoMorph(true);
  }

  /* -------------------------------------------------------------
   * 1C. LIVE INTERACTIVE CURSOR SPOTLIGHT AURA
   * ----------------------------------------------------------- */
  const auraCursor = $('#auraCursor');
  if (auraCursor && !reduceMotion && !isTouchDevice) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let auraX = mouseX;
    let auraY = mouseY;
    let isMouseInWindow = true;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isMouseInWindow) {
        isMouseInWindow = true;
        auraCursor.style.opacity = '0.85';
      }
    }, { passive: true });

    document.addEventListener('mouseleave', () => {
      isMouseInWindow = false;
      auraCursor.style.opacity = '0';
    });

    const updateAura = () => {
      auraX += (mouseX - auraX) * 0.08;
      auraY += (mouseY - auraY) * 0.08;
      auraCursor.style.left = `${auraX}px`;
      auraCursor.style.top = `${auraY}px`;
      requestAnimationFrame(updateAura);
    };

    requestAnimationFrame(updateAura);
  }

  /* -------------------------------------------------------------
   * 2. SCROLL REVEAL (IntersectionObserver with Stagger)
   * ----------------------------------------------------------- */
  const revealElements = $$('.reveal');
  revealElements.forEach((el, index) => {
    el.style.setProperty('--d', `${(index % 4) * 85}ms`);
  });

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          // Keep observing timeline dots for scroll tracking
          if (!entry.target.classList.contains('t-item')) {
            revealObserver.unobserve(entry.target);
          }
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('in'));
  }

  /* -------------------------------------------------------------
   * 3. SCROLL PROGRESS & ACTIVE NAVIGATION
   * ----------------------------------------------------------- */
  const progressBar = $('#progress');
  const navLinks = $$('#navLinks a');
  const sections = navLinks
    .map(link => {
      const hash = link.getAttribute('href');
      return hash.startsWith('#') ? $(hash) : null;
    })
    .filter(Boolean);

  const handleScroll = () => {
    const docEl = document.documentElement;
    const scrollTop = docEl.scrollTop || document.body.scrollTop;
    const scrollHeight = docEl.scrollHeight - docEl.clientHeight;

    // Update progress bar
    if (progressBar && scrollHeight > 0) {
      const progress = (scrollTop / scrollHeight) * 100;
      progressBar.style.width = `${progress}%`;
    }

    // Highlight active section link
    let currentSection = sections[0];
    const scrollTriggerPosition = scrollTop + 160;

    sections.forEach(section => {
      if (section.offsetTop <= scrollTriggerPosition) {
        currentSection = section;
      }
    });

    if (currentSection) {
      navLinks.forEach(link => {
        const targetId = link.getAttribute('href').replace('#', '');
        link.classList.toggle('active', currentSection.id === targetId);
      });
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  /* -------------------------------------------------------------
   * 4. MOBILE HAMBURGER MENU
   * ----------------------------------------------------------- */
  const burger = $('#burger');
  const navMenu = $('#navLinks');

  if (burger && navMenu) {
    burger.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      burger.setAttribute('aria-expanded', String(isOpen));
    });

    // Close when clicking any nav link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
      });
    });

    // Close when clicking outside menu
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !burger.contains(e.target) && navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
      }
    });
  }



  /* -------------------------------------------------------------
   * 6. SUBTLE 3D TILT ON CARDS (Desktop, Max 5deg)
   * ----------------------------------------------------------- */
  if (!reduceMotion && !isTouchDevice) {
    const tiltCards = $$('.t-card, .cert');
    tiltCards.forEach(card => {
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `translateY(-6px) perspective(900px) rotateX(${-py * 5}deg) rotateY(${px * 5}deg)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  /* -------------------------------------------------------------
   * 7A. PROJECT CATEGORY TABS (SOFTWARE VS HARDWARE)
   * ----------------------------------------------------------- */
  const tabSoftwareBtn = $('#tabSoftwareBtn');
  const tabHardwareBtn = $('#tabHardwareBtn');
  const viewSoftware = $('#viewSoftware');
  const viewHardware = $('#viewHardware');

  const switchProjectCategory = (category) => {
    const isSoftware = category === 'software';

    if (tabSoftwareBtn && tabHardwareBtn && viewSoftware && viewHardware) {
      tabSoftwareBtn.classList.toggle('active', isSoftware);
      tabSoftwareBtn.setAttribute('aria-selected', String(isSoftware));

      tabHardwareBtn.classList.toggle('active', !isSoftware);
      tabHardwareBtn.setAttribute('aria-selected', String(!isSoftware));

      if (isSoftware) {
        viewSoftware.hidden = false;
        viewSoftware.classList.add('active');
        viewHardware.hidden = true;
        viewHardware.classList.remove('active');
      } else {
        viewSoftware.hidden = true;
        viewSoftware.classList.remove('active');
        viewHardware.hidden = false;
        viewHardware.classList.add('active');
      }
    }
  };

  if (tabSoftwareBtn && tabHardwareBtn) {
    tabSoftwareBtn.addEventListener('click', () => switchProjectCategory('software'));
    tabHardwareBtn.addEventListener('click', () => switchProjectCategory('hardware'));

    // Keyboard navigation (ArrowLeft / ArrowRight) for tabs
    [tabSoftwareBtn, tabHardwareBtn].forEach(tab => {
      tab.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
          e.preventDefault();
          if (tab === tabSoftwareBtn) {
            tabHardwareBtn.focus();
            switchProjectCategory('hardware');
          } else {
            tabSoftwareBtn.focus();
            switchProjectCategory('software');
          }
        }
      });
    });

    // Handle deep-link hash (e.g. #hardware or #hardware-flashcard)
    if (window.location.hash === '#hardware' || window.location.hash === '#hardware-flashcard') {
      switchProjectCategory('hardware');
    }
  }

  /* -------------------------------------------------------------
   * 7B. 3D STACKED PROJECT DECK
   * ----------------------------------------------------------- */
  const deck = $('#deck');
  if (deck) {
    const projectCards = $$('.proj', deck);
    let order = [...projectCards];
    const totalProjects = projectCards.length;
    const countEl = $('#count');
    const dotsContainer = $('#deckDots');
    let isTransitioning = false;

    // Generate indicator dots
    if (dotsContainer) {
      dotsContainer.innerHTML = '';
      projectCards.forEach((_, idx) => {
        const dot = document.createElement('span');
        dot.className = `deck-dot ${idx === 0 ? 'active' : ''}`;
        dot.setAttribute('aria-label', `Go to project ${idx + 1}`);
        dot.addEventListener('click', () => jumpTo(idx));
        dotsContainer.appendChild(dot);
      });
    }

    const updateDots = (activeIndex) => {
      if (!dotsContainer) return;
      const dots = $$('.deck-dot', dotsContainer);
      dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === activeIndex);
      });
    };

    const paintDeck = () => {
      order.forEach((card, i) => {
        card.style.setProperty('--i', Math.min(i, 3));
        card.dataset.hidden = i > 2 ? 'true' : 'false';
      });

      const topCard = order[0];
      const realIndex = parseInt(topCard.dataset.index, 10);
      if (countEl) countEl.textContent = `${realIndex + 1} / ${totalProjects}`;
      updateDots(realIndex);
    };

    const nextProject = () => {
      if (isTransitioning) return;
      isTransitioning = true;
      const top = order[0];
      top.classList.add('leaving');

      setTimeout(() => {
        top.classList.remove('leaving');
        order.push(order.shift());
        paintDeck();
        isTransitioning = false;
      }, reduceMotion ? 0 : 420);
    };

    const prevProject = () => {
      if (isTransitioning) return;
      isTransitioning = true;
      order.unshift(order.pop());
      paintDeck();
      setTimeout(() => {
        isTransitioning = false;
      }, 50);
    };

    const jumpTo = (targetIndex) => {
      if (isTransitioning) return;
      const currentTopIndex = parseInt(order[0].dataset.index, 10);
      if (currentTopIndex === targetIndex) return;

      while (parseInt(order[0].dataset.index, 10) !== targetIndex) {
        order.push(order.shift());
      }
      paintDeck();
    };

    // Button controls
    const nextBtn = $('#next');
    const prevBtn = $('#prev');
    if (nextBtn) nextBtn.addEventListener('click', nextProject);
    if (prevBtn) prevBtn.addEventListener('click', prevProject);

    // Touch swipe gestures
    let touchStartX = null;
    let touchStartY = null;

    deck.addEventListener('touchstart', e => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }, { passive: true });

    deck.addEventListener('touchend', e => {
      if (touchStartX === null || touchStartY === null) return;
      const diffX = e.changedTouches[0].clientX - touchStartX;
      const diffY = e.changedTouches[0].clientY - touchStartY;

      // Only trigger if horizontal swipe is dominant and exceeds 45px
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 45) {
        if (diffX < 0) {
          nextProject(); // Swiped left -> next card
        } else {
          prevProject(); // Swiped right -> previous card
        }
      }
      touchStartX = null;
      touchStartY = null;
    }, { passive: true });

    // Keyboard navigation when hovering deck
    deck.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        nextProject();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        prevProject();
      }
    });

    paintDeck();
  }

  /* -------------------------------------------------------------
   * 8. CERTIFICATES LIGHTBOX PREVIEW
   * ----------------------------------------------------------- */
  const lightbox = $('#lightbox');
  const lbImg = $('#lbImg');
  const lbTitle = $('#lbTitle');
  const lbMeta = $('#lbMeta');
  const lbClose = $('#lbClose');
  const lbActionWrap = $('#lbActionWrap');
  const lbActionBtn = $('#lbActionBtn');

  const openLightbox = (imgSrc, title, issuer, date, link) => {
    if (!lightbox || !lbImg) return;
    lbImg.src = imgSrc;
    lbImg.alt = title || 'Verified Certificate';
    if (lbTitle) lbTitle.textContent = title || 'Certificate Preview';
    if (lbMeta) lbMeta.textContent = `${issuer || ''} ${issuer && date ? '·' : ''} ${date || ''}`;

    if (lbActionWrap && lbActionBtn) {
      if (link) {
        lbActionBtn.href = link;
        lbActionWrap.style.display = 'block';
      } else {
        lbActionWrap.style.display = 'none';
        lbActionBtn.href = '#';
      }
    }

    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
    if (lbClose) lbClose.focus();
  };

  const closeLightbox = () => {
    if (!lightbox || !lbImg) return;
    lightbox.hidden = true;
    lbImg.src = '';
    if (lbActionWrap) lbActionWrap.style.display = 'none';
    document.body.style.overflow = '';
  };

  $$('.cert, .t-img-wrap, .hw-photo-card, .t-cert-wrap').forEach(el => {
    const handleTrigger = (e) => {
      if (e.target.closest('a')) return;
      const imgSrc = el.dataset.img;
      const title = el.dataset.title;
      const issuer = el.dataset.issuer;
      const date = el.dataset.date;
      const link = el.dataset.link;
      if (imgSrc) openLightbox(imgSrc, title, issuer, date, link);
    };

    el.addEventListener('click', handleTrigger);
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        if (e.target.closest('a')) return;
        e.preventDefault();
        handleTrigger(e);
      }
    });
  });

  if (lbClose) lbClose.addEventListener('click', closeLightbox);

  if (lightbox) {
    lightbox.addEventListener('click', e => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  window.addEventListener('keydown', e => {
    if (e.key === 'Escape' && lightbox && !lightbox.hidden) {
      closeLightbox();
    }
  });

  /* -------------------------------------------------------------
   * 8B. COURSEWORK 3D FLASH CARD (ARDUINO RADAR) FLIP INTERACTION
   * ----------------------------------------------------------- */
  const hardwareFlashCard = $('#hardwareFlashCard');
  const flashFlipBtns = $$('.flash-flip-btn');

  if (hardwareFlashCard && flashFlipBtns.length > 0) {
    flashFlipBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const isFlipped = hardwareFlashCard.classList.toggle('flipped');
        flashFlipBtns.forEach(b => b.setAttribute('aria-expanded', String(isFlipped)));
      });
    });
  }

  /* -------------------------------------------------------------
   * 9. CGPA ANIMATION & PROGRESS BAR
   * ----------------------------------------------------------- */
  const cgpaNumEl = $('#cgpaNum');
  const cgpaBarEl = $('#cgpaBar');

  if (cgpaNumEl && cgpaBarEl) {
    const targetCgpa = parseFloat(cgpaNumEl.dataset.cgpa) || 7.53;
    let animated = false;

    const animateCgpa = () => {
      if (animated) return;
      animated = true;

      // Fill bar
      const percent = Math.min(100, Math.max(0, (targetCgpa / 10) * 100));
      cgpaBarEl.style.width = `${percent}%`;

      // Counter animation
      if (!reduceMotion) {
        let current = 0;
        const duration = 1200;
        const startTime = performance.now();

        const updateCounter = (currentTime) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(1, elapsed / duration);
          // Ease-out expo
          const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
          const val = easeProgress * targetCgpa;
          cgpaNumEl.textContent = val.toFixed(2);

          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          } else {
            cgpaNumEl.textContent = targetCgpa.toFixed(2);
          }
        };

        requestAnimationFrame(updateCounter);
      } else {
        cgpaNumEl.textContent = targetCgpa.toFixed(2);
      }
    };

    if ('IntersectionObserver' in window) {
      const cgpaObserver = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          animateCgpa();
          cgpaObserver.disconnect();
        }
      }, { threshold: 0.3 });
      cgpaObserver.observe(cgpaNumEl);
    } else {
      animateCgpa();
    }
  }

  /* -------------------------------------------------------------
   * 9B. SEMESTER-WISE GPA BREAKDOWN TOGGLE
   * ----------------------------------------------------------- */
  const semToggleBtn = $('#semToggleBtn');
  const semBreakdownDrawer = $('#semBreakdownDrawer');
  const semToggleText = $('#semToggleText');

  if (semToggleBtn && semBreakdownDrawer) {
    semToggleBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const isExpanded = semToggleBtn.getAttribute('aria-expanded') === 'true';
      semToggleBtn.setAttribute('aria-expanded', String(!isExpanded));
      semBreakdownDrawer.hidden = isExpanded;
      if (semToggleText) {
        semToggleText.textContent = !isExpanded ? 'Hide Semester Breakdown' : 'View Semester-Wise GPA';
      }
    });
  }

  /* -------------------------------------------------------------
   * 10. CONTACT FORM (EmailJS + Graceful Mailto Fallback)
   * ----------------------------------------------------------- */
  const contactForm = $('#contactForm');
  const statusEl = $('#status');
  const sendBtn = $('#sendBtn');
  const sendLabel = $('#sendLabel');

  const isEmailJsConfigured = EMAILJS_CONFIG.publicKey !== 'YOUR_PUBLIC_KEY' &&
    EMAILJS_CONFIG.serviceId !== 'YOUR_SERVICE_ID' &&
    EMAILJS_CONFIG.templateId !== 'YOUR_TEMPLATE_ID';

  if (isEmailJsConfigured && window.emailjs) {
    window.emailjs.init({ publicKey: EMAILJS_CONFIG.publicKey });
  }

  const setFormStatus = (message, type = '') => {
    if (!statusEl) return;
    statusEl.textContent = message;
    statusEl.className = `status ${type}`;
  };

  if (contactForm) {
    contactForm.addEventListener('submit', async e => {
      e.preventDefault();
      const formData = new FormData(contactForm);
      const data = Object.fromEntries(formData.entries());

      // Honeypot spam test
      if (data.company) return;

      const name = (data.from_name || '').trim();
      const email = (data.reply_to || '').trim();
      const message = (data.message || '').trim();

      // Form validation
      if (!name) {
        return setFormStatus('Please enter your name.', 'err');
      }
      if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
        return setFormStatus('Please enter a valid email address.', 'err');
      }
      if (!message || message.length < 6) {
        return setFormStatus('Please enter a message (at least 6 characters).', 'err');
      }

      // If EmailJS is not yet configured with real API keys, fall back seamlessly to mailto:
      if (!isEmailJsConfigured || !window.emailjs) {
        const subject = encodeURIComponent(`Portfolio Message from ${name}`);
        const body = encodeURIComponent(`${message}\n\nFrom: ${name} (${email})`);
        window.location.href = `mailto:pranavlakhe1@gmail.com?subject=${subject}&body=${body}`;
        setFormStatus('Opening your default email client to send message…', 'ok');
        return;
      }

      // Send via EmailJS
      if (sendBtn) sendBtn.disabled = true;
      if (sendLabel) sendLabel.textContent = 'Sending…';
      setFormStatus('');

      try {
        await window.emailjs.send(
          EMAILJS_CONFIG.serviceId,
          EMAILJS_CONFIG.templateId,
          {
            from_name: name,
            reply_to: email,
            message: message
          }
        );
        setFormStatus('Thank you! Your message was sent successfully.', 'ok');
        contactForm.reset();
      } catch (err) {
        console.error('EmailJS Error:', err);
        setFormStatus('Unable to send message directly. Please email me at pranavlakhe1@gmail.com.', 'err');
      } finally {
        if (sendBtn) sendBtn.disabled = false;
        if (sendLabel) sendLabel.textContent = 'Send Message';
      }
    });
  }

  /* -------------------------------------------------------------
   * 11. SMOOTH BACK TO TOP
   * ----------------------------------------------------------- */
  const backToTopBtn = $('#backToTop');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', e => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: reduceMotion ? 'auto' : 'smooth'
      });
    });
  }

})();
