import { __awaiter } from "tslib";
import { RichUtils } from '../../../../core/model/rich-utils';
import { ElementDestination } from '../destination';
export class SeparatorDestination extends ElementDestination {
    get elementHandlerTable() {
        return {};
    }
    processElementOpen(_reader) {
        return __awaiter(this, void 0, void 0, function* () {
            this.data.subDocumentInfo.characterImporter.insertText(RichUtils.specialCharacters.SeparatorMark);
        });
    }
}
