import { InlinePictureInfo } from '../../../core/model/manipulators/picture-manipulator/insert-picture-manipulator-params';
import { UnitConverter } from '@devexpress/utils/lib/class/unit-converter';
import { Size } from '@devexpress/utils/lib/geometry/size';
import { ImportedInlinePictureRunInfo } from '../containers/runs';
import { HtmlTagImporterBase } from './base';
export class HtmlImgTagImporter extends HtmlTagImporterBase {
    elementTag() {
        return "IMG";
    }
    importBefore() {
        const imageElement = this.importer.currElement;
        const originalSize = new Size(imageElement.naturalWidth, imageElement.naturalHeight);
        const actualSize = new Size(imageElement.width, imageElement.height);
        if (originalSize.width !== undefined && originalSize.height !== undefined)
            originalSize.applyConverter(UnitConverter.pixelsToTwips);
        if (actualSize.width !== undefined && actualSize.height !== undefined)
            actualSize.applyConverter(UnitConverter.pixelsToTwips);
        const cacheInfo = this.importer.modelManager.model.cache.imageCache.createUnloadedByBase64OrUrl(imageElement.src, originalSize);
        this.addRun(new ImportedInlinePictureRunInfo(this.importer.charPropsBundle, InlinePictureInfo.defaultInfo(cacheInfo), actualSize));
    }
    isImportChilds() {
        return false;
    }
    importAfter() {
    }
}
