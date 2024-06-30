import { SearchUtils } from '@devexpress/utils/lib/utils/search';
import { SelectionCommandBase } from './selection-command-base';
export class SelectParagraphCommand extends SelectionCommandBase {
    executeCore(_state, options) {
        var paragraphs = this.selection.activeSubDocument.paragraphs;
        var paragraphIndex = SearchUtils.normedInterpolationIndexOf(paragraphs, (p) => p.startLogPosition.value, options.param);
        var paragraph = paragraphs[paragraphIndex];
        this.selection.deprecatedSetSelection(paragraph.startLogPosition.value, paragraph.startLogPosition.value + paragraph.length, true, -1, true);
        return true;
    }
}
