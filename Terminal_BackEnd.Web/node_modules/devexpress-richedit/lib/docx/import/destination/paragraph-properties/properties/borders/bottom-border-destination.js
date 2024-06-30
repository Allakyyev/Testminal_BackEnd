import { ParagraphPropertyDescriptor } from '../../../../../../core/model/paragraph/paragraph-properties';
import { ParagraphBorderDestination } from './border-destination';
export class ParagraphBottomBorderDestination extends ParagraphBorderDestination {
    getDescriptor() {
        return ParagraphPropertyDescriptor.bottomBorder;
    }
}
