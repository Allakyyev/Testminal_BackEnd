export class MapCreator {
    constructor(result = {}) {
        this.result = result;
    }
    add(key, value) {
        this.result[key] = value;
        return this;
    }
    append(map) {
        for (const key in map)
            if (Object.prototype.hasOwnProperty.call(map, key))
                this.result[key] = map[key];
        return this;
    }
    getByKey(key) {
        return this.result[key];
    }
    get() {
        return this.result;
    }
}
