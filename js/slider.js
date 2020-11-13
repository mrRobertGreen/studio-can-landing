$(document).ready(function () {

    $(".slider").slick({
        arrows: false,
        dots: true,
        autoplay: true,
        autoplaySpeed: 1000,
    })

    $('.slider').on('beforeChange', function (event, slick, currentSlide, nextSlide) {
        if (nextSlide === 0) {
            $(".slider").slick('slickSetOption', 'autoplaySpeed', 2500);
        } else {
            $(".slider").slick('slickSetOption', 'autoplaySpeed', 4999);
        }
    });
});