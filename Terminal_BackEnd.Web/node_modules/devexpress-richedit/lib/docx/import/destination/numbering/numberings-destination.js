import { __awaiter } from "tslib";
import { MapCreator } from '../../../../base-utils/map-creator';
import { MaskedCharacterProperties } from '../../../../core/model/character/character-properties';
import { ListNumberAlignment, NumberingFormat } from '../../../../core/model/numbering-lists/list-level-properties';
import { NumberingHelper } from '../../../../core/model/numbering-lists/numbering-helper';
import { AbstractNumberingList, NumberingType } from '../../../../core/model/numbering-lists/numbering-list';
import { ControlOptions } from '../../../../core/model/options/control';
import { MaskedParagraphProperties } from '../../../../core/model/paragraph/paragraph-properties';
import { TabProperties } from '../../../../core/model/paragraph/paragraph-style';
import { RichUtils } from '../../../../core/model/rich-utils';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { StringUtils } from '@devexpress/utils/lib/utils/string';
import { TranslationTables } from '../../../translation-table/translation-tables';
import { DocxNsType } from '../../../utils/constants';
import { OpenXmlAbstractNumberingInfo } from '../../list/open-xml-abstract-numbering-info';
import { OpenXmlListLevelOverride } from '../../list/open-xml-list-level-override';
import { OpenXmlNumberingListInfo } from '../../list/open-xml-numbering-list-info';
import { RunPropertiesBaseDestination } from '../character-properties/run-properties-base-destination';
import { ElementDestination, LeafElementDestination } from '../destination';
import { ParagraphPropertiesBaseDestination } from '../paragraph-properties/paragraph-properties-base-destination';
export class NumberingsDestination extends ElementDestination {
    constructor(data) {
        super(data);
    }
    get elementHandlerTable() {
        return NumberingsDestination.handlerTable;
    }
    static onAbstractNumbering(data, _reader) {
        return new AbstractNumberingListDestination(data);
    }
    static onNumbering(data, _reader) {
        return new NumberingListDestination(data);
    }
}
NumberingsDestination.handlerTable = new MapCreator()
    .add('abstractNum', NumberingsDestination.onAbstractNumbering)
    .add('num', NumberingsDestination.onNumbering)
    .get();
export class AbstractNumberingListDestination extends ElementDestination {
    constructor(data) {
        super(data);
        this.list = new AbstractNumberingList(data.documentModel);
        this.info = new OpenXmlAbstractNumberingInfo();
    }
    get elementHandlerTable() {
        return AbstractNumberingListDestination.handlerTable;
    }
    static getThis(data) {
        return data.destinationStack.getThis();
    }
    static onLevel(data, _reader) {
        return new NumberingLevelDestination(data, AbstractNumberingListDestination.getThis(data).list);
    }
    static onMultilevelType(data, _reader) {
        return new NumberingListMultiLevelTypeDestination(data, AbstractNumberingListDestination.getThis(data).list);
    }
    static onName(data, _reader) {
        return new NumberingListNameDestination(data, AbstractNumberingListDestination.getThis(data).list);
    }
    static onUniqueId(data, _reader) {
        return new AbstractNumberingListUniqueIdDestination(data, AbstractNumberingListDestination.getThis(data).list);
    }
    static onNumberingStyleLink(data, _reader) {
        return new NumberingListNumStyleLinkDestination(data, AbstractNumberingListDestination.getThis(data).info);
    }
    static onStyleLink(_data, _reader) {
        return null;
    }
    static onTemplate(_data, _reader) {
        return null;
    }
    processElementOpen(reader) {
        return __awaiter(this, void 0, void 0, function* () {
            this.id = reader.getAttributeNS('abstractNumId', this.data.constants.namespaces[DocxNsType.WordProcessing].namespace);
        });
    }
    processElementClose(_reader) {
        if (StringUtils.isNullOrEmpty(this.id))
            return;
        let innerId = this.list.innerId;
        let index;
        const abstractNumberingList = ListUtils.elementBy(this.data.documentModel.abstractNumberingLists, list => list.innerId == innerId);
        if (innerId != -1 && abstractNumberingList)
            index = this.data.documentModel.abstractNumberingLists.indexOf(abstractNumberingList);
        else {
            index = this.data.documentModel.abstractNumberingLists.length;
            this.data.documentModel.abstractNumberingLists.push(this.list);
        }
        this.info.abstractNumberingListId = this.id;
        this.info.abstractNumberingIndex = index;
        this.data.stylesImporter.addAbstractListInfo(this.info);
    }
}
AbstractNumberingListDestination.handlerTable = new MapCreator()
    .add('lvl', AbstractNumberingListDestination.onLevel)
    .add('multiLevelType', AbstractNumberingListDestination.onMultilevelType)
    .add('name', AbstractNumberingListDestination.onName)
    .add('nsid', AbstractNumberingListDestination.onUniqueId)
    .add('numStyleLink', AbstractNumberingListDestination.onNumberingStyleLink)
    .add('styleLink', AbstractNumberingListDestination.onStyleLink)
    .add('tmpl', AbstractNumberingListDestination.onTemplate)
    .get();
