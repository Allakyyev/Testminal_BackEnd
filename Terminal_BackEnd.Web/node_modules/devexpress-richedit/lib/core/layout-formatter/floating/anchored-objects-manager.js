import { updateMinMaxBounds } from '../../../base-utils/min-max';
import { MinMaxNumber } from '@devexpress/utils/lib/class/min-max';
import { UnitConverter } from '@devexpress/utils/lib/class/unit-converter';
import { Size } from '@devexpress/utils/lib/geometry/size';
import { AnchorObjectHorizontalPositionCalculator } from './position-calculators/horizontal';
import { AnchorObjectVerticalPositionCalculator } from './position-calculators/vertical';
export class AnchoredObjectsManager {
    constructor(manager) {
        this.manager = manager;
        this.anchorObjectHorizontalPositionCalculator = new AnchorObjectHorizontalPositionCalculator(this.manager);
        this.anchorObjectVerticalPositionCalculator = new AnchorObjectVerticalPositionCalculator(this.manager);
        this.reset();
    }
    reset() {
        this.textBoxContextSizeCalculators = {};
    }
}
export class AnchoredTextBoxContextSizeCalculator {
    constructor(wrap, size, layoutInTableCell) {
        this.wrap = wrap;
        this.size = size;
        this.isInited = false;
        this.layoutInTableCell = layoutInTableCell;
    }
    calculateSize(boundsCalculator) {
        if (this.isInited)
            return;
        this.isInited = true;
        this.layoutSize = new Size(this.size.useAbsoluteWidth() ?
            UnitConverter.twipsToPixelsF(this.size.absoluteSize.width) :
            this.size.getActualRelativeWidth(boundsCalculator), this.size.useAbsoluteHeight() ?
            UnitConverter.twipsToPixelsF(this.size.absoluteSize.height) :
            this.size.getActualRelativeHeight(boundsCalculator));
        if (this.wrap.info.tablePosition && this.layoutInTableCell)
            updateMinMaxBounds(this.paragraphMinMax, new MinMaxNumber(this.layoutSize.width, this.layoutSize.width));
    }
}
