document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================
     1. MOBILE NAVIGATION MENU
     ========================================== */
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileMenu = document.getElementById('mobile-menu-sidebar');

  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      
      // Transform hamburger lines
      const span1 = mobileToggle.querySelector('span:nth-child(1)');
      const span2 = mobileToggle.querySelector('span:nth-child(2)');
      const span3 = mobileToggle.querySelector('span:nth-child(3)');
      
      if (mobileToggle.classList.contains('active')) {
        span1.style.transform = 'translateY(8px) rotate(45deg)';
        span2.style.opacity = '0';
        span3.style.transform = 'translateY(-8px) rotate(-45deg)';
      } else {
        span1.style.transform = 'none';
        span2.style.opacity = '1';
        span3.style.transform = 'none';
      }
    });

    // Close mobile menu on click links
    const mobileLinks = mobileMenu.querySelectorAll('.mobile-link');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.classList.remove('active');
        mobileMenu.classList.remove('active');
        const span1 = mobileToggle.querySelector('span:nth-child(1)');
        const span2 = mobileToggle.querySelector('span:nth-child(2)');
        const span3 = mobileToggle.querySelector('span:nth-child(3)');
        span1.style.transform = 'none';
        span2.style.opacity = '1';
        span3.style.transform = 'none';
      });
    });
  }


  /* ==========================================
     2. HERO NODE TOOLTIPS
     ========================================== */
  const heroNodes = document.querySelectorAll('.hero-node');
  const mockupTooltip = document.getElementById('mockup-tooltip');

  if (heroNodes.length > 0 && mockupTooltip) {
    heroNodes.forEach(node => {
      node.addEventListener('mouseenter', () => {
        const text = node.dataset.tooltip;
        mockupTooltip.textContent = text;
        mockupTooltip.style.opacity = '1';
        mockupTooltip.style.transform = 'translateX(-50%) translateY(-5px)';
      });

      node.addEventListener('mouseleave', () => {
        mockupTooltip.style.opacity = '0.7';
        mockupTooltip.textContent = 'Наведите на точки чертежа';
        mockupTooltip.style.transform = 'translateX(-50%) translateY(0)';
      });
    });
  }


  /* ==========================================
     3. X-RAY INTERACTIVE HOTSPOTS LOGIC
     ========================================== */
  const xrayLayers = {
    wall: {
      num: '01',
      title: 'Несущая стена здания',
      desc: 'Железобетон, кирпич, пеноблок или монолит. Служит силовым скелетом здания. От прочности стены зависит выбор крепежных анкеров. Мы обязательно замеряем нагрузку на вырыв перед сборкой каркаса.',
      specs: [
        { label: 'Минимальный класс', val: 'Бетон B15 / Кирпич M100' },
        { label: 'Тестирование анкера', val: 'Обязательный замер на объекте' },
        { label: 'Подготовка стены', val: 'Не требуется выравнивание и сушка' }
      ]
    },
    insulation: {
      num: '02',
      title: 'Минераловатный утеплитель',
      desc: 'Двухслойное негорючее утепление из каменной ваты плотностью 80-110 кг/м³. Защищает здание от перемерзания зимой и перегрева летом. Крепится тарельчатыми дюбелями («грибами»).',
      specs: [
        { label: 'Толщина слоя', val: '50 - 150 мм (по теплорасчету)' },
        { label: 'Плотность слоев', val: 'Внутренний 45 кг/м³, Внешний 90 кг/м³' },
        { label: 'Класс горючести', val: 'НГ (полностью негорючий)' }
      ]
    },
    airgap: {
      num: '03',
      title: 'Вентилируемый зазор',
      desc: 'Воздушный буфер шириной от 40 до 60 мм между утеплителем и панелью. За счет разности давлений возникает постоянный восходящий поток воздуха, который выводит излишки влаги и точку росы наружу.',
      specs: [
        { label: 'Размер зазора', val: 'Минимум 40 мм (по ГОСТ)' },
        { label: 'Физический эффект', val: 'Восходящая тяга (эффект трубы)' },
        { label: 'Защита от влаги', val: 'Исключает конденсат и плесень' }
      ]
    },
    substructure: {
      num: '04',
      title: 'Каркас подконструкции',
      desc: 'Сетка фасадных кронштейнов и профилей (Г-образных, Т-образных). Изготавливается из оцинкованной стали с полимерным слоем, алюминия или нержавеющей стали. Компенсирует кривизну стен до 120 мм.',
      specs: [
        { label: 'Срок службы', val: 'От 30 до 50+ лет' },
        { label: 'Компенсация кривизны', val: 'Телескопические кронштейны' },
        { label: 'Материалы каркаса', val: 'Оцинковка, Алюминий, Нержавейка' }
      ]
    },
    cladding: {
      num: '05',
      title: 'Облицовочные панели',
      desc: 'Декоративный защитный слой: керамогранит, металлокассеты, натуральный камень или фиброцементные плиты. Предохраняет внутренние слои от дождя, снега, механических ударов и УФ-лучей.',
      specs: [
        { label: 'Форматы панелей', val: 'От 600х600мм до 1200х3000мм' },
        { label: 'Ударопрочность', val: 'Защита от вандализма и града' },
        { label: 'Срок службы', val: 'до 100 лет (для камня)' }
      ]
    }
  };

  const hotspots = document.querySelectorAll('.hotspot');
  const xrayNum = document.getElementById('xray-num');
  const xrayTitle = document.getElementById('xray-title');
  const xrayDesc = document.getElementById('xray-desc');
  const xraySpecsList = document.getElementById('xray-specs-list');
  const xrayPrev = document.querySelector('.xray-prev');
  const xrayNext = document.querySelector('.xray-next');
  const xrayIndicator = document.querySelector('.xray-indicator');

  let currentLayerIndex = 0;
  const layerKeys = Object.keys(xrayLayers);

  const updateXrayDisplay = (key) => {
    const data = xrayLayers[key];
    if (!data) return;

    // Transition effect
    const detailsCard = document.querySelector('.xray-details-card');
    if (detailsCard) {
      detailsCard.style.opacity = '0.3';
      detailsCard.style.transform = 'translateY(10px)';
    }

    setTimeout(() => {
      if (xrayNum) xrayNum.textContent = data.num;
      if (xrayTitle) xrayTitle.textContent = data.title;
      if (xrayDesc) xrayDesc.textContent = data.desc;

      if (xraySpecsList) {
        xraySpecsList.innerHTML = '';
        data.specs.forEach(spec => {
          const li = document.createElement('li');
          li.innerHTML = `<span>${spec.label}:</span> <strong>${spec.val}</strong>`;
          xraySpecsList.appendChild(li);
        });
      }

      if (xrayIndicator) {
        xrayIndicator.textContent = `${parseInt(data.num)} / ${layerKeys.length}`;
      }

      // Update hotspot buttons active states
      hotspots.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.layer === key);
      });

      if (detailsCard) {
        detailsCard.style.opacity = '1';
        detailsCard.style.transform = 'translateY(0)';
      }
    }, 250);
  };

  if (hotspots.length > 0) {
    hotspots.forEach(btn => {
      btn.addEventListener('click', () => {
        const key = btn.dataset.layer;
        currentLayerIndex = layerKeys.indexOf(key);
        updateXrayDisplay(key);
      });
    });

    if (xrayPrev && xrayNext) {
      xrayPrev.addEventListener('click', () => {
        currentLayerIndex = (currentLayerIndex - 1 + layerKeys.length) % layerKeys.length;
        updateXrayDisplay(layerKeys[currentLayerIndex]);
      });

      xrayNext.addEventListener('click', () => {
        currentLayerIndex = (currentLayerIndex + 1) % layerKeys.length;
        updateXrayDisplay(layerKeys[currentLayerIndex]);
      });
    }
  }


  /* ==========================================
     4. CINEMATIC SLIDER TRACK LOGIC
     ========================================== */
  const slides = document.querySelectorAll('.cladding-slide');
  const slidePrev = document.getElementById('slide-prev');
  const slideNext = document.getElementById('slide-next');
  let currentSlideIndex = 0;

  const updateSlides = (newIndex) => {
    if (slides.length === 0) return;
    
    // Deactivate current slide
    slides[currentSlideIndex].classList.remove('active');
    
    // Update index
    currentSlideIndex = newIndex;
    if (currentSlideIndex >= slides.length) currentSlideIndex = 0;
    if (currentSlideIndex < 0) currentSlideIndex = slides.length - 1;

    // Activate new slide
    slides[currentSlideIndex].classList.add('active');
  };

  if (slidePrev && slideNext && slides.length > 0) {
    slidePrev.addEventListener('click', () => {
      updateSlides(currentSlideIndex - 1);
    });

    slideNext.addEventListener('click', () => {
      updateSlides(currentSlideIndex + 1);
    });
  }


  /* ==========================================
     5. 3D ASSEMBLY NODE LOGIC (Exploded bracket view)
     ========================================== */
  const btnExp = document.getElementById('btn-node-exp');
  const btnAsm = document.getElementById('btn-node-asm');
  const btnReset = document.getElementById('btn-node-reset');
  const nodeSteps = document.querySelectorAll('.node-step');

  // Node layers elements
  const blWall = document.getElementById('bl-0');
  const blPad = document.getElementById('bl-1');
  const blBracket = document.getElementById('bl-2');
  const blInsul = document.getElementById('bl-3');
  const blProfile = document.getElementById('bl-4');
  const blPanel = document.getElementById('bl-5');

  const layersList = [blWall, blPad, blBracket, blInsul, blProfile, blPanel];

  const setAssemblyTransforms = (mode) => {
    // Mode options: 'exploded', 'assembled', 'reset'
    if (mode === 'exploded') {
      // Wide spacing in isometric coordinates
      if (blWall) blWall.style.transform = 'translateZ(-140px)';
      if (blPad) blPad.style.transform = 'translateZ(-80px)';
      if (blBracket) blBracket.style.transform = 'translateZ(-20px)';
      if (blInsul) blInsul.style.transform = 'translateZ(40px)';
      if (blProfile) blProfile.style.transform = 'translateZ(100px)';
      if (blPanel) blPanel.style.transform = 'translateZ(160px)';
      
      // Make all active/visible in exploded state
      layersList.forEach(lyr => {
        if (lyr) {
          lyr.classList.add('active');
          lyr.style.opacity = '1';
        }
      });
    } else if (mode === 'assembled') {
      // Natural close layout positions
      if (blWall) blWall.style.transform = 'translateZ(0px)';
      if (blPad) blPad.style.transform = 'translateZ(10px)';
      if (blBracket) blBracket.style.transform = 'translateZ(20px)';
      if (blInsul) blInsul.style.transform = 'translateZ(30px)';
      if (blProfile) blProfile.style.transform = 'translateZ(45px)';
      if (blPanel) blPanel.style.transform = 'translateZ(65px)';
      
      layersList.forEach(lyr => {
        if (lyr) {
          lyr.classList.add('active');
          lyr.style.opacity = '1';
        }
      });
    } else {
      // Reset state: flat collapsed overlap
      layersList.forEach(lyr => {
        if (lyr) {
          lyr.style.transform = 'translateZ(0px)';
          lyr.classList.remove('active');
          lyr.style.opacity = '0.2';
        }
      });
      if (blWall) {
        blWall.classList.add('active');
        blWall.style.opacity = '1';
      }
    }
  };

  if (btnExp && btnAsm && btnReset) {
    btnExp.addEventListener('click', () => {
      btnExp.classList.add('active');
      btnAsm.classList.remove('active');
      btnReset.classList.remove('active');
      setAssemblyTransforms('exploded');
    });

    btnAsm.addEventListener('click', () => {
      btnExp.classList.remove('active');
      btnAsm.classList.add('active');
      btnReset.classList.remove('active');
      setAssemblyTransforms('assembled');
    });

    btnReset.addEventListener('click', () => {
      btnExp.classList.remove('active');
      btnAsm.classList.remove('active');
      btnReset.classList.add('active');
      setAssemblyTransforms('reset');
      
      // Reset steps indicator
      nodeSteps.forEach((s, idx) => {
        s.classList.toggle('active', idx === 0);
      });
    });

    // Hover or click steps list logic
    nodeSteps.forEach(step => {
      const triggerStep = () => {
        const stepIndex = parseInt(step.dataset.step);
        
        nodeSteps.forEach(s => s.classList.remove('active'));
        step.classList.add('active');
        
        // Highlight corresponding 3D layer and dim others
        layersList.forEach((lyr, idx) => {
          if (!lyr) return;
          if (idx === stepIndex) {
            lyr.classList.add('active');
            lyr.style.opacity = '1';
            // Slight jump forward effect
            const currentZ = parseInt(lyr.style.transform.match(/translateZ\((.*)px\)/)[1]);
            lyr.style.transform = `translateZ(${currentZ + 20}px)`;
          } else {
            lyr.classList.remove('active');
            lyr.style.opacity = '0.2';
          }
        });
      };

      step.addEventListener('click', triggerStep);
      step.addEventListener('mouseenter', triggerStep);
    });

    // Initialize in exploded state
    setAssemblyTransforms('exploded');
  }


  /* ==========================================
     6. INTERACTIVE COST CALCULATOR
     ========================================== */
  const areaRange = document.getElementById('calc-area-range');
  const areaVal = document.getElementById('calc-area-val');
  const windowsRange = document.getElementById('calc-windows-range');
  const windowsVal = document.getElementById('calc-windows-val');
  
  const claddingOptions = document.querySelectorAll('#calc-cladding-select .calc-option');
  const substructurePills = document.querySelectorAll('#calc-sub-select .calc-pill');

  // Outputs
  const priceDesign = document.getElementById('price-design');
  const priceMaterials = document.getElementById('price-materials');
  const priceWork = document.getElementById('price-work');
  const priceTotal = document.getElementById('price-total');

  const formatPrice = (val) => {
    return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " ₽";
  };

  const calculateCost = () => {
    if (!areaRange || !priceTotal) return;

    const area = parseInt(areaRange.value);
    const windows = parseInt(windowsRange.value);

    // Get active cladding base price
    let claddingPrice = 4200;
    claddingOptions.forEach(opt => {
      if (opt.classList.contains('active')) {
        claddingPrice = parseInt(opt.dataset.price);
      }
    });

    // Get active sub multiplier
    let subMultiplier = 1.0;
    substructurePills.forEach(pill => {
      if (pill.classList.contains('active')) {
        subMultiplier = parseFloat(pill.dataset.multiplier);
      }
    });

    // Calculate details
    const geodesyCost = Math.round(area * 450); // 450 rub/m² flat fee
    const materialsCost = Math.round(area * claddingPrice * subMultiplier);
    
    // Base work installation (2400 rub/m²) + window slopes framing (1500 rub per window)
    const workCost = Math.round((area * 2400) + (windows * 1500));
    
    const totalCost = geodesyCost + materialsCost + workCost;

    // Render values
    if (areaVal) areaVal.textContent = area;
    if (windowsVal) windowsVal.textContent = windows;

    if (priceDesign) priceDesign.textContent = formatPrice(geodesyCost);
    if (priceMaterials) priceMaterials.textContent = formatPrice(materialsCost);
    if (priceWork) priceWork.textContent = formatPrice(workCost);
    if (priceTotal) priceTotal.textContent = formatPrice(totalCost);
  };

  if (areaRange && priceTotal) {
    areaRange.addEventListener('input', calculateCost);
    windowsRange.addEventListener('input', calculateCost);

    claddingOptions.forEach(opt => {
      opt.addEventListener('click', () => {
        claddingOptions.forEach(o => o.classList.remove('active'));
        opt.classList.add('active');
        calculateCost();
      });
    });

    substructurePills.forEach(pill => {
      pill.addEventListener('click', () => {
        substructurePills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        calculateCost();
      });
    });

    // Initial calculation
    calculateCost();
  }


  /* ==========================================
     7. CINEMATIC PORTFOLIO TABS FILTER
     ========================================== */
  const pTabs = document.querySelectorAll('.p-tab');
  const pCards = document.querySelectorAll('.portfolio-card');

  if (pTabs.length > 0 && pCards.length > 0) {
    pTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        pTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const filter = tab.dataset.filter;

        pCards.forEach(card => {
          if (filter === 'all') {
            card.style.display = 'flex';
          } else {
            if (card.classList.contains(filter)) {
              card.style.display = 'flex';
            } else {
              card.style.display = 'none';
            }
          }
        });
      });
    });
  }


  /* ==========================================
     8. MINIMALIST CONTACT FORM AND SUCCESS POPUP
     ========================================== */
  const contactForm = document.getElementById('alt-form');
  const formSuccess = document.getElementById('form-success');

  if (contactForm && formSuccess) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Show submitting action or direct fade out
      contactForm.style.opacity = '0.3';
      contactForm.style.pointerEvents = 'none';

      setTimeout(() => {
        contactForm.style.display = 'none';
        formSuccess.style.display = 'flex';
        formSuccess.style.opacity = '0';
        
        setTimeout(() => {
          formSuccess.style.opacity = '1';
        }, 50);
      }, 1000);
    });
  }

});
