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

// helper: creates the Audio object ONLY when needed (avoids choking iOS memory limit)
function getOrCreateAudio(card) {
	if (!audioCache.has(card)) {
		const indicator = card.querySelector(".play-indicator");
		const audio = new Audio(card.dataset.preview);
		audio.preload = "auto";
		audio.volume = 0.4;

		audio.onended = () => {
			hideEqualizer();
			indicator.innerHTML = PLAY_ICON;
			currentAudio = null;
			currentActiveCard = null;
		};

		audioCache.set(card, audio);
	}
	return audioCache.get(card);
}

// preload ONLY the cards currently visible on screen
const observer = new IntersectionObserver((entries, obs) => {
	entries.forEach((entry) => {
		if (entry.isIntersecting) {
			getOrCreateAudio(entry.target);
			obs.unobserve(entry.target);
		}
	});
}, { rootMargin: "150px" });

songCards.forEach((card) => {
	observer.observe(card);
	const indicator = card.querySelector(".play-indicator");

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
		currentAudio = getOrCreateAudio(card);

		showEqualizer(card);
		indicator.innerHTML = PAUSE_ICON;

		// catch any mobile playback interruption so the UI never gets stuck
		currentAudio.play().catch(() => {
			hideEqualizer();
			indicator.innerHTML = PLAY_ICON;
		});
	});
});
