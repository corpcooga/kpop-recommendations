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
	equalizerEl.remove(); // detach from any previous card
	equalizerEl.classList.remove("is-paused");
	card.appendChild(equalizerEl);
}

function pauseEqualizer() {
	equalizerEl.classList.add("is-paused");
}

// Global audio controller
let currentAudio = null;
let currentActiveCard = null;

const songCards = document.querySelectorAll(".song-card");

songCards.forEach((card) => {
	card.addEventListener("click", () => {
		const previewUrl = card.dataset.preview;
		const indicator = card.querySelector(".play-indicator");

		// toggling the currently playing card
		if (currentAudio && currentActiveCard === card) {
			if (!currentAudio.paused) {
				currentAudio.pause();
				indicator.innerHTML = PLAY_ICON;
				pauseEqualizer(); // freezes the bars in place
			} else {
				currentAudio.play();
				indicator.innerHTML = PAUSE_ICON;
				showEqualizer(card); // resumes bouncing
			}
			return;
		}

		// another song was already playing: pause and reset its icon
		if (currentAudio) {
			currentAudio.pause();
			if (currentActiveCard) {
				currentActiveCard.querySelector(".play-indicator").innerHTML = PLAY_ICON;
				equalizerEl.remove();
			}
		}

		// start new audio
		currentAudio = new Audio(previewUrl);
		currentAudio.volume = 0.4;
		currentActiveCard = card;
		indicator.innerHTML = PAUSE_ICON;
		showEqualizer(card); // injects equalizer into this card
		currentAudio.play();

		// Reset button icon when track finishes 30-second duration
		currentAudio.addEventListener("ended", () => {
			indicator.innerHTML = PLAY_ICON;
			equalizerEl.remove();
			currentAudio = null;
			currentActiveCard = null;
		});
	});
});
