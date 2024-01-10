// Selecting elements with class "collapsible"
var coll = document.getElementsByClassName("collapsible");
var i;

// Selecting elements for fade-in and slide-in effects
const faders = document.querySelectorAll('.fade-in');
const sliders = document.querySelectorAll('.slide-in')

// Adding click event listeners to collapsible elements
for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function() {
    // Toggling the "active" class on the clicked collapsible element
    this.classList.toggle("active");
    // Selecting the next sibling element
    var content = this.nextElementSibling;
    // Toggling the display property of the next sibling element
    if (content.style.display === "block") {
      content.style.display = "none";
    } else {
      content.style.display = "block";
    }
  });
}

// Options for IntersectionObserver
const appearOptions = {
  threshold: 0,
  rootMargin: '0px 0px -250px 0px'
};

// IntersectionObserver for elements with 'fade-in' effect
const appearOnScroll = new IntersectionObserver(function(entries, appearOnScroll){
  entries.forEach(entry => {
    if (!entry.isIntersecting) {
      return;
    } else {
      // Adding 'appear' class to the element when it becomes visible
      entry.target.classList.add('appear');
      // Unobserving the element to avoid redundant checks
      appearOnScroll.unobserve(entry.target);
    }
  })
}, appearOptions);

// Observing elements with 'fade-in' effect
faders.forEach(fader => {
  appearOnScroll.observe(fader);
})

// Observing elements with 'slide-in' effect
sliders.forEach(slider => {
  appearOnScroll.observe(slider);
});
