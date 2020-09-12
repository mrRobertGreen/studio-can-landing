$(document).ready(function(){
    $(".menu__item").click(function() {
        $(".menu__item").removeClass("menu__item_active")
        $(this).addClass("menu__item_active")
        const id = $(this).attr('id');
        const fakeItem = $(".menu__item_fake")
        switch (id) {
            case "menu-we":
                moveFakeItem(1)
                break
            case "menu-services":
                moveFakeItem(152)
                break
            case "menu-examples":
                moveFakeItem(303)
                break
            case "menu-process":
                moveFakeItem(454)
                break
            case "menu-vacancies":
                moveFakeItem(605)
                break
            case "menu-contacts":
                moveFakeItem(756)
                break
            default: 
                fakeItem.animate({left: "", right: "1px"}, 300)
    }
    })

    $(window).scroll(function() {
        if($(this).scrollTop() >= 70) {
            $('.menu').addClass('stickytop');
            $('.top').addClass('p-top-184')
        }
        else {
            $('.menu').removeClass('stickytop');
            $('.top').removeClass('p-top-184')
        }
    });

    $(".menu__row").on('click', '[href*="#"]', function(e){
        $.scrollTo($(this.hash), 500, {'offset':-70});
        e.preventDefault();
    });
    
    let visibleElem = null
    let prevScrollPos = 0

    $(window).on('resize scroll', function() {
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
});


$.fn.isInViewport = function() {
    const elementTop = $(this).offset().top;
    const elementBottom = elementTop + $(this).outerHeight();
  
    const viewportTop = $(window).scrollTop();
    const viewportBottom = viewportTop + $(window).height();
  
    return elementBottom > viewportTop && elementTop < viewportBottom;
};

const moveFakeItem = (left = 1, delay = 300) => {
    const fakeItem = $(".menu__item_fake")
    fakeItem.animate({left: `${left}px`}, delay)
}