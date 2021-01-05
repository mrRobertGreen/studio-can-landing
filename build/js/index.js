$(window).on('load', function () {
    let slider;
    const ids = ["we", "services", "examples", "process", "vacancies", "contacts"] // массив id блоков
    let isAllowedAutoSwitching = true; // разрешено ли автопролистывание меню

    
    let currentIndex = 0 // индекс текущего блока
    let lastCurrentIndex = 0

    if (window.matchMedia('(max-width: 768px)').matches) {
        // если ширина экрана не больше 768 пикселей
        const options = {
            horizontal: 1,
            speed: 300,
            mouseDragging: 1,
            touchDragging: 1,
            easing: 'swing',
            releaseSwing: true,
            swingSpeed: 0.5,
        };
        slider = new Sly('#frame', options).init();
    }

    $("#menu-fake").width($("#menu-we").width()) // установили начальную ширину бегунку

    if (window.matchMedia('(min-width: 900px)').matches) {
        // если ширина экрана больше 900 пикселей
        $(".menu__item").click(async function () { // подписались на событие клика по менюшке
            await bigMenuController($(this).attr('id')) // двигаем ползунок в менюшке
            currentIndex = ids.findIndex(id => "menu-" + id === $(this).attr('id')) // ставим индекс текущего блока
        })
    } else {
        $(".menu__item").click(async function () {
            await smallMenuController($(this).attr('id'), slider)
            currentIndex = ids.findIndex(id => "menu-" + id === $(this).attr('id')) // ставим индекс текущего блока
        })
    }

    $(window).scroll(function () {
        // make menu fixed on top
        if (window.matchMedia('(min-width: 900px)').matches) {
            if ($(this).scrollTop() >= 86) {
                $('.menu-copy').css("display", "block");
                $('.menu').addClass('stickytop');
            } else {
                $('.menu').removeClass('stickytop');
                $('.menu-copy').css("display", "none");
            }
        } else {
            if ($(this).scrollTop() >= 57) {
                $('.menu-copy').css("display", "block");
                $('.menu').addClass('stickytop');
            } else {
                $('.menu').removeClass('stickytop');
                $('.menu-copy').css("display", "none");
            }
        }
    });

    const linkClasses = ".menu__link, .menu__track, .we-are__link, .clouds__item, .process, .offer"

    $(linkClasses).on('click', '[href^="#"]', async function (e) {
        // плавная прокрутка до якоря
        e.preventDefault()
        isAllowedAutoSwitching = false

        if (this.hash == "#we") {   
            await $('html,body').animate({
                scrollTop: $(this.hash).offset().top + 1
            }, 500, "swing", () => isAllowedAutoSwitching = true);
            // последним параметром идет функция, которая выполняется послео кончания анимации
            // в ней мы вкючаем автопролистывание
        } else {
            await $('html,body').animate({
                scrollTop: $(this.hash).offset().top - 100
            }, 500, "swing", () => isAllowedAutoSwitching = true);
        }
    });

    window.addEventListener("load", () => {
        // после загрузки страницы ставим пункт меню в правильное положение
        while (isVisibleForScrollDown("#" + ids[currentIndex] + "-end")) {
            currentIndex++
            lastCurrentIndex++
        }
        if (window.matchMedia('(min-width: 900px)').matches) {
            // если ширина экрана больше 900 пикселей
            bigMenuController(`menu-${ids[currentIndex]}`)
        } else {
            smallMenuController(`menu-${ids[currentIndex]}`, slider)
        }
    });

    let lastScrollTop = 0;

    $(window).on("scroll", function () {
        // автопереключение пунктов меню
        let scrollTop = $(this).scrollTop();

        if (!isAllowedAutoSwitching) return

        if (scrollTop > lastScrollTop) {
            // скролл вниз
            let i = currentIndex
            while (isVisibleForScrollDown("#" + ids[i] + "-start")) {
                // идем вниз до по стартовым чекпоинтам, пока не дойдем до первого не видимого
                ++i
            }
            if (i === -1 || i === 0) currentIndex = 0
            else currentIndex = i - 1

        } else {
            // скролл вверх
            let i = currentIndex
            while (isVisibleForScrollUp("#" + ids[i] + "-end")) {
                --i
            }
            if (i === 6) currentIndex = 5
            else currentIndex = i + 1
        }

        if (lastCurrentIndex !== currentIndex) {
            lastCurrentIndex = currentIndex
            if (window.matchMedia('(min-width: 900px)').matches) {
                // если ширина экрана больше 900 пикселей
                isAllowedAutoSwitching = false
                bigMenuController(`menu-${ids[currentIndex]}`)
                setTimeout(() => {
                    isAllowedAutoSwitching = true
                }, 300)
            } else {
                isAllowedAutoSwitching = false
                smallMenuController(`menu-${ids[currentIndex]}`, slider)
                setTimeout(() => {
                    isAllowedAutoSwitching = true
                }, 300)
            }
        }
        lastScrollTop = scrollTop;
    })


    $("#textarea").on('input', function (e) {
         // резиновый textarea
        fixTextareaSize(e.target)
    });

    function fixTextareaSize(textarea) {
        textarea.style.height = 'auto'
        textarea.style.height = textarea.scrollHeight + 0 + "px"
    }

    $('.card__main').click(function(event) {
		if($('.cards').hasClass('one')){
			$('.card__main').not($(this)).removeClass('active');
			$('.card__addition').not($(this).next()).slideUp(300);
		}
		$(this).toggleClass('active').next().slideToggle(300);
	});

});

