/**
 * DataGuru marketing site.
 * CONTACT_EMAIL stays hello@dataguru.com.
 * The same address is printed in the HTML for visitors without JavaScript.
 */
const CONTACT_EMAIL = "hello@dataguru.com";

const SPORT_SLUGS = new Set([
  "football",
  "tennis",
  "american-football",
  "ice-hockey",
  "basketball",
  "baseball",
  "cricket",
  "rugby",
  "golf",
  "motorsport",
  "other",
]);

function applyContactEmail() {
  document.querySelectorAll("[data-contact-email]").forEach((node) => {
    node.textContent = CONTACT_EMAIL;
    if (node instanceof HTMLAnchorElement) {
      node.href = `mailto:${CONTACT_EMAIL}`;
    }
  });
}

function bindNav() {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("site-nav");
  if (!toggle || !nav) return;

  const close = () => {
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  };

  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") === "true";
    nav.classList.toggle("is-open", !open);
    toggle.setAttribute("aria-expanded", open ? "false" : "true");
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    if (toggle.getAttribute("aria-expanded") !== "true") return;
    close();
    toggle.focus();
  });

  nav.addEventListener("click", (event) => {
    if (event.target instanceof Element && event.target.closest("a")) close();
  });

  window.addEventListener("resize", () => {
    if (window.matchMedia("(min-width: 801px)").matches) close();
  });
}

function fieldValue(form, name) {
  const field = form.elements.namedItem(name);
  if (!field || !("value" in field)) return "";
  return String(field.value).trim();
}

function selectedSports(form) {
  return Array.from(form.querySelectorAll('input[name="sports"]:checked')).map(
    (box) => box.value,
  );
}

function encodeMailto(subject, body) {
  const query = [
    `subject=${encodeURIComponent(subject)}`,
    `body=${encodeURIComponent(body)}`,
  ].join("&");
  return `mailto:${CONTACT_EMAIL}?${query}`;
}

function preselectSports(form) {
  const raw = new URLSearchParams(window.location.search).get("sports");
  if (!raw) return;
  const wanted = new Set(
    raw
      .split(",")
      .map((slug) => slug.trim().toLowerCase())
      .filter((slug) => SPORT_SLUGS.has(slug)),
  );
  form.querySelectorAll('input[name="sports"]').forEach((box) => {
    const slug = box.getAttribute("data-slug");
    if (slug && wanted.has(slug)) box.checked = true;
  });
}

function setSportsError(form, show) {
  const fieldset = form.querySelector("[data-sports-field]");
  const error = form.querySelector("[data-sports-error]");
  if (!fieldset || !error) return;
  error.hidden = !show;
  fieldset.setAttribute("aria-invalid", show ? "true" : "false");
  if (show) {
    const first = fieldset.querySelector('input[name="sports"]');
    if (first) first.focus();
  }
}

function bindRequestForm() {
  const form = document.querySelector("[data-request-form]");
  if (!(form instanceof HTMLFormElement)) return;

  preselectSports(form);
  form.querySelectorAll('input[name="sports"]').forEach((box) => {
    box.addEventListener("change", () => {
      if (selectedSports(form).length) setSportsError(form, false);
    });
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = fieldValue(form, "name");
    const email = fieldValue(form, "email");
    const company = fieldValue(form, "company");
    const message = fieldValue(form, "message");
    const sports = selectedSports(form);

    const missing = [
      ["name", name],
      ["email", email],
      ["company", company],
      ["message", message],
    ].find(([, value]) => !value);
    if (missing) {
      const control = form.elements.namedItem(missing[0]);
      if (control && "focus" in control) control.focus();
      return;
    }
    if (!sports.length) {
      setSportsError(form, true);
      return;
    }
    setSportsError(form, false);

    const subject = `DataGuru data request — ${company}`;
    const body = [
      `Name: ${name}`,
      `Work email: ${email}`,
      `Company: ${company}`,
      `Sports of interest: ${sports.join(", ")}`,
      "",
      message,
    ].join("\r\n");
    const mailto = encodeMailto(subject, body);

    form.dataset.producedMailto = mailto;
    const openLink = document.querySelector("[data-open-mailto]");
    const subjectNode = document.querySelector("[data-request-subject]");
    const summary = document.querySelector("[data-request-summary]");
    const status = document.querySelector("[data-request-status]");
    if (openLink instanceof HTMLAnchorElement) openLink.href = mailto;
    if (subjectNode) subjectNode.textContent = subject;
    if (summary) summary.textContent = body.replace(/\r\n/g, "\n");
    if (status instanceof HTMLElement) {
      status.hidden = false;
      status.focus();
    }
  });
}

applyContactEmail();
bindNav();
bindRequestForm();
