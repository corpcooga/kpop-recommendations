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

// Clean vector SVG icons
const PLAY_ICON = `
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M8 5v14l11-7z"/>
  </svg>`;

const PAUSE_ICON = `
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
  </svg>`;

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
				indicator.innerHTML = PLAY_ICON;
			} else {
				currentAudio.play();
				indicator.innerHTML = PAUSE_ICON;
			}
			return;
		}

		// Case 2: Another song was already playing -> Stop it and reset its icon
		if (currentAudio) {
			currentAudio.pause();
			if (currentActiveCard) {
				currentActiveCard.querySelector(".play-indicator").innerHTML = PLAY_ICON;
			}
		}

		// Case 3: Start new audio
		currentAudio = new Audio(previewUrl);
		currentActiveCard = card;
		indicator.innerHTML = PAUSE_ICON;
		currentAudio.play();

		// Reset button icon when track finishes 30-second duration
		currentAudio.addEventListener("ended", () => {
			indicator.innerHTML = PLAY_ICON;
			currentAudio = null;
			currentActiveCard = null;
		});
	});
});