export class NumberingListDestination extends ElementDestination {
    constructor(data) {
        super(data);
        this.listInfo = new OpenXmlNumberingListInfo();
    }
    get elementHandlerTable() {
        return NumberingListDestination.handlerTable;
    }
    static getThis(data) {
        return data.destinationStack.getThis();
    }
    static onAbstractNumberingId(data, _reader) {
        return new AbstractNumberingListReferenceDestination(data, NumberingListDestination.getThis(data).listInfo);
    }
    static onLevelOverride(data, _reader) {
        return new ListLevelOverrideDestination(data, NumberingListDestination.getThis(data).listInfo);
    }
    processElementOpen(reader) {
        return __awaiter(this, void 0, void 0, function* () {
            this.listInfo.id = this.data.readerHelper.getWpSTIntegerValue(reader, 'numId', Number.MIN_VALUE);
        });
    }
    processElementClose(_reader) {
        if (StringUtils.isNullOrEmpty(this.listInfo.abstractNumberingListId) || this.listInfo.id == Number.MIN_VALUE)
            return;
        this.data.stylesImporter.addListInfo(this.listInfo);
    }
}
NumberingListDestination.handlerTable = new MapCreator()
    .add('abstractNumId', NumberingListDestination.onAbstractNumberingId)
    .add('lvlOverride', NumberingListDestination.onLevelOverride)
    .get();
export class AbstractNumberingLeafElementDestination extends LeafElementDestination {
    constructor(data, list) {
        super(data);
        this.list = list;
    }
}
export class NumberingListNameDestination extends AbstractNumberingLeafElementDestination {
    constructor(data, list) {
        super(data, list);
    }
    processElementOpen(_reader) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
}
export class AbstractNumberingListUniqueIdDestination extends AbstractNumberingLeafElementDestination {
    constructor(data, list) {
        super(data, list);
    }
    processElementOpen(reader) {
        return __awaiter(this, void 0, void 0, function* () {
            const value = this.data.readerHelper.getWpSTIntegerValue(reader, 'val', Number.MIN_VALUE, 16);
            if (value != Number.MIN_VALUE) {
                this.list.innerId = Math.abs(value);
            }
        });
    }
}
export class NumberingListMultiLevelTypeDestination extends AbstractNumberingLeafElementDestination {
    constructor(data, list) {
        super(data, list);
    }
    processElementOpen(reader) {
        return __awaiter(this, void 0, void 0, function* () {
            const listType = this.data.readerHelper.getWpEnumValue(reader, 'val', TranslationTables.numberingListTypeTable.importMap, NumberingType.Simple);
            if (listType != NumberingType.MultiLevel)
                this.setHybridListType();
        });
    }
    setHybridListType() {
        const count = this.list.levels.length;
        for (let i = 0; i < count; i++) {
            const listLevel = this.list.levels[i];
            listLevel.changeListLevelProperties((properties) => {
                if (properties.templateCode === 0)
                    properties.templateCode = NumberingHelper.generateNewTemplateCode(this.data.documentModel);
            });
        }
    }
}
export class NumberingListNumStyleLinkDestination extends LeafElementDestination {
    constructor(data, info) {
        super(data);
        this.info = info;
    }
    processElementOpen(reader) {
        return __awaiter(this, void 0, void 0, function* () {
            const styleId = reader.getAttributeNS('val', this.data.constants.wordProcessingNamespaceConst);
            if (styleId)
                this.info.numberingStyleReferenceIndex = styleId;
        });
    }
}
export class AbstractNumberingListReferenceDestination extends LeafElementDestination {
    constructor(data, listInfo) {
        super(data);
        this.listInfo = listInfo;
    }
    processElementOpen(reader) {
        return __awaiter(this, void 0, void 0, function* () {
            this.listInfo.abstractNumberingListId = reader.getAttributeNS('val', this.data.constants.namespaces[DocxNsType.WordProcessing].namespace);
        });
    }
}
export class ListLevelOverrideDestination extends LeafElementDestination {
    constructor(data, listInfo) {
        super(data);
        this.listInfo = listInfo;
        this.levelOverride = new OpenXmlListLevelOverride(this.data.documentModel);
    }
    get elementHandlerTable() {
        return ListLevelOverrideDestination.handlerTable;
    }
    static getThis(data) {
        return data.destinationStack.getThis();
    }
    static onLevelOverride(data, _reader) {
        const thisObject = ListLevelOverrideDestination.getThis(data);
        thisObject.overrideRead = true;
        return new ListLevelOverrideLevelDestination(data, thisObject.levelOverride);
    }
    static onLevelStartOverride(data, _reader) {
        const thisObject = ListLevelOverrideDestination.getThis(data);
        thisObject.overrideRead = true;
        return new ListLevelOverrideStartDestination(data, thisObject.levelOverride);
    }
    processElementOpen(reader) {
        return __awaiter(this, void 0, void 0, function* () {
            this.levelOverride.levelIndex = this.data.readerHelper.getWpSTIntegerValue(reader, 'ilvl', Number.MIN_VALUE);
        });
    }
    processElementClose(_reader) {
        if (this.levelOverride.levelIndex < 0 || this.levelOverride.levelIndex >= 9 || !this.overrideRead)
            return;
        this.listInfo.levelOverrides.push(this.levelOverride);
    }
}
ListLevelOverrideDestination.handlerTable = new MapCreator()
    .add('lvl', ListLevelOverrideDestination.onLevelOverride)
    .add('startOverride', ListLevelOverrideDestination.onLevelStartOverride)
    .get();
