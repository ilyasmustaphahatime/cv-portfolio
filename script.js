const topLinks = document.querySelectorAll(".top-link");
const sideLinks = document.querySelectorAll(".side-link");
const allNavLinks = [...topLinks, ...sideLinks];
const sections = document.querySelectorAll("section[id], header[id]");
const backToTopButton = document.querySelector(".back-to-top");
const mobileNavToggle = document.querySelector(".mobile-nav-toggle");
const topNav = document.querySelector(".top-nav");
const revealElements = document.querySelectorAll(".reveal");
const contactForm = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");

function setNavOpen(forceOpen) {
  if (!mobileNavToggle || !topNav) return;

  const shouldOpen =
    typeof forceOpen === "boolean"
      ? forceOpen
      : mobileNavToggle.getAttribute("aria-expanded") !== "true";

  mobileNavToggle.setAttribute("aria-expanded", String(shouldOpen));
  topNav.classList.toggle("open", shouldOpen);
  document.body.classList.toggle("nav-open", shouldOpen);
}

if (mobileNavToggle) {
  mobileNavToggle.addEventListener("click", () => setNavOpen());
}

allNavLinks.forEach((link) => {
  link.addEventListener("click", () => setNavOpen(false));
});

document.addEventListener("click", (event) => {
  if (!topNav || !mobileNavToggle) return;

  const clickedInsideNav =
    topNav.contains(event.target) || mobileNavToggle.contains(event.target);

  if (!clickedInsideNav) {
    setNavOpen(false);
  }
});

function setActiveLink() {
  const offset = window.scrollY + window.innerHeight * 0.28;
  let currentId = "home";

  sections.forEach((section) => {
    if (offset >= section.offsetTop) {
      currentId = section.id;
    }
  });

  allNavLinks.forEach((link) => {
    const isActive = link.getAttribute("href") === `#${currentId}`;
    link.classList.toggle("active", isActive);
  });
}

function updateBackToTop() {
  if (!backToTopButton) return;
  backToTopButton.classList.toggle("visible", window.scrollY > 500);
}

window.addEventListener("scroll", () => {
  setActiveLink();
  updateBackToTop();
});

if (backToTopButton) {
  backToTopButton.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.16,
  }
);

revealElements.forEach((element) => revealObserver.observe(element));

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    const name = contactForm.elements.namedItem("name").value.trim();
    const email = contactForm.elements.namedItem("email").value.trim();
    const message = contactForm.elements.namedItem("message").value.trim();

    if (!name || !email || !message) {
      event.preventDefault();
      formStatus.textContent = "Please fill in all fields before sending.";
      formStatus.className = "form-status error";
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      event.preventDefault();
      formStatus.textContent = "Please enter a valid email address.";
      formStatus.className = "form-status error";
      return;
    }

    formStatus.textContent = "Sending message...";
    formStatus.className = "form-status success";
  });
}

window.addEventListener("resize", () => {
  if (window.innerWidth > 720) {
    setNavOpen(false);
  }
});

setActiveLink();
updateBackToTop();
