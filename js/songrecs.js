// Clean vector SVG icons
const PLAY_ICON = `
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M8 5v14l11-7z"/>
  </svg>`;

const PAUSE_ICON = `
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
  </svg>`;

// A reusable equalizer element created once in memory
const equalizerEl = document.createElement("div");
equalizerEl.className = "equalizer";
equalizerEl.innerHTML = "<span></span><span></span><span></span><span></span>";

function showEqualizer(card) {
	// If moving to a new card, attach it first
	if (equalizerEl.parentElement !== card) {
		card.appendChild(equalizerEl);
		// Force browser to register the initial hidden state before transitioning in
		void equalizerEl.offsetWidth;
	}
	equalizerEl.classList.add("is-active");
}

function hideEqualizer() {
	equalizerEl.classList.remove("is-active");
}

// global audio controller
let currentAudio = null;
let currentActiveCard = null;

const songCards = document.querySelectorAll(".song-card");

songCards.forEach((card) => {
	card.addEventListener("click", () => {
		const indicator = card.querySelector(".play-indicator");

		// toggling the currently playing card
		if (currentAudio && currentActiveCard === card) {
			if (!currentAudio.paused) {
				currentAudio.pause();
				hideEqualizer();
				indicator.innerHTML = PLAY_ICON;
			} else {
				currentAudio.play();
				showEqualizer(card); // resumes bouncing
				indicator.innerHTML = PAUSE_ICON;
			}
			return;
		}

		// another song was already playing: pause and reset its icon
		if (currentAudio) {
			currentAudio.pause();
			hideEqualizer();
			currentActiveCard.querySelector(".play-indicator").innerHTML = PLAY_ICON;
		}

		currentActiveCard = card;
		currentAudio = new Audio(card.dataset.preview);
		currentAudio.volume = 0.4;

		currentAudio.play();
		showEqualizer(card);
		indicator.innerHTML = PAUSE_ICON;

		// Reset button icon when track finishes
		currentAudio.addEventListener("ended", () => {
			hideEqualizer();
			indicator.innerHTML = PLAY_ICON;
			currentAudio = null;
			currentActiveCard = null;
		});
	});
});
