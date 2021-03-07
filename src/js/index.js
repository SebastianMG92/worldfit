/////// Polyfill
// import './polyfills/polyfill';

//////////////////////////
// IMPORT CSS
//////////////////////////

/////// LIBRARIES CSS
import 'bootstrap/dist/css/bootstrap-grid.css';
import 'swiper/css/swiper.css';
import "glightbox/dist/css/glightbox.css";

/////// MAIN CSS
import '../css/style.sass';


//////////////////////////
// IMPORT LIBRARIES JS
//////////////////////////

// Fuse js
import Fuse from 'fuse.js'

// GSAP
import gsap from "gsap";
import { TweenMax, TimelineMax, Power2, Linear, Back, ScrollTrigger} from "gsap/all";
gsap.registerPlugin(TweenMax, TimelineMax, Power2, Linear, Back, ScrollTrigger);

//swiper
import Swiper from "swiper";

// Glightbox
import GLightbox from "glightbox";

// Woocommerce
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";


// Share.js
import "sharer.js";

//////////////////////////
// General functions
//////////////////////////

// Media query
function getViewport() {
  let windowWidth = window.innerWidth;
  let direction = window.innerWidth < 768 ? true : false;
  return direction;
}

// Margin header
function marginMain() {
  let header;
  const main = document.querySelector('.site-main');
  window.addEventListener('load', e => {
    setTimeout(() => {
      header = document.querySelector('#header');
      main.style.marginTop = header.offsetHeight + 'px';
    }, 200);
  });
  window.addEventListener('resize', e => {
    setTimeout(() => {
      header = document.querySelector('#header');
      main.style.marginTop = header.offsetHeight + 'px';  
    }, 200);
  });
  window.addEventListener('scroll', e => {
    setTimeout(() => {
      if (window.pageYOffset < 100) {
        header = document.querySelector('#header');
        main.style.marginTop = header.offsetHeight + 'px';
      }
    }, 200);
  })
}


// Check if an element exists in array using a comparer function
Array.prototype.inArray = function(comparer) { 
  for(var i=0; i < this.length; i++) { 
      if(comparer(this[i])) return true; 
  }
  return false; 
}
Array.prototype.pushIfNotExist = function(element, comparer) { 
  if (!this.inArray(comparer)) {
      this.push(element);
  }
}

//////////////////////////
// CLASS BLOCKS
//////////////////////////

// Lazy load
class LazyLoad {
  constructor() {
    this.lazyBg = document.querySelectorAll('.js-lazy-bg');
    this.lazyImages = document.querySelectorAll('.js-lazy-image');

    this.start();
  }
  start() {

    if (this.lazyImages.length > 0) {
      const images = Array.from(this.lazyImages);
      let config = {
        rootMargin: '0px 0px 500px 0px',
      }
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const image = entry.target;
                image.src = image.dataset.src;
                image.onload = () => image.previousElementSibling.remove();
                imageObserver.unobserve(image);
            }
        });
      }, config);

      images.forEach(img => {
        imageObserver.observe(img)
      });
    }

    if (this.lazyBg.length > 0) {
      const bgs = Array.from(this.lazyBg);

      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bg = entry.target;
                const image = document.createElement('img'); 
                image.src = bg.dataset.src;
                image.onload = () => bg.classList.add('loaded');
                imageObserver.unobserve(bg);
            }
        });
      });

      bgs.forEach(bg => imageObserver.observe(bg));
    }


  }
}

