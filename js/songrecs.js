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
	if (equalizerEl.parentElement !== card) { // if not resuming the same song card after pausing
		card.appendChild(equalizerEl);
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
const audioCache = new Map();

const songCards = document.querySelectorAll(".song-card");

songCards.forEach((card) => {
	const indicator = card.querySelector(".play-indicator");

	// pre-create and preload audio when the page loads (or on first touch)
	const audio = new Audio(card.dataset.preview);
	audio.preload = "metadata";
	audio.volume = 0.4;
	audio.onended = () => {
		hideEqualizer();
		indicator.innerHTML = PLAY_ICON;
		currentAudio = null;
		currentActiveCard = null;
	};
	audioCache.set(card, audio);

	// warm up full audio buffer the instant a finger touches the card on mobile
	card.addEventListener("touchstart", () => {
		audio.preload = "auto";
		audio.load();
	}, { passive: true, once: true });

	card.addEventListener("click", () => {
		// toggling the currently playing card
		if (currentAudio && currentActiveCard === card) {
			if (!currentAudio.paused) {
				hideEqualizer();
				indicator.innerHTML = PLAY_ICON;
				currentAudio.pause();
			} else {
				showEqualizer(card);
				indicator.innerHTML = PAUSE_ICON;
				currentAudio.play();
			}
			return;
		}

		// another song was already playing: pause and reset its icon
		if (currentAudio) {
			hideEqualizer();
			currentActiveCard.querySelector(".play-indicator").innerHTML = PLAY_ICON;
			currentAudio.pause();
			currentAudio.currentTime = 0;
		}

		currentActiveCard = card;
		currentAudio = audioCache.get(card);

		showEqualizer(card);
		indicator.innerHTML = PAUSE_ICON;
		currentAudio.play();
	});
});
