import { RichUtils } from '../../model/rich-utils';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { RunType } from '../../model/runs/run-type';
import { ParagraphRun } from '../../model/runs/simple-runs';
export class SectionRestorer {
    static fixLastSection(model) {
        const lastSection = ListUtils.last(model.sections);
        if (!lastSection.interval.length) {
            model.sections.pop();
            const chunk = model.mainSubDocument.getLastChunk();
            const textRuns = chunk.textRuns;
            const lastRun = ListUtils.last(textRuns);
            if (lastRun.getType() == RunType.SectionRun) {
                const startOffset = lastRun.startOffset;
                const paragraphMark = RichUtils.specialCharacters.ParagraphMark;
                chunk.textBuffer = [chunk.textBuffer.substr(0, startOffset), paragraphMark].join('');
                textRuns.pop();
                lastRun.paragraph.listLevelIndex = Math.max(0, lastRun.paragraph.listLevelIndex);
                textRuns.push(new ParagraphRun(startOffset, lastRun.paragraph, lastRun.getCharPropsBundle(model)));
            }
        }
    }
}
