import { EnumUtils } from '@devexpress/utils/lib/utils/enum';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { LayoutRowStateFlags } from '../../layout/main-structures/layout-row';
import { TextRowFormatterState } from './formatter';
export class RowBaseFormatterState {
    constructor(rowFormatter) {
        this.rowFormatter = rowFormatter;
    }
    addBoxAnyway(isFinishRow = false, nextState = TextRowFormatterState.None, ...setFlags) {
        if (!this.rowFormatter.wordHolder.pushBoxes())
            return;
        if (!this.rowFormatter.rowSizesManager.addNumberingBoxes())
            return;
        this.rowFormatter.rowSizesManager.anywayAddBox();
        if (this.rowFormatter.manager.innerClientProperties.viewsSettings.isSimpleView)
            setFlags = ListUtils.reducedMap(setFlags, (f) => EnumUtils.isAnyOf(f, LayoutRowStateFlags.ColumnEnd, LayoutRowStateFlags.PageEnd, LayoutRowStateFlags.SectionEnd) ? null : f);
        ListUtils.forEach(setFlags, (flag) => this.rowFormatter.row.flags.set(flag, true));
        if (nextState != TextRowFormatterState.None)
            this.rowFormatter.setState(nextState);
        if (isFinishRow)
            this.rowFormatter.finishRow();
    }
    addAnchorObject() {
        if (!this.rowFormatter.wordHolder.pushBoxes())
            return;
        this.rowFormatter.addAnchorObject();
    }
    addTextBox() {
        this.rowFormatter.wordHolder.addBox();
    }
    addDashBox() {
        this.rowFormatter.wordHolder.addBox();
        this.rowFormatter.wordHolder.pushBoxes();
    }
    addPictureBox() {
        if (!this.rowFormatter.wordHolder.pushBoxes())
            return;
        if (!this.rowFormatter.rowSizesManager.addNumberingBoxes())
            return;
        this.rowFormatter.rowSizesManager.addBox();
    }
    addSpaceBox() {
        this.addBoxAnyway(false, TextRowFormatterState.Base);
    }
    addTabulationBox() {
        if (!this.rowFormatter.wordHolder.pushBoxes())
            return;
        if (!this.rowFormatter.rowSizesManager.addNumberingBoxes())
            return;
        if (this.rowFormatter.tabInfo.addTabBox())
            this.rowFormatter.setState(TextRowFormatterState.Base);
        else
            this.rowFormatter.finishRow();
    }
    addSectionBox() {
        this.addBoxAnyway(true, TextRowFormatterState.None, LayoutRowStateFlags.ParagraphEnd, LayoutRowStateFlags.SectionEnd);
    }
    addLineBreakBox() {
        this.addBoxAnyway(true);
    }
    addPageBreakBox() {
        this.addBoxAnyway(false, TextRowFormatterState.EndedWithPageBreak, LayoutRowStateFlags.PageEnd);
    }
    addColumnBreakBox() {
        this.addBoxAnyway(true, TextRowFormatterState.None, LayoutRowStateFlags.ColumnEnd);
    }
    addParagraphBox() {
        this.addBoxAnyway(false, TextRowFormatterState.EndedWithParagraphMark, LayoutRowStateFlags.ParagraphEnd);
    }
}
export class RowEndedWithParagraphMarkFormatterState extends RowBaseFormatterState {
    constructor(rowFormatter) {
        super(rowFormatter);
    }
    addAnchorObject() {
        this.rowFormatter.finishRow();
    }
    addTextBox() {
        this.rowFormatter.finishRow();
    }
    addDashBox() {
        this.rowFormatter.finishRow();
    }
    addPictureBox() {
        this.rowFormatter.finishRow();
    }
    addSpaceBox() {
        this.rowFormatter.finishRow();
    }
    addTabulationBox() {
        this.rowFormatter.finishRow();
    }
    addLineBreakBox() {
        this.rowFormatter.finishRow();
    }
    addPageBreakBox() {
        this.rowFormatter.finishRow();
    }
    addColumnBreakBox() {
        this.rowFormatter.finishRow();
    }
    addParagraphBox() {
        this.rowFormatter.finishRow();
    }
}
export class RowEndedWithPageBreakState extends RowEndedWithParagraphMarkFormatterState {
    constructor(rowFormatter) {
        super(rowFormatter);
    }
    addParagraphBox() {
        this.addBoxAnyway(false, TextRowFormatterState.EndedWithParagraphMark, LayoutRowStateFlags.ParagraphEnd);
    }
}