function isVisible(id) {
    // check element visibility
    const element = $(id)
    const elementTop = $(element).offset().top; // позиция элемента от верхнего края документа
    const elementBottom = elementTop + $(element).outerHeight(); // позиция конца элемента от верхнего края документа

    // формируем область по центру экрана и будем проверять видимость элемента в этой области
    const viewportTop = $(window).scrollTop() + $(window).height() / 2.5
    const viewportBottom = viewportTop + $(window).height() / 10;

    // чтоб наглядно увидеть эту область раскомментируй этот код
    // $('#scanner').remove()
    // $('#body').append('<div id="scanner"></div>');

    // const props = {
    //     background: "#000",
    //     opacity: 0.5,
    //     position: "fixed",
    //     width: "100%",
    //     height: viewportBottom - viewportTop + "px",

    //     top: $(window).height() / 2.5 + "px",
    //     bottom: $(window).height() / 2.1 + "px",
    // }
    // $("#scanner").css(props)

    return elementBottom > viewportTop && elementTop < viewportBottom;
};

function isVisibleForScrollDown(id) {
    // console.log("id: ", id)

    const element = $(id)

    if (!element.offset()) return

    const elementTop = $(element).offset().top; // позиция элемента от верхнего края документа
    const viewportTop = $(window).scrollTop(); // значение отступа прокрутки сверху 
    const viewportBottom = viewportTop + $(window).height();

    // $('#scanner').remove()
    // $('#body').append('<div id="scanner"></div>');

    // const props = {
    //     background: "#000",
    //     opacity: 0.5,
    //     position: "fixed",
    //     width: "100%",
    //     height: "10px",
    //     top: $(window).height() / 2 + "px",
    // }
    // $("#scanner").css(props)


    return elementTop < viewportTop + $(window).height() / 2
}

function isVisibleForScrollUp(id) {

    const element = $(id)

    if (!element.offset()) return

    const elementTop = $(element).offset().top; // позиция элемента от верхнего края документа
    const viewportTop = $(window).scrollTop(); // значение отступа прокрутки сверху 
    const viewportBottom = viewportTop + $(window).height();


    return elementTop > viewportTop + $(window).height() / 2
}

const moveFakeItem = async (left = 1, delay = 300) => {
    // move fake menu item to left with delay
    const fakeItem = $(".menu__item_fake")
    await fakeItem.animate({
        left: `${left}px`
    }, delay)
}

