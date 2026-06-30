/* ==========================================================================
   ООО «СТРОНГ» — PREMIUM LANDING PAGE JAVASCRIPT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================
     1. NAVIGATION & SCROLL EFFECTS
     ========================================== */
  const navbar = document.querySelector('.navbar');
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');

  // Navbar background change and scroll progress on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Scroll progress bar
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    const progBar = document.getElementById('scroll-progress');
    if (progBar) {
      progBar.style.width = scrollPercent + '%';
    }
  });

  // Mobile Menu Toggle
  let scrim = document.getElementById('nav-scrim');
  if (!scrim) {
    scrim = document.createElement('div');
    scrim.id = 'nav-scrim';
    scrim.style.position = 'fixed';
    scrim.style.inset = '0';
    scrim.style.background = 'rgba(12, 20, 32, 0.6)';
    scrim.style.backdropFilter = 'blur(4px)';
    scrim.style.webkitBackdropFilter = 'blur(4px)';
    scrim.style.zIndex = '999';
    scrim.style.opacity = '0';
    scrim.style.pointerEvents = 'none';
    scrim.style.transition = 'opacity 0.4s ease';
    document.body.appendChild(scrim);
  }

  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      if (isOpen) {
        scrim.style.opacity = '1';
        scrim.style.pointerEvents = 'auto';
        document.body.classList.add('menu-open');
      } else {
        scrim.style.opacity = '0';
        scrim.style.pointerEvents = 'none';
        document.body.classList.remove('menu-open');
      }
      
      // Toggle burger icon active state
      const spans = mobileToggle.querySelectorAll('span');
      if (spans.length >= 3) {
        spans[0].style.transform = isOpen ? 'rotate(45deg) translate(5px, 5.5px)' : 'none';
        spans[1].style.opacity = isOpen ? '0' : '1';
        spans[2].style.transform = isOpen ? 'rotate(-45deg) translate(5px, -5.5px)' : 'none';
      }
    });

    // Close menu when clicking backdrop scrim
    scrim.addEventListener('click', () => {
      navMenu.classList.remove('open');
      scrim.style.opacity = '0';
      scrim.style.pointerEvents = 'none';
      document.body.classList.remove('menu-open');
      
      const spans = mobileToggle.querySelectorAll('span');
      if (spans.length >= 3) {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      }
    });

    // Close menu when clicking link items
    const menuLinks = navMenu.querySelectorAll('a');
    menuLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        scrim.style.opacity = '0';
        scrim.style.pointerEvents = 'none';
        document.body.classList.remove('menu-open');
        
        const spans = mobileToggle.querySelectorAll('span');
        if (spans.length >= 3) {
          spans[0].style.transform = 'none';
          spans[1].style.opacity = '1';
          spans[2].style.transform = 'none';
        }
      });
    });
  }

  // Hero Background Parallax
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg) {
    window.addEventListener('scroll', () => {
      const scrollPos = window.scrollY;
      // translate background slightly slower than scroll
      heroBg.style.transform = `scale(1.05) translateY(${scrollPos * 0.15}px)`;
    });
  }


  /* ==========================================
     2. GLOBAL SCROLL REVEAL OBSERVER
     ========================================== */
  const revealElements = document.querySelectorAll('.reveal');
  
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // If it's a grid, we can trigger children stagger
        if (entry.target.classList.contains('reveal-stagger')) {
          const children = entry.target.children;
          Array.from(children).forEach((child, index) => {
            setTimeout(() => {
              child.classList.add('revealed');
              child.style.opacity = '1';
              child.style.transform = 'translateY(0)';
            }, index * 120);
          });
        }
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15
  });

  revealElements.forEach(el => revealObserver.observe(el));


  /* ==========================================
     3. SECTION 2: WHAT IS VENTILATED FACADE (SVG ANIMATION)
     ========================================== */
  const SEQ_FACADE = [
    ['g-anchor',  300,  'layer', -1],
    ['g-bracket', 500,  'layer',  0],
    ['lbl-br',    900,  'label', -1],
    ['g-insul',   1200, 'layer',  1],
    ['lbl-in',    1600, 'label', -1],
    ['g-mem',     2000, 'layer',  2],
    ['lbl-me',    2400, 'label', -1],
    ['g-rail',    2800, 'layer',  3],
    ['lbl-ra',    3200, 'label', -1],
    ['g-gap',     3600, 'layer',  4],
    ['lbl-ga',    4000, 'label', -1],
    ['g-clad',    4400, 'layer',  5],
    ['lbl-cl',    4800, 'label', -1],
    ['lbl-dim',   5200, 'label', -1],
  ];
  
  let facadeTimers = [];
  let facadeRunning = false;
  const facadeBtn = document.getElementById('facade-btn');

  function resetFacade() {
    facadeTimers.forEach(clearTimeout); 
    facadeTimers = [];
    document.querySelectorAll('.facade-section .lg').forEach(el => {
      el.style.transition = 'none';
      el.style.opacity = '0';
      el.style.transform = 'translateX(120px)';
    });
    document.querySelectorAll('.steps-dots .dot').forEach(d => d.classList.remove('active'));
    if (facadeBtn) facadeBtn.classList.remove('on');
  }

  function showFacadeLayer(id, type, dot) {
    const el = document.getElementById(id);
    if (!el) return;
    el.style.transition = type === 'layer'
      ? 'opacity 0.65s ease, transform 0.8s cubic-bezier(0.22,1,0.36,1)'
      : 'opacity 0.55s ease';
    el.style.opacity = '1';
    el.style.transform = 'translateX(0)';
    if (dot >= 0) { 
      const d = document.getElementById('d' + dot); 
      if (d) d.classList.add('active'); 
    }
  }

  function runFacadeAnimation() {
    resetFacade();
    const t0 = setTimeout(() => {
      SEQ_FACADE.forEach(([id, delay, type, dot]) => {
        facadeTimers.push(setTimeout(() => showFacadeLayer(id, type, dot), delay));
      });
      facadeTimers.push(setTimeout(() => {
        if (facadeBtn) facadeBtn.classList.add('on');
      }, 5700));
      // Auto cycle (12 seconds)
      facadeTimers.push(setTimeout(runFacadeAnimation, 14000));
    }, 150);
    facadeTimers.push(t0);
  }

  // Observe Facade section to start animation
  const facadeSection = document.querySelector('.facade-section');
  if (facadeSection) {
    const facadeObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !facadeRunning) {
        facadeRunning = true;
        setTimeout(runFacadeAnimation, 500);
        facadeObserver.unobserve(facadeSection);
      }
    }, { threshold: 0.25 });
    facadeObserver.observe(facadeSection);
  }

  // Replay click
  if (facadeBtn) {
    facadeBtn.addEventListener('click', () => {
      runFacadeAnimation();
    });
  }


  /* ==========================================
     4. SECTION 3: ADVANTAGES COUNT UP & REVEAL
     ========================================== */
  const bar = document.getElementById('bar');

  function countUp(elements) {
    elements.forEach(el => {
      const target = +el.dataset.target;
      const dur = 1800;
      const step = 16;
      const inc  = target / (dur / step);
      let cur = 0;
      const timer = setInterval(() => {
        cur = Math.min(cur + inc, target);
        el.textContent = Math.floor(cur) + (target === 150 ? '+' : '');
        if (cur >= target) clearInterval(timer);
      }, step);
    });
  }

  if (bar) {
    const barObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setTimeout(() => {
          bar.classList.add('visible');
          const countElements = bar.querySelectorAll('[data-target]');
          countUp(countElements);
        }, 200);
        barObserver.unobserve(bar);
      }
    }, { threshold: 0.3 });
    barObserver.observe(bar);
  }


  /* ==========================================
     5. SECTION 4: CLADDING TYPES SHOWCASE
     ========================================== */
  const claddingItems = document.querySelectorAll('.cladding-item');
  const svgPanels = document.querySelectorAll('.showcase-svg-panel');
  const showcaseNum = document.getElementById('showcase-num');
  const showcaseTitle = document.getElementById('showcase-title');
  const showcaseBadge = document.getElementById('showcase-badge');
  const showcaseListCol = document.querySelector('.showcase-list-col');

  if (claddingItems.length > 0) {
    claddingItems.forEach(item => {
      const triggerActive = () => {
        // Remove active class from all items
        claddingItems.forEach(i => i.classList.remove('active'));
        // Add active class to clicked/hovered item
        item.classList.add('active');

        const index = item.dataset.index;
        const num = item.dataset.num;
        const title = item.dataset.title;
        const badge = item.dataset.badge;

        // Update active SVG panel
        svgPanels.forEach(p => {
          p.classList.toggle('active', p.dataset.index === index);
        });

        // Update text labels
        if (showcaseNum) showcaseNum.textContent = num;
        if (showcaseTitle) showcaseTitle.textContent = title;
        if (showcaseBadge) showcaseBadge.textContent = badge;
      };

      // Hover triggers on desktop only
      item.addEventListener('mouseenter', () => {
        if (window.innerWidth > 990) {
          triggerActive();
        }
      });
      
      // Click always triggers
      item.addEventListener('click', triggerActive);
    });

    // Mobile horizontal scroll snapping active state detection
    if (showcaseListCol) {
      let isScrolling;
      showcaseListCol.addEventListener('scroll', () => {
        window.clearTimeout(isScrolling);
        isScrolling = setTimeout(() => {
          if (window.innerWidth <= 990) {
            const firstItem = showcaseListCol.querySelector('.cladding-item');
            if (!firstItem) return;
            const itemWidth = firstItem.offsetWidth + 15; // Width + gap (15px)
            const scrollIndex = Math.round(showcaseListCol.scrollLeft / itemWidth);
            const targetItem = claddingItems[scrollIndex];
            if (targetItem && !targetItem.classList.contains('active')) {
              targetItem.click();
            }
          }
        }, 100);
      });
    }
  }


  /* ==========================================
     6. SECTION 5: 3D FACADE ASSEMBLY SYSTEM
     ========================================== */
  // Layer configuration [assembled Z, exploded Z]
  const LAYERS = [
    { id: 'l0', az: 0,   ez: -260 },
    { id: 'l1', az: 24,  ez: -185 },
    { id: 'l2', az: 50,  ez: -115 },
    { id: 'l3', az: 80,  ez: -45  },
    { id: 'l4', az: 85,  ez: 10   },
    { id: 'l5', az: 108, ez: 65   },
    { id: 'l6', az: 130, ez: 120  },
  ];

  let assemblyTimers = [];
  const bExp = document.getElementById('bExp');
  const bAsm = document.getElementById('bAsm');
  const bRestart = document.getElementById('bRestart');
  const assemblyProg = document.getElementById('assembly-prog');

  function clrAssembly() {
    assemblyTimers.forEach(clearTimeout);
    assemblyTimers = [];
  }

  function setAssemblyLayer(id, z, opacity, ms) {
    const el = document.getElementById(id);
    if (!el) return;
    el.style.transition = `transform ${ms}ms cubic-bezier(0.22,1,0.36,1), opacity ${Math.round(ms * 0.7)}ms ease`;
    el.style.transform = `translateZ(${z}px)`;
    el.style.opacity = opacity;
  }

  function runAssemble() {
    clrAssembly();
    if (bAsm) bAsm.classList.add('on');
    if (bExp) bExp.classList.remove('on');
    if (assemblyProg) assemblyProg.style.width = '0%';
    
    document.querySelectorAll('.assembly-section .step').forEach(s => s.classList.remove('show', 'hl'));

    // Reset all layers to exploded state
    LAYERS.forEach(l => {
      const el = document.getElementById(l.id);
      if (el) {
        el.style.transition = 'none';
        el.style.transform = `translateZ(${l.ez}px)`;
        el.style.opacity = '0';
      }
    });

    setTimeout(() => {
      LAYERS.forEach((l, i) => {
        const delay = 200 + i * 280;
        assemblyTimers.push(setTimeout(() => {
          setAssemblyLayer(l.id, l.az, '1', 900);
          
          // Show step label
          const steps = document.querySelectorAll('.assembly-section .step');
          if (steps[i]) {
            setTimeout(() => steps[i].classList.add('show'), 280);
          }
          // Progress bar
          if (assemblyProg) {
            assemblyProg.style.width = `${Math.round((i + 1) / LAYERS.length * 100)}%`;
          }
        }, delay));
      });
    }, 80);
  }

  function runExplode() {
    clrAssembly();
    if (bExp) bExp.classList.add('on');
    if (bAsm) bAsm.classList.remove('on');
    clearAssemblyHl();

    LAYERS.forEach((l, i) => {
      assemblyTimers.push(setTimeout(() => {
        setAssemblyLayer(l.id, l.ez, '1', 700);
        // Show step label immediately as it explodes
        const steps = document.querySelectorAll('.assembly-section .step');
        if (steps[i]) {
          steps[i].classList.add('show');
        }
      }, i * 70));
    });
  }

  function highlightAssemblyLayer(idx) {
    clearAssemblyHl();
    const layerEl = document.getElementById('l' + idx);
    if (layerEl) layerEl.classList.add('active-hl');
    
    const steps = document.querySelectorAll('.assembly-section .step');
    if (steps[idx]) steps[idx].classList.add('hl');
  }

  function clearAssemblyHl() {
    LAYERS.forEach(l => {
      const el = document.getElementById(l.id);
      if (el) el.classList.remove('active-hl');
    });
    document.querySelectorAll('.assembly-section .step').forEach(s => s.classList.remove('hl'));
  }

  // Bind controls
  if (bAsm) bAsm.addEventListener('click', runAssemble);
  if (bExp) bExp.addEventListener('click', runExplode);
  if (bRestart) {
    bRestart.addEventListener('click', () => {
      clrAssembly();
      LAYERS.forEach(l => {
        const el = document.getElementById(l.id);
        if (el) {
          el.style.transition = 'none';
          el.style.opacity = '0';
        }
      });
      document.querySelectorAll('.assembly-section .step').forEach(s => s.classList.remove('show', 'hl'));
      if (assemblyProg) assemblyProg.style.width = '0%';
      if (bAsm) bAsm.classList.add('on');
      if (bExp) bExp.classList.remove('on');
      setTimeout(runAssemble, 300);
    });
  }

  // Interactive step clicks
  const stepElements = document.querySelectorAll('.assembly-section .step');
  stepElements.forEach(step => {
    step.addEventListener('click', () => {
      const idx = parseInt(step.dataset.i);
      highlightAssemblyLayer(idx);
    });
  });

  // Layer click handlers
  LAYERS.forEach((l, idx) => {
    const el = document.getElementById(l.id);
    if (el) {
      el.addEventListener('click', () => {
        highlightAssemblyLayer(idx);
      });
    }
  });

  // Observe assembly section to run auto-start
  const assemblySection = document.querySelector('.assembly-section');
  let assemblyTriggered = false;
  if (assemblySection) {
    const assemblyObserver = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && !assemblyTriggered) {
        assemblyTriggered = true;
        setTimeout(runExplode, 500);
        assemblyObserver.unobserve(assemblySection);
      }
    }, { threshold: 0.2 });
    assemblyObserver.observe(assemblySection);
  }


  /* ==========================================
     7. SECTION 6: SUBSTRUCTURE ANIMATION
     ========================================== */
  const substructureSection = document.querySelector('.substructure-section');
  const subBottom = document.getElementById('sub-bottom');
  
  if (substructureSection) {
    const subObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        const cards = substructureSection.querySelectorAll('.sub-card');
        cards.forEach((c, idx) => {
          setTimeout(() => c.classList.add('visible'), idx * 150);
        });
        subObserver.unobserve(substructureSection);
      }
    }, { threshold: 0.15 });
    subObserver.observe(substructureSection);
  }

  if (subBottom) {
    const subBottomObserver = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setTimeout(() => subBottom.classList.add('visible'), 200);
        subBottomObserver.unobserve(subBottom);
      }
    }, { threshold: 0.25 });
    subBottomObserver.observe(subBottom);
  }


  /* ==========================================
     8. SECTION 7: PORTFOLIO TABS & REVEAL
     ========================================== */
  const portTabBtns = document.querySelectorAll('.portfolio-tab');
  const portPanels = document.querySelectorAll('.portfolio-panel');

  portTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle tabs
      portTabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Toggle panels
      const targetPanelId = btn.dataset.target;
      portPanels.forEach(p => {
        p.classList.remove('active');
        if (p.id === targetPanelId) {
          p.classList.add('active');
          // Trigger reveals inside the panel
          revealPortfolioCards(p);
        }
      });
    });
  });

  function revealPortfolioCards(panel) {
    const cards = panel.querySelectorAll('.case-card, .masonry-card');
    cards.forEach((c, idx) => {
      setTimeout(() => {
        c.classList.add('revealed');
        c.style.opacity = '1';
        c.style.transform = 'translateY(0)';
      }, idx * 60);
    });
  }

  // Observe Portfolio Section to reveal first panel cards
  const portfolioSection = document.querySelector('#portfolio');
  let portfolioRevealed = false;
  if (portfolioSection) {
    const portObserver = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && !portfolioRevealed) {
        portfolioRevealed = true;
        const activePanel = document.querySelector('.portfolio-panel.active');
        if (activePanel) revealPortfolioCards(activePanel);
        portObserver.unobserve(portfolioSection);
      }
    }, { threshold: 0.1 });
    portObserver.observe(portfolioSection);
  }

  // completed portfolio expander logic (real expansion)
  const showAllBtn = document.getElementById('show-all-portfolio');
  if (showAllBtn) {
    showAllBtn.addEventListener('click', () => {
      const hiddenCards = document.querySelectorAll('.masonry-card.hidden-card');
      hiddenCards.forEach((c, idx) => {
        setTimeout(() => {
          c.classList.remove('hidden-card');
          c.classList.add('show-card');
        }, idx * 60);
      });
      showAllBtn.parentElement.style.display = 'none'; // Hide button container
    });
  }


  /* ==========================================
     9. SECTION 8a: COUNTERS (ABOUT COMPANY STATS)
     ========================================== */
  const aboutStatsSection = document.querySelector('.about-stats');
  if (aboutStatsSection) {
    const aboutObserver = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        const counters = aboutStatsSection.querySelectorAll('.stat-num');
        counters.forEach(c => {
          const target = parseInt(c.dataset.target);
          if (isNaN(target)) return; // skip range values like "70–150"
          const isYear = c.dataset.year === 'true';
          const plus = c.dataset.plus === 'true';
          
          let cur = isYear ? 1990 : 0;
          const dur = 2000;
          const step = 20;
          const inc = (target - cur) / (dur / step);
          
          const timer = setInterval(() => {
            cur += inc;
            c.textContent = Math.floor(cur) + (plus ? '+' : '');
            if (cur >= target) {
              clearInterval(timer);
              c.textContent = target + (plus ? '+' : '');
            }
          }, step);
        });
        aboutObserver.unobserve(aboutStatsSection);
      }
    }, { threshold: 0.3 });
    aboutObserver.observe(aboutStatsSection);
  }

  // Observe About values cards
  const aboutInfoSection = document.querySelector('.about-info');
  if (aboutInfoSection) {
    const aboutInfoObserver = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        const valCards = aboutInfoSection.querySelectorAll('.value-card');
        valCards.forEach((c, idx) => {
          setTimeout(() => c.classList.add('revealed'), idx * 120);
        });
        aboutInfoObserver.unobserve(aboutInfoSection);
      }
    }, { threshold: 0.15 });
    aboutInfoObserver.observe(aboutInfoSection);
  }


  /* ==========================================
     10. SECTION 9: PARTNERS (DUPLICATE TO FIT INFINITE SCROLL)
     ========================================== */
  const partnersMarquee = document.querySelector('.partners-marquee');
  if (partnersMarquee) {
    // Duplicate children to ensure smooth infinite loop
    const children = Array.from(partnersMarquee.children);
    children.forEach(child => {
      const clone = child.cloneNode(true);
      partnersMarquee.appendChild(clone);
    });
  }


  /* ==========================================
     11. SECTION 10: CTA FORM VALIDATION
     ========================================== */
  const ctaForm = document.getElementById('cta-form');
  const formSuccess = document.getElementById('form-success');

  if (ctaForm) {
    ctaForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('form-name').value.trim();
      const phone = document.getElementById('form-phone').value.trim();
      const type = document.getElementById('form-type').value;
      const area = document.getElementById('form-area').value.trim();

      if (!name || !phone || !type || !area) {
        alert('Пожалуйста, заполните все обязательные поля.');
        return;
      }

      // Check phone format (basic Russian format checking)
      const phoneRegex = /^(\+7|7|8)?[\s\-]?\(?[0-9]{3}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/;
      if (!phoneRegex.test(phone)) {
        alert('Пожалуйста, введите корректный номер телефона (например: +7 (999) 123-45-67).');
        return;
      }

      // Success animation
      ctaForm.style.display = 'none';
      formSuccess.style.display = 'block';
    });
  }
});
