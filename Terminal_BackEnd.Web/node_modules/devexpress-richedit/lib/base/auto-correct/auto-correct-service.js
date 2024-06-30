import { BulletedListAutoCorrectProvider, EventAutoCorrectProvider, TableBasedCompositeAutoCorrectProvider, TableBasedImmediateAutoCorrectProvider, TableBasedSimpleAutoCorrectProvider, TwoInitialCapitalsAutoCorrectProvider, UrlAutoCorrectProvider } from './auto-correct-providers';
export class AutoCorrectService {
    constructor(control, settings) {
        this.control = control;
        this.settings = settings;
        this.providers = [];
        this.registerDefaultProviders();
    }
    registerDefaultProviders() {
        this.providers.push(new EventAutoCorrectProvider(this.control));
        if (this.settings.replaceTextAsYouType) {
            this.providers.push(new TableBasedSimpleAutoCorrectProvider(this.control, this.settings));
            this.providers.push(new TableBasedCompositeAutoCorrectProvider(this.control, this.settings));
            this.providers.push(new TableBasedImmediateAutoCorrectProvider(this.control, this.settings));
        }
        if (this.settings.correctTwoInitialCapitals)
            this.providers.push(new TwoInitialCapitalsAutoCorrectProvider(this.control));
        if (this.settings.enableAutomaticNumbering)
            this.providers.push(new BulletedListAutoCorrectProvider(this.control));
        if (this.settings.detectUrls)
            this.providers.push(new UrlAutoCorrectProvider(this.control));
    }
    performAutoCorrect() {
        if (this.control.selection.isCollapsed()) {
            for (let provider of this.providers)
                if (provider.revise()) {
                    this.control.inputController.inputEditor.clearInputElement();
                    return;
                }
        }
    }
}
