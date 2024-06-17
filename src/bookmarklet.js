(function() {
    var url = document.getElementsByClassName("abs-button download-pdf")[0].href;
    var title = document.title.replace(/\[.*?\]/g, "").trim().replace(/[^a-zA-Z0-9]/g, " ");

    try {
        downloadFile(url, title + ".pdf");
    } catch (e) {
        alert("Download failed.");
        console.log('Download failed.', e);
    }

    function downloadFile(url, filename) {
        fetch(url)
            .then(response => response.blob())
            .then(blob => {
                const link = document.createElement('a');
                const blobUrl = URL.createObjectURL(blob);
                link.href = blobUrl;
                link.download = filename;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(blobUrl); // Clean up
            })
            .catch(err => {
                console.error('Fetch failed:', err);
            });
    }
}).call(window);