export class NumberingLevelBaseDestination extends ElementDestination {
    constructor(data) {
        super(data);
    }
    get elementHandlerTable() {
        return NumberingLevelBaseDestination.handlerTable;
    }
    get levelIndex() { return this._levelIndex; }
    ;
    set levelIndex(val) { this._levelIndex = val; }
    ;
    static getThis(data) {
        return data.destinationStack.getThis();
    }
    static createElementHandlerTable() {
        const result = new MapCreator()
            .add('isLgl', NumberingLevelBaseDestination.onLegalNumbering)
            .add('lvlJc', NumberingLevelBaseDestination.onTextAlignment)
            .add('lvlRestart', NumberingLevelBaseDestination.onRestart)
            .add('lvlText', NumberingLevelBaseDestination.onText)
            .add('start', NumberingLevelBaseDestination.onStart)
            .add('suff', NumberingLevelBaseDestination.onSuffix)
            .add('numFmt', NumberingLevelBaseDestination.onNumberingFormat)
            .add('pPr', NumberingLevelBaseDestination.onParagraphProperties)
            .add('rPr', NumberingLevelBaseDestination.onRunProperties)
            .add('legacy', NumberingLevelBaseDestination.onLegacy);
        return result;
    }
    static onTextAlignment(data, _reader) {
        return new ListLevelTextAlignmentDestination(data, NumberingLevelBaseDestination.getThis(data));
    }
    static onRestart(data, _reader) {
        return new ListLevelRestartDestination(data, NumberingLevelBaseDestination.getThis(data));
    }
    static onText(data, _reader) {
        return new ListLevelFormatStringDestination(data, NumberingLevelBaseDestination.getThis(data));
    }
    static onStart(data, _reader) {
        return new ListLevelStartDestination(data, NumberingLevelBaseDestination.getThis(data));
    }
    static onSuffix(data, _reader) {
        return new ListLevelSuffixDestination(data, NumberingLevelBaseDestination.getThis(data));
    }
    static onNumberingFormat(data, _reader) {
        return new ListLevelNumberingFormatDestination(data, NumberingLevelBaseDestination.getThis(data));
    }
    static onParagraphProperties(data, _reader) {
        return new ListLevelParagraphPropertiesDestination(data, NumberingLevelBaseDestination.getThis(data).level);
    }
    static onRunProperties(data, _reader) {
        return new ListLevelRunPropertiesDestination(data, NumberingLevelBaseDestination.getThis(data).level);
    }
    static onLegalNumbering(data, _reader) {
        return new ListLevelLegalNumberingDestination(data, NumberingLevelBaseDestination.getThis(data));
    }
    static onLegacy(data, _reader) {
        return new ListLevelLegacyDestination(data, NumberingLevelBaseDestination.getThis(data));
    }
}
NumberingLevelBaseDestination.handlerTable = NumberingLevelBaseDestination.createElementHandlerTable()
    .get();
