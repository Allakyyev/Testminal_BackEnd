import { DrawingEffectCollection } from './drawing-effect-collection';
export class ContainerEffect {
    constructor() {
        this.name = "";
        this.hasEffectsList = true;
        this.effects = new DrawingEffectCollection();
    }
    get isEmpty() {
        return this.effects.list.length == 0;
    }
    clone() {
        const obj = new ContainerEffect();
        obj.name = this.name;
        obj.type = this.type;
        obj.hasEffectsList = this.hasEffectsList;
        obj.effects = this.effects.clone();
        return obj;
    }
}
