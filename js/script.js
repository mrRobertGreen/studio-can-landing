$(document).ready(function () {
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

    const linkClasses = ".menu__track, .we-are__link, .clouds__item, .process, .offer"

    $(linkClasses).on('click', '[href*="#"]', async function (e) {
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
        console.log(currentIndex)

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
        // textarea resizing
        fixTextareaSize(e.target)
    });

    function fixTextareaSize(textarea) {
        textarea.style.height = 'auto'
        textarea.style.height = textarea.scrollHeight + 0 + "px"
    }
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