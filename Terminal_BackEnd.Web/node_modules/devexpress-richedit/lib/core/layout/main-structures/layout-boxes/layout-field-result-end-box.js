import { Errors } from '@devexpress/utils/lib/errors';
import { LayoutBox, LayoutBoxType } from './layout-box';
export class LayoutFieldResultEndBox extends LayoutBox {
    getType() {
        return LayoutBoxType.FieldResultEnd;
    }
    clone() {
        throw new Error(Errors.InternalException);
    }
    isWhitespace() {
        throw new Error(Errors.InternalException);
    }
    renderGetContent(_renderer) {
        throw new Error(Errors.InternalException);
    }
    pushInfoForMeasure(_info, _showHiddenSymbols) { }
    popInfoForMeasure(_info, _showHiddenSymbols) { }
    isLineBreak() {
        throw new Error(Errors.InternalException);
    }
}
