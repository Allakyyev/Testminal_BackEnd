import { History } from './model/history/base/history';
import { ModelManipulator } from './model/manipulators/model-manipulator';
export class ModelManager {
    constructor(model, options, batchUpdatableObject) {
        this.model = model;
        this.richOptions = options;
        this.modelManipulator = new ModelManipulator(this, batchUpdatableObject);
        this.history = new History(options.control);
    }
}
export class ClientModelManager extends ModelManager {
    get clientMode() { return true; }
}
export class ServerModelManager extends ModelManager {
    get clientMode() { return false; }
}
