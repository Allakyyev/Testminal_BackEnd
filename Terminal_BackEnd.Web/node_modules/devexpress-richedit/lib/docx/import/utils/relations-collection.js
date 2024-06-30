import { __awaiter } from "tslib";
import { ExtensionHelper } from '../../../core/formats/utils/extension-helper';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { StringUtils } from '@devexpress/utils/lib/utils/string';
import { PathHelper } from '../../utils/path-helper';
import { StringExtensions } from '../../utils/string-extensions';
import { RelationshipsDestination } from '../destination/relationships/relationships-destination';
export class RelationsCollection {
    constructor(data) {
        this.data = data;
        this.list = [];
    }
    init(path) {
        return __awaiter(this, void 0, void 0, function* () {
            const reader = yield this.data.archiveData.getXmlReader(path);
            if (!reader)
                return;
            if (reader.readToFollowingNS('Relationships', this.data.constants.rels.packageRelsNamespace))
                yield this.data.importContent(reader, new RelationshipsDestination(this.data, this));
        });
    }
    add(rel) {
        this.list.push(rel);
    }
    lookupRelationById(id) {
        return ListUtils.elementBy(this.list, (rel) => rel.id == id);
    }
    lookupRelationByType(type) {
        return ListUtils.elementBy(this.list, (rel) => rel.type == type);
    }
    lookupRelationByTargetAndType(target, type) {
        return ListUtils.elementBy(this.list, (rel) => rel.target == target && rel.type == type);
    }
    generateId() {
        return `rId${this.list.length + 1}`;
    }
    lookupExternalRelationById(relationId) {
        const relation = this.lookupRelationById(relationId);
        return !relation.targetMode || StringExtensions.compareInvariantCultureIgnoreCase(relation.targetMode, 'external') != 0 ? null : relation;
    }
    lookupRelationTargetById(id, rootFolder, defaultFileName) {
        const relation = this.lookupRelationById(id);
        return PathHelper.normalize(this.calculateRelationTargetCore(relation, rootFolder, defaultFileName));
    }
    lookupPackageFileStreamByRelationId(relationId, rootFolder) {
        return __awaiter(this, void 0, void 0, function* () {
            const fileName = this.lookupRelationTargetById(relationId, rootFolder, '');
            return this.data.archiveData.getXmlReader(fileName);
        });
    }
    lookupRelationTargetByType(type, rootFolder, defaultFileName) {
        let relation = this.lookupRelationByType(type);
        if (!relation) {
            relation = this.lookupRelationByType(this.data.constants.translateToStrict(type));
            if (relation != null)
                this.data.constants.setStrictOpenXml();
        }
        return PathHelper.normalize(this.calculateRelationTargetCore(relation, rootFolder, defaultFileName));
    }
    lookupExternalImageByRelationId(relationId) {
        return __awaiter(this, void 0, void 0, function* () {
            const relation = this.lookupExternalRelationById(relationId);
            if (!relation)
                return null;
            const imgInfo = this.data.documentModel.cache.imageCache.createUnloadedInfoByUrl(relation.target);
            this.data.imageRelationToCacheMap[relation.target] = imgInfo.tmpId;
            return imgInfo.tmpId;
        });
    }
    lookupImageByRelationId(relationId, rootFolder) {
        return __awaiter(this, void 0, void 0, function* () {
            let fileName = this.lookupRelationTargetById(relationId, rootFolder, '');
            if (StringUtils.startsAt(fileName, '/'))
                fileName = fileName.substring(1);
            if (this.data.imageRelationToCacheMap[fileName])
                return this.data.imageRelationToCacheMap[fileName];
            const base64Data = yield this.data.archiveData.getBase64(fileName);
            if (!base64Data)
                return null;
            const prefix = ExtensionHelper.makeBase64UriPrefix(ExtensionHelper.convertExtensionToMimeType(PathHelper.getFileExtension(fileName)));
            const imgInfo = this.data.documentModel.cache.imageCache.createUnloadedInfoByBase64(prefix + base64Data);
            this.data.imageRelationToCacheMap[fileName] = imgInfo.tmpId;
            return imgInfo.tmpId;
        });
    }
    calculateRelationTargetCore(relation, rootFolder, defaultFileName) {
        if (relation == null)
            return StringUtils.isNullOrEmpty(rootFolder) ? defaultFileName : rootFolder + '/' + defaultFileName;
        if (StringUtils.startsAt(relation.target, '/'))
            return relation.target;
        return StringUtils.isNullOrEmpty(rootFolder) ? relation.target : rootFolder + '/' + relation.target;
    }
}
