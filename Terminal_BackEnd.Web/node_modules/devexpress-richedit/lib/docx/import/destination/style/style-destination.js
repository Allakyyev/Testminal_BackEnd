import { __awaiter } from "tslib";
import { MapCreator } from '../../../../base-utils/map-creator';
import { StringMapUtils } from '@devexpress/utils/lib/utils/map/string';
import { DocxNsType } from '../../../utils/constants';
import { LinkedStyleIdDestination } from './base/linked-style-id-destination';
import { NextStyleDestination } from './base/next-style-destination';
import { StyleHiddenDestination } from './base/style-hidden-destination';
import { StyleNameDestination } from './base/style-name-destination';
import { StyleParentIdDestination } from './base/style-parent-id-destination';
import { StyleQFormatDestination } from './base/style-qformat-destination';
import { StyleSemiHiddenDestination } from './base/style-semi-hidden-destination';
import { StyleConditionalTableFormatting } from './style-conditional-table-formatting';
import { StyleDestinationBase } from './style-destination-base';
export class StyleDestination extends StyleDestinationBase {
    get currImporter() { return this.data.stylesImporter.currImporter; }
    get elementHandlerTable() { return StyleDestination.handlerTable; }
    processElementOpen(reader) {
        const _super = Object.create(null, {
            processElementOpen: { get: () => super.processElementOpen }
        });
        return __awaiter(this, void 0, void 0, function* () {
            _super.processElementOpen.call(this, reader);
            switch (reader.getAttributeNS('type', this.data.constants.namespaces[DocxNsType.WordProcessing].namespace)) {
                case 'character':
                    this.data.stylesImporter.currImporter = this.data.stylesImporter.characterManager;
                    break;
                case 'table':
                    this.data.stylesImporter.currImporter = this.data.stylesImporter.tableManager;
                    break;
                case 'tableCell':
                    this.data.stylesImporter.currImporter = this.data.stylesImporter.tableCellManager;
                    break;
                case 'numbering':
                    this.data.stylesImporter.currImporter = this.data.stylesImporter.numberingListManager;
                    break;
                case 'paragraph':
                default:
                    this.data.stylesImporter.currImporter = this.data.stylesImporter.paragraphManager;
                    break;
            }
            this.currImporter.startImport();
            this.currImporter.currInfo.id = reader.getAttributeNS('styleId', this.data.constants.namespaces[DocxNsType.WordProcessing].namespace);
            this.currImporter.currInfo.isDefault = this.data.readerHelper.getWpSTOnOffValue(reader, 'default', false);
        });
    }
    processElementClose(reader) {
        super.processElementClose(reader);
        this.currImporter.endImport(this);
    }
}
StyleDestination.handlerTable = new MapCreator(StringMapUtils.map(StyleDestinationBase.handlerTable, e => e))
    .add('basedOn', (data, _reader) => new StyleParentIdDestination(data))
    .add('hidden', (data, _reader) => new StyleHiddenDestination(data))
    .add('qFormat', (data, _reader) => new StyleQFormatDestination(data))
    .add('semiHidden', (data, _reader) => new StyleSemiHiddenDestination(data))
    .add('name', (data, _reader) => new StyleNameDestination(data))
    .add('link', (data, _reader) => new LinkedStyleIdDestination(data))
    .add('next', (data, _reader) => new NextStyleDestination(data))
    .add('tblStylePr', (data, _reader) => new StyleConditionalTableFormatting(data))
    .get();
