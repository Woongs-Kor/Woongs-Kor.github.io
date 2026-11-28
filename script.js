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

const folderButtons = document.querySelectorAll(".folder");
folderButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const willOpen = btn.getAttribute("aria-expanded") !== "true";
    folderButtons.forEach((other) => {
      other.setAttribute("aria-expanded", "false");
      document.getElementById(other.getAttribute("aria-controls")).hidden = true;
    });
    if (willOpen) {
      btn.setAttribute("aria-expanded", "true");
      document.getElementById(btn.getAttribute("aria-controls")).hidden = false;
    }
  });
});

document.querySelectorAll("[data-open-folder]").forEach((link) => {
  link.addEventListener("click", () => {
    const target = document.querySelector(`.folder[data-folder="${link.dataset.openFolder}"]`);
    if (target && target.getAttribute("aria-expanded") !== "true") {
      target.click();
    }
  });
});

document.querySelectorAll("[data-proportion-group]").forEach((group) => {
  const segments = Array.from(group.querySelectorAll("[data-chart-count]"));
  if (segments.length === 0) {
    return;
  }

  const counts = segments.map((segment) => Number(segment.dataset.chartCount));
  if (counts.some((count) => !Number.isFinite(count) || count < 0)) {
    console.error("Invalid count in proportional chart.", group);
    return;
  }

  const total = counts.reduce((sum, count) => sum + count, 0);
  if (total === 0) {
    console.error("Proportional chart counts must sum to more than zero.", group);
    return;
  }

  segments.forEach((segment, index) => {
    const share = (counts[index] / total) * 100;
    segment.style.flexBasis = `${share}%`;

    const shareLabel = group.querySelector(
      `[data-chart-share="${segment.dataset.chartKey}"]`
    );
    if (shareLabel) {
      shareLabel.textContent = `${share.toFixed(1)}%`;
    }
  });
});
