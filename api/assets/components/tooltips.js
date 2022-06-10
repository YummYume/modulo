const pageTooltips = document.querySelectorAll('[data-bs-toggle="tooltip"]');

if (pageTooltips.length > 0) {
    const tooltipTriggerList = [].slice.call(pageTooltips);

    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}
