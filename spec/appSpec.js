const fs = require('fs')
myCode = fs.readFileSync("assets/script.js",'utf-8') // depends on the file encoding
eval(myCode);
describe("FreshFruits test", function (){
    it('should be defined', function () {
        expect(replaceWithInlineSVG).toBeDefined();
    });
});
