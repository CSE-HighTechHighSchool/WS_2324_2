/* Name: Jyothi Ramesh, Jasmine Guo, Ishani Singh
   Date: 1/8/2024
   Program: electric.js
   Purpose: Enhance the appearance of the electric html page by adding 
            interactive components such as tabs and fade in transitions
*/


// Selecting DOM elements
const tabs = document.querySelector(".elWrapper");          // Selecting the container for tabs
const tabButton = document.querySelectorAll(".tab-button");  // Selecting all tab buttons
const contents = document.querySelectorAll(".elContent");    // Selecting all content elements
const faders = document.querySelectorAll('.fade-in');       // Selecting elements for fade-in effect
const sliders = document.querySelectorAll('.slide-in')       // Selecting elements for slide-in effect

// Event listener for tab clicks
tabs.onclick = e => {
  const id = e.target.dataset.id;
  if (id) {
    // Removing 'active' class from all tab buttons
    tabButton.forEach(btn => {
      btn.classList.remove("active");
    });
    // Adding 'active' class to the clicked tab button
    e.target.classList.add("active");

    // Removing 'active' class from all content elements
    contents.forEach(content => {
      content.classList.remove("active");
    });
    // Adding 'active' class to the content element corresponding to the clicked tab
    const element = document.getElementById(id);
    element.classList.add("active");
  }
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
