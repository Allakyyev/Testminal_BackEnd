import { BorderLineStyle } from '../../../core/model/borders/enums';
import { ApiUtils } from '../../../model-api/api-utils/api-utils';
import { executeApiCommandCore } from '../../commands/commands';
import { HomeTabCommandId, TableDesignTabCommandId } from './enum';
export class CommandState {
    constructor(visible, enabled, value) {
        this.visible = visible;
        this.enabled = enabled;
        this.value = value;
    }
}
export function executeApiCommand(commandManager, commandId, parameter) {
    return executeApiCommandCore(commandManager, commandId, parameter);
}
export function getApiCommandState(commandManager, commandId) {
    var _a;
    const command = commandManager.getCommand(commandId);
    if (!command)
        return null;
    const state = command.getState();
    let value = state.value;
    switch (commandId) {
        case HomeTabCommandId.ChangeFontName:
            value = (_a = state.value) === null || _a === void 0 ? void 0 : _a.name;
            break;
        case HomeTabCommandId.ChangeFontForeColor:
            value = ApiUtils.internalColorToApiColor(state.value);
            break;
        case HomeTabCommandId.ChangeShading:
            value = ApiUtils.internalColorToApiColor(state.value);
            break;
        case TableDesignTabCommandId.ChangeTableStyle:
            value = typeof (state.value) == 'string' ? state.value : undefined;
            break;
        case TableDesignTabCommandId.ChangeTableRepositoryItemBorderStyle: {
            switch (value) {
                case BorderLineStyle.None:
                    value = 'None';
                    break;
                case BorderLineStyle.Dashed:
                    value = 'Dashed';
                    break;
                case BorderLineStyle.Double:
                    value = 'Double';
                    break;
                case BorderLineStyle.Dotted:
                    value = 'Dotted';
                    break;
                case BorderLineStyle.Single:
                    value = 'Single';
                    break;
                default: value = BorderLineStyle.Single;
            }
            break;
        }
        case TableDesignTabCommandId.ChangeTableCellShading:
            value = ApiUtils.internalColorToApiColor(state.value);
            break;
        case HomeTabCommandId.ChangeFontHighlightColor:
            value = ApiUtils.internalColorToApiColor(state.value);
            break;
    }
    return new CommandState(state.visible, state.enabled, value);
}
