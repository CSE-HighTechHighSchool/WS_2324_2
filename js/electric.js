const tabs = document.querySelector(".elWrapper");
const tabButton = document.querySelectorAll(".tab-button");
const contents = document.querySelectorAll(".elContent");
const faders = document.querySelectorAll('.fade-in');
const sliders = document.querySelectorAll('.slide-in')

tabs.onclick = e => {
  const id = e.target.dataset.id;
  if (id) {
    tabButton.forEach(btn => {
      btn.classList.remove("active");
    });
    e.target.classList.add("active");

    contents.forEach(content => {
      content.classList.remove("active");
    });
    const element = document.getElementById(id);
    element.classList.add("active");
  }
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