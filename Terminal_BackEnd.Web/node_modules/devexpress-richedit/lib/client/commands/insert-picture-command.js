import { CommandBase } from '../../base/commands/command-base';
import { SimpleCommandState } from '../../base/commands/command-states';
import { InlinePictureInfo } from '../../core/model/manipulators/picture-manipulator/insert-picture-manipulator-params';
import { ImageLoadingOptions } from '../../core/model/manipulators/picture-manipulator/loader/image-loading-options';
import { ControlOptions } from '../../core/model/options/control';
import { Browser } from '@devexpress/utils/lib/browser';
export class InsertPictureCommand extends CommandBase {
    getState() {
        return new SimpleCommandState(this.isEnabled());
    }
    isEnabled() {
        return super.isEnabled() && ControlOptions.isEnabled(this.control.modelManager.richOptions.control.inlinePictures) &&
            this.control.selection.intervals.length === 1;
    }
    executeCore() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = Browser.AndroidMobilePlatform ?
            'image/jpeg,image/png,image/bmp,image/x-ms-bmp' :
            '.jpg,.jpeg,.png,.bmp';
        input.addEventListener('change', (e) => this.onFileChange(e), false);
        input.click();
        return true;
    }
    onFileChange(e) {
        const file = e.target.files[0];
        if (file) {
            const cacheInfo = this.control.modelManager.model.cache.imageCache.createUnloadedInfoByFile(file);
            this.modelManipulator.picture.insertInlinePictureViaHistory(this.selection.intervalsInfo.subDocPosition, this.inputPosition.charPropsBundle, InlinePictureInfo.defaultInfo(cacheInfo), new ImageLoadingOptions(true));
        }
    }
}
