import { ApiParametersChecker } from '../../api-utils/api-utils/parameter-checker';
import { ColorHelper } from '../../core/model/color/color';
import { AnchorInfo } from '../../core/model/floating-objects/anchor-info';
import { RelativeHeightType, RelativeWidthType } from '../../core/model/floating-objects/enums';
import { AnchorTextBoxSize } from '../../core/model/floating-objects/sizes';
import { TextBoxProperties } from '../../core/model/floating-objects/text-box-properties';
import { InlinePictureInfo } from '../../core/model/manipulators/picture-manipulator/insert-picture-manipulator-params';
import { ImageLoadingOptions } from '../../core/model/manipulators/picture-manipulator/loader/image-loading-options';
import { NonVisualDrawingObjectInfo } from '../../core/model/manipulators/picture-manipulator/non-visual-drawing-object-info';
import { BaseTextBoxInfo } from '../../core/model/manipulators/text-box-manipulator';
import { RunType } from '../../core/model/runs/run-type';
import { Shape } from '../../core/model/shapes/shape';
import { SubDocumentPosition } from '../../core/model/sub-document';
import { InputPositionBase } from '../../core/selection/input-position-base';
import { SelectionIntervalsInfo } from '../../core/selection/selection-intervals-info';
import { UnitConverter } from '@devexpress/utils/lib/class/unit-converter';
import { Margins } from '@devexpress/utils/lib/geometry/margins';
import { Size } from '@devexpress/utils/lib/geometry/size';
import { ColorUtils } from '@devexpress/utils/lib/utils/color';
import { IntervalApi } from '../interval';
import { PictureApi } from '../picture';
import { TextBoxApi } from '../text-box';
import { DrawingObjectCollectionBase } from './drawing-object-collection-base';
export class PictureCollection extends DrawingObjectCollectionBase {
    create(position, base64, size, callback = () => { }) {
        position = ApiParametersChecker.check(position, 1, false, [
            ApiParametersChecker.numberDescriptor('start', (v) => v, 0, this._subDocument.getDocumentEndPosition() - 1)
        ]);
        base64 = ApiParametersChecker.check(base64, 2, false, [
            ApiParametersChecker.stringDescriptor('base64', (v) => v, false)
        ]);
        const coreSize = ApiParametersChecker.check(size, 3, false, [
            ApiParametersChecker.objectDescriptor('size', 'SizeApi', (v) => new Size(v.width, v.height))
        ]);
        const origSize = new Size(coreSize.width, coreSize.height);
        const cacheInfo = this._processor.modelManager.model.cache.imageCache.createUnloadedByBase64OrUrl(base64, origSize);
        const inputPos = new InputPositionBase().setIntervals(SelectionIntervalsInfo.fromPosition(this._subDocument, position));
        this._processor.modelManager.modelManipulator.picture.insertInlinePictureViaHistory(new SubDocumentPosition(this._subDocument, position), inputPos.charPropsBundle, InlinePictureInfo.defaultInfo(cacheInfo), new ImageLoadingOptions(false, coreSize, () => callback(new IntervalApi(position, 1))));
    }
    get _runTypes() {
        return [RunType.AnchoredPictureRun, RunType.InlinePictureRun];
    }
    _getItem(coreItem) {
        return new PictureApi(this._processor.modelManager, this._subDocument, coreItem.run, coreItem.position);
    }
}
export class TextBoxCollection extends DrawingObjectCollectionBase {
    create(position) {
        position = ApiParametersChecker.check(position, 1, false, [
            ApiParametersChecker.numberDescriptor('start', (v) => v, 0, this._subDocument.getDocumentEndPosition())
        ]);
        const topBottomMargin = UnitConverter.inchesToTwips(0.05);
        const leftRightMargin = UnitConverter.inchesToTwips(0.1);
        const absoluteSize = new Size(UnitConverter.inchesToTwips(2), UnitConverter.inchesToTwips(0.3));
        const relativeSize = new Size(AnchorTextBoxSize.RELATIVE_COEFF * 0.40, AnchorTextBoxSize.RELATIVE_COEFF * 0.2);
        let size = new AnchorTextBoxSize(false, 0, absoluteSize, relativeSize, RelativeWidthType.Page, RelativeHeightType.Page, false, false);
        let contentMargins = new Margins(leftRightMargin, leftRightMargin, topBottomMargin, topBottomMargin);
        let textBoxProperties = new TextBoxProperties(contentMargins);
        const anchorInfo = new AnchorInfo();
        anchorInfo.zOrder = this._processor.modelManager.modelManipulator.floatingObject.zOrder.getNewZOrder(this._subDocument);
        const inputPos = new InputPositionBase().setIntervals(SelectionIntervalsInfo.fromPosition(this._subDocument, position));
        this._processor.modelManager.modelManipulator.textBox.insertAnchoredTextBoxViaHistoty(new SubDocumentPosition(this._subDocument, position), inputPos.charPropsBundle, new BaseTextBoxInfo(null, size, new Shape(ColorUtils.fromString(ColorUtils.colorNames.white), ColorHelper.BLACK_COLOR, UnitConverter.pointsToTwips(3.0 / 4)), anchorInfo, textBoxProperties, new NonVisualDrawingObjectInfo()));
        const textBoxRun = this._subDocument.getRunByPosition(position);
        return new TextBoxApi(this._processor.modelManager, this._subDocument, textBoxRun, position);
    }
    get _runTypes() {
        return [RunType.AnchoredTextBoxRun];
    }
    _getItem(coreItem) {
        return new TextBoxApi(this._processor.modelManager, this._subDocument, coreItem.run, coreItem.position);
    }
}
