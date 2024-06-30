import { __awaiter } from "tslib";
import { FormatImagesImporter } from '../../core/formats/utils/images-import';
import { Stack } from '@devexpress/utils/lib/class/stack';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { DocxConstants } from '../utils/constants';
import { ProgressIndication } from '../utils/progress-indication';
import { XmlReaderState } from '../zip/xml-reader';
import { AltChunkImporter } from './importers/alt-chunk-importer';
import { CorePropertiesImporter } from './importers/core-properties-importer';
import { CustomPropertiesImporter } from './importers/custom-properties-importer';
import { EndNotesImporter } from './importers/end-notes-importer';
import { FootNotesImporter } from './importers/foot-notes-importer';
import { HeaderFooterImporter } from './importers/header-footer-importer';
import { NumberingListImporter } from './importers/numbering-list-importer';
import { SectionImporter } from './importers/section-importer';
import { SettingsImporter } from './importers/settings-importer';
import { StylesImporter } from './importers/styles-importer';
import { ThemesImporter } from './importers/themes-importer';
import { WebSettingsImporter } from './importers/web-settings-importer';
import { ImportSubDocumentInfo } from './model/import-sub-document-info';
import { ReaderHelper } from './utils/reader-helper';
import { RelationsCollection } from './utils/relations-collection';
export class DestinationStack extends Stack {
    getThis() {
        return this.last.peek();
    }
}
export class Data {
    constructor(options, archiveData, documentModel) {
        this.imageRelationToCacheMap = {};
        this.options = options;
        this.archiveData = archiveData;
        this.documentModel = documentModel;
        this.formatImagesImporter = new FormatImagesImporter();
        this.stylesImporter = new StylesImporter(this);
        this.stylesImporter.presetDefaultProperties();
        this.subDocumentsInfoStack = new Stack();
        this.pushCurrentSubDocument(this.documentModel.mainSubDocument);
        this.progressIndication = new ProgressIndication();
        this.constants = new DocxConstants();
        this.readerHelper = new ReaderHelper(this);
        this.relationsStack = new Stack();
        this.corePropertiesImporter = new CorePropertiesImporter(this);
        this.customPropertiesImporter = new CustomPropertiesImporter(this);
        this.endNotesImporter = new EndNotesImporter(this);
        this.footNotesImporter = new FootNotesImporter(this);
        this.numberingListImporter = new NumberingListImporter(this);
        this.settingsImporter = new SettingsImporter(this);
        this.themesImporter = new ThemesImporter(this);
        this.webSettingsImporter = new WebSettingsImporter(this);
        this.headerFooterImporter = new HeaderFooterImporter(this);
        this.sectionImporter = new SectionImporter(this);
        this.altChunkImporter = new AltChunkImporter(this);
        this.destinationStack = new DestinationStack();
    }
    get subDocumentInfo() { return this.subDocumentsInfoStack.last; }
    get subDocument() { return this._subDocument; }
    fixLastParagraph() {
        if (this.shouldFixLastParagraph()) {
        }
    }
    addRelations(filePath) {
        return __awaiter(this, void 0, void 0, function* () {
            const rel = new RelationsCollection(this);
            yield rel.init(filePath);
            this.relationsStack.push(rel);
            return rel;
        });
    }
    pushCurrentSubDocument(subDocument) {
        this._subDocument = subDocument;
        this.subDocumentsInfoStack.push(new ImportSubDocumentInfo(this, subDocument, {}, null));
    }
    popCurrentSubDocument() {
        const oldInfo = this.subDocumentsInfoStack.last;
        oldInfo.endImport();
        this.subDocumentsInfoStack.pop();
        this._subDocument = this.subDocumentsInfoStack.last ? this.subDocumentsInfoStack.last.subDocument : null;
        return oldInfo.subDocument;
    }
    importContent(reader, initialDestination) {
        return __awaiter(this, void 0, void 0, function* () {
            const destinationCount = this.destinationStack.count;
            this.destinationStack.push(initialDestination);
            while (reader.read())
                yield this.destinationStack.last.process(reader);
            if (reader.state == XmlReaderState.Error) {
                this.options.throwInvalidFile('Invalid file');
                return false;
            }
            while (this.destinationStack.count > destinationCount)
                this.destinationStack.pop();
            return true;
        });
    }
    shouldFixLastParagraph() {
        return this.subDocument.paragraphs.length > 1 &&
            ListUtils.last(this.subDocument.paragraphs).isEmpty && true;
    }
}