// Header
class Header {
  constructor(){
    this.toggleMenu = this.toggleMenu.bind(this);
    this.accesibilityInit = this.accesibilityInit.bind(this);

    this.state = {
      menuActive: false,
      subMenuActive: false,
    }
    this.headerContainer = document.querySelector('#header');
    this.start();
  }
  start(){
    if (this.headerContainer) {
      // Sticky container
      this.stickyContainer = this.headerContainer.querySelector('.header-fix');
      // Responsive menu
      this.menuButton = this.headerContainer.querySelector('#button__menu');
      this.mainMenu = this.headerContainer.querySelector('#main__menu');
      this.socialMobile = this.headerContainer.querySelector('.header__movilmenu--footer');
      // Sub menu system
      this.menuItems = this.headerContainer.querySelectorAll(
        ".header__nav > .menu-item"
      );
      this.subMenuContainer = this.headerContainer.querySelectorAll(
        ".header__desktopMenu > .menu-item-has-children"
      );
      this.subMenuContainerL2 = this.headerContainer.querySelectorAll(
        ".header__desktopMenu > .menu-item-has-children .menu-item-has-children"
      );
      // Sticky menu
      this.stickyTransparent();

      this.searchButton = this.headerContainer.querySelector('.header__icons--search');
      // Accesibility
      // const desktop = window.matchMedia("(min-width: 768px)");
      // this.closeAcc = document.querySelector('.acc-close-menu');
      // this.links = this.headerContainer.querySelectorAll('.menu-item a');
      // this.accesibilityInit(desktop);
      // desktop.addListener(this.accesibilityInit);

      // Listeners
      this.menuButton.addEventListener('click', this.toggleMenu);
      // this.closeAcc.addEventListener('click', this.toggleMenu);

      // Submenus init
      if (this.subMenuContainer.length > 0) {
        this.subMenuToggle(this.subMenuContainer, "level-1");
      }
      if (this.subMenuContainerL2.length > 0) {
        this.subMenuToggle(this.subMenuContainerL2, "level-2");
      }

      // Search bar function
      if (this.searchButton) {
        
        this.searchButton.addEventListener('click', e => {
          e.preventDefault();
          const panel = this.searchButton.previousElementSibling;
          if (!this.searchButton.classList.contains('active')) {
            this.searchButton.classList.add('active');
            panel.style.maxHeight = panel.scrollHeight + 'px';
          } else {
            this.searchButton.classList.remove('active');
            panel.style.maxHeight = null;
          }
        });

      }
    }
  }
  toggleMenu(){
    if (this.state.menuActive === false) {

      this.menuButton.classList.add('is-active');
      this.mainMenu.classList.add('is-active');
      this.headerContainer.classList.add('is-active');
      document.body.classList.add('hidde-overlay');
      // this.accesibilityInit({matches: true});

      this.mainMenu.style.display = 'block';

      TweenMax.to(this.mainMenu, .3 , {
        delay: .2,
        ease: Power2.easeInOut,
        x: 0,
      });
      TweenMax.to(this.socialMobile, .8, {
        delay: .2,
        opacity: 1,
      });
      TweenMax.to(this.menuItems, .8 , {
        delay: .2,
        opacity: 1,
      });

      setTimeout(() => {
        this.state.menuActive = true
      }, 800);
    } else {
      this.menuButton.classList.remove('is-active');
      this.mainMenu.classList.remove('is-active');
      this.headerContainer.classList.remove('is-active');
      document.body.classList.remove('hidde-overlay');
      // this.accesibilityInit({matches: false});

      TweenMax.to(this.menuItems, 0, {
        opacity: 0,
        onComplete: () => {
          TweenMax.set(this.menuItems, {clearProps:"all"});
        },
      });

      
      TweenMax.to(this.mainMenu, .3 , {
        delay: .1,
        x: '-80vw',
        onComplete: () => {
          TweenMax.set(this.mainMenu, {clearProps:"all"});
        },
      });
      TweenMax.to(this.socialMobile, .3, {
        opacity: 0,
        onComplete: () => {
          TweenMax.set(this.overlayMenu, {clearProps:"all"});
        },
      });

      setTimeout(() => {
        this.state.menuActive = false
      }, 400);
    }
  }
  subMenuToggle(submenus, level) {
    for (let i = 0; i < submenus.length; i++) {
      const submenu = submenus[i];
      // Hover event
      submenu.addEventListener('mouseenter', (e) => {
          const submenuChild = e.target.querySelector('.sub-menu');
          const parent = level === "level-2" ? e.target.parentElement : null;
          e.target.classList.add('open');
          submenuChild.style.maxHeight = submenuChild.scrollHeight + "px"

          if (parent) {
            parent.style.maxHeight = parent.scrollHeight + submenuChild.scrollHeight + "px";
          }
      });
      submenu.addEventListener('mouseleave', (e) => {
          const submenuChild = e.target.querySelector('.sub-menu');
          const parent = level === "level-2" ? e.target.parentElement : null;
          e.target.classList.remove('open');
          submenuChild.style.maxHeight = null;

          if (parent) {
            parent.style.maxHeight = parent.scrollHeight + submenuChild.scrollHeight + "px";
          }
      });
      // Focus event
      submenu.addEventListener('focus', (e) => {
          const submenuChild = e.target.querySelector('.sub-menu');
          const parent = level === "level-2" ? e.target.parentElement : null;
          e.target.classList.add('open');
          submenuChild.style.maxHeight = submenuChild.scrollHeight + "px";

          if (parent) {
            parent.style.maxHeight = parent.scrollHeight + submenuChild.scrollHeight + "px";
          }
      });
    }
  }
  stickyTransparent(){
    let lastScrollTop = 0;
    window.onscroll = () => {
      var st = window.pageYOffset || document.documentElement.scrollTop;
      const trigger = 100;

      if (st < lastScrollTop){
        this.headerContainer.classList.add('is-sticky-up');
        this.headerContainer.classList.remove('is-sticky-down');
      } else if (st > lastScrollTop) {
        this.headerContainer.classList.add('is-sticky-down');
        this.headerContainer.classList.remove('is-sticky-up');
      }


      if (window.pageYOffset > trigger) {
        this.headerContainer.classList.add('is-sticky');
      } else {
        this.headerContainer.classList.remove('is-sticky-up');
        this.headerContainer.classList.remove('is-sticky');
        this.headerContainer.classList.remove('is-sticky-down');
      }

      lastScrollTop = st <= 0 ? 0 : st;
    }

  }
  accesibilityInit(querie){
    if (querie.matches) {
      this.search.tabIndex = 0
      this.closeAcc.tabIndex = 0
      for (let i = 0; i < this.links.length; i++) {
        const link = this.links[i];
        link.tabIndex = 0
      }
    } else {
      this.search.tabIndex = -1
      this.closeAcc.tabIndex = -1
      for (let i = 0; i < this.links.length; i++) {
        const link = this.links[i];
        link.tabIndex = -1
      }
    }
  }
}

