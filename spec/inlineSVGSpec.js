import {replaceWithInlineSVG} from "../modules/inlineSVG.js";

describe("Image to SVG", function (){
    it('should replace image with SVG', function (done) {
        expect(replaceWithInlineSVG).toBeDefined()
        const elem = document.createElement('div');
        const image = document.createElement('img');
        image.setAttribute('src', 'img/arrow-left.svg');
        image.classList.add('TestClassPassthrough');
        elem.appendChild(image);
        replaceWithInlineSVG(image);
        // The replace function has an async call which is not exposed outside, or need not te be exposed. So we wait for some delay for the async call to finish and check the result.
        setTimeout(function (){
            expect(elem.children[0].nodeName).toBe('svg');
            expect(elem.children[0].classList).toContain('TestClassPassthrough');
            done();
        }, 1000);
    });
});
