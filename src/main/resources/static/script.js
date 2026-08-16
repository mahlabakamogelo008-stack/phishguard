const urlInput = document.getElementById("urlInput");
const scanButton = document.getElementById("scanButton");
const result = document.getElementById("result");
const verdict = document.getElementById("verdict");
const riskScore = document.getElementById("riskScore");
const checks = document.getElementById("checks");

scanButton.addEventListener("click", checkWebsite);

function checkWebsite() {

    const url = urlInput.value.trim();

    if (url === "") {
        result.classList.remove("hidden");
        verdict.textContent = "Please enter a website URL.";
        riskScore.textContent = "";
        checks.innerHTML = "";
        return;
    }

    let score = 0;
    let warnings = [];

    // Check HTTPS
    if (!url.startsWith("https://")) {
        score += 20;
        warnings.push("⚠ Website does not use HTTPS");
    }

    // Check for IP address
    const ipPattern = /https?:\/\/\d{1,3}(\.\d{1,3}){3}/;

    if (ipPattern.test(url)) {
        score += 30;
        warnings.push("⚠ IP address used instead of a domain name");
    }

    // Check suspicious words
    const suspiciousWords = [
        "login",
        "verify",
        "account",
        "password",
        "secure",
        "update"
    ];

    let foundWords = suspiciousWords.filter(word =>
        url.toLowerCase().includes(word)
    );

    if (foundWords.length > 0) {
        score += foundWords.length * 5;
        warnings.push(
            "⚠ Suspicious keyword detected: " + foundWords.join(", ")
        );
    }

    // Check @ symbol
    if (url.includes("@")) {
        score += 20;
        warnings.push("⚠ URL contains an @ symbol");
    }

    // Limit score to 100
    score = Math.min(score, 100);

    result.classList.remove("hidden");

    riskScore.textContent = "Risk Score: " + score + "/100";

    if (score < 30) {

        verdict.textContent = "🟢 LIKELY SAFE";
        verdict.style.color = "#4ade80";

    } else if (score < 60) {

        verdict.textContent = "🟠 SUSPICIOUS";
        verdict.style.color = "#facc15";

    } else {

        verdict.textContent = "🔴 LIKELY PHISHING";
        verdict.style.color = "#f87171";
    }

    if (warnings.length === 0) {

        checks.innerHTML = "✓ No common phishing indicators detected.";

    } else {

        checks.innerHTML = warnings
            .map(warning => `<p>${warning}</p>`)
            .join("");
    }
}