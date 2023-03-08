// Initialize Barba.js
Barba.init({
  transitions: [{
    // Define a transition for the "work" namespace
    name: 'scale-down',
    from: {
      namespace: ['home']
    },
    to: {
      namespace: ['work']
    },
    leave(data) {
      // Scale the homepage down to 80%
      return gsap.to(data.current.container, {
        duration: 0.6,
        scaleX: 0.8,
        scaleY: 0.8,
        ease: 'power2.inOut'
      });
    },
    beforeEnter(data) {
      // Move the work page offscreen, ready to animate in
      data.next.container.style.transform = 'translate3d(0, 100%, 0)';
    },
    enter(data) {
      // Animate the work page in from the bottom
      return gsap.fromTo(data.next.container, {
        yPercent: 100
      }, {
        duration: 0.6,
        yPercent: 0,
        ease: 'power2.inOut'
      });
    },
    after(data) {
      // Remove the homepage, since it's now behind the work page
      data.current.container.remove();
    }
  }]
});

// Listen for clicks on the links
document.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', (event) => {
    // Prevent the default link behavior
    event.preventDefault();
    // Trigger the Barba.js transition
    Barba.Pjax.goTo(event.target.href);
  });
});