import { RichEditClientCommand } from '../../../base/commands/client-command';
export class MailMergeOptionsApi {
    constructor(native) {
        this._native = native;
    }
    getDataSource() { return this._native.rawDataSource; }
    setDataSource(dataSource, callback = () => { }) {
        this._native.setNewRawDataSource(dataSource, callback);
    }
    get activeRecordIndex() { return this._native.core.modelManager.richOptions.mailMerge.activeRecordIndex; }
    set activeRecordIndex(value) {
        this._native.core.modelManager.richOptions.mailMerge.activeRecordIndex = value;
        if (this._native.core.modelManager.richOptions.mailMerge.viewMergedData)
            this._native.core.commandManager.getCommand(RichEditClientCommand.GoToDataRecord).execute(true, value);
    }
    get viewMergedData() { return this._native.core.modelManager.richOptions.mailMerge.viewMergedData; }
    set viewMergedData(value) {
        this._native.core.commandManager.getCommand(RichEditClientCommand.ToggleViewMergedData).execute(true, value);
    }
}
