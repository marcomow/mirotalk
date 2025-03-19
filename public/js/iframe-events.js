
window.addEventListener('message', event => {
    if (event.data.command === 'toggleVideo') {
        console.log('Received message from iframe:', event.data);
        videoBtn.click();
    }
});
