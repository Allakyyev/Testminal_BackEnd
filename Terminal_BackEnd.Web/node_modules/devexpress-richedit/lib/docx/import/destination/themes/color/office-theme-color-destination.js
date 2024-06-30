import { __awaiter } from "tslib";
import { DrawingColor } from '../../../../../core/model/drawing/drawing-color';
import { DrawingColorModelInfo } from '../../../../../core/model/drawing/drawing-color-model-info';
import { DrawingColorDestination } from './drawing-color-destination';
export class OfficeThemeColorDestination extends DrawingColorDestination {
    constructor(data, themeColorIndex) {
        super(data, new DrawingColor(new DrawingColorModelInfo()));
        this.themeColorIndex = themeColorIndex;
    }
    processElementClose(_reader) {
        return __awaiter(this, void 0, void 0, function* () {
            this.data.documentModel.colorProvider.officeTheme.colors.setDrawingColor(this.themeColorIndex, this.color);
        });
    }
}
