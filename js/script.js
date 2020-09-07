$(document).ready(function(){
    $(".menu__item").click(function() {
        $(".menu__item").removeClass("menu__item_active")
        $(this).addClass("menu__item_active")
        const id = $(this).attr('id');
        const fakeItem = $(".menu__item_fake")
        switch (+id) {
            case 1:
                fakeItem.animate({left: "1px"}, 300)
                break
            case 2:
                fakeItem.animate({left: "152px"}, 300)
                break
            case 3:
                fakeItem.animate({left: "303px"}, 300)
                break
            case 4:
                fakeItem.animate({left: "454px"}, 300)
                break
            case 5:
                fakeItem.animate({left: "605px"}, 300)
                break
            case 6:
                fakeItem.animate({left: "756px"}, 300)
                break
            default: 
                fakeItem.animate({left: "", right: "1px"}, 300)
    }
    })

    $(window).scroll(function() {
        if($(this).scrollTop() > 0) {
            $('.header-wrap').addClass('stickytop');
            // $('.top').addClass('padding-for-top-block')
        }
        else {
            $('.header-wrap').removeClass('stickytop');
            // $('.top').removeClass('padding-for-top-block')
        }
    });
});