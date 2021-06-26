/**
 * Checks is time spec object is valid
 * Always returns a boolean
 * @param {import(".").TimeSpec} spec
 * @returns {boolean}
 */
export function validateTimeSpec (spec) {
    if (spec === null) {
        return false;
    }

    const { hour, minute, second, zoneMinute } = spec;

    if (typeof zoneMinute === "number") {
        if (zoneMinute < 0 || zoneMinute > 60) {
            return false;
        }
    }

    if (typeof hour === "number") {
        // Allow fractions up to 24
        if (hour < 0 || hour >= 24) {
            return false;
        }

        if (typeof minute === "number") {
            // Allow fractions up to 60
            if (minute < 0 || minute >= 60) {
                return false;
            }

            if (typeof second === "number") {
                 // Allow fractions up to leap second
                if (second < 0 || second >= 61) {
                    return false;
                }
            }
        }

        return true;
    }

    return true;
}