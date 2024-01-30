document.addEventListener('DOMContentLoaded', function() {
    const darkPatternElements = detectDarkPatterns();

    darkPatternElements.forEach(function(element) {
        const boundingBox = document.createElement('div');
        boundingBox.style.position = 'absolute';
        boundingBox.style.border = '2px solid red';
        boundingBox.style.boxSizing = 'border-box';
        boundingBox.style.pointerEvents = 'none';

        const rect = element.getBoundingClientRect();
        boundingBox.style.top = rect.top + 'px';
        boundingBox.style.left = rect.left + 'px';
        boundingBox.style.width = rect.width + 'px';
        boundingBox.style.height = rect.height + 'px';

        document.body.appendChild(boundingBox);
    });
});

function detectDarkPatterns() {
    // Implement your logic to detect dark patterns and return corresponding elements
    // For example, you might use regex to search for specific patterns in text content or inspect element attributes
    // Return an array of elements detected as dark patterns
    return document.querySelectorAll('.bounty-box'); // Example: select elements with class '.bounty-box'
}
