$(document).ready(function(){
   $(".menu__item").click(function() {
      $(".menu__item").removeClass("menu__item_active")
      $(this).addClass("menu__item_active")
   })

   $(window).scroll(function() {
      if($(this).scrollTop() >= 90) {
          $('.menu').addClass('stickytop');
          $('.top').addClass('padding-for-top-block')
      }
      else{
          $('.menu').removeClass('stickytop');
          $('.top').removeClass('padding-for-top-block')
      }
  });
});