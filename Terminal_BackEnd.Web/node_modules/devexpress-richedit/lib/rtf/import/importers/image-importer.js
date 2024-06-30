import { FormatImagesImporterData } from '../../../core/formats/utils/images-import';
import { AnchorInfo } from '../../../core/model/floating-objects/anchor-info';
import { AnchorPictureInfo, InlinePictureInfo } from '../../../core/model/manipulators/picture-manipulator/insert-picture-manipulator-params';
import { ImageLoadingOptions } from '../../../core/model/manipulators/picture-manipulator/loader/image-loading-options';
import { RichUtils } from '../../../core/model/rich-utils';
import { AnchoredPictureRun } from '../../../core/model/runs/anchored-picture-run';
import { AnchoredTextBoxRun } from '../../../core/model/runs/anchored-text-box-run';
import { InlinePictureRun } from '../../../core/model/runs/inline-picture-run';
import { SubDocumentPosition } from '../../../core/model/sub-document';
import { Size } from '@devexpress/utils/lib/geometry/size';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { RtfTopmostShapeBoundsCalculator } from '../model/shape/calculators/rtf-topmost-shape-bounds-calculator';
import { RtfShapeImportHelper } from '../model/shape/rtf-shape-helpers/rtf-shape-import-helper';
import { RtfBaseImporter } from './importer-base';
export class RtfImageImporter extends RtfBaseImporter {
    constructor(data) {
        super(data);
        this.imageId = 1;
        this.scale = new Size(100, 100);
    }
    isShapeFieldContent() {
        return this.data.importers.field.currentField && this.data.importers.field.currentField.isShapeField;
    }
    isInlineTextBox() {
        return this.isShapeFieldContent() && ListUtils.last(this.data.subDocument.chunks[0].textRuns) instanceof AnchoredTextBoxRun;
    }
    insertImage(imageInfo) {
        if (!imageInfo || !imageInfo.base64) {
            if (!this.isShapeFieldContent())
                this.data.importers.character.insertSpace();
            return;
        }
        if (this.isInlineTextBox())
            return;
        const cacheInfo = this.documentModel.cache.imageCache.createUnloadedInfoByBase64(imageInfo.base64);
        const actualSize = new Size(this.desireSize.width * this.scale.width / 100, this.desireSize.height * this.scale.height / 100);
        const characterImporter = this.data.importers.character;
        const pos = characterImporter.logPosition;
        const run = new InlinePictureRun(pos, this.data.importers.paragraph.paragraph, characterImporter.getPropsBundle(), InlinePictureInfo.defaultInfo(cacheInfo, this.scale));
        characterImporter.addRun(run, RichUtils.specialCharacters.ObjectMark);
        this.data.formatImagesImporter.registerImageRun(new FormatImagesImporterData(new SubDocumentPosition(this.data.subDocument, pos), ImageLoadingOptions.initByActualSize(actualSize), run));
    }
    insertImageShape(imageInfo, shapeProperties, isInline = true) {
        if (imageInfo == null)
            return;
        const cacheInfo = this.documentModel.cache.imageCache.createUnloadedInfoByBase64(imageInfo.base64);
        let actualSize = new Size(this.desireSize.width * this.scale.width / 100, this.desireSize.height * this.scale.height / 100);
        const characterImporter = this.data.importers.character;
        const pos = characterImporter.logPosition;
        let run;
        if (isInline) {
            run = new InlinePictureRun(pos, this.data.importers.paragraph.paragraph, characterImporter.getPropsBundle(), InlinePictureInfo.defaultInfo(cacheInfo, this.scale));
            characterImporter.addRun(run, RichUtils.specialCharacters.ObjectMark);
            new RtfShapeImportHelper(shapeProperties).applyInlinePictureRunProperties(run);
            actualSize = new RtfTopmostShapeBoundsCalculator(shapeProperties).applyTransform2DAndGetActualSize(new AnchorInfo(), run.size);
        }
        else {
            run = new AnchoredPictureRun(pos, this.data.importers.paragraph.paragraph, characterImporter.getPropsBundle(), AnchorPictureInfo.defaultInfo(cacheInfo, this.scale), -1);
            characterImporter.addRun(run, RichUtils.specialCharacters.FloatingObjectMark);
            new RtfShapeImportHelper(shapeProperties).applyAnchoredPictureRunProperties(run);
            actualSize = new RtfTopmostShapeBoundsCalculator(shapeProperties).applyTransform2DAndGetActualSize(run.anchorInfo, run.size);
        }
        this.data.formatImagesImporter.registerImageRun(new FormatImagesImporterData(new SubDocumentPosition(this.data.subDocument, pos), ImageLoadingOptions.initByActualSize(actualSize), run));
    }
    pushState() {
    }
    popState() {
    }
    startImportSubDocument() {
    }
    finalizeSubDocument() {
    }
}
