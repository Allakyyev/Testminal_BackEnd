import { ExtensionHelper } from '../../../../core/formats/utils/extension-helper';
import { BaseExporter } from '../base';
export class ImageExporter extends BaseExporter {
    exportImageData(modelImageId, base64Uri) {
        const isRelationExported = this.data.exportedImageTable[modelImageId];
        this.data.exportedImageTable[modelImageId] = true;
        const contentType = ExtensionHelper.getMimeTypeFromBase64Uri(base64Uri);
        const extension = ExtensionHelper.convertMimeTypeToExtension(contentType);
        this.data.contentTypesExporter.registerContentType(extension, contentType);
        const imageName = this.data.idGenerator.generateImageName(modelImageId);
        if (!isRelationExported)
            this.data.zipBuilder.addBase64(`word/media/${imageName}.${extension}`, ExtensionHelper.getBase64DataWithoutPrefix(base64Uri));
        const imageRelationId = this.data.idGenerator.generateImageRelationId(modelImageId);
        this.data.relationExporter.imageRelationsTable[imageRelationId] = `media/${imageName}.${extension}`;
        return imageRelationId;
    }
    exportImageUrl(modelImageId, url) {
        const imageRelationId = this.data.idGenerator.generateImageRelationId(modelImageId);
        this.data.relationExporter.exportedExternalImageRelationsTable[imageRelationId] = url;
        return imageRelationId;
    }
}