// Woocommerce
class Woocommerce {
  constructor() {
    // Shop page
    this.wooShop = document.querySelector('.js-woo-product-page');
    this.start();
  }
  start() {

    this.api = new WooCommerceRestApi({
      url: window.location.origin,
      consumerKey: "ck_13097343a23c2565069b3bc2bd38acceca143ab7",
      consumerSecret: "cs_55294a0f6482a89889ec4f1fe3a34731f8da754b",
      version: "wc/v3",
    });

    // If shop page
    if (this.wooShop) {
      this.shopPage(this.wooShop);
    }
  }
  getProducts(endpoint, config) {
    // List products
    return this.api.get(endpoint, config)
      .then((response) => {
        // Successful request
        return response.data;
        // console.log("Response Data:", response.data);
        // console.log("Total of pages:", response.headers['x-wp-totalpages']);
        // console.log("Total of items:", response.headers['x-wp-total']);
      })
      .catch((error) => {
        // Invalid request, for 4xx and 5xx statuses
        console.log("Response Status:", error.response.status);
        console.log("Response Headers:", error.response.headers);
        console.log("Response Data:", error.response.data);
      })
      .finally(() => {
        // Always executed.
      });
  };
  getOutput(product) {
      // Price html output
      const priceOutput = (product) => {
        let output;
        if (product.type === 'simple') {
          output = `
            <div class="price">
              ${product.on_sale ? 
                `<span class="normal_price">$${product.regular_price}</span> - <span class="sale_price">$${product.sale_price}</span>`
                :
                `<span class="regular_price">$${product.regular_price}</span>`
              }
            </div>
          `
        } else {
          output = `
            ${product.product_variations.map((variation, index) => 
              variation.on_sale ? 
              `<div class="dynamic_price ${index === 0 ? `active` : ``}" data-id="${variation.id}">
                <span class="normal_price">$${variation.regular_price}</span> - <span class="sale_price">$${variation.sale_price}</span>
              </div>` 
              : 
              `<div class="dynamic_price ${index === 0 ? `active` : ``}" data-id="${variation.id}">
                <span class="regular_price">$${variation.regular_price}</span>
              </div>`
            ).join('')}
          `
        }
        return output;
      };
      // Variation html output
      const variationOutput = (product) => {
        let output;
        if (product.type === 'simple') {
          output = `
          <form class="woocommerce cart" action="${product.permalink}">
            <div class="woocommerce__add_to_cart">
              <input type="number" min="1" name="quantity" value="1" title="Cantidad" inputmode="numeric">
              <button name="add-to-cart" type="submit" value="${product.id}" class="single_add_to_cart_button button alt">Añadir al carrito</button>
            </div>
          </form>
          `;
        } else {
          const valid_variations = product.product_variations;

          // Create an object with variations
          const list_variations = {};
          for (let i = 0; i < valid_variations.length; i++) {
            const group = valid_variations[i].attributes;
            for (let i = 0; i < group.length; i++) {
              const item = group[i];
              if (!list_variations[item.slug]) {
                list_variations[item.slug] = []
              }
              if (list_variations[item.slug]) {
                list_variations[item.slug].pushIfNotExist(item.title, function(e) { 
                  return e === item.title;
                });
              }
            }
          };
          
          output = `
          <form class="woocommerce cart" action="${product.permalink}" data-product-variations='${JSON.stringify(valid_variations)}'>
            <div class="variables">
              ${
                Object.entries(list_variations).map(group => `
                  <div class="variable">
                    <div class="variable__options">
                      ${group[1].map((opt, index) => `
                        <label>
                          <input type="radio" value="${opt}" name="${group[0]}" ${index === 0 ? 'checked' : ''}>
                          ${opt}
                        </label>
                      `).join('')}
                    </div>
                  </div>
                `).join('')
              }
            </div>
            <div class="woocommerce__add_to_cart">
              <input type="number" min="1" name="quantity" value="1" title="Cantidad" inputmode="numeric">
              <button type="submit" class="single_add_to_cart_button button alt disabled wc-variation-selection-needed">Añadir al carrito</button>
              <input type="hidden" name="product_id" value="${product.id}">
              <input type="hidden" name="variation_id" class="variation_id" value="0">
            </div>
          </form>
          `;
        }
        return output;
      };
      return `
        <div class="productSlider__product ${product.type === 'variable' ? `js-product-variations` : ''}">
          <div>
            <a class="productSlider__product--link" href="${product.permalink}">
                <figure class="productSlider__product--img">
                    <img class="" alt="${product.images[0].alt}" src="${product.images[0].src}">
                </figure>
            </a>
            <div class="productSlider__product--content">
                <span class="category">
                  ${product.categories ? product.categories.map(cat => cat.name) : ''}                                                                 
                </span>
                <a href="${product.permalink}" class="productSlider__product--link">
                    <h3 class="heading">${product.name}</h3>
                    <p class="price">
                      ${priceOutput(product)}
                    </p> 
                </a>
            </div>
          </div>

          <div class="productSlider__product--cart">
            ${variationOutput(product)}
          </div>
        </div>
      `
  };
  variableSystem(products) {

    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      const form = product.querySelector('.woocommerce');
      const variable_checkboxes = form.querySelectorAll('input[type="radio"]');
      const variable_data = JSON.parse(form.dataset.productVariations);
      const options = {
        includeScore: true,
        keys: ['attributes.option']
      };
      const fuse = new Fuse(variable_data, options)
      let state = {};

      for (let i = 0; i < variable_checkboxes.length; i++) {
        const checkbox = variable_checkboxes[i];
        
        // Add categories of variations
        if (!state[checkbox.name]) {
          state[checkbox.name] = [];
        }

        checkbox.addEventListener('change', e => {
          e.preventDefault();
          const category = checkbox.name;
          if (state[category].length > 0) {
            state[category] = [];
          }

          state[category].push(checkbox.value);

          // if (checkbox.checked) {
          //   state.checked.push(checkbox.value);
          // } else {
          //   state.checked = state.checked.filter(item => item !== checkbox.value);
          // }



          console.log(state);
        });
        
      }
      
      // console.log(state);
      // console.log(variable_checkboxes);
      // console.log(variable_data);

    }

  }
  async shopPage(container) {
    
    // Get products
    let config = {
      per_page: container.dataset.products ? container.dataset.products : 6,
      orderby: "popularity",
      status: "publish",
      min_price: 1,
    };
    const products = await this.getProducts(`products`, config);

    // Building html
    let output = await products.map( product => this.getOutput(product));

    // Print data
    let newItem = document.createElement('div');
    newItem.classList.add('productGrid__container');
    newItem.innerHTML = output.join('');
    const variable_elements =  newItem.querySelectorAll('.js-product-variations');
    variable_elements.length > 0 && this.variableSystem(variable_elements);
    container.appendChild(newItem);
  }
}

