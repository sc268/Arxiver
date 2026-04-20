(function() {
    function sanitize(str) {
        return str.trim().replace(/[^a-zA-Z0-9]/g, " ").replace(/\s+/g, " ").trim();
    }

    function sendDownload(url, filename) {
        chrome.runtime.sendMessage({ action: 'download', url, filename });
    }

    // arXiv paper page
    if (window.location.hostname.includes('arxiv.org')) {
        const pdfButton = document.getElementsByClassName("abs-button download-pdf")[0];
        if (!pdfButton) { alert("No PDF found on this arXiv page."); return; }
        const title = sanitize(document.title.replace(/\[.*?\]/g, ""));
        sendDownload(pdfButton.href, title + ".pdf");
        return;
    }

    // Google Scholar alert email links (Gmail or any page with scholar_url links)
    // Paper title is the link text; actual PDF URL is in the ?url= parameter
    const scholarLinks = document.querySelectorAll('a[href*="scholar.google.com/scholar_url"]');
    scholarLinks.forEach(link => {
        const title = sanitize(link.textContent);
        if (!title) return;
        try {
            const pdfUrl = new URL(link.href).searchParams.get('url');
            if (pdfUrl) sendDownload(pdfUrl, title + ".pdf");
        } catch (e) {
            console.error("Failed to parse scholar link:", e);
        }
    });
}).call(window);
