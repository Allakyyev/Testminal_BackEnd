export class PropertiesMergerBase {
    constructor(initialialProperties, descriptors) {
        this.innerProperties = initialialProperties;
        this.descriptors = descriptors;
    }
    mergeInternal(properties, mask, setValue) {
        if (!this.innerProperties.getUseValue(mask) && properties.getUseValue(mask)) {
            setValue();
            this.innerProperties.setUseValue(mask, true);
        }
    }
    mergeOnlyOwnInternal(properties, parentProperties, mask, setValue, equals) {
        if (!this.innerProperties.getUseValue(mask) && properties.getUseValue(mask)) {
            if (!parentProperties.getUseValue(mask) || !equals()) {
                setValue();
                this.innerProperties.setUseValue(mask, true);
            }
        }
    }
    mergeTableProperties(descriptor, getValue) {
        const mask = descriptor.maskValue();
        if (this.innerProperties.getUseValue(mask))
            return;
        const prop = getValue();
        if (prop === null)
            return;
        descriptor.setProp(this.innerProperties, prop);
        this.innerProperties.setUseValue(mask, true);
    }
    mergeAll(from) {
        if (from) {
            const to = this.innerProperties;
            for (let desc of this.descriptors) {
                const mask = desc.maskValue();
                if (!to.getUseValue(mask) && from.getUseValue(mask)) {
                    desc.setProp(to, desc.getProp(from));
                    to.setUseValue(mask, true);
                }
            }
        }
    }
    mergeOnlyOwnProperties(from, parent) {
        const to = this.innerProperties;
        for (let desc of this.descriptors) {
            const mask = desc.maskValue();
            if (!to.getUseValue(mask) && from.getUseValue(mask)) {
                if (parent.getUseValue(mask) && desc.binaryEquals(desc.getProp(from), desc.getProp(parent)))
                    continue;
                desc.setProp(to, desc.getProp(from));
                to.setUseValue(mask, true);
            }
        }
    }
}