// Sliders
class Sliders {
  constructor() {
    this.headerSlide = document.querySelectorAll('.js-header-slide');
    this.productSlide = document.querySelectorAll('.js-product-slide');
    this.tabSlide = document.querySelectorAll('.js-product-tabSlide');
    this.largeSlide = document.querySelectorAll('.js-slide-large');
    this.start();
  }
  start() {
    if (this.headerSlide.length > 0) {

      for (let i = 0; i < this.headerSlide.length; i++) {
        const slide = this.headerSlide[i];
        

        const slides = slide.querySelectorAll('.sliderHero__swiper--item');
        const arrow_prev = slide.querySelector('.swiper-button-prev');
        const arrow_next = slide.querySelector('.swiper-button-next');
  
        arrow_prev.classList.add('js-header-slide-prev');
        arrow_next.classList.add('js-header-slide-next');

        let config = {
          init: false,
          lazy: true,
          // Optional parameters
          loop: true,
          // Navigation arrows
          navigation: {
            nextEl: '.js-header-slide-next',
            prevEl: '.js-header-slide-prev',
          },
        };

        if (slide.dataset.autoplay) {
          config.autoplay = {delay:slide.dataset.autoplay};
        }

        if (slides.length <= 1) {
          config.init = false;
          arrow_prev.style.display = 'none';
          arrow_next.style.display = 'none';
        };
        
        const headerSwiper = new Swiper(this.headerSlide, config);

        headerSwiper.on('init', () => {
          const content = headerSwiper.slides[headerSwiper.activeIndex].querySelectorAll('.js-header-slide-anim');
          if (content) {
            gsap.to(content, .5,{
              delay:.5,
              opacity:1,
              y: 0,
              ease: Back.easeOut.config(4),
              stagger: .1
            });
          }

        });
        headerSwiper.on('slideChange', () => {
          const prevSlide = headerSwiper.slides[headerSwiper.previousIndex] ? headerSwiper.slides[headerSwiper.previousIndex].querySelectorAll('.js-header-slide-anim') : null;
          const content = headerSwiper.slides[headerSwiper.activeIndex] ? headerSwiper.slides[headerSwiper.activeIndex].querySelectorAll('.js-header-slide-anim') : null;

          if (prevSlide) {
            gsap.to(prevSlide, 0,{
              clearProps:"all",
            });
          }
          if (content) {
            gsap.to(content, .5,{
              delay:.5,
              opacity:1,
              y: 0,
              ease: Back.easeOut.config(4),
              stagger: .1
            });
          }

        });

        headerSwiper.init();

      }


    }
    if (this.productSlide.length > 0) {
      
      for (let i = 0; i < this.productSlide.length; i++) {
        const slide = this.productSlide[i];
        
        // Arrows
        const arrow_prev = slide.parentElement.querySelector('.js-product-slide-prev');
        const arrow_next = slide.parentElement.querySelector('.js-product-slide-next');
        // Pagination
        const navigation = slide.parentElement.querySelector('.js-product-slide-navigation');

        arrow_prev.classList.add(`js-product-slide-prev-${i}`);
        arrow_next.classList.add(`js-product-slide-next-${i}`);
        navigation.classList.add(`js-product-slide-navigation-${i}`);


        var headerSwiper = new Swiper(slide, {
          // Optional parameters
          slidesPerView: 1,
          spaceBetween: 0,
          lazy: true,
          observer: true,
          observeParents: true,
          threshold: 20,
          // If we need pagination
          scrollbar: {
            el: `.js-product-slide-navigation-${i}`,
          },
          // Navigation arrows
          navigation: {
            nextEl: `.js-product-slide-next-${i}`,
            prevEl: `.js-product-slide-prev-${i}`,
          },
          // Responsive
          breakpoints: {
            // when window width is >= 640px.
            768: {
              spaceBetween: 10,
              slidesPerView: 2,
            },
            992: {
              spaceBetween: 10,
              slidesPerView: 3,
            },
          }
        })
      }
    }
    if (this.tabSlide.length > 0) {
      
      for (let i = 0; i < this.tabSlide.length; i++) {
        const slide = this.tabSlide[i];
        
        // Arrows
        const arrow_prev = slide.parentElement.querySelector('.js-product-slide-prev');
        const arrow_next = slide.parentElement.querySelector('.js-product-slide-next');
  
        arrow_prev.classList.add(`js-product-slide-prev-${i}`);
        arrow_next.classList.add(`js-product-slide-next-${i}`);


        var headerSwiper = new Swiper(slide, {
          // Optional parameters
          slidesPerView: 1,
          lazy: true,
          observer: true,
          observeParents: true,
          threshold: 20,
          // Navigation arrows
          navigation: {
            nextEl: `.js-product-slide-next-${i}`,
            prevEl: `.js-product-slide-prev-${i}`,
          },
          // Responsive
          breakpoints: {
            // when window width is >= 640px.
            576: {
              spaceBetween: 10,
              slidesPerView: 1.2,
            },
            768: {
              spaceBetween: 10,
              slidesPerView: 2.2,
            },
            992: {
              spaceBetween: 10,
              slidesPerView: 4.2,
            },
          }
        })
      }
    }
    if (this.largeSlide.length > 0) {

      for (let i = 0; i < this.largeSlide.length; i++) {
        const slide = this.largeSlide[i];
        const next_arrow = slide.querySelector('.swiper-button-next');
        const prev_arrow = slide.querySelector('.swiper-button-prev');
        const pagination = slide.querySelector('.swiper-pagination');

        prev_arrow.classList.add(`js-slide-large-prev-${i}`);
        next_arrow.classList.add(`js-slide-large-next-${i}`);
        pagination.classList.add(`js-slide-large-pagination-${i}`);



        let config = {
          slidesPerView: 1,
          spaceBetween: 10,
          lazy: true,
          pagination: {
            el: `.js-slide-large-pagination-${i}`,
          },
          navigation: {
            nextEl: `.js-slide-large-next-${i}`,
            prevEl: `.js-slide-large-prev-${i}`,
          },
          breakpoints: {
            768: {
              slidesPerView: 2,
              spaceBetween: 30            
            },
            992: {
              slidesPerView: 3,
              spaceBetween: 30            
            }
          }

        };
        
        if (slide.dataset.delay) {
          config.autoplay = {
            delay: slide.dataset.delay,
          }
        };
        
        const swiper_slide = new Swiper(slide, config);

      }

    }
  }
}

