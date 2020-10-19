$(document).ready(function () {
    $("#menu-fake").width($("#menu-we").width())
    $(".menu__item").click(function () {
        // listen menu-item click  
        $(".menu__item").removeClass("menu__item_active")
        $(this).addClass("menu__item_active")
        const id = $(this).attr('id');
        const fakeItem = $("#menu-fake")
        switch (id) {
            case "menu-we":
                moveFakeItem(3)
                fakeItem.width($(this).width())
                break
            case "menu-services":
                moveFakeItem($("#menu-we").outerWidth() + 3)
                fakeItem.width($(this).width())
                break
            case "menu-examples":
                moveFakeItem($("#menu-we").outerWidth() + $("#menu-services").outerWidth() + 3)
                fakeItem.width($(this).width())
                break
            case "menu-process":
                moveFakeItem($("#menu-we").outerWidth() + $("#menu-services").outerWidth() + $("#menu-examples").outerWidth() + 3)
                fakeItem.width($(this).width())
                break
            case "menu-vacancies":
                moveFakeItem($("#menu-we").outerWidth() + $("#menu-services").outerWidth() + $("#menu-examples").outerWidth() + $("#menu-process").outerWidth() + 3)
                fakeItem.width($(this).width())
                break
            case "menu-contacts":
                moveFakeItem($("#menu-we").outerWidth() + $("#menu-services").outerWidth() + $("#menu-examples").outerWidth() + $("#menu-process").outerWidth() + $("#menu-vacancies").outerWidth())
                fakeItem.width($(this).width())
                break
            default:
                break
        }
    })

    $(window).scroll(function () {
        // make menu fixed on top
        if ($(this).scrollTop() >= 70) {
            $('.menu').addClass('stickytop');
            $('.top').addClass('p-top-184')
        } else {
            $('.menu').removeClass('stickytop');
            $('.top').removeClass('p-top-184')
        }
    });

    $(".menu__row").on('click', '[href*="#"]', function (e) {
        // make smooth scroll to anchor
        $.scrollTo($(this.hash), 500, {
            'offset': -70
        });
        e.preventDefault();
    });

    let visibleElem = null
    // let prevScrollPos = 0

    $(window).on('resize scroll', function () {
        // switch menu items when scrolling
        let pagesArr = [
            "we",
            "services",
            "examples",
            "process",
            "vacancies",
            "contacts",
        ]

        // pagesArr = prevScrollPos > $(this).scrollTop ? pagesArr.reverse() : pagesArr
        // prevScrollPos = $(this).scrollTop

        elem = pagesArr.find(page => $(`#${page}`).isInViewport())
        if (elem && visibleElem !== elem) {
            $(`#menu-${elem}`).click()
            visibleElem = elem
        }
    });

    // horizontal scroll on menu
    if (window.matchMedia('(max-width: 768px)').matches) {
        var options = {
            horizontal: 1,
            speed: 300,
            mouseDragging: 1,
            touchDragging: 1,
        };
        var frame = new Sly('#frame', options).init();
    }

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