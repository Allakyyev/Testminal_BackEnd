export class ToolbarItemBase {
    get toolbarItemTemplateCreator() {
        if (!this._toolbarItemTemplateCreator)
            this._toolbarItemTemplateCreator = this.getBuildTemplateStrategy();
        return this._toolbarItemTemplateCreator;
    }
    createToolbarItemTemplate() {
        return this.toolbarItemTemplateCreator.createTemplate();
    }
}
