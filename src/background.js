const pendingDownloads = new Map(); // downloadId -> url

chrome.action.onClicked.addListener(async (tab) => {
    try {
        await chrome.scripting.executeScript({
            target: { tabId: tab.id, allFrames: true },
            files: ['bookmarklet.js']
        });
    } catch (error) {
        console.error("Error executing script:", error);
    }
});

chrome.runtime.onMessage.addListener((message) => {
    if (message.action === 'download') {
        chrome.downloads.download({ url: message.url, filename: message.filename }, (downloadId) => {
            if (downloadId !== undefined) {
                pendingDownloads.set(downloadId, message.url);
            }
        });
    }
});

// If a download resolves to HTML (e.g. login wall), cancel it and open in a tab instead
chrome.downloads.onChanged.addListener((delta) => {
    if (!pendingDownloads.has(delta.id)) return;

    if (delta.mime && delta.mime.current === 'text/html') {
        const url = pendingDownloads.get(delta.id);
        pendingDownloads.delete(delta.id);
        chrome.downloads.cancel(delta.id, () => {
            chrome.downloads.erase({ id: delta.id });
            chrome.tabs.create({ url });
        });
    } else if (delta.state && (delta.state.current === 'complete' || delta.state.current === 'interrupted')) {
        pendingDownloads.delete(delta.id);
    }
});
