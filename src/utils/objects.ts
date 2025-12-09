type ExpectedObjectType = { [key: string]: unknown }

export const clearUnmodifiedObjectKeys = (originalObject: ExpectedObjectType, modifiedObject: ExpectedObjectType) => {
    let copy: ExpectedObjectType | null = null

    if (originalObject && modifiedObject) {
        Object.entries(originalObject).forEach(([key, originalValue]) => {
            if (originalValue != modifiedObject[key]) {
                if(!copy) copy = {} 
                copy[key] = modifiedObject[key]
            }
        })
    }

    return copy
}

export function getChangedFields<T extends object>(
    original: Partial<T> | null,
    updated: Partial<T>
  ): Partial<T> {
    if (!original) return updated;

    const changes: Partial<T> = {};

    for (const key in updated) {
      const originalValue = original[key as keyof T];
      const updatedValue = updated[key as keyof T];

      if (JSON.stringify(originalValue) !== JSON.stringify(updatedValue)) {
        changes[key as keyof T] = updatedValue!;
      }
    }

    return changes;
}


export function hasDuplicateObjectsOnArray<
  T extends Record<string, any>, 
  K extends keyof T
>(arr: T[], propertyName: K): boolean {
  const seenValues = new Set<T[K]>();

  for (const obj of arr) {
    const value = obj[propertyName];
    if (seenValues.has(value)) {
      return true;
    }
    seenValues.add(value);
  }

  return false;
}
