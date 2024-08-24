var swiper = new Swiper(".mySwiper", {
  pagination: {
    el: ".swiper-pagination",
    type: "progressbar",
    loop: true,     
   slidesPerView: 1,

  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
});
function updateCartCount() {
  const countCartItems = JSON.parse(localStorage.getItem('cart')) || [];
  const cartCountElement = document.querySelector('.item-inCart');
  cartCountElement.textContent = countCartItems.length;
}

window.addEventListener('load', updateCartCount);