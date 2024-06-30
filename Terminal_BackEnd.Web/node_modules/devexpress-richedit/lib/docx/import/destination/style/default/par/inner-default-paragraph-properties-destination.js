import { NumberingList } from '../../../../../../core/model/numbering-lists/numbering-list';
import { ParagraphPropertiesBaseDestination } from '../../../paragraph-properties/paragraph-properties-base-destination';
export class InnerDefaultParagraphPropertiesDestination extends ParagraphPropertiesBaseDestination {
    get elementHandlerTable() {
        return ParagraphPropertiesBaseDestination.handlerTable;
    }
    get numberingId() {
        return NumberingList.NumberingListNotSettedIndex;
    }
    set numberingId(_value) {
    }
    get listLevelIndex() {
        return NumberingList.NumberingListNotSettedIndex;
    }
    set listLevelIndex(_value) {
    }
}
