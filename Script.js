function checkUrl() {
    const urlInput = document.getElementById('urlInput').value.trim();
    const resultDiv = document.getElementById('result');
    
    if (!urlInput) {
        alert("Please enter a URL to check.");
        return;
    }

    let score = 0;
    let reasons = [];

    try {
        // Add http protocol if missing to allow the URL object to parse it
        const urlString = urlInput.startsWith('http') ? urlInput : 'http://' + urlInput;
        const url = new URL(urlString);
        const domain = url.hostname;

        // Heuristic 1: IP Address in Domain
        const ipRegex = /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/;
        if (ipRegex.test(domain)) {
            score += 40;
            reasons.push("Uses an IP address instead of a domain name.");
        }

        // Heuristic 2: Suspicious keywords in URL
        const suspiciousKeywords = ['login', 'secure', 'account', 'update', 'verify', 'bank', 'password', 'free', 'auth'];
        const lowerUrl = urlInput.toLowerCase();
        suspiciousKeywords.forEach(keyword => {
            if (lowerUrl.includes(keyword)) {
                score += 15;
                reasons.push(`Contains suspicious keyword: "${keyword}".`);
            }
        });

        // Heuristic 3: Multiple subdomains (e.g., secure.login.bank.com)
        const domainParts = domain.split('.');
        if (domainParts.length > 3) { 
            score += 20;
            reasons.push("Unusually high number of subdomains.");
        }

        // Heuristic 4: Unusually long URL
        if (urlInput.length > 75) {
            score += 10;
            reasons.push("URL is unusually long, often used to hide the true domain.");
        }

        // Heuristic 5: Presence of @ symbol
        if (urlInput.includes('@')) {
            score += 30;
            reasons.push("Contains '@' symbol (browsers ignore everything before '@').");
        }

        // Heuristic 6: Hyphen in domain
        if (domain.includes('-')) {
            score += 10;
            reasons.push("Domain contains a hyphen (common in fraudulent lookalike domains).");
        }

        // Display results based on score
        resultDiv.classList.remove('hidden');
        resultDiv.innerHTML = '';

        let riskLevel = "";

        if (score >= 40) {
            riskLevel = "High Risk (Likely Phishing)";
            resultDiv.className = "mt-6 p-4 rounded-lg text-left bg-red-50 text-red-900 border border-red-200";
        } else if (score >= 15) {
            riskLevel = "Medium Risk (Suspicious)";
            resultDiv.className = "mt-6 p-4 rounded-lg text-left bg-yellow-50 text-yellow-900 border border-yellow-200";
        } else {
            riskLevel = "Low Risk (Looks Safe)";
            resultDiv.className = "mt-6 p-4 rounded-lg text-left bg-green-50 text-green-900 border border-green-200";
            reasons.push("No immediate red flags detected based on static heuristics.");
        }

        let resultHTML = `<h3 class="font-bold text-lg mb-3 flex items-center">${riskLevel}</h3>`;
        resultHTML += `<ul class="list-disc pl-5 text-sm space-y-1.5 marker:text-gray-400">`;
        reasons.forEach(r => {
            resultHTML += `<li>${r}</li>`;
        });
        resultHTML += `</ul>`;
        
        resultDiv.innerHTML = resultHTML;

    } catch (e) {
        alert("Invalid URL format. Please ensure you are entering a valid web address.");
    }
}
