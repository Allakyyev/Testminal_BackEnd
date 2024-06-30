import { WRE_NUSA_registerCustomContainerType } from './external-types';
export function registerRichEditCustomContainerType(customContainerTypeName, richEditsHolder) {
    if (richEditsHolder.isContainerTypeRegistered(customContainerTypeName))
        return;
    richEditsHolder.registerContainerType(customContainerTypeName);
    WRE_NUSA_registerCustomContainerType(customContainerTypeName, customContainerType => {
        customContainerType.getFocussedElement = (containerElement) => {
            return containerElement;
        };
        customContainerType.setFocussedElement = (element) => {
            const rich = richEditsHolder.getRichEditByElement(element);
            rich.Focus();
        };
        richEditsHolder.registerContainerTypeObject(customContainerTypeName, customContainerType);
    });
}
