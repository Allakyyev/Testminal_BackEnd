import { NumberingListCountersCalculator } from './numbering-list-counters-calculator';
export class SubDocumentNumberingListCountersManager {
    constructor(subDocument) {
        this.calculators = {};
        this.currentParagraphIndex = -1;
        this.subDocument = subDocument;
    }
    calculateCounters(paragraphIndex) {
        if (paragraphIndex < this.currentParagraphIndex)
            this.reset();
        this.currentParagraphIndex = paragraphIndex;
        var paragraph = this.subDocument.paragraphs[paragraphIndex];
        var abstractNumberingListIndex = paragraph.getAbstractNumberingListIndex();
        var calculator = this.getCalculator(abstractNumberingListIndex);
        return calculator.calculateNextCounters(paragraph);
    }
    getCalculator(abstractNumberingListIndex) {
        if (!this.calculators[abstractNumberingListIndex])
            this.calculators[abstractNumberingListIndex] = new NumberingListCountersCalculator(this.subDocument.documentModel.abstractNumberingLists[abstractNumberingListIndex]);
        return this.calculators[abstractNumberingListIndex];
    }
    reset() {
        this.calculators = {};
        this.currentParagraphIndex = -1;
    }
}
