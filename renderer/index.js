const { ipcRenderer } = require('electron');

// Handle the browse-image button click
document.getElementById('browse-image').addEventListener('click', () => {
    ipcRenderer.invoke('open-file-dialog').then((filePath) => {
        if (filePath) {
            // Call the backend API with the selected file path
            ipcRenderer.invoke('process-image', filePath).then((response) => {
                console.log('Image processed:', response);
                // Handle the response (e.g., display results in the UI)
            }).catch((error) => {
                console.error('Error processing image:', error);
            });
        }
    }).catch((error) => {
        console.error('Error opening file dialog:', error);
    });
});