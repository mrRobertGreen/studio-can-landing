$(document).ready(function(){
    $(".menu__item").click(function() {
        $(".menu__item").removeClass("menu__item_active")
        $(this).addClass("menu__item_active")
        const id = $(this).attr('id');
        const fakeItem = $(".menu__item_fake")
        switch (id) {
            case "item-1":
                fakeItem.animate({left: "1px"}, 300)
                break
            case "item-2":
                fakeItem.animate({left: "152px"}, 300)
                break
            case "item-3":
                fakeItem.animate({left: "303px"}, 300)
                break
            case "item-4":
                fakeItem.animate({left: "454px"}, 300)
                break
            case "item-5":
                fakeItem.animate({left: "605px"}, 300)
                break
            case "item-6":
                fakeItem.animate({left: "756px"}, 300)
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
    
    // $('.main-menu [href]').each(function() {
    //     if (this.href == window.location.href) {
    //       $(this).addClass('active');
    //     }
    //   });


    // $(window).scroll(function() {
    //     if (0 < $(this).scrollY() < 300) {

    //         $("#item-1" ).find( ".menu__item" ).trigger('click');
    //     }
    // });  
});