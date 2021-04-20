function replaceWithInlineSVG(image) {
    fetch(image.src).then(function(response) {
        return response.text();
    }).then(function(response){
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(response, "text/xml");
        // Get the SVG tag, ignore the rest
        let svg = xmlDoc.getElementsByTagName('svg')[0];
        // Add replaced image's ID to the new SVG
        if(typeof image.id !== 'undefined') {
            svg.setAttribute('id', image.id);
        }
        // Add replaced image's classes to the new SVG
        if(typeof image.className !== 'undefined') {
            svg.setAttribute('class', image.className);
        }
        // Remove any invalid XML tags as per http://validator.w3.org
        svg.removeAttribute('xmlns:a');
        // if the viewport is not set the SVG wont't scale.
        if(!svg.getAttribute('viewBox') && svg.getAttribute('height') && svg.getAttribute('width')) {
            svg.setAttribute('viewBox', '0 0 ' + svg.getAttribute('height') + ' ' + svg.getAttribute('width'))
        }
        // Replace image with the generated SVG
        image.parentNode.replaceChild(svg, image);
    })
}
export {replaceWithInlineSVG}
