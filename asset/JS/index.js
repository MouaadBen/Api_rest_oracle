const images = document.querySelectorAll(".chain-img");
let currentIndex = 0;

function showNextImage() {
  images[currentIndex].classList.remove("visible");
  currentIndex = (currentIndex + 1) % images.length;
  images[currentIndex].classList.add("visible");
}

window.addEventListener("load", () => {
  images[currentIndex].classList.add("visible");
  setInterval(showNextImage, 5000);
});
