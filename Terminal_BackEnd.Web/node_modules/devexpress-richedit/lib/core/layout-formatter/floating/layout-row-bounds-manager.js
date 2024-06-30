import { CompatibilityMode } from '../../model/document-model';
import { Errors } from '@devexpress/utils/lib/errors';
import { Polygon } from '@devexpress/utils/lib/geometry/polygon';
import { Rectangle } from '@devexpress/utils/lib/geometry/rectangle';
import { IntervalAlgorithms } from '@devexpress/utils/lib/intervals/algorithms';
import { FixedInterval } from '@devexpress/utils/lib/intervals/fixed';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { NumberMapUtils } from '@devexpress/utils/lib/utils/map/number';
import { AnchoredObjectLevelType } from '../../layout/main-structures/layout-boxes/layout-anchored-object-box';
import { AnchorObjectTextWrapSide, AnchorObjectTextWrapType } from '../../model/floating-objects/enums';
export class RectangleRowBoundsCalculatorInfo extends Rectangle {
}
export class AnchorObjectBoundsInfo {
    constructor(bounds, cell) {
        this.bounds = bounds;
        this.cell = cell;
        this.canPutTextAtRight = false;
        this.canPutTextAtLeft = false;
    }
}
export class LayoutRowBoundsCalculator {
    getRectangleBounds(manager) {
        const tableFormatter = manager.activeFormatter.tableFormatter;
        if (!tableFormatter) {
            const ignoreFloatingObjectsInHeaderFooter = manager.model.compatibilitySettings.compatibilityMode < CompatibilityMode.Word2013;
            if (manager.activeFormatter.subDocument.isHeaderFooter() && ignoreFloatingObjectsInHeaderFooter)
                return [];
            else
                return this.rectangleBounds;
        }
        const posInfo = manager.layout.anchorObjectsPositionInfo;
        const tableEndPos = tableFormatter.tableInfo.table.getEndPosition();
        return ListUtils.reducedMap(this.rectangleBounds, (b, i) => posInfo.getPosition(this.ancObjectsId[i]) < tableEndPos ? b : null);
    }
    addTableInTextObject(obj, horizOuterBounds) {
        this.addAnchoredObject(obj, horizOuterBounds);
    }
    resetByColumn(objects, horizOuterBounds, ignoreFo) {
        this.rectangleBounds = [];
        this.ancObjectsId = [];
        if (!ignoreFo) {
            const inTextObjects = NumberMapUtils.reducedMap(objects, (obj) => obj.levelType == AnchoredObjectLevelType.InText ? obj : null);
            NumberMapUtils.forEach(inTextObjects, (obj) => this.addAnchoredObject(obj, horizOuterBounds));
        }
    }
    removeAnchorObjectId(id) {
        this.ancObjectsId.splice(id, 1);
        this.rectangleBounds.splice(id, 1);
    }
    addAnchoredObject(obj, horizOuterBounds) {
        const anchorInfo = obj.anchorInfo;
        const extBounds = obj.getExtendedBounds();
        const center = extBounds.center;
        const polygon = Polygon.fromRectangle(extBounds);
        polygon.rotateAround(center, obj.rotationInRadians, false, true);
        const bounds = polygon.bounds;
        switch (anchorInfo.wrapType) {
            case AnchorObjectTextWrapType.Tight:
            case AnchorObjectTextWrapType.Through:
            case AnchorObjectTextWrapType.Square: {
                const info = this.createAnchorObjectBoundsInfo(anchorInfo, bounds, obj.parentCell);
                LayoutRowBoundsCalculator.applySquareWrapSide(anchorInfo.wrapSide, info, horizOuterBounds);
                this.rectangleBounds.push(info);
                break;
            }
            case AnchorObjectTextWrapType.TopAndBottom: {
                const info = this.createAnchorObjectBoundsInfo(anchorInfo, bounds, obj.parentCell);
                info.canPutTextAtLeft = false;
                info.canPutTextAtRight = false;
                this.rectangleBounds.push(info);
                break;
            }
            default: throw new Error(Errors.InternalException);
        }
        this.ancObjectsId.push(obj.objectId);
    }
    createAnchorObjectBoundsInfo(anchorInfo, bounds, cell) {
        bounds.applyOffsetsOutside(anchorInfo.getDistanceMargins());
        return new AnchorObjectBoundsInfo(bounds, cell);
    }
    static applySquareWrapSide(wrapSide, boundsInfo, horizOuterBounds) {
        const bounds = boundsInfo.bounds;
        const intersection = IntervalAlgorithms.getIntersectionNonNullLength(new FixedInterval(bounds.x, bounds.width), horizOuterBounds);
        if (!intersection)
            return;
        switch (wrapSide) {
            case AnchorObjectTextWrapSide.Right:
                boundsInfo.canPutTextAtRight = true;
                break;
            case AnchorObjectTextWrapSide.Left:
                boundsInfo.canPutTextAtLeft = true;
                break;
            case AnchorObjectTextWrapSide.Largest:
                boundsInfo.canPutTextAtLeft = intersection.start - horizOuterBounds.start >= horizOuterBounds.end - intersection.end;
                boundsInfo.canPutTextAtRight = !boundsInfo.canPutTextAtLeft;
                break;
            case AnchorObjectTextWrapSide.Both:
                boundsInfo.canPutTextAtRight = true;
                boundsInfo.canPutTextAtLeft = true;
                break;
        }
    }
}
