let currentProductId = "_pr1"

window.onload = () => {
	$(".product-slider").slick({
		arrows: false,
		dots: true,
	})

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

	const menuItems = document.querySelectorAll(".product-menu__item")
	const products = document.querySelectorAll(".services__item")
	const backBtn = document.querySelector(".product__header").querySelector(".arrow-back")
	const productPopup = document.querySelector(".product-popup")
	const mainContainer = document.querySelector(".container")

	backBtn.addEventListener("click", () => {
		productPopup.classList.add("hidden")
		mainContainer.classList.remove("hidden")
	})

	menuItems.forEach(active => {
		active.addEventListener("click", () => {
			active.classList.add("active")
			setActiveProduct(active.id)
			$('.product-slider').slick('refresh');
			menuItems.forEach(item => {
				if (item !== active) item.classList.remove("active")
			})
		});
	})

	products.forEach(product => {
		product.addEventListener("click", () => {
			setActiveProduct(product.id)
			productPopup.classList.toggle("hidden")
			mainContainer.classList.add("hidden")
		});
	})
}

const setActiveProduct = (id) => {
	if (id !== currentProductId) {
		currentProductId = id
		const title = document.querySelector(".product__title")
		const price = document.querySelector(".product__price")
		const slider = document.querySelector(".product-slider")
		const category = document.querySelector(".product__category")
		title.innerHTML = productsData[id].name
		price.innerHTML = productsData[id].price
		$('.product-slider').slick('removeSlide', null, null, true); // удаление всех слайдов
		slider.innerHTML = productsData[id].images
		category.innerHTML = productsData[id].category
	}
}