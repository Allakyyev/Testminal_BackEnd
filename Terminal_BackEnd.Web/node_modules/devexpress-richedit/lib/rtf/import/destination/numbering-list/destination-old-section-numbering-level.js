import { RtfOldListLevelInfo } from '../../model/numbering-lists/rtf-old-list-level-info';
import { DestinationType } from '../utils/destination-type';
import { DestinationOldParagraphNumberingBase } from './destination-old-paragraph-numbering-base';
export class DestinationOldSectionNumberingLevel extends DestinationOldParagraphNumberingBase {
    constructor(importer, levelNumber) {
        super(importer);
        importer.importers.numbering.oldListLevelInfo = new RtfOldListLevelInfo();
        this.levelNumber = levelNumber;
    }
    get destinationType() { return DestinationType.DestinationOldSectionNumberingLevel; }
    createClone() {
        const result = new DestinationOldSectionNumberingLevel(this.importer, this.levelNumber);
        return result;
    }
    beforePopRtfState() {
        super.beforePopRtfState();
        this.importer.importers.numbering.oldListLevelInfoCollection.getByIndex(this.levelNumber).copyFrom(this.createRtfOldListLevelInfo());
    }
    createRtfOldListLevelInfo() {
        const result = new RtfOldListLevelInfo();
        return result;
    }
}
