const timeout = 500;
function setPlaceholders(placeholders) {
    const placeholderCreator = window.NUSA_createCommandPlaceholder;
    const setPlaceholderValues = window.NUSA_setCommandPlaceholderValues;
    for (let placeholder of placeholders) {
        placeholderCreator(placeholder.id, placeholder.description);
        const values = [];
        const spokenForms = [];
        for (let val of placeholder.values) {
            if (Array.isArray(val)) {
                spokenForms.push(val[0]);
                values.push(val[1]);
            }
            else {
                spokenForms.push(val.spokenForm);
                values.push(val.value);
            }
        }
        setPlaceholderValues(placeholder.id, values, spokenForms);
    }
}
function setCommands(commandSets) {
    const createCommandSet = window.NUSA_createCommandSet;
    const createCommand = window.NUSA_createCommand;
    for (const cmdSet of commandSets) {
        const cmdSetId = createCommandSet(cmdSet.title, cmdSet.description);
        for (let command of cmdSet.commands)
            createCommand(cmdSetId, command.commandId, command.phrase, command.title, command.description);
    }
}
export function WRE_registerCommands(commandSets, placeholders) {
    let tryCounter = 0;
    const register = () => {
        if (tryCounter++ > 10)
            return;
        const placeholderCreator = window.NUSA_createCommandPlaceholder;
        if (placeholderCreator) {
            setPlaceholders(placeholders);
            setCommands(commandSets);
            WRE_NUSA_reinitializeVuiForm();
        }
        else {
            setTimeout(() => {
                register();
            }, timeout);
        }
    };
    register();
}
export function WRE_NUSA_registerCustomControlType(customControlTypeName, callback) {
    let tryCounter = 0;
    const register = () => {
        if (tryCounter++ > 10)
            return;
        const registrator = window.NUSA_registerCustomControlType;
        if (registrator)
            callback(registrator(customControlTypeName));
        else {
            setTimeout(() => {
                register();
            }, timeout);
        }
    };
    register();
}
let reinitVuiFormId = null;
export function WRE_NUSA_reinitializeVuiForm() {
    if (reinitVuiFormId !== null)
        return;
    let tryCounter = 0;
    const reinitialize = () => {
        const reinitializator = window.NUSA_reinitializeVuiForm;
        if (tryCounter++ > 10) {
            reinitVuiFormId = null;
            return;
        }
        if (reinitializator) {
            reinitVuiFormId = null;
            try {
                reinitializator();
            }
            catch (_e) {
            }
        }
        else {
            reinitVuiFormId = setTimeout(() => {
                reinitialize();
            }, timeout);
        }
    };
    reinitialize();
}
export function WRE_NUSA_registerCustomContainerType(customContainerTypeName, callback) {
    let tryCounter = 0;
    const register = () => {
        if (tryCounter++ > 10)
            return;
        const registrator = window.NUSA_registerCustomContainerType;
        if (registrator)
            callback(registrator(customContainerTypeName));
        else {
            setTimeout(() => {
                register();
            }, timeout);
        }
    };
    register();
}
export const WRE_NUSA_controlTypeAttr = 'data-nusa-custom-control-type';
export const WRE_NUSA_containerTypeAttr = 'data-nusa-custom-container-type';
export const WRE_NUSA_enabledAttr = 'data-nusa-enabled';
export const WRE_NUSA_conceptNameAttr = 'data-nusa-concept-name';
