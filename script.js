const year = document.getElementById("year");
if (year) {
  year.textContent = String(new Date().getFullYear());
}

const sections = Array.from(document.querySelectorAll("main section[id]"));
const sideLinks = document.querySelectorAll(".sidebar a[href^='#']");

function updateCurrentSection() {
  const probeLine = window.scrollY + window.innerHeight * 0.25;

  let current = sections[0];
  for (const section of sections) {
    if (section.offsetTop <= probeLine) {
      current = section;
    }
  }

  const atBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;
  if (atBottom) {
    current = sections[sections.length - 1];
  }

  sideLinks.forEach((link) => {
    link.classList.toggle(
      "current",
      link.getAttribute("href") === `#${current.id}`
    );
  });
}

window.addEventListener("scroll", updateCurrentSection, { passive: true });
window.addEventListener("resize", updateCurrentSection);
updateCurrentSection();
