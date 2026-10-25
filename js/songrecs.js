// handles song number in song section header area
document.querySelectorAll(".song-section").forEach((section) => {
	const badge = section.querySelector(".badge");
	const numSongs = section.querySelectorAll(".song-card").length;
	if (badge)
		badge.textContent = `• ${numSongs} song${numSongs > 1 ? "s" : ""}`;
});

const PLAY_ICON = `
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M8 5v14l11-7z"/>
  </svg>`;

const PAUSE_ICON = `
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
  </svg>`;

// reusable equalizer element created once in memory
const equalizerEl = document.createElement("div");
equalizerEl.className = "equalizer";
equalizerEl.innerHTML = "<span></span><span></span><span></span><span></span>";

function showEqualizer(card) {
	if (equalizerEl.parentElement !== card) { // if not resuming the same song card after pausing
		card.appendChild(equalizerEl);
		void equalizerEl.offsetWidth;
	}
	equalizerEl.classList.add("is-active", "is-paused");
}

function hideEqualizer() {
	equalizerEl.classList.remove("is-active", "is-paused");
}

// unpauses the EQ bars on the exact frame the audio playhead physically starts moving
function startEqualizerWhenPlaying(audio, card) {
	const startTime = audio.currentTime;

	function checkPlayhead() {
		// stop checking if the user switched to another card or paused
		if (currentActiveCard !== card || audio.paused) return;

		if (audio.currentTime > startTime) {
			equalizerEl.classList.remove("is-paused");
		} else {
			requestAnimationFrame(checkPlayhead);
		}
	}

	requestAnimationFrame(checkPlayhead);
}

// global audio controller
let currentAudio = null;
let currentActiveCard = null;
const audioCache = new Map();

const songCards = document.querySelectorAll(".song-card");

songCards.forEach((card) => {
	const indicator = card.querySelector(".play-indicator");

	const audio = new Audio();
	audio.preload = "none";
	audio.src = card.dataset.preview;
	audio.volume = 0.4;

	audio.onended = () => {
		hideEqualizer();
		indicator.innerHTML = PLAY_ICON;
		currentAudio = null;
		currentActiveCard = null;
	};

	audioCache.set(card, audio);

	// Pre-buffer when hovering on desktop or first touching on mobile
	const warmUp = () => {
		audio.preload = "auto";
	};
	card.addEventListener("mouseenter", warmUp, { passive: true, once: true });
	card.addEventListener("touchstart", warmUp, { passive: true, once: true });

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
				currentAudio.play()
					.then(() => {
						startEqualizerWhenPlaying(currentAudio, card);
					})
					.catch(() => { });
			}
			return;
		}

		// another song was already playing or loading: pause and reset its icon
		if (currentAudio) {
			hideEqualizer();
			currentActiveCard.querySelector(".play-indicator").innerHTML = PLAY_ICON;
			currentAudio.pause();

			if (currentAudio.readyState >= 3) {
				// already buffered: keep it in cache and rewind to 0:00
				currentAudio.currentTime = 0;
			} else {
				// still buffering on slow internet: abort download so it doesn't hog bandwidth
				currentAudio.preload = "none";
				currentAudio.src = currentActiveCard.dataset.preview;
			}
		}

		currentActiveCard = card;
		currentAudio = audioCache.get(card);

		showEqualizer(card);
		indicator.innerHTML = PAUSE_ICON;

		currentAudio.play()
			.then(() => {
				if (currentActiveCard === card) {
					startEqualizerWhenPlaying(currentAudio, card);
				}
			})
			.catch(() => {
				// only hide if the user hasn't switched to a different card
				if (currentActiveCard === card) {
					hideEqualizer();
					indicator.innerHTML = PLAY_ICON;
					currentAudio = null;
					currentActiveCard = null;
				}
			});
	});
});
