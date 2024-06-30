import { __awaiter } from "tslib";
import { OpenXmlRelation } from '../../../utils/open-xml-relation';
import { ElementDestination } from '../destination';
export class RelationDestination extends ElementDestination {
    constructor(data, relations) {
        super(data);
        this.relations = relations;
    }
    get elementHandlerTable() {
        return {};
    }
    processElementOpen(reader) {
        return __awaiter(this, void 0, void 0, function* () {
            const rel = new OpenXmlRelation(reader.getAttribute('Id'), reader.getAttribute('Target'), reader.getAttribute('Type'), reader.getAttribute('TargetMode'));
            if (!rel.isEmpty())
                this.relations.add(rel);
        });
    }
}
