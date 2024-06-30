import { ContentInsertedSubDocumentChange } from '../../change-base';
import { ModelChangeType } from '../../enums';
export class SimpleRunInsertedSubDocumentChange extends ContentInsertedSubDocumentChange {
    constructor(subDocumentId, position, length, characterProperties, characterStyle, runType, text) {
        super(subDocumentId, position, length);
        this.subDocumentId = subDocumentId;
        this.position = position;
        this.length = length;
        this.characterProperties = characterProperties;
        this.characterStyle = characterStyle;
        this.runType = runType;
        this.text = text;
        this.type = ModelChangeType.SimpleRunInserted;
    }
}
