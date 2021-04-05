let currentProductId = ""
let scrollPos = 0;
let productScrollPos = 0;
const MENU_ITEM_WIDTH = 90
const mainBody = document.querySelector('body');



$(window).on('load', function () {
  
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
  // const body = document.querySelector(".product-popup__body")

  // $('#product-slider').on("reInit", () => {
  //   productPopup.scroll(0, 0)
  //   body.scroll(0, 0)
  // })

  const setActiveProduct = (id) => {
    if (id !== currentProductId) {
      currentProductId = id

      const htmlDots = `<div class="products-dots">
        <div class="products-dots__dot"></div>
        <div class="products-dots__dot"></div>
        <div class="products-dots__dot"></div>
      </div>
`

      const title = document.querySelector(".product__title")
      const detailsWrapper = document.querySelector(".product-details-wrapper")
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
      category.innerHTML = productsData[id].category

      // $('#product-slider').slick('removeSlide', null, null, true); // удаление всех слайдов
      slider.innerHTML = productsData[id].images
      menuItems.forEach((item, idx) => {
        if (item.id === "menu_" + id) {
          item.classList.add("active")
          productMenu.slideTo((idx - 1) * MENU_ITEM_WIDTH)
        } else {
          item.classList.remove("active")
        }
      })

      detailsWrapper.innerHTML = ""

      productsData[id].details.forEach((detail, detailIdx) => {
        const productDetailsBlock = document.createElement("div");
        productDetailsBlock.classList.add("product-details")
        const title = `<div class="product-details__title">${detail.title}</div>`
        let paragraphs = ""
        detail.items.forEach((item, itemIdx) => {
          if (detailIdx === productsData[id].details.length - 1 && itemIdx === 0) {
            paragraphs += `<p class="mb-21">${item}</p>`
          } else {
            paragraphs += `<p>${item}</p>`
          }
        })
        productDetailsBlock.innerHTML = title + paragraphs
        if (detailIdx === productsData[id].details.length - 1) detailsWrapper.innerHTML += htmlDots
        detailsWrapper.appendChild(productDetailsBlock)
      })
    }
  }

  const formPopup = document.querySelector(".form-popup")
  const formPopupTextarea = document.querySelector("._popup-textarea > textarea")

  const openForm = () => {
    formPopup.classList.remove("hidden")
    let value;
    const productName = productsData[currentProductId].name

    switch (currentProductId) {
      case "design_landing":
        value = "Я хочу дизайн Лендинга";
        break;
      case "design_bigsite":
        value = "Я хочу дизайн Большого сайта"
        break;
      case "design_market":
        value = "Я хочу дизайн Интернет-магазина"
        break;
      case "design_polygraphy":
        value = "Я хочу Полиграфию"
        break;
      case "design_networks":
        value = "Я хочу дизайн Социальных сетей"
        break;
      case "marketing_complex":
        value = "Я хочу Комплексную рекламу"
        break;
      case "marketing_context":
        value = "Я хочу Контекстную рекламу"
        break;
      default:
        value = "Я хочу " + productName;
    }

    formPopupTextarea.value = value;
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
        mainBody.style['overflow-y'] = 'hidden'
        setActiveProduct(id)
      }
    })

    if (hash === "#back") {
      history.pushState("", document.title, window.location.pathname + window.location.search);
      mainMenu.classList.remove("hidden")
      mainContainer.classList.remove("hidden")
      productPopup.classList.add("hidden")
      mainBody.style.paddingRight = '0px';
      mainBody.style['overflow-y'] = 'auto'
      window.scrollTo(0, scrollPos)
    }

    if (hash === "#back-to-product") {
      history.pushState("", document.title, window.location.pathname + window.location.search);
      formPopup.classList.add("hidden")
    }

    if (hash === "#form") {
      if (currentProductId) {
        openForm()
      } else {
        history.pushState("", document.title, window.location.pathname + window.location.search);
      }
    }
  }

  onHashChange()

  window.addEventListener("hashchange", onHashChange)
})