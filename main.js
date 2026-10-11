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

// Global audio controller
let currentAudio = null;
let currentActiveCard = null;

const songCards = document.querySelectorAll(".song-card");

songCards.forEach((card) => {
	card.addEventListener("click", () => {
		const previewUrl = card.dataset.preview;
		const indicator = card.querySelector(".play-indicator");

		// Case 1: Clicking the currently playing card -> Pause it
		if (currentAudio && currentActiveCard === card) {
			if (!currentAudio.paused) {
				currentAudio.pause();
				indicator.textContent = "▶";
			} else {
				currentAudio.play();
				indicator.textContent = "⏸";
			}
			return;
		}

		// Case 2: Another song was already playing -> Stop it and reset its icon
		if (currentAudio) {
			currentAudio.pause();
			if (currentActiveCard) {
				currentActiveCard.querySelector(".play-indicator").textContent = "▶";
			}
		}

		// Case 3: Start new audio
		currentAudio = new Audio(previewUrl);
		currentActiveCard = card;
		indicator.textContent = "⏸";
		currentAudio.play();

		// Reset button icon when track finishes 30-second duration
		currentAudio.addEventListener("ended", () => {
			indicator.textContent = "▶";
			currentAudio = null;
			currentActiveCard = null;
		});
	});
});
