export class ImageLoadingOptions {
    constructor(calculateActualSize = false, actualSize, callback) {
        this.imageLoadedEvent = [];
        this.calculateActualSize = calculateActualSize;
        this.actualSize = actualSize;
        if (callback)
            this.imageLoadedEvent.push(callback);
    }
    static initByActualSize(actualSize, callback) {
        actualSize = actualSize && actualSize.width && actualSize.height ? actualSize : undefined;
        return new ImageLoadingOptions(!actualSize, actualSize, callback);
    }
}
