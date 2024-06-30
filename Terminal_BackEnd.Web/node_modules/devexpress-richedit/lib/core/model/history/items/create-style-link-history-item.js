import { HistoryItem } from '../base/history-item';
export class CreateStyleLinkHistoryItem extends HistoryItem {
    constructor(modelManipulator, characterStyle, paragraphStyle) {
        super(modelManipulator);
        this.characterStyle = characterStyle;
        this.paragraphStyle = paragraphStyle;
    }
    redo() {
        this.modelManipulator.style.setLinkStyle(this.characterStyle, this.paragraphStyle);
    }
    undo() {
        this.modelManipulator.style.restoreLinkStyle(this.characterStyle, this.paragraphStyle);
    }
}
