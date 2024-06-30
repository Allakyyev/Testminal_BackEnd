import { NumberMapUtils } from '@devexpress/utils/lib/utils/map/number';
import { StringUtils } from '@devexpress/utils/lib/utils/string';
import { DocumentProtectionChangedModelChange } from '../changes/model/document-protection-changed';
import { RangePermissionsPropertiesChange } from '../changes/sub-document/range-permissions-changed';
import { DocumentProtectionHistoryItem } from '../history/items/document-protection-history-item';
import { DocumentProtectionType } from '../json/enums/json-document-enums';
import { HashAlgorithmType } from '../options/document-protection';
import { PasswordHashCodeCalculator } from '../protection/password-hash-code-calculator';
import { BaseManipulator } from './base-manipulator';
export class DocumentProtectionPropertiesManipulator extends BaseManipulator {
    changeProtectionProperties(documentModel, newProtectionProperties) {
        const oldValue = documentModel.documentProtectionProperties.clone();
        documentModel.documentProtectionProperties.copyFrom(newProtectionProperties);
        this.raiseProtectionPropertiesChanged();
        return oldValue;
    }
    raiseProtectionPropertiesChanged() {
        this.filterRangePermissions();
        this.modelManipulator.notifyModelChanged(new DocumentProtectionChangedModelChange(this.model.documentProtectionProperties));
    }
    raiseRangePermissionPropertiesChanged() {
        this.filterRangePermissions();
        this.modelManipulator.notifyModelChanged(new RangePermissionsPropertiesChange());
    }
    filterRangePermissions() {
        NumberMapUtils.forEach(this.model.subDocuments, (subDocument) => {
            subDocument.filterRangePermissions(this.modelManipulator.modelManager.richOptions.documentProtection);
        });
    }
    enforceDocumentProtection(password, protectionType = DocumentProtectionType.ReadOnly) {
        const protectionProperties = this.model.documentProtectionProperties.clone();
        protectionProperties.enforceProtection = true;
        protectionProperties.protectionType = protectionType;
        if (StringUtils.isNullOrEmpty(password)) {
            protectionProperties.hashAlgorithmType = HashAlgorithmType.None;
            protectionProperties.hashIterationCount = 0;
            protectionProperties.passwordPrefix = null;
            protectionProperties.passwordHash = null;
            protectionProperties.word2003PasswordHash = null;
            protectionProperties.openOfficePasswordHash = null;
        }
        else {
            protectionProperties.hashAlgorithmType = HashAlgorithmType.Sha1;
            protectionProperties.hashIterationCount = 100000;
            const calculator = new PasswordHashCodeCalculator();
            protectionProperties.passwordPrefix = calculator.generatePasswordPrefix(16);
            protectionProperties.passwordHash = calculator.calculatePasswordHash(password, protectionProperties.passwordPrefix, protectionProperties.hashIterationCount, protectionProperties.hashAlgorithmType);
            protectionProperties.word2003PasswordHash = calculator.calculateLegacyPasswordHash(password);
        }
        this.modelManipulator.modelManager.history.addAndRedo(new DocumentProtectionHistoryItem(this.modelManipulator, protectionProperties));
    }
    forceRemoveDocumentProtection() {
        const protectionProperties = this.model.documentProtectionProperties.clone();
        protectionProperties.enforceProtection = false;
        this.modelManipulator.modelManager.history.addAndRedo(new DocumentProtectionHistoryItem(this.modelManipulator, protectionProperties));
    }
}
