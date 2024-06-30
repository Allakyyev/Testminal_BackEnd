export class TintAndShadeCalculator {
    static modifyShadeToTint(shade) {
        return (shade / TintAndShadeCalculator.maxTintValue) - 1;
    }
    static calculateTint(tint) {
        return (1 - tint / TintAndShadeCalculator.maxTintValue);
    }
    static calculateShadeFromColorModelInfoTint(tint) {
        return Math.floor((tint + 1) * TintAndShadeCalculator.maxTintValue);
    }
    static calculateTintFromColorModelInfoTint(tint) {
        return Math.floor(TintAndShadeCalculator.maxTintValue * (1 - tint));
    }
}
TintAndShadeCalculator.maxTintValue = 255;
