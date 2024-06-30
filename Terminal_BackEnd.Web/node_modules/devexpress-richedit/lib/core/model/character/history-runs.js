import { RichUtils } from '../rich-utils';
import { RunType } from '../runs/run-type';
export class HistoryRun {
    constructor(type, charPropsBundle, offsetAtStartDocument, text) {
        this.type = type;
        this.charPropsBundle = charPropsBundle;
        this.offsetAtStartDocument = offsetAtStartDocument;
        this.text = text;
    }
}
export class HistoryRunInlinePicture extends HistoryRun {
    constructor(offsetAtStartDocument, charPropsBundle, picInfo, options) {
        super(RunType.InlinePictureRun, charPropsBundle, offsetAtStartDocument, RichUtils.specialCharacters.ObjectMark);
        this.picInfo = picInfo;
        this.options = options;
    }
}
export class HistoryRunFieldCodeStart extends HistoryRun {
    constructor(type, charPropsBundle, offsetAtStartDocument, text, showCode, startPosition, separatorPosition, endPosition, hyperlinkInfo) {
        super(type, charPropsBundle, offsetAtStartDocument, text);
        this.showCode = showCode;
        this.startPosition = startPosition;
        this.separatorPosition = separatorPosition;
        this.endPosition = endPosition;
        this.hyperlinkInfo = hyperlinkInfo;
    }
}
export class HistoryRunFieldCodeEnd extends HistoryRun {
}
export class HistoryRunFieldResultEnd extends HistoryRun {
}
export class HistoryRunParagraph extends HistoryRun {
    constructor(type, charPropsBundle, parPropsBundle, offsetAtStartDocument, text, applyDirectlyToNewParagraph) {
        super(type, charPropsBundle, offsetAtStartDocument, text);
        this.applyDirectlyToNewParagraph = applyDirectlyToNewParagraph;
        this.parPropsBundle = parPropsBundle;
    }
}
export class HistoryRunSection extends HistoryRunParagraph {
    constructor(charPropsBundle, parPropsBundle, section, offsetAtStartDocument, applyDirectlyToNewParagraph) {
        super(RunType.SectionRun, charPropsBundle, parPropsBundle, offsetAtStartDocument, RichUtils.specialCharacters.SectionMark, applyDirectlyToNewParagraph);
        this.sectionProperties = section.sectionProperties;
        this.headers = section.headers.clone();
        this.footers = section.footers.clone();
    }
}
export class HistoryRunAnchoredPicture extends HistoryRun {
    constructor(charPropsBundle, picInfo, offsetAtStartDocument) {
        super(RunType.AnchoredPictureRun, charPropsBundle, offsetAtStartDocument, RichUtils.specialCharacters.ObjectMark);
        this.picInfo = picInfo;
    }
}
export class HistoryRunAnchoredTextBox extends HistoryRun {
    constructor(charPropsBundle, textBoxInfo, offsetAtStartDocument) {
        super(RunType.AnchoredTextBoxRun, charPropsBundle, offsetAtStartDocument, RichUtils.specialCharacters.ObjectMark);
        this.textBoxInfo = textBoxInfo;
    }
}
