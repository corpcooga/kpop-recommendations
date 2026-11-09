const contactForm = document.getElementById("contact-form");

if (contactForm) {
	contactForm.addEventListener("submit", async (e) => {
		e.preventDefault();

		const submitBtn = document.getElementById("submit-btn");
		const email = document.getElementById("sender-email").value;
		const message = document.getElementById("message").value;

		submitBtn.disabled = true;
		submitBtn.value = "Sending...";

		try {
			const response = await fetch("https://kpop-recommendations.vercel.app/api/contact", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, message })
			});

			if (response.ok) {
				submitBtn.value = "✓ Message Sent!";
				contactForm.reset();
			} else {
				submitBtn.value = "Failed to send — try again";
			}
		} catch (error) {
			submitBtn.value = "Could not connect to server";
		} finally {
			setTimeout(() => {
				submitBtn.disabled = false;
				submitBtn.value = "Send Message";
			}, 3000);
		}
	});
}