const bigMenuController = async (id) => {
    $(".menu__item").removeClass("menu__item_active") // удалили активный класс со всех блочков
    $("#" + id).addClass("menu__item_active") // добавили активный класс к блоку, на который тыкнули
    const fakeItem = $("#menu-fake") // нашли наш бегающий блок
    switch (id) {
        case "menu-we":
            await moveFakeItem(3) // подвинули бегунок на 3 пикселя вправо
            fakeItem.width($("#menu-we").width()) // установили ему ширину равную размеру блока, по которому он едет
            break
        case "menu-services":
            await moveFakeItem($("#menu-we").width() + 3) // подвинули бегунок на ширину предыдущего блока + 3px
            fakeItem.width($("#menu-services").width()) // установили ему ширину равную размеру блока, по которому он едет
            break
            // далее все аналогично
        case "menu-examples":
            await moveFakeItem($("#menu-we").width() + $("#menu-services").width() + 3)
            fakeItem.width($("#menu-examples").width())
            break
        case "menu-process":
            await moveFakeItem($("#menu-we").width() + $("#menu-services").width() + $("#menu-examples").width() + 3)
            fakeItem.width($("#menu-process").width())
            break
        case "menu-vacancies":
            await moveFakeItem($("#menu-we").width() + $("#menu-services").width() + $("#menu-examples").width() + $("#menu-process").width() + 3)
            fakeItem.width($("#menu-vacancies").width())
            break
        case "menu-contacts":
            await moveFakeItem($("#menu-we").width() + $("#menu-services").width() + $("#menu-examples").width() + $("#menu-process").width() + $("#menu-vacancies").width() + 6)
            fakeItem.width($("#menu-contacts").width())
            break
        default:
    }
}

const smallMenuController = async (id, slider) => {
    // тут все то же самое
    // отличается только ширина сдвига бегунка
    // и добавляется новая фича - слайдер автоматически скроллится при переключении блоков
    $(".menu__item").removeClass("menu__item_active")
    $("#" + id).addClass("menu__item_active")
    const fakeItem = $("#menu-fake")
    switch (id) {
        case "menu-we":
            await moveFakeItem(2) // подвинули бегунок на 2 пикселя вправо
            fakeItem.width($("#menu-we").width()) // установили ему ширину равную размеру блока, по которому он едет
            slider.slideTo(0) // сдвинули слайдер в начало
            break
        case "menu-services":
            await moveFakeItem($("#menu-we").width() + 2)
            fakeItem.width($("#menu-services").width())
            slider.slideTo($("#menu-we").width() / 4 + 2) // сдвинули на ширину предыдущего блока + 2px вправо
            break
        case "menu-examples":
            await moveFakeItem($("#menu-we").width() + $("#menu-services").width() + 2)
            fakeItem.width($("#menu-examples").width())
            slider.slideTo($("#menu-we").width() + $("#menu-we").width() / 2 + 2)
            break
        case "menu-process":
            await moveFakeItem($("#menu-we").width() + $("#menu-services").width() + $("#menu-examples").width() + 2)
            fakeItem.width($("#menu-process").width())
            slider.slideTo($("#menu-we").width() + $("#menu-services").width() + $("#menu-services").width() / 2 + 2)
            break
        case "menu-vacancies":
            await moveFakeItem($("#menu-we").width() + $("#menu-services").width() + $("#menu-examples").width() + $("#menu-process").width() + 2)
            fakeItem.width($("#menu-vacancies").width())
            slider.slideTo($("#menu-we").width() + $("#menu-services").width() + $("#menu-examples").width() + $("#menu-process").width() / 2 + 2)
            break
        case "menu-contacts":
            await moveFakeItem($("#menu-we").width() + $("#menu-services").width() + $("#menu-examples").width() + $("#menu-process").width() + $("#menu-vacancies").width() + 2)
            fakeItem.width($("#menu-contacts").width())
            slider.slideTo($("#menu-we").width() + $("#menu-services").width() + $("#menu-examples").width() + $("#menu-process").width() + $("#menu-vacancies").width())
            break
        default:
            break
    }
}
"use strict"

document.addEventListener('DOMContentLoaded', function () {

	const form1 = document.getElementById('form1');
	const form2 = document.getElementById('form2');

	form1.addEventListener('submit', (e) => formSend(e, form1));
	form2.addEventListener('submit', (e) => formSend(e, form2));


	async function formSend(e, form) {
		e.preventDefault();

		let formData = new FormData(form);
		let error = formValidate(form);

		if (error === 0) {
			form.classList.add('_sending');
			let response = await fetch('sendmail.php', {
				method: 'POST',
				body: formData
			});
			if (response.ok) {
				let result = await response.json();
				showSuccessModal()
				form.reset();
				form.classList.remove('_sending');
			} else {
				showFailModal()
				form.classList.remove('_sending');
			}
		} else {
			// ...
		}
	}
});

