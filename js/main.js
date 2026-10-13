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

	// prevents negative bounce values on iOS/Safari
	const currentScrollY = Math.max(0, window.scrollY);
	const scrollDiff = currentScrollY - lastScrollY;

	// 1. Scrolled to top -> reveal
	if (currentScrollY <= 10) {
		header.classList.remove("collapsed");
	}
	// 2. Scrolling down past threshold by a deliberate amount -> commit to collapse
	else if (scrollDiff > SCROLL_DELTA && currentScrollY > COLLAPSE_THRESHOLD) {
		header.classList.add("collapsed");
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
	if (header.classList.contains("collapsed")) {
		header.classList.remove("collapsed");
		isExpanding = true;

		// Wait for the CSS transition to finish before listening to scroll again
		setTimeout(() => {
			isExpanding = false;
			lastScrollY = window.scrollY;
		}, 250);
	}
});

document.addEventListener("touchstart", () => { }, { passive: true });
