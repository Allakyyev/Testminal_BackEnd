export function updateMinMaxBounds(objA, objB) {
    if (!objB)
        return objA;
    if (objB.minElement > objA.minElement)
        objA.minElement = objB.minElement;
    if (objB.maxElement > objA.maxElement)
        objA.maxElement = objB.maxElement;
    return objA;
}