const showSuccessModal = () => {
	// показ и автозакрытие попапа с сообщением об успехе
	if ($("div.success").hasClass("visible")) {
		// ...
	} else {
		$("div.success").addClass("visible")
		$("div.success").removeClass("hidden")
		setTimeout(() => {
			$("div.success").removeClass("visible")
			$("div.success").addClass("hidden")
		}, 2500)
	}
}

const showFailModal = () => {
	// показ и автозакрытие попапа с сообщением об ошибке
	if ($("div.fail").hasClass("visible")) {
		// ...
	} else {
		$("div.fail").addClass("visible")
		$("div.fail").removeClass("hidden")
		setTimeout(() => {
			$("div.fail").removeClass("visible")
			$("div.fail").addClass("hidden")
		}, 2500)
	}
}

function formValidate(form) {
	// валидация формы
	let error = 0; // количество ошибок
	let formReq = document.querySelectorAll('._req'); // обязательные поля ввода

	for (let index = 0; index < formReq.length; index++) {
		const input = formReq[index];

		if (!isChild(form, input)) continue; // если это поле не из этой формы, то пропускаем

		formRemoveError(input); // очищаем прошлые ошибки, на всякий случай

		if (input.getAttribute("type") === "checkbox" && input.checked === false) {
			// если это чекбокс и он пустой
			formAddError(input);
			error++;
			input.addEventListener("change", () => {
				// убираем ошибку, если пользователь ставит галочку
				formRemoveError(input)
			})
			break; // выходим, т.к. хотим показывать ошибки по очереди, а не все сразу
		} else {
			// если это просто input
			if (input.value === '') {
				formAddError(input);
				error++;
				input.addEventListener("keyup", () => {
					// убираем ошибку, если пользователь начинает что-то вводить
					formRemoveError(input)
				})
				break;
			}
		}
	}
	return error;
}

function formAddError(input) {
	input.parentElement.classList.add('_error');
}

function formRemoveError(input) {
	input.parentElement.classList.remove('_error');
}

