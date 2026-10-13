const lastUpdatedElement = document.getElementById("last-updated");

if (lastUpdatedElement) {
	// formats the raw date string into a readable format
	const fileDate = new Date(document.lastModified)

	lastUpdatedElement.textContent = fileDate.toLocaleDateString("en-US", {
		year: "numeric",
		month: "short",
		day: "numeric"
	});
}

// Get the current file name from the URL path (defaults to "index.html" at root "/")
let currentPage = window.location.pathname.split("/").pop();
if (currentPage === "" || currentPage === "/")
	currentPage = "index.html";

// Select all navigation links
const navLinks = document.querySelectorAll(".nav-links a");

navLinks.forEach((link) => {
	// Check if the link's href matches the current page
	if (link.getAttribute("href") === currentPage) {
		link.classList.add("active");
		link.setAttribute("aria-current", "page"); // Accessibility best practice

		link.addEventListener("click", (e) => {
			e.preventDefault();
		});
	}
});

// mobile menu bar header behavior
const header = document.querySelector("header");
let lastScrollY = window.scrollY;
let isExpanding = false;

// Buffer constants to stop micro-jitter
const COLLAPSE_THRESHOLD = 50; // Must scroll down past threshold before collapsing starts
const SCROLL_DELTA = 10; // Must scroll at least delta pixels in one direction to trigger

function handleScroll() {
	if (isExpanding) return; // ignore layout shifts caused by expanding

	// prevents negative bounce values
	const currentScrollY = Math.max(0, window.scrollY);
	const scrollDiff = currentScrollY - lastScrollY;

	// 1. Scrolled to top -> reveal
	if (currentScrollY <= 10) {
		header.classList.remove("collapsed");
	}
	// 2. Scrolling down past threshold by a deliberate amount -> commit to collapse
	else if (currentScrollY > COLLAPSE_THRESHOLD && scrollDiff > SCROLL_DELTA) {
		if (!header.classList.contains("collapsed")) {
			header.classList.add("collapsed");
			isExpanding = true;
			setTimeout(() => {
				isExpanding = false;
				lastScrollY = Math.max(0, window.scrollY);
			}, 250);
		}
	}
	// 3. Deliberately scrolling up by at least delta -> reveal
	else if (scrollDiff < -SCROLL_DELTA) {
		header.classList.remove("collapsed");
	}

	lastScrollY = currentScrollY;
}

window.addEventListener("scroll", handleScroll, { passive: true });

// Click header to reveal items when collapsed
header.addEventListener("click", () => {
	header.classList.remove("collapsed");
});

document.addEventListener("touchstart", () => { }, { passive: true });
