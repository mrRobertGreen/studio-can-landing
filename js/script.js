$(document).ready(function(){
   $(".menu__item").click(function() {
      $(".menu__item").removeClass("menu__item_active")
      $(this).addClass("menu__item_active")
   })
});