$(document).ready(function () {

    let slider;

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
        $(".menu__item").click(function () { // подписались на событие клика по менюшке
            // listen menu-item click  
            $(".menu__item").removeClass("menu__item_active") // удалили активный класс со всех блочков
            $(this).addClass("menu__item_active") // добавили активный класс к блоку, на который тыкнули
            const id = $(this).attr('id'); // взяли id у активного блока
            const fakeItem = $("#menu-fake") // нашли наш бегающий блок
            switch (id) {
                case "menu-we":
                    moveFakeItem(3) // подвинули бегунок на 3 пикселя вправо
                    fakeItem.width($(this).width()) // установили ему ширину равную размеру блока, по которому он едет
                    break
                case "menu-services":
                    moveFakeItem($("#menu-we").width() + 3) // подвинули бегунок на ширину предыдущего блока + 3px
                    fakeItem.width($(this).width()) // установили ему ширину равную размеру блока, по которому он едет
                    break
                    // далее все аналогично
                case "menu-examples":
                    moveFakeItem($("#menu-we").width() + $("#menu-services").width() + 3)
                    fakeItem.width($(this).width())
                    break
                case "menu-process":
                    moveFakeItem($("#menu-we").width() + $("#menu-services").width() + $("#menu-examples").width() + 3)
                    fakeItem.width($(this).width())
                    break
                case "menu-vacancies":
                    moveFakeItem($("#menu-we").width() + $("#menu-services").width() + $("#menu-examples").width() + $("#menu-process").width() + 3)
                    fakeItem.width($(this).width())
                    break
                case "menu-contacts":
                    moveFakeItem($("#menu-we").width() + $("#menu-services").width() + $("#menu-examples").width() + $("#menu-process").width() + $("#menu-vacancies").width() + 6)
                    fakeItem.width($(this).width())
                    break
                default:
                    break
            }
        })
    } else {
        // тут все то же самое
        // отличается только ширина сдвига бегунка
        // и добавляется новая фича - слайдер автоматически скроллится при переключении блоков
        $(".menu__item").click(function () {
            $(".menu__item").removeClass("menu__item_active")
            $(this).addClass("menu__item_active")
            const id = $(this).attr('id');
            const fakeItem = $("#menu-fake")
            switch (id) {
                case "menu-we":
                    moveFakeItem(2) // подвинули бегунок на 2 пикселя вправо
                    fakeItem.width($(this).width()) // установили ему ширину равную размеру блока, по которому он едет
                    slider.slideTo(0) // сдвинули слайдер в начало
                    break
                case "menu-services":
                    moveFakeItem($("#menu-we").width() + 2)
                    fakeItem.width($(this).width())
                    slider.slideTo($("#menu-we").width() / 4 + 2) // сдвинули на ширину предыдущего блока + 2px вправо
                    break
                case "menu-examples":
                    moveFakeItem($("#menu-we").width() + $("#menu-services").width() + 2)
                    fakeItem.width($(this).width())
                    slider.slideTo($("#menu-we").width() + $("#menu-we").width() / 2 + 2)
                    break
                case "menu-process":
                    moveFakeItem($("#menu-we").width() + $("#menu-services").width() + $("#menu-examples").width() + 2)
                    fakeItem.width($(this).width())
                    slider.slideTo($("#menu-we").width() + $("#menu-services").width() + $("#menu-services").width() / 2 + 2)
                    break
                case "menu-vacancies":
                    moveFakeItem($("#menu-we").width() + $("#menu-services").width() + $("#menu-examples").width() + $("#menu-process").width() + 2)
                    fakeItem.width($(this).width())
                    slider.slideTo($("#menu-we").width() + $("#menu-services").width() + $("#menu-examples").width() + $("#menu-process").width() / 2 + 2)
                    break
                case "menu-contacts":
                    moveFakeItem($("#menu-we").width() + $("#menu-services").width() + $("#menu-examples").width() + $("#menu-process").width() + $("#menu-vacancies").width() + 2)
                    fakeItem.width($(this).width())
                    slider.slideTo($("#menu-we").width() + $("#menu-services").width() + $("#menu-examples").width() + $("#menu-process").width() + $("#menu-vacancies").width())
                    break
                default:
                    break
            }
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

    $(".menu__track").on('click', '[href*="#"]', function (e) {
        // make smooth scroll to anchor
        e.preventDefault()

        if (this.hash== "#we") {
            $('html,body').animate({scrollTop: $(this.hash).offset().top + 1}, 500);
        } else {
            $('html,body').animate({scrollTop: $(this.hash).offset().top - 100}, 500);
        }
        
    });

    $("#textarea").on('keyup', function() {
        // textarea resizing
        if (this.scrollTop > 0){
          this.style.height = this.scrollHeight + "px";
        }
      });
});

$.fn.isInViewport = function () {
    // check element visibility
    const elementTop = $(this).offset().top;
    const elementBottom = elementTop + $(this).outerHeight();

    const menuHeight = 70 // height of top fixed menu

    const viewportTop = $(window).scrollTop() + menuHeight;
    const viewportBottom = viewportTop + $(window).height();

    return elementBottom > viewportTop && elementTop < viewportBottom;
};

const moveFakeItem = (left = 1, delay = 300) => {
    // move fake menu item to left with delay
    const fakeItem = $(".menu__item_fake")
    fakeItem.animate({
        left: `${left}px`
    }, delay)
}