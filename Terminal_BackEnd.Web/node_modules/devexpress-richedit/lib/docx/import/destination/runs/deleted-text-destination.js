import { __awaiter } from "tslib";
import { TextDestination } from './text-destination';
export class DeletedTextDestination extends TextDestination {
    constructor(data) {
        super(data);
        this.characterProperties = this.data.subDocumentInfo.characterImporter.properties.clone();
    }
    processElementOpen(_reader) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
}
