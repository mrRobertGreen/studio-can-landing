let currentProductId = ""
let scrollPos = 0;

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
  slider = new Sly('#product-menu', options).init();

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

      title.innerHTML = productsData[id].name
      price.innerHTML = productsData[id].price
      category.innerHTML = productsData[id].category

      
      // for (let i = 0; i < productsData[id].images.length; ++i) {
      //   const img =  document.createElement('img');
      //   img.src = productsData[id].images[i]
      //   img.className = "product-slider__item"
      //   $('#product-slider').slick('slickRemove', i)
      //   slider.appendChild(img);
      //   //$('#product-slider').slick('refresh')
      //   //slider.innerHTML = productsData[id].images[i]
      // }

      $('#product-slider').slick('removeSlide', null, null, true); // удаление всех слайдов
      slider.innerHTML = productsData[id].images
      $('#product-slider').slick('refresh')
      
    
      menuItems.forEach(item => {
        if (item.id === id) {
          item.classList.add("active")
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
        mainMenu.classList.add("hidden")
        mainContainer.classList.add("hidden")
        $('body').css('overflow', 'hidden');
        setActiveProduct(id)
      }
    })

    if (hash === "#back") {
      history.pushState("", document.title, window.location.pathname + window.location.search);
      mainMenu.classList.remove("hidden")
      mainContainer.classList.remove("hidden")
      productPopup.classList.add("hidden")
      $('body').css('overflow', 'auto');
      window.scrollTo(0, scrollPos)
    }
  }

  onHashChange()

  window.addEventListener("hashchange", onHashChange)
})