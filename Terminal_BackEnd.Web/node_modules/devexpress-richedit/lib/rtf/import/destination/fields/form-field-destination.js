import { CheckBoxProperties, FormFieldTextType } from '../../../../core/model/fields/check-box-properties';
import { DestinationType } from '../utils/destination-type';
import { FieldStatusBarTextDestination } from './field-status-bar-text-destination';
import { FieldSubDestination } from './field-sub-destination';
import { FormFieldEntryMacroDestination } from './form-field-entry-macro-destination';
import { FormFieldExitMacroDestination } from './form-field-exit-macro-destination';
import { FormFieldHelpTextDestination } from './form-field-help-text-destination';
import { FormFieldNameDestination } from './form-field-name-destination';
export class FormFieldDestination extends FieldSubDestination {
    get destinationType() { return DestinationType.FormFieldDestination; }
    createInstance() {
        return new FormFieldDestination(this.importer);
    }
    static getFormFieldProperties(importer) {
        return importer.importers.field.fields.peek().formFieldProperties;
    }
    static getCheckBoxProperties(importer) {
        return importer.importers.field.fields.peek().checkBoxProperties;
    }
    static onFormFieldTypeKeyword(importer, parameterValue, _hasParameter) {
        if (parameterValue == 1)
            importer.importers.field.fields.peek().checkBoxProperties = new CheckBoxProperties();
    }
    static onFormFieldListFieldResultKeyword(importer, parameterValue, _hasParameter) {
        const checkBoxProperties = FormFieldDestination.getCheckBoxProperties(importer);
        if (checkBoxProperties != null)
            checkBoxProperties.checkBoxState = parameterValue;
    }
    static onFormFieldProtectedKeyword(importer, _parameterValue, _hasParameter) {
        FormFieldDestination.getFormFieldProperties(importer).enabled = false;
    }
    static onFormFieldCheckBoxFieldSizeTypeKeyword(importer, parameterValue, _hasParameter) {
        const checkBoxProperties = FormFieldDestination.getCheckBoxProperties(importer);
        if (checkBoxProperties != null)
            checkBoxProperties.sizeType = parameterValue;
    }
    static onFormFieldCalculatedOnExitKeyword(importer, _parameterValue, _hasParameter) {
        FormFieldDestination.getFormFieldProperties(importer).calculateOnExit = true;
    }
    static onFormFieldCheckBoxFieldSizeKeyword(importer, parameterValue, _hasParameter) {
        const checkBoxProperties = FormFieldDestination.getCheckBoxProperties(importer);
        if (checkBoxProperties != null)
            checkBoxProperties.size = parameterValue;
    }
    static onFormFieldNameKeyword(importer, _parameterValue, _hasParameter) {
        importer.destination = new FormFieldNameDestination(importer);
    }
    static onFormFieldListFieldDefaultKeyword(importer, parameterValue, _hasParameter) {
        const checkBoxProperties = FormFieldDestination.getCheckBoxProperties(importer);
        if (checkBoxProperties != null)
            checkBoxProperties.defaultState = parameterValue != 0;
    }
    static onFormFieldHelpTextCustomKeyword(importer, _parameterValue, _hasParameter) {
        FormFieldDestination.getFormFieldProperties(importer).helpTextType = FormFieldTextType.Custom;
    }
    static onFormFieldHelpTextKeyword(importer, _parameterValue, _hasParameter) {
        importer.destination = new FormFieldHelpTextDestination(importer);
    }
    static onFormFieldStatusBarTextCustomKeyword(importer, _parameterValue, _hasParameter) {
        FormFieldDestination.getFormFieldProperties(importer).statusTextType = FormFieldTextType.Custom;
    }
    static onFormFieldStatusBarTextKeyword(importer, _parameterValue, _hasParameter) {
        importer.destination = new FieldStatusBarTextDestination(importer);
    }
    static onFormFieldEntryMacroKeyword(importer, _parameterValue, _hasParameter) {
        importer.destination = new FormFieldEntryMacroDestination(importer);
    }
    static onFormFieldExitMacroKeyword(importer, _parameterValue, _hasParameter) {
        importer.destination = new FormFieldExitMacroDestination(importer);
    }
}
