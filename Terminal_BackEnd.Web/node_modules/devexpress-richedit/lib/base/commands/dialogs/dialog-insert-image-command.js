import { InlinePictureInfo } from '../../../core/model/manipulators/picture-manipulator/insert-picture-manipulator-params';
import { ImageLoadingOptions } from '../../../core/model/manipulators/picture-manipulator/loader/image-loading-options';
import { ControlOptions } from '../../../core/model/options/control';
import { SubDocumentInterval, SubDocumentPosition } from '../../../core/model/sub-document';
import { Size } from '@devexpress/utils/lib/geometry/size';
import { DialogParametersBase, ShowDialogCommandBase } from './show-dialog-command-base';
export class DialogInsertImageCommand extends ShowDialogCommandBase {
    constructor(control) {
        super(control);
    }
    isEnabled() {
        return super.isEnabled() && ControlOptions.isEnabled(this.control.modelManager.richOptions.control.inlinePictures) && this.selection.intervals.length === 1;
    }
    createParameters(_options) {
        return new InsertImageDialogParameters();
    }
    applyParameters(_state, newParams) {
        const interval = this.selection.intervalsInfo.interval.clone();
        const cacheInfo = this.control.modelManager.model.cache.imageCache.createLoadedInfo(newParams.base64EncodedImage, newParams.originalSize, newParams.id);
        this.history.addTransaction(() => {
            this.modelManipulator.range.removeInterval(new SubDocumentInterval(this.selection.activeSubDocument, interval), true, false);
            this.modelManipulator.picture.insertInlinePictureViaHistory(new SubDocumentPosition(this.selection.activeSubDocument, interval.start), this.inputPosition.charPropsBundle, InlinePictureInfo.defaultInfo(cacheInfo), new ImageLoadingOptions(true));
        });
        return true;
    }
    getDialogName() {
        return "InsertImage";
    }
}
export class InsertImageDialogParameters extends DialogParametersBase {
    constructor() {
        super(...arguments);
        this.id = 0;
        this.base64EncodedImage = null;
        this.originalSize = new Size(100, 100);
    }
    copyFrom(obj) {
        super.copyFrom(obj);
        this.id = obj.id;
        this.originalSize = obj.originalSize.clone();
        this.base64EncodedImage = obj.base64EncodedImage;
    }
    clone() {
        const newInstance = new InsertImageDialogParameters();
        newInstance.copyFrom(this);
        return newInstance;
    }
    applyConverter(_converter) {
        return this;
    }
}
