import assert from "../../utils/utils.assert.js";
import { Example } from "../examples.model.js";

/**
 * Using Fake data for now to get things mocked out and done
 */

export class ExampleInterface {
    /** @param {Example} data */
    constructor(data = Example) {
        assert.not_null(data);
        this.data = data;
    }
    async all() {
        return this.data;
    }

    /**
     *
     * @param {string} id
     */
    async getById(id) {
        assert.type(id, "string");
        return this.data[Number(id)];
    }
}

const singleton = new ExampleInterface([
    {
        id: "1",
        name: "one",
        public: "print('hi')",
        private: "console.log('hi')",
    },
    {
        id: "2",
        name: "two",
        public: "shape.rectangle(20,20,20,20)",
        private: `import { tad, shape } from "/js/lib/TeachAndDraw.js";

        tad.use(update);
        console.log(tad, document.querySelector("#myCanvas"));
        tad.w=280;
        tad.h=280;
        function update() {shape.border="#282c34";shape.colour="#282c34";shape.rectangle(tad.w/2,tad.h/2,tad.w,tad.h);shape.colour="blue";shape.rectangle(50,50,50,tad.h);}`,
    },
]);
export default singleton;
