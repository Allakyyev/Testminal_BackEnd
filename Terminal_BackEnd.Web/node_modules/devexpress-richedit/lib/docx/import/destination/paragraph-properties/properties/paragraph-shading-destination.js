import { __awaiter } from "tslib";
import { ParagraphPropertyDescriptor } from '../../../../../core/model/paragraph/paragraph-properties';
import { ShadingHelper } from '../../shading/shading-helper';
import { ParagraphFormattingLeafElementDestination } from '../paragraph-formatting-leaf-element-destination';
export class ParagraphShadingDestination extends ParagraphFormattingLeafElementDestination {
    processElementOpen(reader) {
        return __awaiter(this, void 0, void 0, function* () {
            this.setProperty(ShadingHelper.getShadingValue(this.data, reader));
        });
    }
    getDescriptor() {
        return ParagraphPropertyDescriptor.shadingInfo;
    }
}
