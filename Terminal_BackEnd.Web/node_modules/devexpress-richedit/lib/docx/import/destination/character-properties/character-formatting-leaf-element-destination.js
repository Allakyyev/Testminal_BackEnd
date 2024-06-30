import { LeafElementDestination } from '../destination';
export class CharacterFormattingLeafElementDestination extends LeafElementDestination {
    constructor(data, characterProperties) {
        super(data);
        this.characterProperties = characterProperties;
    }
    setProperty(newValue) {
        this.characterProperties.setValue(this.getDescriptor(), newValue);
    }
}
