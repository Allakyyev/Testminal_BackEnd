import { ParagraphPropertyDescriptor } from '../../../../../../core/model/paragraph/paragraph-properties';
import { ParagraphBorderDestination } from './border-destination';
export class ParagraphLeftBorderDestination extends ParagraphBorderDestination {
    getDescriptor() {
        return ParagraphPropertyDescriptor.leftBorder;
    }
}
