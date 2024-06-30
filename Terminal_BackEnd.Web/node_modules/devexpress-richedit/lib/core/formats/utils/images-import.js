export class FormatImagesImporterData {
    constructor(subDocPos, options, run) {
        this.subDocPos = subDocPos;
        this.options = options;
        this.run = run;
    }
}
export class FormatImagesImporter {
    constructor() {
        this.data = [];
        this.callbackId = [];
    }
    dispose() {
        this.callbackId.forEach(id => clearTimeout(id));
        clearTimeout(this.timeoutId);
    }
    whenAllPicturesLoaded(callback, timeout = 3000) {
        if (!this.data.length) {
            this.callOnImportEnd = () => callback(true);
            return;
        }
        let numLoadingPictures = this.data.length;
        this.timeoutId = setTimeout(() => callback(false), timeout);
        this.data.forEach(data => data.options.imageLoadedEvent.push(() => {
            numLoadingPictures--;
            if (numLoadingPictures == 0) {
                clearTimeout(this.timeoutId);
                this.callbackId.push(setTimeout(() => callback(true), 0));
            }
        }));
    }
    import(modelManipulator) {
        this.data.forEach(d => {
            const cacheInfo = d.run.info.cacheInfo;
            modelManipulator.picture.loader.sizeUpdater.addSizes(d.subDocPos, d.options, d.run, null);
            if (cacheInfo.isLoaded)
                modelManipulator.picture.loader.sizeUpdater.update(cacheInfo, false);
        });
        modelManipulator.model.cache.imageCache.loadAllPictures(modelManipulator.picture);
        if (this.callOnImportEnd)
            this.callOnImportEnd();
    }
    registerImageRun(data) {
        this.data.push(data);
    }
}
