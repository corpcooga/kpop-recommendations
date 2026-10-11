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

const header = document.querySelector("header");

let lastScrollY = window.scrollY;
let currentTranslate = 0;
let headerHeight = header.offsetHeight;
let isTicking = false;
let scrollTimeout = null;

// Keeps header visible and recalculates dimensions on screen resize
window.addEventListener("resize", () => {
	headerHeight = header.offsetHeight;
	lastScrollY = window.scrollY;

	// Reset all mobile hide states so resizing never hides the bar
	currentTranslate = 0;
	header.classList.remove("nav-hidden", "is-scrolling");
	header.style.setProperty("--header-y", "0px");
});

function snapHeader() {
	// Re-enable CSS transitions by removing .is-scrolling first
	header.classList.remove("is-scrolling");

	const currentScrollY = window.scrollY;

	// If the user stopped scrolling near the top, CSS smoothly slides it in to 0px
	if (currentScrollY <= headerHeight) {
		header.classList.remove("nav-hidden");
		currentTranslate = 0;
		header.style.setProperty("--header-y", "0px");
		return;
	}

	// Normal threshold snap when further down the page
	if (Math.abs(currentTranslate) > headerHeight * 0.4) {
		header.classList.add("nav-hidden");
		currentTranslate = -headerHeight;
	} else {
		header.classList.remove("nav-hidden");
		currentTranslate = 0;
		header.style.setProperty("--header-y", "0px");
	}
}

window.addEventListener("scroll", () => {
	if (window.innerWidth > 768) return;

	const currentScrollY = window.scrollY;
	let delta = currentScrollY - lastScrollY;
	lastScrollY = currentScrollY;

	// Make header reappear 1.5x faster when scrolling up
	if (delta < 0)
		delta *= 1.5;

	header.classList.add("is-scrolling");
	header.classList.remove("nav-hidden");

	// Prevent gap: lock fully visible if within the top region of the page
	if (currentScrollY <= 0) {
		currentTranslate = 0;
	} else {
		currentTranslate = Math.min(0, Math.max(-headerHeight, currentTranslate - delta));
	}

	if (!isTicking) {
		window.requestAnimationFrame(() => {
			header.style.setProperty("--header-y", `${currentTranslate}px`);
			isTicking = false;
		});
		isTicking = true;
	}

	// Snap after 100ms pause in scrolling
	clearTimeout(scrollTimeout);
	scrollTimeout = setTimeout(snapHeader, 100);
}, { passive: true });