// Product tabs
class ProductTabs {
  constructor(){
    this.CONTAINER = document.querySelectorAll('.js-product-tabs');
    this.start();
  }
  start() {
    if (this.CONTAINER.length > 0) {

      const showSlide = (tab, slides) => {
        for (let i = 0; i < slides.length; i++) {
          const slide = slides[i];
          slide.classList.remove('active');
          if (tab.dataset.type === slide.dataset.type) {
            slide.classList.add('active');
          }
        }
      };
      const resetActive = (tabs) => {
        for (let i = 0; i < tabs.length; i++) {
          const tab = tabs[i];
          tab.classList.remove('active');
        }
      };

      for (let i = 0; i < this.CONTAINER.length; i++) {

        const container = this.CONTAINER[i];
        
        const tabs = container.querySelectorAll('.js-products-tabs-tab');
        const slides = container.querySelectorAll('.js-products-tabs-slide');

        // Init Active
        tabs[0].classList.add('active');
        slides[0].classList.add('active');

        for (let i = 0; i < tabs.length; i++) {
          const tab = tabs[i];
          
          tab.addEventListener('click', e => {
            e.preventDefault();

            if (!tab.classList.contains('active')) {
              resetActive(tabs);
              tab.classList.add('active');
              showSlide(tab, slides);
            }

          });
        }
      }

    }
  }
}

