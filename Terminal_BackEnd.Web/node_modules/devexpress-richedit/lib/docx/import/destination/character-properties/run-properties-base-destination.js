import { MapCreator } from '../../../../base-utils/map-creator';
import { ElementDestination } from '../destination';
import { AllCapsDestination } from './properties/all-caps-destination';
import { BoldDestination } from './properties/bold-destination';
import { CharacterShadingDestination } from './properties/character-shading-destination';
import { DoubleStrikeThroughDestination } from './properties/double-strike-through-destination';
import { FontNameDestination } from './properties/font-name-destination';
import { FontScriptDestination } from './properties/font-script-destination';
import { FontSizeDestination } from './properties/font-size-destination';
import { ForeColorDestination } from './properties/fore-color-destination';
import { HiddenTextDestination } from './properties/hidden-text-destination';
import { HighlightColorDestination } from './properties/highlight-color-destination';
import { ItalicDestination } from './properties/italic-destination';
import { LanguageDestination } from './properties/language-destination';
import { NoProofDestination } from './properties/no-proof-destination';
import { SingleStrikeThroughDestination } from './properties/single-strike-through-destination';
import { SmallCapsDestination } from './properties/small-caps-destination';
import { UnderlineDestination } from './properties/underline-destination';
export class RunPropertiesBaseDestination extends ElementDestination {
    constructor(data, characterProperties) {
        super(data);
        this.characterProperties = characterProperties;
    }
    get elementHandlerTable() { return RunPropertiesBaseDestination.handlerTable; }
    static getCharacterProperties(data) {
        return data.destinationStack.getThis().characterProperties;
    }
}
RunPropertiesBaseDestination.handlerTable = new MapCreator()
    .add('b', (data) => new BoldDestination(data, RunPropertiesBaseDestination.getCharacterProperties(data)))
    .add('i', (data) => new ItalicDestination(data, RunPropertiesBaseDestination.getCharacterProperties(data)))
    .add('caps', (data) => new AllCapsDestination(data, RunPropertiesBaseDestination.getCharacterProperties(data)))
    .add('smallCaps', (data) => new SmallCapsDestination(data, RunPropertiesBaseDestination.getCharacterProperties(data)))
    .add('vanish', (data) => new HiddenTextDestination(data, RunPropertiesBaseDestination.getCharacterProperties(data)))
    .add('color', (data) => new ForeColorDestination(data, RunPropertiesBaseDestination.getCharacterProperties(data)))
    .add('highlight', (data) => new HighlightColorDestination(data, RunPropertiesBaseDestination.getCharacterProperties(data)))
    .add('shd', (data) => new CharacterShadingDestination(data, RunPropertiesBaseDestination.getCharacterProperties(data)))
    .add('strike', (data) => new SingleStrikeThroughDestination(data, RunPropertiesBaseDestination.getCharacterProperties(data)))
    .add('dstrike', (data) => new DoubleStrikeThroughDestination(data, RunPropertiesBaseDestination.getCharacterProperties(data)))
    .add('u', (data) => new UnderlineDestination(data, RunPropertiesBaseDestination.getCharacterProperties(data)))
    .add('sz', (data) => new FontSizeDestination(data, RunPropertiesBaseDestination.getCharacterProperties(data)))
    .add('vertAlign', (data) => new FontScriptDestination(data, RunPropertiesBaseDestination.getCharacterProperties(data)))
    .add('rFonts', (data) => new FontNameDestination(data, RunPropertiesBaseDestination.getCharacterProperties(data)))
    .add('lang', (data) => new LanguageDestination(data, RunPropertiesBaseDestination.getCharacterProperties(data)))
    .add('noProof', (data) => new NoProofDestination(data, RunPropertiesBaseDestination.getCharacterProperties(data)))
    .get();
