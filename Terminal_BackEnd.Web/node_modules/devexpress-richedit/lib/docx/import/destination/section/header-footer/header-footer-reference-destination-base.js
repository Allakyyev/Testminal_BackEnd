import { __awaiter } from "tslib";
import { SubDocumentInfoType } from '../../../../../core/model/enums';
import { HeaderFooterType } from '../../../../../core/model/section/enums';
import { StringUtils } from '@devexpress/utils/lib/utils/string';
import { PathHelper } from '../../../../utils/path-helper';
import { LeafElementDestination } from '../../destination';
import { HeaderFooterDestination } from './header-footer-destination';
export class HeaderFooterReferenceDestinationBase extends LeafElementDestination {
    processElementOpen(reader) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = reader.getAttributeNS('id', this.data.constants.relsNamespaceConst);
            if (StringUtils.isNullOrEmpty(id))
                this.data.options.throwInvalidFile('Invalid file. Not found header');
            const sdType = reader.getAttributeNS('type', this.data.constants.wordProcessingNamespaceConst);
            const hdrReader = yield this.data.relationsStack.last.lookupPackageFileStreamByRelationId(id, this.data.documentRootFolder);
            yield this.data.addRelations(`${this.data.documentRootFolder}/_rels/${PathHelper.getFileName(hdrReader.filePath)}.rels`);
            if (hdrReader.readToFollowingNS(this.isHeader() ? 'hdr' : 'ftr', this.data.constants.wordProcessingNamespaceConst)) {
                this.data.pushCurrentSubDocument(this.createSubDocument(sdType));
                yield this.data.importContent(hdrReader, new HeaderFooterDestination(this.data));
            }
            else {
                reader.skipElement();
                this.data.options.throwInvalidFile("Invalid file. (Don't find header/footer reference)");
            }
        });
    }
    processElementClose(_reader) {
        this.data.altChunkImporter.insertAltChunks();
        this.data.fixLastParagraph();
        this.data.popCurrentSubDocument();
        this.data.relationsStack.pop();
    }
    createSubDocument(type) {
        if (StringUtils.isNullOrEmpty(type))
            type = 'default';
        const section = this.data.sectionImporter.section;
        const createdSubDocument = this.documentModel.createSubDocument(this.isHeader() ? SubDocumentInfoType.Header : SubDocumentInfoType.Footer, -1, true);
        let hfType;
        switch (type) {
            case 'first':
                hfType = HeaderFooterType.First;
                break;
            case 'even':
                hfType = HeaderFooterType.Even;
                break;
            case 'odd':
            case 'default':
                hfType = HeaderFooterType.Odd;
                break;
            default:
                this.data.options.throwInvalidFile('Inknown section type');
        }
        (this.isHeader() ?
            section.headers.setObjectIndex(hfType, this.documentModel.headers.push(createdSubDocument.info) - 1) :
            section.footers.setObjectIndex(hfType, this.documentModel.footers.push(createdSubDocument.info) - 1));
        return createdSubDocument;
    }
}
export class FooterReferenceDestination extends HeaderFooterReferenceDestinationBase {
    isHeader() { return false; }
}
export class HeaderReferenceDestination extends HeaderFooterReferenceDestinationBase {
    isHeader() { return true; }
}