function isChild(parent, child) {
	// проверяет на наличие дочернего элемента child у parent
	if (parent.contains(child)) return true;
	return false;
}
const productsData = {
  code_design_landing: {
    id: "code_design_landing",
    category: "Код + дизайн",
    name: "Лендинг",
    includes: "<p>— Логотип со всеми необходимыми его вариантами;</p>" +
      "<p>— Подбор шрифтов;</p>" +
      "<p>— Цветовая палитра;</p>" +
      "<p>— Руководство по использованию.</p>",
    time: "<p>11 дней без учета правок</p>",
    process: "<p>1. Знакомство и ответы на вопросы;</p>" +
      " <p>2. Заключение договора;</p>" +
      "<p>3. Поэтапное согласование матриц проекта, шрифтов и самого логотипа.</p>",
    price: "20,000 ₽",
    pricing: "<p class=\"mb-21\">Час работы дизайнера: ~ 500 ₽</p>" +
      "<p>60% — вознаграждение специалиста;</p>" +
      "<p>10% — налоги и взносы;</p>" +
      "<p>15% — аммортизация, развитие;</p>" +
      "<p> 15% — вознаграждение старожил-атлантов =D</p>",
    images: "<img src=\"../img/services/svg/landing_white.svg\" class=\"product-slider__item\" />" +
      "<img src=\"../img/services/svg/landing_white.svg\" class=\"product-slider__item\" />" +
      "<img src=\"../img/services/svg/landing_white.svg\" class=\"product-slider__item\" />",
  },
  code_design_bigsite: {
    id: "code_design_bigsite",
    category: "Код + дизайн",
    name: "Большой сайт",
    includes: "<p>— Логотип со всеми необходимыми его вариантами;</p>" +
      "<p>— Подбор шрифтов;</p>" +
      "<p>— Цветовая палитра;</p>" +
      "<p>— Руководство по использованию.</p>",
    time: "<p>11 дней без учета правок</p>",
    process: "<p>1. Знакомство и ответы на вопросы;</p>" +
      " <p>2. Заключение договора;</p>" +
      "<p>3. Поэтапное согласование матриц проекта, шрифтов и самого логотипа.</p>",
    price: "20,000 ₽",
    pricing: "<p class=\"mb-21\">Час работы дизайнера: ~ 500 ₽</p>" +
      "<p>60% — вознаграждение специалиста;</p>" +
      "<p>10% — налоги и взносы;</p>" +
      "<p>15% — аммортизация, развитие;</p>" +
      "<p> 15% — вознаграждение старожил-атлантов =D</p>",
    images: "<img src=\"../img/services/svg/big_white.svg\" class=\"product-slider__item\" />" +
      "<img src=\"../img/services/svg/big_white.svg\" class=\"product-slider__item\" />" +
      "<img src=\"../img/services/svg/big_white.svg\" class=\"product-slider__item\" />",
  },
  code_design_market: {
    id: "code_design_market",
    category: "Код + дизайн",
    name: "Интернет-магазин",
    includes: "<p>— Логотип со всеми необходимыми его вариантами;</p>" +
      "<p>— Подбор шрифтов;</p>" +
      "<p>— Цветовая палитра;</p>" +
      "<p>— Руководство по использованию.</p>",
    time: "<p>11 дней без учета правок</p>",
    process: "<p>1. Знакомство и ответы на вопросы;</p>" +
      " <p>2. Заключение договора;</p>" +
      "<p>3. Поэтапное согласование матриц проекта, шрифтов и самого логотипа.</p>",
    price: "20,000 ₽",
    pricing: "<p class=\"mb-21\">Час работы дизайнера: ~ 500 ₽</p>" +
      "<p>60% — вознаграждение специалиста;</p>" +
      "<p>10% — налоги и взносы;</p>" +
      "<p>15% — аммортизация, развитие;</p>" +
      "<p> 15% — вознаграждение старожил-атлантов =D</p>",
    images: "<img src=\"../img/services/svg/market_white.svg\" class=\"product-slider__item\" />" +
      "<img src=\"../img/services/svg/market_white.svg\" class=\"product-slider__item\" />" +
      "<img src=\"../img/services/svg/market_white.svg\" class=\"product-slider__item\" />",
  },
  design_logo: {
    id: "design_logo",
    category: "Только дизайн",
    name: "Логотип",
    includes: "<p>— Логотип со всеми необходимыми его вариантами;</p>" +
      "<p>— Подбор шрифтов;</p>" +
      "<p>— Цветовая палитра;</p>" +
      "<p>— Руководство по использованию.</p>",
    time: "<p>11 дней без учета правок</p>",
    process: "<p>1. Знакомство и ответы на вопросы;</p>" +
      " <p>2. Заключение договора;</p>" +
      "<p>3. Поэтапное согласование матриц проекта, шрифтов и самого логотипа.</p>",
    price: "20,000 ₽",
    pricing: "<p class=\"mb-21\">Час работы дизайнера: ~ 500 ₽</p>" +
      "<p>60% — вознаграждение специалиста;</p>" +
      "<p>10% — налоги и взносы;</p>" +
      "<p>15% — аммортизация, развитие;</p>" +
      "<p> 15% — вознаграждение старожил-атлантов =D</p>",
    images: "<img src=\"../img/services/svg/logo_white.svg\" class=\"product-slider__item\" />" +
      "<img src=\"../img/services/svg/logo_white.svg\" class=\"product-slider__item\" />" +
      "<img src=\"../img/services/svg/logo_white.svg\" class=\"product-slider__item\" />",
  },
  design_branding: {
    id: "design_branding",
    category: "Только дизайн",
    name: "Фирменный стиль",
    includes: "<p>— Логотип со всеми необходимыми его вариантами;</p>" +
      "<p>— Подбор шрифтов;</p>" +
      "<p>— Цветовая палитра;</p>" +
      "<p>— Руководство по использованию.</p>",
    time: "<p>11 дней без учета правок</p>",
    process: "<p>1. Знакомство и ответы на вопросы;</p>" +
      " <p>2. Заключение договора;</p>" +
      "<p>3. Поэтапное согласование матриц проекта, шрифтов и самого логотипа.</p>",
    price: "20,000 ₽",
    pricing: "<p class=\"mb-21\">Час работы дизайнера: ~ 500 ₽</p>" +
      "<p>60% — вознаграждение специалиста;</p>" +
      "<p>10% — налоги и взносы;</p>" +
      "<p>15% — аммортизация, развитие;</p>" +
      "<p> 15% — вознаграждение старожил-атлантов =D</p>",
    images: "<img src=\"../img/services/svg/branding_white.svg\" class=\"product-slider__item\" />" +
      "<img src=\"../img/services/svg/branding_white.svg\" class=\"product-slider__item\" />" +
      "<img src=\"../img/services/svg/branding_white.svg\" class=\"product-slider__item\" />",
  },
  design_landing: {
    id: "design_landing",
    name: "Лендинг",
    category: "Только дизайн",
    includes: "<p>— Логотип со всеми необходимыми его вариантами;</p>" +
      "<p>— Подбор шрифтов;</p>" +
      "<p>— Цветовая палитра;</p>" +
      "<p>— Руководство по использованию.</p>",
    time: "<p>11 дней без учета правок</p>",
    process: "<p>1. Знакомство и ответы на вопросы;</p>" +
      " <p>2. Заключение договора;</p>" +
      "<p>3. Поэтапное согласование матриц проекта, шрифтов и самого логотипа.</p>",
    price: "20,000 ₽",
    pricing: "<p class=\"mb-21\">Час работы дизайнера: ~ 500 ₽</p>" +
      "<p>60% — вознаграждение специалиста;</p>" +
      "<p>10% — налоги и взносы;</p>" +
      "<p>15% — аммортизация, развитие;</p>" +
      "<p> 15% — вознаграждение старожил-атлантов =D</p>",
    images: "<img src=\"../img/services/svg/landing_white.svg\" class=\"product-slider__item\" />" +
      "<img src=\"../img/services/svg/landing_white.svg\" class=\"product-slider__item\" />" +
      "<img src=\"../img/services/svg/landing_white.svg\" class=\"product-slider__item\" />",
  },
  design_bigsite: {
    id: "design_bigsite",
    name: "Большой сайт",
    category: "Только дизайн",
    includes: "<p>— Логотип со всеми необходимыми его вариантами;</p>" +
      "<p>— Подбор шрифтов;</p>" +
      "<p>— Цветовая палитра;</p>" +
      "<p>— Руководство по использованию.</p>",
    time: "<p>11 дней без учета правок</p>",
    process: "<p>1. Знакомство и ответы на вопросы;</p>" +
      " <p>2. Заключение договора;</p>" +
      "<p>3. Поэтапное согласование матриц проекта, шрифтов и самого логотипа.</p>",
    price: "20,000 ₽",
    pricing: "<p class=\"mb-21\">Час работы дизайнера: ~ 500 ₽</p>" +
      "<p>60% — вознаграждение специалиста;</p>" +
      "<p>10% — налоги и взносы;</p>" +
      "<p>15% — аммортизация, развитие;</p>" +
      "<p> 15% — вознаграждение старожил-атлантов =D</p>",
    images: "<img src=\"../img/services/svg/big_white.svg\" class=\"product-slider__item\" />" +
      "<img src=\"../img/services/svg/big_white.svg\" class=\"product-slider__item\" />" +
      "<img src=\"../img/services/svg/big_white.svg\" class=\"product-slider__item\" />",
  },
  design_market: {
    id: "design_market",
    name: "Интернет-магазин",
    category: "Только дизайн",
    includes: "<p>— Логотип со всеми необходимыми его вариантами;</p>" +
      "<p>— Подбор шрифтов;</p>" +
      "<p>— Цветовая палитра;</p>" +
      "<p>— Руководство по использованию.</p>",
    time: "<p>11 дней без учета правок</p>",
    process: "<p>1. Знакомство и ответы на вопросы;</p>" +
      " <p>2. Заключение договора;</p>" +
      "<p>3. Поэтапное согласование матриц проекта, шрифтов и самого логотипа.</p>",
    price: "20,000 ₽",
    pricing: "<p class=\"mb-21\">Час работы дизайнера: ~ 500 ₽</p>" +
      "<p>60% — вознаграждение специалиста;</p>" +
      "<p>10% — налоги и взносы;</p>" +
      "<p>15% — аммортизация, развитие;</p>" +
      "<p> 15% — вознаграждение старожил-атлантов =D</p>",
    images: "<img src=\"../img/services/svg/market_white.svg\" class=\"product-slider__item\" />" +
      "<img src=\"../img/services/svg/market_white.svg\" class=\"product-slider__item\" />" +
      "<img src=\"../img/services/svg/market_white.svg\" class=\"product-slider__item\" />",
  },
  design_polygraphy: {
    id: "design_polygraphy",
    name: "Полиграфия",
    category: "Только дизайн",
    includes: "<p>— Логотип со всеми необходимыми его вариантами;</p>" +
      "<p>— Подбор шрифтов;</p>" +
      "<p>— Цветовая палитра;</p>" +
      "<p>— Руководство по использованию.</p>",
    time: "<p>11 дней без учета правок</p>",
    process: "<p>1. Знакомство и ответы на вопросы;</p>" +
      " <p>2. Заключение договора;</p>" +
      "<p>3. Поэтапное согласование матриц проекта, шрифтов и самого логотипа.</p>",
    price: "20,000 ₽",
    pricing: "<p class=\"mb-21\">Час работы дизайнера: ~ 500 ₽</p>" +
      "<p>60% — вознаграждение специалиста;</p>" +
      "<p>10% — налоги и взносы;</p>" +
      "<p>15% — аммортизация, развитие;</p>" +
      "<p> 15% — вознаграждение старожил-атлантов =D</p>",
    images: "<img src=\"../img/services/svg/poligraphy_white.svg\" class=\"product-slider__item\" />" +
      "<img src=\"../img/services/svg/poligraphy_white.svg\" class=\"product-slider__item\" />" +
      "<img src=\"../img/services/svg/poligraphy_white.svg\" class=\"product-slider__item\" />",
  },
  design_networks: {
    id: "design_networks",
    name: "Социальные сети",
    category: "Только дизайн",
    includes: "<p>— Логотип со всеми необходимыми его вариантами;</p>" +
      "<p>— Подбор шрифтов;</p>" +
      "<p>— Цветовая палитра;</p>" +
      "<p>— Руководство по использованию.</p>",
    time: "<p>11 дней без учета правок</p>",
    process: "<p>1. Знакомство и ответы на вопросы;</p>" +
      " <p>2. Заключение договора;</p>" +
      "<p>3. Поэтапное согласование матриц проекта, шрифтов и самого логотипа.</p>",
    price: "20,000 ₽",
    pricing: "<p class=\"mb-21\">Час работы дизайнера: ~ 500 ₽</p>" +
      "<p>60% — вознаграждение специалиста;</p>" +
      "<p>10% — налоги и взносы;</p>" +
      "<p>15% — аммортизация, развитие;</p>" +
      "<p> 15% — вознаграждение старожил-атлантов =D</p>",
    images: "<img src=\"../img/services/svg/network_white.svg\" class=\"product-slider__item\" />" +
      "<img src=\"../img/services/svg/network_white.svg\" class=\"product-slider__item\" />" +
      "<img src=\"../img/services/svg/network_white.svg\" class=\"product-slider__item\" />",
  },
  marketing_complex: {
    id: "marketing_complex",
    name: "Комплексная реклама",
    category: "Реклама",
    includes: "<p>— Логотип со всеми необходимыми его вариантами;</p>" +
      "<p>— Подбор шрифтов;</p>" +
      "<p>— Цветовая палитра;</p>" +
      "<p>— Руководство по использованию.</p>",
    time: "<p>11 дней без учета правок</p>",
    process: "<p>1. Знакомство и ответы на вопросы;</p>" +
      " <p>2. Заключение договора;</p>" +
      "<p>3. Поэтапное согласование матриц проекта, шрифтов и самого логотипа.</p>",
    price: "20,000 ₽",
    pricing: "<p class=\"mb-21\">Час работы дизайнера: ~ 500 ₽</p>" +
      "<p>60% — вознаграждение специалиста;</p>" +
      "<p>10% — налоги и взносы;</p>" +
      "<p>15% — аммортизация, развитие;</p>" +
      "<p> 15% — вознаграждение старожил-атлантов =D</p>",
    images: "<img src=\"../img/services/svg/complex_white.svg\" class=\"product-slider__item\" />" +
      "<img src=\"../img/services/svg/complex_white.svg\" class=\"product-slider__item\" />" +
      "<img src=\"../img/services/svg/complex_white.svg\" class=\"product-slider__item\" />",
  },
  marketing_context: {
    id: "marketing_context",
    name: "Контекстная реклама",
    category: "Реклама",
    includes: "<p>— Логотип со всеми необходимыми его вариантами;</p>" +
      "<p>— Подбор шрифтов;</p>" +
      "<p>— Цветовая палитра;</p>" +
      "<p>— Руководство по использованию.</p>",
    time: "<p>11 дней без учета правок</p>",
    process: "<p>1. Знакомство и ответы на вопросы;</p>" +
      " <p>2. Заключение договора;</p>" +
      "<p>3. Поэтапное согласование матриц проекта, шрифтов и самого логотипа.</p>",
    price: "20,000 ₽",
    pricing: "<p class=\"mb-21\">Час работы дизайнера: ~ 500 ₽</p>" +
      "<p>60% — вознаграждение специалиста;</p>" +
      "<p>10% — налоги и взносы;</p>" +
      "<p>15% — аммортизация, развитие;</p>" +
      "<p> 15% — вознаграждение старожил-атлантов =D</p>",
    images: "<img src=\"../img/services/svg/context_white.svg\" class=\"product-slider__item\" />" +
      "<img src=\"../img/services/svg/context_white.svg\" class=\"product-slider__item\" />" +
      "<img src=\"../img/services/svg/context_white.svg\" class=\"product-slider__item\" />",
  },
  marketing_seo: {
    id: "marketing_seo",
    name: "SEO продвижение",
    category: "Реклама",
    includes: "<p>— Логотип со всеми необходимыми его вариантами;</p>" +
      "<p>— Подбор шрифтов;</p>" +
      "<p>— Цветовая палитра;</p>" +
      "<p>— Руководство по использованию.</p>",
    time: "<p>11 дней без учета правок</p>",
    process: "<p>1. Знакомство и ответы на вопросы;</p>" +
      " <p>2. Заключение договора;</p>" +
      "<p>3. Поэтапное согласование матриц проекта, шрифтов и самого логотипа.</p>",
    price: "20,000 ₽",
    pricing: "<p class=\"mb-21\">Час работы дизайнера: ~ 500 ₽</p>" +
      "<p>60% — вознаграждение специалиста;</p>" +
      "<p>10% — налоги и взносы;</p>" +
      "<p>15% — аммортизация, развитие;</p>" +
      "<p> 15% — вознаграждение старожил-атлантов =D</p>",
    images: "<img src=\"../img/services/svg/seo_white.svg\" class=\"product-slider__item\" />" +
      "<img src=\"../img/services/svg/seo_white.svg\" class=\"product-slider__item\" />" +
      "<img src=\"../img/services/svg/seo_white.svg\" class=\"product-slider__item\" />",
  },
  marketing_smm: {
    id: "marketing_smm",
    name: "SMM",
    category: "Реклама",
    includes: "<p>— Логотип со всеми необходимыми его вариантами;</p>" +
      "<p>— Подбор шрифтов;</p>" +
      "<p>— Цветовая палитра;</p>" +
      "<p>— Руководство по использованию.</p>",
    time: "<p>11 дней без учета правок</p>",
    process: "<p>1. Знакомство и ответы на вопросы;</p>" +
      " <p>2. Заключение договора;</p>" +
      "<p>3. Поэтапное согласование матриц проекта, шрифтов и самого логотипа.</p>",
    price: "20,000 ₽",
    pricing: "<p class=\"mb-21\">Час работы дизайнера: ~ 500 ₽</p>" +
      "<p>60% — вознаграждение специалиста;</p>" +
      "<p>10% — налоги и взносы;</p>" +
      "<p>15% — аммортизация, развитие;</p>" +
      "<p> 15% — вознаграждение старожил-атлантов =D</p>",
    images: "<img src=\"../img/services/svg/smm_white.svg\" class=\"product-slider__item\" />" +
      "<img src=\"../img/services/svg/smm_white.svg\" class=\"product-slider__item\" />" +
      "<img src=\"../img/services/svg/smm_white.svg\" class=\"product-slider__item\" />",
  },
  ids: ["code_design_landing", "code_design_bigsite", "code_design_market",
    "design_logo", "design_branding", "design_landing", "design_bigsite", "design_market",
    "design_polygraphy", "design_networks", "marketing_complex", "marketing_context", "marketing_seo",
    "marketing_smm"
  ]
}
let currentProductId = ""
let scrollPos = 0;
let productScrollPos = 0;
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

  const setActiveProduct = (id) => {
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