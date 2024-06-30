import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { SubDocumentInterval } from '../sub-document';
import { ParagraphPropertyDescriptor } from './paragraph-properties';
export class ParagraphPropertiesApplier {
    constructor(modelManager, inputPosition, newParProps, subDocument, intervals) {
        this.modelManager = modelManager;
        this.newParProps = newParProps;
        this.inputPosition = inputPosition;
        this.modelManip = this.modelManager.modelManipulator;
        this.subDoc = subDocument;
        this.intervals = intervals;
    }
    apply() {
        const history = this.modelManager.history;
        this.parPropsFull = this.inputPosition.getMergedParagraphPropertiesFull();
        this.parPropsRaw = this.inputPosition.getMergedParagraphPropertiesRaw();
        this.oldParPropsRaw = this.parPropsRaw.clone();
        const parIndices = this.subDoc.getParagraphIndicesByIntervals(this.intervals);
        let changed = 0;
        history.beginTransaction();
        ListUtils.reverseForEach(parIndices, (parIndex) => {
            const paragraph = this.subDoc.paragraphs[parIndex];
            const interval = this.subDoc.paragraphs[parIndex].interval;
            this.oldParPropsRaw = paragraph.getParagraphMergedProperties().clone();
            changed |= this.applyProp(interval, ParagraphPropertyDescriptor.firstLineIndentType);
            changed |= this.applyProp(interval, ParagraphPropertyDescriptor.firstLineIndent);
            changed |= this.applyProp(interval, ParagraphPropertyDescriptor.widowOrphanControl);
            changed |= this.applyProp(interval, ParagraphPropertyDescriptor.afterAutoSpacing);
            changed |= this.applyProp(interval, ParagraphPropertyDescriptor.outlineLevel);
            changed |= this.applyProp(interval, ParagraphPropertyDescriptor.beforeAutoSpacing);
            changed |= this.applyProp(interval, ParagraphPropertyDescriptor.pageBreakBefore);
            changed |= this.applyProp(interval, ParagraphPropertyDescriptor.rightIndent);
            changed |= this.applyProp(interval, ParagraphPropertyDescriptor.suppressHyphenation);
            changed |= this.applyProp(interval, ParagraphPropertyDescriptor.suppressLineNumbers);
            changed |= this.applyProp(interval, ParagraphPropertyDescriptor.keepLinesTogether);
            changed |= this.applyProp(interval, ParagraphPropertyDescriptor.keepWithNext);
            changed |= this.applyProp(interval, ParagraphPropertyDescriptor.shadingInfo);
            changed |= this.applyProp(interval, ParagraphPropertyDescriptor.leftIndent);
            changed |= this.applyProp(interval, ParagraphPropertyDescriptor.lineSpacingType);
            changed |= this.applyProp(interval, ParagraphPropertyDescriptor.lineSpacing);
            changed |= this.applyProp(interval, ParagraphPropertyDescriptor.alignment);
            changed |= this.applyProp(interval, ParagraphPropertyDescriptor.contextualSpacing);
            changed |= this.applyProp(interval, ParagraphPropertyDescriptor.spacingBefore);
            changed |= this.applyProp(interval, ParagraphPropertyDescriptor.spacingAfter);
            changed |= this.applyProp(interval, ParagraphPropertyDescriptor.divId);
        });
        history.endTransaction();
        return !!changed;
    }
    applyProp(interval, descriptor) {
        const newValue = descriptor.getProp(this.newParProps);
        const currValue = descriptor.getProp(this.oldParPropsRaw);
        if (newValue !== undefined && newValue !== currValue) {
            descriptor.setProp(this.parPropsFull, newValue);
            descriptor.setProp(this.parPropsRaw, newValue);
            this.modelManager.history.addAndRedo(new (descriptor.getHistoryItemConstructor())(this.modelManip, new SubDocumentInterval(this.subDoc, interval), newValue, true));
            return 1;
        }
        return 0;
    }
}
