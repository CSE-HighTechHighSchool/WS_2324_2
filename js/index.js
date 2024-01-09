var coll = document.getElementsByClassName("collapsible");
var i;
const faders = document.querySelectorAll('.fade-in');
const sliders = document.querySelectorAll('.slide-in')

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.display === "block") {
      content.style.display = "none";
    } else {
      content.style.display = "block";
    }
  });
}

const appearOptions = {
  threshold: 0,
  rootMargin: '0px 0px -250px 0px'
};

const appearOnScroll = new IntersectionObserver(function(entries, appearOnScroll){
  entries.forEach(entry => {
    if (!entry.isIntersecting) {
      return;
    } else {
      entry.target.classList.add('appear');
      appearOnScroll.unobserve(entry.target);
    }
  })
}, appearOptions);

faders.forEach(fader => {
  appearOnScroll.observe(fader);
})

sliders.forEach(slider => {
  appearOnScroll.observe(slider);
});