// Accordion
class Accordion {
  constructor() {
    this.CONTAINER = document.querySelector('.js-accordion');
    this.start();
  }
  start() {

    if (this.CONTAINER) {
      
      const accordions = this.CONTAINER.querySelectorAll('.tabsBlock__container--button');

      for (let i = 0; i < accordions.length; i++) {
        const accordion = accordions[i];
        const panel = accordion.nextElementSibling;

        accordion.addEventListener('click', e => {

          accordion.classList.toggle('active');
          if (panel.style.maxHeight) {
            panel.style.maxHeight = null;
          } else {
            panel.style.maxHeight = panel.scrollHeight + "px";
          } 

        });
      }

    }

  }
}

// Animations
class Animations {
  constructor() {
    this.fadeInStagger = document.querySelectorAll('.js-anim-fadeIn-stagger');
    this.parallaxElements = document.querySelectorAll('.js-anim-parallax');
    this.parallaxBgs = document.querySelectorAll('.js-anim-parallaxBg');
    this.footerAnimation = document.querySelectorAll('.js-anim-footer');
    this.start();
  }

  start() {

    if (this.fadeInStagger.length > 0) {
      
      let options = {
        threshold: .3,
      };
      if (getViewport()) {
        options.threshold = .05;
      }

      for (let i = 0; i < this.fadeInStagger.length; i++) {
        const container = this.fadeInStagger[i];
        const items = container.querySelectorAll('.js-anim-fadeIn-stagger-item')
        let shown = false;

        const scrollObserver = (entries, observer) => {
          entries.forEach((entry) => {
            if (entry.intersectionRatio > 0 && !shown) {
              shown = true;
              gsap.to(items, .5,{
                delay:.1,
                opacity:1,
                y: 0,
                ease: Back.easeOut.config(4),
                stagger: .2
              });
            }
          });
        };

        let observer = new IntersectionObserver(scrollObserver, options);
        observer.observe(container);

      }

    }

    if (this.parallaxElements.length > 0) {
      
      for (let i = 0; i < this.parallaxElements.length; i++) {
        const container = this.parallaxElements[i];
        const items = container.querySelectorAll('.js-anim-parallax-item')

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: container,
            start: "top bottom",
            end: "bottom top",
            scrub: .5,
          }
        });

