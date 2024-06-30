import { MathUtils } from '@devexpress/utils/lib/utils/math';
import { RtfOldListLevelInfoCollection } from '../model/numbering-lists/rtf-old-list-level-info-collection';
import { RtfBaseImporter } from './importer-base';
export class NumberingListsImporter extends RtfBaseImporter {
    constructor(data) {
        super(data);
        this.listOverrideIndexToNumberingListIndexMap = {};
        this.numberingListToOldListLevelInfoMap = {};
        this.paragraphStyleListOverrideIndexMap = {};
        this.oldListLevelInfoCollection = new RtfOldListLevelInfoCollection();
    }
    ensureNumberingListLevelValid(listLevelIndex) {
        return MathUtils.restrictValue(listLevelIndex, 0, 8);
    }
    addNumberingListToParagraph(paragraph, paragraphListInfo) {
        paragraph.numberingListIndex = paragraphListInfo.numberingListIndex;
        paragraph.listLevelIndex = this.ensureNumberingListLevelValid(paragraphListInfo.listLevelIndex);
    }
    linkParagraphStylesWithNumberingLists() {
        for (let style of this.documentModel.paragraphStyles) {
            const info = this.paragraphStyleListOverrideIndexMap[style.styleName];
            if (!info)
                return;
            const numberingListIndex = this.listOverrideIndexToNumberingListIndexMap[info.numberingListIndex];
            if (numberingListIndex == undefined || numberingListIndex < 0 || numberingListIndex >= this.documentModel.numberingLists.length)
                return;
            style.numberingListIndex = numberingListIndex;
            style.listLevelIndex = this.ensureNumberingListLevelValid(info.listLevelIndex);
        }
    }
    pushState() {
    }
    popState() {
    }
    startImportSubDocument() {
    }
    finalizeSubDocument() {
        if (this.subDocument.isMain())
            this.linkParagraphStylesWithNumberingLists();
    }
}
