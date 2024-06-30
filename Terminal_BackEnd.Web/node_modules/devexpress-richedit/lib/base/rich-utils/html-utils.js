import { HtmlImporter } from '../../html/import/html-importer';
export function getHTMLElementsFromHtml(inputController, html) {
    let resultHtml = html;
    if (typeof html === "string")
        resultHtml = HtmlImporter.convertHtml(html);
    inputController.setEditableDocumentContent(resultHtml);
    const editableElement = inputController.getEditableDocument();
    const elementsContainer = editableElement.body || editableElement;
    return elementsContainer.childNodes;
}
