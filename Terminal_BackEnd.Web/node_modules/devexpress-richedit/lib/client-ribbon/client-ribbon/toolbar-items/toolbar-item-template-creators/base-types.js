export class ToolbarItemTemplateCreator {
    createTemplate() {
        return {
            location: 'before',
            locateInMenu: 'auto'
        };
    }
    getCssClass() {
        return 'dx-ribbon-item';
    }
    shouldCreateTextContentTemplate(textOptions) {
        return textOptions && textOptions.text && textOptions.text != '';
    }
    createTextContentTemplate(textOptions, widgetOptions, type) {
        return (_data, _index, _element) => {
            const container = document.createElement("div");
            const boxElement = document.createElement("div");
            boxElement.style.display = 'inline-block';
            const textElement = document.createElement("div");
            textElement.style.display = 'inline-block';
            textElement.textContent = textOptions.text;
            if (!textOptions.displayAfterEditor)
                container.appendChild(textElement);
            container.appendChild(boxElement);
            if (textOptions.displayAfterEditor)
                container.appendChild(textElement);
            new type(boxElement, widgetOptions);
            return container;
        };
    }
}
export class ToolbarDropDownItemTemplateCreator extends ToolbarItemTemplateCreator {
    getOnFocusOut() {
        return (e) => e.component.close();
    }
    getOnKeyDown() {
        return (e) => {
            if (e.event.keyCode === 9)
                e.event.preventDefault();
        };
    }
}
