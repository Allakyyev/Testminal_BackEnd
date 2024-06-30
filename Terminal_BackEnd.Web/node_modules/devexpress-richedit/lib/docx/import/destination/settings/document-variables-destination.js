import { __awaiter } from "tslib";
import { MapCreator } from '../../../../base-utils/map-creator';
import { StringUtils } from '@devexpress/utils/lib/utils/string';
import { ElementDestination, LeafElementDestination } from '../destination';
export class DocumentSettingsDocVarsDestination extends ElementDestination {
    get elementHandlerTable() {
        return DocumentSettingsDocVarsDestination.handlerTable;
    }
}
DocumentSettingsDocVarsDestination.handlerTable = new MapCreator()
    .add('docVar', (data) => new DocumentSettingsDocVarDestination(data))
    .get();
export class DocumentSettingsDocVarDestination extends LeafElementDestination {
    processElementOpen(reader) {
        return __awaiter(this, void 0, void 0, function* () {
            const name = this.data.readerHelper.readAttribute(reader, 'name');
            const value = this.data.readerHelper.readAttribute(reader, 'val');
            if (!StringUtils.isNullOrEmpty(name) && !StringUtils.isNullOrEmpty(value))
                this.data.documentModel.docVariables.addValue(name, value);
        });
    }
}
