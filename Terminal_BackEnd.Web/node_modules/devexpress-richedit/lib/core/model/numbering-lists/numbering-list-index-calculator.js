export class NumberingListIndexCalculator {
    constructor(subDocument, targetType, startIndex) {
        this.subDocument = subDocument;
        this.targetType = targetType;
        this.startIndex = startIndex;
    }
    getTargetListInfo(paragraphIndices) {
        if (this.startIndex === 1)
            return null;
        var startParagraphIndex = paragraphIndices[0];
        const startParagraph = this.subDocument.paragraphs[startParagraphIndex];
        var targetParagraph = this.getTargetParagraph(startParagraphIndex);
        if (!targetParagraph && this.hasSameParagraphType(startParagraphIndex + 1))
            targetParagraph = this.subDocument.paragraphs[startParagraphIndex + 1];
        if (targetParagraph) {
            if (startParagraph.isInList() && (startParagraph.getListLevelIndex() != targetParagraph.getListLevelIndex()))
                return null;
            return {
                listIndex: targetParagraph.getNumberingListIndex(),
                listlevelIndex: Math.max(0, targetParagraph.getListLevelIndex())
            };
        }
        return null;
    }
    getTargetParagraph(startParagraphIndex) {
        let hasNonEmptyNotInListParagraphBefore = false;
        let lastListPartIsSingleParagraph = false;
        for (let i = startParagraphIndex - 1; i >= 0; i--) {
            var targetParagraph = this.subDocument.paragraphs[i];
            if (!hasNonEmptyNotInListParagraphBefore)
                hasNonEmptyNotInListParagraphBefore = !targetParagraph.isEmpty && !targetParagraph.isInList();
            if (this.hasSameParagraphType(i)) {
                lastListPartIsSingleParagraph = i <= 0 || !this.hasSameParagraphType(i - 1);
                if (this.startIndex > 1) {
                    if (this.isStartIndexMatch(targetParagraph))
                        return targetParagraph;
                    else
                        return null;
                }
                if (hasNonEmptyNotInListParagraphBefore && !lastListPartIsSingleParagraph)
                    return null;
                return targetParagraph;
            }
        }
        return null;
    }
    isStartIndexMatch(targetParagraph) {
        var listCounters = this.subDocument.documentModel.getRangeListCounters(targetParagraph);
        if (listCounters.length !== 1)
            return false;
        const counter = listCounters[0];
        if (this.startIndex < counter)
            return false;
        if (this.startIndex - counter > 2)
            return false;
        return true;
    }
    hasSameParagraphType(paragraphIndex) {
        var paragraph = this.subDocument.paragraphs[paragraphIndex];
        return paragraph && paragraph.isInList() && paragraph.getNumberingList().getListType() === this.targetType;
    }
}
