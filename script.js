// ===== Helpers
const $ = (q, el = document) => el.querySelector(q);
const $$ = (q, el = document) => [...el.querySelectorAll(q)];

const navLinks = $$(".nav-link");
const sections = ["home", "about", "skills", "services", "contact"].map(id => document.getElementById(id));

const menuBtn = $("#menuBtn");
const closeBtn = $("#closeBtn");
const drawer = $("#drawer");
const drawerLinks = $$(".drawer-link");

const themeBtn = $("#themeBtn");
const yearEl = $("#year");

// ===== Year
yearEl.textContent = new Date().getFullYear();

// ===== Theme (saved)
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "light") document.body.classList.add("light");

function updateThemeIcon() {
  const isLight = document.body.classList.contains("light");
  themeBtn.innerHTML = isLight ? `<i class="fa-solid fa-sun"></i>` : `<i class="fa-solid fa-moon"></i>`;
}
updateThemeIcon();

themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("light");
  localStorage.setItem("theme", document.body.classList.contains("light") ? "light" : "dark");
  updateThemeIcon();
});

// ===== Mobile drawer
function openDrawer(){
  drawer.classList.add("show");
  drawer.setAttribute("aria-hidden", "false");
}
function closeDrawer(){
  drawer.classList.remove("show");
  drawer.setAttribute("aria-hidden", "true");
}
menuBtn.addEventListener("click", openDrawer);
closeBtn.addEventListener("click", closeDrawer);
drawer.addEventListener("click", (e) => { if (e.target === drawer) closeDrawer(); });
drawerLinks.forEach(a => a.addEventListener("click", closeDrawer));

// ===== Active nav on scroll
function setActive(id){
  navLinks.forEach(a => a.classList.toggle("active", a.getAttribute("href") === `#${id}`));
}
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) setActive(entry.target.id);
  });
}, { threshold: 0.45 });

sections.forEach(sec => observer.observe(sec));

// ===== Skill bar animation (on view)
const skillBars = $$(".bar span");
const skillsSection = $("#skills");

const skillObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    skillBars.forEach((bar) => {
      const w = bar.getAttribute("data-width") || "0";
      bar.style.width = `${w}%`;
    });

    skillObs.disconnect(); // animate once
  });
}, { threshold: 0.3 });

skillObs.observe(skillsSection);

// ===== Contact form validation
const form = $("#contactForm");
const toast = $("#toast");

function setError(input, msg){
  const field = input.closest(".field");
  const err = field.querySelector(".err");
  err.textContent = msg;
  input.style.borderColor = msg ? "rgba(255,122,166,.65)" : "";
}
function isEmail(v){
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = $("#name");
  const email = $("#email");
  const subject = $("#subject");
  const message = $("#message");

  let ok = true;

  if (name.value.trim().length < 2) { setError(name, "Enter your name"); ok = false; }
  else setError(name, "");

  if (!isEmail(email.value.trim())) { setError(email, "Enter a valid email"); ok = false; }
  else setError(email, "");

  if (subject.value.trim().length < 3) { setError(subject, "Enter a subject"); ok = false; }
  else setError(subject, "");

  if (message.value.trim().length < 10) { setError(message, "Write at least 10 characters"); ok = false; }
  else setError(message, "");

  if (!ok) return;

  // Demo success
  toast.classList.add("show");
  form.reset();

  setTimeout(() => toast.classList.remove("show"), 2600);
});

// ===== Projects filter + modal
const filterBtns = $$(".fbtn");
const cards = $$(".p-card");

filterBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    filterBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    const f = btn.dataset.filter;
    cards.forEach(card => {
      const tags = (card.dataset.tags || "").split(" ");
      const show = (f === "all") || tags.includes(f);
      card.style.display = show ? "" : "none";
    });
  });
});

const modal = $("#pModal");
const mClose = $("#mClose");
const mTitle = $("#mTitle");
const mDesc = $("#mDesc");
const mStack = $("#mStack");
const mLive = $("#mLive");
const mCode = $("#mCode");

function openModal(data){
  mTitle.textContent = data.title || "Project";
  mDesc.textContent = data.desc || "";
  mStack.innerHTML = "";

  const stack = (data.stack || "").split(",").map(s => s.trim()).filter(Boolean);
  stack.forEach(s => {
    const pill = document.createElement("span");
    pill.className = "stack-pill";
    pill.textContent = s;
    mStack.appendChild(pill);
  });

  mLive.href = data.live || "#";
  mCode.href = data.code || "#";

  modal.classList.add("show");
  modal.setAttribute("aria-hidden", "false");
}
function closeModal(){
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden", "true");
}

$$(".p-open").forEach(btn => {
  btn.addEventListener("click", () => {
    openModal({
      title: btn.dataset.title,
      desc: btn.dataset.desc,
      stack: btn.dataset.stack,
      live: btn.dataset.live,
      code: btn.dataset.code,
    });
  });
});

mClose.addEventListener("click", closeModal);
modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });
