import { FormatImagesImporterData } from '../../../core/formats/utils/images-import';
import { AnchorInfo } from '../../../core/model/floating-objects/anchor-info';
import { AnchorObjectHorizontalPositionAlignment, AnchorObjectTextWrapType, AnchorObjectVerticalPositionAlignment, RelativeHeightType, RelativeWidthType } from '../../../core/model/floating-objects/enums';
import { AnchorTextBoxSize, PictureSize } from '../../../core/model/floating-objects/sizes';
import { TextBoxProperties } from '../../../core/model/floating-objects/text-box-properties';
import { AnchorPictureInfo } from '../../../core/model/manipulators/picture-manipulator/insert-picture-manipulator-params';
import { ImageLoadingOptions } from '../../../core/model/manipulators/picture-manipulator/loader/image-loading-options';
import { NonVisualDrawingObjectInfo } from '../../../core/model/manipulators/picture-manipulator/non-visual-drawing-object-info';
import { RichUtils } from '../../../core/model/rich-utils';
import { AnchoredPictureRun } from '../../../core/model/runs/anchored-picture-run';
import { AnchoredTextBoxRun } from '../../../core/model/runs/anchored-text-box-run';
import { Shape } from '../../../core/model/shapes/shape';
import { SubDocumentPosition } from '../../../core/model/sub-document';
import { MaskedCharacterPropertiesBundle } from '../../../core/rich-utils/properties-bundle';
import { Constants } from '@devexpress/utils/lib/constants';
import { Margins } from '@devexpress/utils/lib/geometry/margins';
import { Size } from '@devexpress/utils/lib/geometry/size';
export var ShapeType;
(function (ShapeType) {
    ShapeType[ShapeType["None"] = -1] = "None";
    ShapeType[ShapeType["PictureFrame"] = 75] = "PictureFrame";
    ShapeType[ShapeType["TextBox"] = 202] = "TextBox";
})(ShapeType || (ShapeType = {}));
export class FloatingObjectImportInfo {
    constructor(data) {
        this.size = new AnchorTextBoxSize(false, 0, new Size(Constants.MIN_SAFE_INTEGER, Constants.MIN_SAFE_INTEGER), new Size(0, 0), RelativeWidthType.Page, RelativeHeightType.Page, true, true);
        this.imageId = null;
        this.subDocId = -1;
        this.data = data;
        this.anchorInfo = new AnchorInfo();
        this.anchorInfo.wrapType = AnchorObjectTextWrapType.None;
        this.anchorInfo.horizontalPositionAlignment = AnchorObjectHorizontalPositionAlignment.None;
        this.anchorInfo.verticalPositionAlignment = AnchorObjectVerticalPositionAlignment.None;
        this.shape = new Shape();
        this.textBoxProperties = new TextBoxProperties(new Margins(144, 144, 72, 72));
        this.constainerProperties = new NonVisualDrawingObjectInfo();
        this.objectNonVisualProperties = new NonVisualDrawingObjectInfo();
    }
    insertFloatingObject(imageCache) {
        if (!this.isFloatingObject)
            return null;
        const pos = this.data.subDocumentInfo.positionImporter.currPosition;
        const paragraph = this.data.subDocumentInfo.paragraphImporter.paragraph;
        const characterStyle = this.data.subDocumentInfo.characterImporter.style;
        const maskedCharacterProperties = this.data.subDocumentInfo.characterImporter.properties;
        switch (this.shapeType) {
            case ShapeType.TextBox: {
                if (this.subDocId < 0)
                    return null;
                const run = new AnchoredTextBoxRun(pos, paragraph, new MaskedCharacterPropertiesBundle(maskedCharacterProperties, characterStyle), this.shape.clone(), this.subDocId, this.size.clone(), this.anchorInfo.clone(), -1, this.textBoxProperties.clone());
                this.data.subDocumentInfo.characterImporter.addRun(run, RichUtils.specialCharacters.ObjectMark);
                run.containerProperties.copyFrom(this.constainerProperties);
                return run;
            }
            default: {
                if (this.imageId === null)
                    return null;
                const cacheInfo = imageCache.getPictureData(this.imageId);
                const run = new AnchoredPictureRun(pos, paragraph, new MaskedCharacterPropertiesBundle(maskedCharacterProperties, characterStyle), new AnchorPictureInfo(new PictureSize(this.size.lockAspectRatio, this.size.rotation, cacheInfo, new Size(100, 100)), this.shape.clone(), this.anchorInfo.clone(), this.constainerProperties, this.objectNonVisualProperties), -1);
                this.data.subDocumentInfo.characterImporter.addRun(run, RichUtils.specialCharacters.ObjectMark);
                this.data.formatImagesImporter.registerImageRun(new FormatImagesImporterData(new SubDocumentPosition(this.data.subDocument, pos), ImageLoadingOptions.initByActualSize(this.size.absoluteSize), run));
                return run;
            }
        }
        return null;
    }
}