        gsap.utils.toArray(items).forEach(item => {
          const depth = item.dataset.depth;
          const movement = -(container.offsetHeight * depth);
          tl.to(item, {y:movement,ease: "none"}, 0);
        });

      }

    }

    if (this.footerAnimation.length > 0) {
      
      for (let i = 0; i < this.footerAnimation.length; i++) {
        const container = this.footerAnimation[i];
        const item = container.querySelectorAll('.js-anim-footer-item');
        
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: container,
            start: "top bottom",
            end: "bottom bottom",
            scrub: .1,
          }
        });

        tl.to(item, {top: 0,ease: "none"}, .3);



      }

    }

    if (this.parallaxBgs.length > 0) {
     
      for (let i = 0; i < this.parallaxBgs.length; i++) {
        const container = this.parallaxBgs[i];
        const bg = container.querySelector('.js-anim-parallaxBg-item');

        // bg.style.backgroundPosition = `50% 0px`;

        // gsap.to(bg, {
        //   backgroundPosition: `50% ${-container.offsetHeight}px`,
        //   ease: "none",
        //   scrollTrigger: {
        //     trigger: container,
        //     scrub: 1
        //   }
        // });

      }
      
    }

  }
}

// Lightboxes
class Lightboxes {
  constructor() {
    this.lightboxes = document.querySelectorAll('.js-lightbox');
    this.galleryImages = document.querySelectorAll('.js-lightbox-gallery');
    this.btnImage = document.querySelectorAll('.js-lightbox-btnImage')
    this.start();
  }
  start() {

    if (this.lightboxes.length > 0) {
      for (let i = 0; i < this.lightboxes.length; i++) {
        const button = this.lightboxes[i];
        const lightbox = button.nextElementSibling
        const close = lightbox.querySelector('.js-lightbox-close');

        close.addEventListener("click", (e) => {
          e.preventDefault();

          document.body.classList.remove("hidde-overlay");
          lightbox.classList.remove("show");
          lightbox.style.opacity = 0;

          //Captcha
          if (this.captcha) {
            this.captcha.classList.add("hidde");
          }
        });

        button.addEventListener("click", (e) => {
          e.preventDefault();

          document.body.classList.add("hidde-overlay");
          lightbox.classList.add("show");

          gsap
            .to(lightbox, {
              duration: 0.5,
              opacity: 1,
            })
            .delay(0.2);
        });

      }
    }

    if (this.galleryImages.length > 0) {
      for (let i = 0; i < this.galleryImages.length; i++) {
        const container = this.galleryImages[i];
        const images = container.querySelectorAll('.js-lightbox-gallery-item');
        
        for (let j = 0; j < images.length; j++) {
          const image = images[j];
          image.classList.add(`js-lightbox-gallery-item-${i}`)
        }

        var lightbox = GLightbox({
          selector: `.js-lightbox-gallery-item-${i}`,
        });

      }
    }

    if (this.btnImage.length > 0) {
      for (let i = 0; i < this.btnImage.length; i++) {
        const container = this.btnImage[i];
        const images = container.dataset.images.split(',');
        container.classList.add(`js-lightbox-btnImage-${i}`);

        let config = {
          selector: `.js-lightbox-btnImage-${i}`,
          elements: [],
          startAt: 0,
        }

        config.selector = `.js-lightbox-btnImage-${i}`;

        for (let j = 0; j < images.length; j++) {
          const image = images[j];
          let image_config = {
            href: `${image}`,
            type: 'image',
          };
          config.elements.push(image_config);
        };

        const lightbox = GLightbox(config);
      }
    }

  }
}