export class NumberingLevelDestination extends NumberingLevelBaseDestination {
    constructor(data, list) {
        super(data);
        this.list = list;
    }
    get elementHandlerTable() {
        return NumberingLevelDestination.handlerTable;
    }
    static onParagraphStyleReference(data, _reader) {
        return new ListLevelParagraphStyleReferenceDestination(data, NumberingLevelBaseDestination.getThis(data));
    }
    processElementOpen(reader) {
        return __awaiter(this, void 0, void 0, function* () {
            this.levelIndex = this.data.readerHelper.getWpSTIntegerValue(reader, 'ilvl', 0);
            this.level = this.list.createLevel(this.levelIndex);
            this.levelProperties = this.level.getListLevelProperties().clone();
            this.levelProperties.templateCode = this.data.readerHelper.getWpSTIntegerValue(reader, 'tplc', 0, 16);
        });
    }
    processElementClose(_reader) {
        this.level.setListLevelProperties(this.levelProperties);
        if (this.levelIndex < 0 || this.levelIndex >= 9)
            return;
        this.list.levels[this.levelIndex] = this.level;
    }
}
NumberingLevelDestination.handlerTable = NumberingLevelBaseDestination.createElementHandlerTable()
    .add('pStyle', NumberingLevelDestination.onParagraphStyleReference)
    .get();
