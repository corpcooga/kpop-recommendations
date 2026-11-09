const contactForm = document.getElementById("contact-form");

if (contactForm) {
	contactForm.addEventListener("submit", async (e) => {
		e.preventDefault();

		const submitBtn = document.getElementById("submit-btn");
		const statusEl = document.getElementById("form-status");
		const email = document.getElementById("sender-email").value;
		const message = document.getElementById("message").value;

		submitBtn.disabled = true;
		submitBtn.value = "Sending...";
		statusEl.style.display = "block";
		statusEl.style.color = "var(--slate-gray)";
		statusEl.textContent = "Sending your message...";

		try {
			const response = await fetch("http://127.0.0.1:5000/api/contact", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, message })
			});

			const data = await response.json();

			if (response.ok) {
				statusEl.style.color = "var(--purple-mid)";
				statusEl.textContent = "Message sent! Check your inbox.";
				contactForm.reset();
			} else {
				statusEl.style.color = "#e57373";
				statusEl.textContent = data.error || "Failed to send.";
			}
		} catch (error) {
			statusEl.style.color = "#e57373";
			statusEl.textContent = "Could not connect to server.";
		} finally {
			submitBtn.disabled = false;
			submitBtn.value = "Send Message";
		}
	});
}
