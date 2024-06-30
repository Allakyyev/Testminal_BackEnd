export class BaseManipulator {
    constructor(manipulator) {
        this.modelManipulator = manipulator;
    }
    get history() { return this.modelManipulator.modelManager.history; }
    get model() { return this.modelManipulator.modelManager.model; }
}
