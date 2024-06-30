import { __awaiter } from "tslib";
import { MapCreator } from '../../../../base-utils/map-creator';
import { CompatSettings } from '../../../../core/model/compat-settings';
import { CompatibilityMode } from '../../../../core/model/document-model';
import { ElementDestination, LeafElementDestination } from '../destination';
export class DocumentSettingsCompatDestination extends ElementDestination {
    get elementHandlerTable() {
        return DocumentSettingsCompatDestination.handlerTable;
    }
}
DocumentSettingsCompatDestination.handlerTable = new MapCreator()
    .add('compatSetting', (data) => new DocumentSettingsCompatSettingDestination(data))
    .get();
export class DocumentSettingsCompatSettingDestination extends LeafElementDestination {
    processElementOpen(reader) {
        return __awaiter(this, void 0, void 0, function* () {
            const compatSettings = new CompatSettings();
            compatSettings.name = this.data.readerHelper.readAttribute(reader, 'name');
            compatSettings.uri = this.data.readerHelper.readAttribute(reader, 'uri');
            compatSettings.value = this.data.readerHelper.readAttribute(reader, 'val');
            this.data.documentModel.compatSettings.push(compatSettings);
            this.processSetting(reader, compatSettings);
        });
    }
    processSetting(reader, prop) {
        if (prop.name == "compatibilityMode")
            this.data.documentModel.compatibilitySettings.compatibilityMode = this.data.readerHelper.getWpSTIntegerValue(reader, "val", CompatibilityMode.Word2007);
    }
}
