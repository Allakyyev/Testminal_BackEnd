import { __awaiter } from "tslib";
import { RichUtils } from '../../../../core/model/rich-utils';
import { LeafElementDestination } from '../destination';
export class CarriageReturnDestination extends LeafElementDestination {
    processElementOpen(_reader) {
        return __awaiter(this, void 0, void 0, function* () {
            this.data.subDocumentInfo.characterImporter.insertText(RichUtils.specialCharacters.LineBreak);
        });
    }
}