export class ListLevelOverrideLevelDestination extends NumberingLevelBaseDestination {
    constructor(data, levelOverride) {
        super(data);
        this.levelOverride = levelOverride;
        this.level = levelOverride.getOverrideListLevel();
        this.levelProperties = this.level.getListLevelProperties().clone();
    }
    get levelIndex() {
        return this.levelOverride.levelIndex;
    }
    processElementOpen(reader) {
        const _super = Object.create(null, {
            processElementOpen: { get: () => super.processElementOpen }
        });
        return __awaiter(this, void 0, void 0, function* () {
            _super.processElementOpen.call(this, reader);
            this.level.changeListLevelProperties((prop) => prop.templateCode = this.data.readerHelper.getWpSTIntegerValue(reader, 'tplc', 0, 16));
        });
    }
    processElementClose(_reader) {
        this.level.setListLevelProperties(this.levelProperties);
    }
}
export class ListLevelOverrideStartDestination extends LeafElementDestination {
    constructor(data, levelOverride) {
        super(data);
        this.levelOverride = levelOverride;
    }
    processElementOpen(reader) {
        return __awaiter(this, void 0, void 0, function* () {
            this.levelOverride.newStart = this.data.readerHelper.getWpSTIntegerValue(reader, 'val', 0);
        });
    }
}
export class ListLevelElementDestination extends LeafElementDestination {
    constructor(data, levelDestination) {
        super(data);
        this.levelDestination = levelDestination;
    }
    get properties() {
        return this.levelDestination.levelProperties;
    }
}
export class ListLevelTextAlignmentDestination extends ListLevelElementDestination {
    constructor(data, levelDestination) {
        super(data, levelDestination);
    }
    processElementOpen(reader) {
        return __awaiter(this, void 0, void 0, function* () {
            this.properties.alignment = this.data.readerHelper.getWpEnumValue(reader, 'val', TranslationTables.listNumberAlignmentTable.importMap, ListNumberAlignment.Left);
        });
    }
}
export class ListLevelStartDestination extends ListLevelElementDestination {
    constructor(data, levelDestination) {
        super(data, levelDestination);
    }
    processElementOpen(reader) {
        return __awaiter(this, void 0, void 0, function* () {
            this.properties.start = Math.max(0, this.data.readerHelper.getWpSTIntegerValue(reader, 'val'));
        });
    }
}
export class ListLevelLegacyDestination extends ListLevelElementDestination {
    constructor(data, levelDestination) {
        super(data, levelDestination);
    }
    processElementOpen(reader) {
        return __awaiter(this, void 0, void 0, function* () {
            this.properties.legacy = true;
            this.properties.legacySpace = this.data.readerHelper.getWpSTIntegerValue(reader, 'legacySpace', 0);
            this.properties.legacyIndent = this.data.readerHelper.getWpSTIntegerValue(reader, 'legacyIndent', 0);
        });
    }
}
export class ListLevelFormatStringDestination extends ListLevelElementDestination {
    constructor(data, levelDestination) {
        super(data, levelDestination);
    }
    processElementOpen(reader) {
        return __awaiter(this, void 0, void 0, function* () {
            let formatString = reader.getAttributeNS('val', this.data.constants.namespaces[DocxNsType.WordProcessing].namespace);
            if (formatString == null)
                formatString = '';
            if (!ControlOptions.isEnabled(this.data.documentModel.options.numberingBulleted))
                formatString = this.replaceStringFormatInBulletNumbering(formatString);
            if (!ControlOptions.isEnabled(this.data.documentModel.options.numberingSimple) &&
                ControlOptions.isEnabled(this.data.documentModel.options.numberingBulleted)) {
                formatString = this.replaceStringFormatInSimpleNumbering();
                this.levelDestination.level.getCharacterProperties().fontInfo.name = 'Symbol';
            }
            this.properties.displayFormatString = this.convertFormatString(formatString);
        });
    }
    replaceStringFormatInBulletNumbering(value) {
        const result = this.convertFormatString(value);
        if (result == value)
            return '%1.';
        return value;
    }
    replaceStringFormatInSimpleNumbering() {
        return '·';
    }
    convertFormatString(value) {
        const regex = new RegExp(/%\d/);
        let result = value.replace('{', '{{').replace('}', '}}');
        let match = result.match(regex);
        if (match) {
            do {
                const matchString = match[0];
                const numberIndex = matchString.search(/\d/);
                const numb = parseInt(matchString.substr(numberIndex, 1), 10);
                result = result.replace(regex, '{' + (numb - 1) + '}');
                match = result.match(regex);
            } while (match);
        }
        return result;
    }
}
export class ListLevelRestartDestination extends ListLevelElementDestination {
    constructor(data, levelDestination) {
        super(data, levelDestination);
    }
    processElementOpen(reader) {
        return __awaiter(this, void 0, void 0, function* () {
            const index = Math.min(9, Math.max(0, this.data.readerHelper.getWpSTIntegerValue(reader, 'val')));
            this.properties.relativeRestartLevel = this.levelDestination.levelIndex - index;
        });
    }
}
export class ListLevelSuffixDestination extends ListLevelElementDestination {
    constructor(data, levelDestination) {
        super(data, levelDestination);
    }
    processElementOpen(reader) {
        return __awaiter(this, void 0, void 0, function* () {
            this.properties.separator = String.fromCharCode(this.data.readerHelper.getWpEnumValue(reader, 'val', TranslationTables.listNumberSeparatorTable.importMap, RichUtils.specialCharacters.TabMark.charCodeAt(0)));
        });
    }
}
export class ListLevelNumberingFormatDestination extends ListLevelElementDestination {
    constructor(data, levelDestination) {
        super(data, levelDestination);
    }
    processElementOpen(reader) {
        return __awaiter(this, void 0, void 0, function* () {
            let format = this.data.readerHelper.getWpEnumValue(reader, 'val', TranslationTables.pageNumberingFormatTable.importMap, NumberingFormat.Decimal);
            if (format == NumberingFormat.Bullet && !ControlOptions.isEnabled(this.data.documentModel.options.numberingBulleted) &&
                ControlOptions.isEnabled(this.data.documentModel.options.numberingSimple))
                format = NumberingFormat.Decimal;
            else if (format == NumberingFormat.Decimal && !ControlOptions.isEnabled(this.data.documentModel.options.numberingSimple) &&
                ControlOptions.isEnabled(this.data.documentModel.options.numberingBulleted))
                format = NumberingFormat.Bullet;
            this.properties.format = format;
        });
    }
}
export class ListLevelLegalNumberingDestination extends ListLevelElementDestination {
    constructor(data, levelDestination) {
        super(data, levelDestination);
    }
    processElementOpen(reader) {
        return __awaiter(this, void 0, void 0, function* () {
            this.properties.convertPreviousLevelNumberingToDecimal = this.data.readerHelper.getWpSTOnOffValue(reader, 'val');
        });
    }
}
export class ListLevelParagraphStyleReferenceDestination extends ListLevelElementDestination {
    constructor(data, levelDestination) {
        super(data, levelDestination);
    }
    processElementOpen(_reader) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
}
export class ListLevelRunPropertiesDestination extends RunPropertiesBaseDestination {
    constructor(data, level) {
        super(data, null);
        this.level = level;
        this.characterProperties = MaskedCharacterProperties.createDefault(this.data.documentModel);
    }
    processElementClose(_reader) {
        this.level.setCharacterProperties(this.characterProperties);
    }
}
export class ListLevelParagraphPropertiesDestination extends ParagraphPropertiesBaseDestination {
    constructor(data, level) {
        super(data, null, new TabProperties());
        this.paragraphProperties = MaskedParagraphProperties.createDefault(this.data.documentModel);
        this.level = level;
    }
    get numberingId() {
        return -1;
    }
    set numberingId(_value) { }
    get listLevelIndex() {
        return -1;
    }
    set listLevelIndex(_value) { }
    processElementClose(_reader) {
        this.level.setParagraphProperties(this.paragraphProperties);
    }
}
