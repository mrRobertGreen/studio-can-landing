$(document).ready(function () {

    let slider;
    const ids = ["we", "services", "examples", "process", "vacancies", "contacts"] // массив id блоков
    let isAllowedAutoSwitching = true; // разрешено ли автопролистывание меню
    let viewedBlockIdx = 0 // блок, находящийся в поле зрения
    let lastScrollTop = 0;

    if (window.matchMedia('(max-width: 768px)').matches) {
        // если ширина экрана не больше 768 пикселей
        const options = {
            horizontal: 1,
            speed: 300,
            mouseDragging: 1,
            touchDragging: 1,
        };
        slider = new Sly('#frame', options).init();
    }

    $("#menu-fake").width($("#menu-we").width()) // установили начальную ширину бегунку

    if (window.matchMedia('(min-width: 900px)').matches) {
        // если ширина экрана больше 900 пикселей
        $(".menu__item").click(async function () { // подписались на событие клика по менюшке
            // isAllowedAutoSwitching = false // запрещаем автопролистывание меню
            await bigMenuController($(this).attr('id')) // двигаем ползунок в менюшке
            // viewedBlockIdx = ids.findIndex(item => item === $(this).attr('id').substr(5))
            // isAllowedAutoSwitching = true // разрешаем автопролистывание меню
        })
    } else {
        $(".menu__item").click(async function () {
            // isAllowedAutoSwitching = false
            await smallMenuController($(this).attr('id'), slider)
            // viewedBlockIdx = ids.findIndex(item => item === $(this).attr('id').substr(5))
            // isAllowedAutoSwitching = true
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
            if ($(this).scrollTop() >= 66) {
                $('.menu-copy').css("display", "block");
                $('.menu').addClass('stickytop');
            } else {
                $('.menu').removeClass('stickytop');
                $('.menu-copy').css("display", "none");
            }
        }

    });

    $(".menu__track").on('click', '[href*="#"]', async function (e) {
        // плавная прокрутка до якоря
        e.preventDefault()
        isAllowedAutoSwitching = false

        if (this.hash == "#we") {
            await $('html,body').animate({
                scrollTop: $(this.hash).offset().top + 1
            }, 500, "swing", () => isAllowedAutoSwitching = true);
            // последним параметром идет функция, которая выполняется послео кончания анимации
            // в ней мы вкючаем автопролистывание
            viewedBlockIdx = ids.findIndex(item => item === "we")
        } else {
            await $('html,body').animate({
                scrollTop: $(this.hash).offset().top - 100
            }, 500, "swing", () => isAllowedAutoSwitching = true);
            viewedBlockIdx = ids.findIndex(item => item === this.hash.substr(1))
        }
    });



    let currentIndex = 0
    let lastCurrentIndex = 0
    $(window).on("scroll", function () {
        let scrollTop = $(this).scrollTop();
        
        if (!isAllowedAutoSwitching) return

        if (scrollTop > lastScrollTop) {
            // скролл вниз
            for (let i = currentIndex; i < ids.length; ++i) {
                if (isVisible("#" + ids[i] + "-start")) {
                    currentIndex = i
                }
            }
        } else {
            // скролл вверх
            for (let i = currentIndex; i >= 0; --i) {
                if (isVisible("#" + ids[i] + "-end")) {
                    currentIndex = i
                }
            }
        }

        if (lastCurrentIndex !== currentIndex) {
            console.log("currentIndex: ", currentIndex)
            console.log("lastCurrentIndex: ", lastCurrentIndex)
            lastCurrentIndex = currentIndex
            if (window.matchMedia('(min-width: 900px)').matches) {
                // если ширина экрана больше 900 пикселей
                bigMenuController(`menu-${ids[currentIndex]}`)
            } else {
                smallMenuController(`menu-${ids[currentIndex]}`, slider)
            }
        }
        lastScrollTop = scrollTop;
    })


    // $(window).on("scroll", function (event) {
    //     if (!isAllowedAutoSwitching) return // если запрещено автопролистывание, то выходим

    //     let scrollTop = $(this).scrollTop();

    //     if (scrollTop > lastScrollTop) {
    //         // скролл вниз
    //         for (let i = viewedBlockIdx; i < ids.length; ++i) {
    //             if (isInViewport($(`#${ids[i]}`)) && !isInViewport($(`#${ids[viewedBlockIdx]}`))) {
    //                 if (window.matchMedia('(min-width: 900px)').matches) {
    //                     // если ширина экрана больше 900 пикселей
    //                     bigMenuController(`menu-${ids[i]}`)
    //                 } else {
    //                     smallMenuController(`menu-${ids[i]}`, slider)
    //                 }
    //                 viewedBlockIdx = i
    //                 return
    //             }
    //         }
    //     } else {
    //         // скролл вверх
    //         for (let i = viewedBlockIdx; i >= 0; --i) {
    //             if (isInViewport($(`#${ids[i]}`)) && !isInViewport($(`#${ids[viewedBlockIdx]}`))) {
    //                 if (window.matchMedia('(min-width: 900px)').matches) {
    //                     // если ширина экрана больше 900 пикселей
    //                     bigMenuController(`menu-${ids[i]}`)
    //                 } else {
    //                     smallMenuController(`menu-${ids[i]}`, slider)
    //                 }
    //                 viewedBlockIdx = i
    //                 return
    //             }
    //         }
    //     }
    //     lastScrollTop = scrollTop;
    // });


    // $("#textarea").on('keyup', function () {
    //     // textarea resizing
    //     if (this.scrollTop > 0) {
    //         this.style.height = this.scrollHeight + "px";
    //     } else {
    //         this.style.height = this.scrollHeight + "px";
    //     }
    // });

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

    const viewportTop = $(window).scrollTop() + $(window).height() / 2.5 // значение отступа прокрутки сверху 
    const viewportBottom = viewportTop + $(window).height() - $(window).height() / 2.5; // значение отступа прокрутки сверху + высота окна 

    return elementBottom > viewportTop  && elementTop < viewportBottom; 
};

function isVisibleForScrollDown(id) {
    // check element visibility
    const element = $(id)
    const elementTop = $(element).offset().top; // позиция элемента от верхнего края документа
    const elementBottom = elementTop + $(element).outerHeight(); // позиция конца элемента от верхнего края документа

    const viewportTop = $(window).scrollTop(); // значение отступа прокрутки сверху 
    const viewportBottom = viewportTop + $(window).height(); // значение отступа прокрутки сверху + высота окна 

    return elementBottom - viewportTop >  $(window).height() / 2
};

function isVisibleForScrollUp(id) {
    // check element visibility
    const element = $(id)
    const elementTop = $(element).offset().top; // позиция элемента от верхнего края документа
    const elementBottom = elementTop + $(element).outerHeight(); // позиция конца элемента от верхнего края документа

    const viewportTop = $(window).scrollTop(); // значение отступа прокрутки сверху 
    const viewportBottom = viewportTop + $(window).height(); // значение отступа прокрутки сверху + высота окна 

    return viewportBottom - elementTop >  $(window).height() / 2
};



function isInViewport(id) {
    // check element visibility
    const element = $(id)
      
    const elementTop = $(element).offset().top; // позиция элемента от верхнего края документа
    const elementBottom = elementTop + $(element).outerHeight(); // позиция конца элемента от верхнего края документа

    const menuHeight = 20 + 39 // height of top fixed menu

    const viewportTop = $(window).scrollTop() + menuHeight; // значение отступа прокрутки сверху 
    const viewportBottom = viewportTop + $(window).height(); // значение отступа прокрутки сверху + высота окна 

    return elementBottom > viewportTop && elementTop < viewportBottom;
};

function isInViewportFromBottom(id) {
    // check element visibility
    const element = $(id)
    const elementTop = $(element).offset().top; // позиция элемента от верхнего края документа
    const elementBottom = elementTop + $(element).outerHeight(); // позиция конца элемента от верхнего края документа

    const menuHeight = 20 + 39 // height of top fixed menu

    const viewportTop = $(window).scrollTop() // значение отступа прокрутки сверху 
    const viewportBottom = viewportTop + $(window).height(); // значение отступа прокрутки сверху + высота окна 

    return elementBottom < viewportBottom
};


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
    // const id = $(this).attr('id'); // взяли id у активного блока
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
            break
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