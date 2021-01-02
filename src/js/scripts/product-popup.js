let currentProductId = ""
let scrollPos = 0;
const MENU_ITEM_WIDTH = 90
const mainBody = document.querySelector('body');

$(window).on('load', function () {
  // слайдер
  $("#product-slider").slick({
    arrows: false,
    dots: true,
  })

  // меню
  const options = {
    horizontal: 1,
    speed: 300,
    mouseDragging: 1,
    touchDragging: 1,
    easing: 'swing',
    releaseSwing: true,
    swingSpeed: 0.5,
  };
  const productMenu = new Sly('#product-menu', options).init();

  // сами карточки
  const productPopup = document.querySelector(".product-popup")
  const mainMenu = document.querySelector("#frame")
  const mainContainer = document.querySelector("#main-container")
  const menuItems = document.querySelectorAll(".product-menu__item")
  const body = document.querySelector(".product-popup__body")

  $('#product-slider').on("reInit", () => {
    productPopup.scroll(0, 0)
    body.scroll(0, 0)
  })

  const setActiveProduct = async (id) => {
    if (id !== currentProductId) {
      currentProductId = id

      const title = document.querySelector(".product__title")
      const price = document.querySelector(".product__price")
      const slider = document.querySelector("#product-slider")
      const category = document.querySelector(".product__category")
      const arrowPrev = document.querySelector(".arrow-wrapper.prev")
      const arrowNext = document.querySelector(".arrow-wrapper.next")

      const curProductIndex = productsData.ids.findIndex((elem) => elem === id)

      if (curProductIndex !== 0) {
        const prevProductId = productsData.ids[curProductIndex - 1]
        arrowPrev.style.opacity = 1;
        arrowPrev.setAttribute("href", "/#" + prevProductId)
      } else {
        arrowPrev.setAttribute("href", "/#back")
        arrowPrev.style.opacity = 0;
      }
      if (curProductIndex !== productsData.ids.length - 1) {
        const nextProductId = productsData.ids[curProductIndex + 1]
        arrowNext.style.opacity = 1;
        arrowNext.setAttribute("href", "/#" + nextProductId)
      } else {
        arrowNext.setAttribute("href", "/#back")
        arrowNext.style.opacity = 0;
      }


      title.innerHTML = productsData[id].name
      price.innerHTML = productsData[id].price
      category.innerHTML = productsData[id].category

      $('#product-slider').slick('removeSlide', null, null, true); // удаление всех слайдов
      slider.innerHTML = productsData[id].images
      $('#product-slider').slick('refresh')

      menuItems.forEach((item, idx) => {
        if (item.id === "menu_" + id) {
          item.classList.add("active")
          productMenu.slideTo((idx - 1) * MENU_ITEM_WIDTH)
        } else {
          item.classList.remove("active")
        }
      })
    }
  }

  const onHashChange = () => {

    const hash = window.location.hash;

    productsData.ids.forEach(id => {
      if (hash === "#" + id) {
        scrollPos = window.pageYOffset
        productPopup.classList.remove("hidden")
        if (window.innerWidth <= 600) {
          mainContainer.classList.add("hidden")
        }
        if (window.innerWidth >= 1100) {
          const lockPaddingValue = window.innerWidth - document.querySelector('.wrapper').offsetWidth + 'px';
          mainBody.style.paddingRight = lockPaddingValue;
        }
        mainMenu.classList.add("hidden")
        $('body').css('overflow', 'hidden');
        setActiveProduct(id)
      }
    })

    if (hash === "#back") {
      history.pushState("", document.title, window.location.pathname + window.location.search);
      mainMenu.classList.remove("hidden")
      mainContainer.classList.remove("hidden")
      productPopup.classList.add("hidden")
      mainBody.style.paddingRight = '0px';
      $('body').css('overflow', 'auto');
      window.scrollTo(0, scrollPos)
    }
  }

  onHashChange()

  window.addEventListener("hashchange", onHashChange)
})