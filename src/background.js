chrome.action.onClicked.addListener(async (tab) => {
    try {
        await chrome.scripting.executeScript({
            target: {tabId: tab.id},
            files: ['bookmarklet.js'] 
        });
    } catch (error) {
        console.error("Error executing bookmarklet script:", error);
    }
});
