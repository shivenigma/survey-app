import {Router} from "../modules/router.js";

describe("Router tests", function () {
    let router;
    beforeEach(function () {
        router = new Router();
        this.getHashSpy = spyOn(router, 'getHash').and.returnValue('#/hello');
    });
    afterEach(function () {
        router.cleanUp();
        router = null;
    });
    it('should throw error for invalid callbacks', function () {
        expect(function () {
            router.add('', '');
        }).toThrow('Callback should be a function');
    });
    it('should return the exact fragment with slashes trimmed.', function () {
        // This test also implicitly tests the utility function Router@clearSlashes.
        expect(router.getRouteFragment()).toEqual('hello');
        this.getHashSpy.and.returnValue('#/anothertest');
        expect(router.getRouteFragment()).toEqual('anothertest');
    });
    it('should match fragment and call the callback with params', function () {
        const randomFn = jasmine.createSpy().and.callFake(function() {
            return false;
        });
        // testing normal route
        router.add('hello', randomFn);
        router.check('hello');
        expect(randomFn).toHaveBeenCalled();
        // testing route with param
        router.add('question/:id', randomFn);
        router.check('/question/2/');
        expect(randomFn).toHaveBeenCalledWith({id: '2'});
    });
    it('should listen for route changes periodically', function () {
        jasmine.clock().install();
        const checkSpy = jasmine.createSpy(router, 'check').and.callThrough();
        router.listen();
        this.getHashSpy.and.returnValue('#/testroute');
        // jasmine.clock().tick(100);
        expect(checkSpy).toHaveBeenCalled();
        jasmine.clock().uninstall();
    });
});
