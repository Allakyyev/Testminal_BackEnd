import { ParagraphPropertyDescriptor } from '../../../../../../core/model/paragraph/paragraph-properties';
import { ParagraphBorderDestination } from './border-destination';
export class ParagraphRightBorderDestination extends ParagraphBorderDestination {
    getDescriptor() {
        return ParagraphPropertyDescriptor.rightBorder;
    }
}
