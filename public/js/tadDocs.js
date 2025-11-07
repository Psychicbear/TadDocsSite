window.onload = function () {
    // Enables opening hx-get links in new tabs with ctrl+click
    htmx.on('htmx:configRequest', (evt) => {
        const requestType = evt.detail.verb;
        const ctrlKey = evt.detail.triggeringEvent?.ctrlKey;
        const pushUrl = evt.target.attributes['hx-push-url']?.value;

        if (requestType === 'get' && ctrlKey && pushUrl) {
            let url = window.location.origin + evt.detail.path;
            evt.preventDefault();
            window.open(url, '_blank');
        }
    })
}