// Gallery
class Gallery {
  constructor() {
    this.gallery = document.querySelectorAll('.js-gallery')
    this.start();
  }
  start() {
    if (this.gallery.length > 0) {
      for (let i = 0; i < this.gallery.length; i++) {
        const gallery = this.gallery[i];
        const btn = gallery.querySelector('.js-gallery-btn');
        const images = gallery.querySelectorAll('.js-gallery-img.hidde .image');

        btn.addEventListener('click', e => {
          e.preventDefault();
          for (let i = 0; i < images.length; i++) {
            const image = images[i];
            image.parentElement.parentElement.classList.remove('hidde');
            const dummie = document.createElement('img'); 
            dummie.src = image.dataset.src;
            dummie.onload = () => image.classList.add('loaded');
            btn.classList.add('disabled');
          }

        });

      }
    }
  }
}

////////////////////
// Run apps
////////////////////
document.addEventListener('DOMContentLoaded', function () {

  var lazy = new LazyLoad();
  var header = new Header();
  var woocommerce = new Woocommerce();
  var slide = new Sliders();
  var product = new ProductTabs();
  var accordion = new Accordion();
  var animations = new Animations();
  var lightboxes = new Lightboxes();
  var gallery = new Gallery();

  marginMain();

});

////////////////////
// Import components
////////////////////





////////////////////
// Copyright
////////////////////
window.SayMyName = function () {
  console.log(`%c
                                                        
                MADE WITH TOO MUCH SKILLS:              
                                                        
                                                        
       333333    666    00000  PPPPPP  MM    MM IIIII   
          3333  66     00   00 PP   PP MMM  MMM  III    
         3333  666666  00   00 PPPPPP  MM MM MM  III    
           333 66   66 00   00 PP      MM    MM  III    
       333333   66666   00000  PP      MM    MM IIIII   
                                                        
                                                        
                    https://360pmi.com/                 
`, 'background: #e8404b; color: white');
}

////////////////////
// IE Detecter
////////////////////

/* Sample function that returns boolean in case the browser is Internet Explorer*/

const isIE = () => {
  var ua = navigator.userAgent;
  /* MSIE used to detect old browsers and Trident used to newer ones*/
  var is_ie = ua.indexOf("MSIE ") > -1 || ua.indexOf("Trident/") > -1;
  
  return is_ie; 
}
const checkIeCookie = (name) => {
  var dc = document.cookie;
  var prefix = name + "=";
  var begin = dc.indexOf("; " + prefix);
  if (begin == -1) {
      begin = dc.indexOf(prefix);
      if (begin != 0) return null;
  }
  else
  {
      begin += 2;
      var end = document.cookie.indexOf(";", begin);
      if (end == -1) {
      end = dc.length;
      }
  }
  // because unescape has been deprecated, replaced with decodeURI
  //return unescape(dc.substring(begin + prefix.length, end));
  return decodeURI(dc.substring(begin + prefix.length, end));
}

/* Create an alert to show if the browser is IE or not */
if (isIE() && !checkIeCookie('ie_cookie')){

    const container = document.createElement('div');
    container.classList.add('ie-notification');

    container.innerHTML = `
      <p>Your web browser (Internet Explorer) is out of date. Please update your browser for more security, speed, and for the best experience on this site.</p>
      <div>
      <div>
        <a href="https://browsehappy.com/" target="_blank">Update my browser</a>
        <button class="ignore-update">Ignore</button>
      </div>
    `
    document.body.appendChild(container);

    const ignoreUpdate = document.querySelector('.ignore-update');
    ignoreUpdate.addEventListener('click', (e) => {
      var d = new Date();
        
      d.setTime(d.getTime() + (1*60*60*1000));
      var expires = "expires="+ d.toUTCString();
      document.cookie = "ie_cookie" + "=" + 1 + ";" + expires + ";path=/";
      container.style.display = 'none';
    });
}


////////////////////
// Keyboard focus
////////////////////

function keyboardFocus (e) {
  if (e.keyCode === 9) { // Tab key
    document.documentElement.classList.add('keyboard-focus');
  }

  document.removeEventListener('keydown', keyboardFocus, false);
}

document.documentElement.classList.remove('no-js');
document.addEventListener('keydown', keyboardFocus, false);

