import { nanoid } from "nanoid";

class NanoId {
    constructor(){
        this.id = nanoid; // 21-character ID with 64-char alphabet (a-zA-Z0-9_-)
    }
    getId(){
        return this.id();
    }

}

const id = new NanoId();
export default id;