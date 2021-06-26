/**
 * @param {string} input
 * @returns {import(".").TimeSpec}
 */
export function parseTime(input) {
    let m;

    let out = {};

    // Comma is allowed as decimal separator
    input = input.replace(/,/g,".");

    // Parse Time Zone
    m = /(?:([+−-]\d\d)(?::?(\d\d))?|Z)$/.exec(input);

    if (m) {
        if (m[1]) {
            out.zoneHour = +m[1].replace("−", "-");

            if (m[2]) {
                out.zoneMinute = +m[2];
            }
        } else {
            // We must have had "Z"
            out.zoneHour = 0;
            out.zoneMinute = 0;
        }

        input = input.substr(0, input.length - m[0].length);
    }

    // Support 20210623TZ
    if (m && input.length === 0) {
        return out;
    }

    m = /^(\d\d(?:\.\d+)?)$/.exec(input);
    if (m) {
        out.hour = +m[1];

        if (out.hour < 0 || out.hour >= 24) {
            return null;
        }

        return out;
    }

    m = /^(\d\d):?(\d\d(?:\.\d+)?)$/.exec(input);
    if (m) {
        out.hour = +m[1];
        out.minute = +m[2];

        if (out.hour < 0 || out.hour >= 24 || out.minute < 0 || out.minute >= 60) {
            return null;
        }

        return out;
    }

    m = /^(\d{2}):?(\d{2}):?(\d\d(?:\.\d+)?)$/.exec(input);
    if (m) {
        out.hour = +m[1];
        out.minute = +m[2];
        out.second = +m[3];

        if (out.hour < 0 || out.hour >= 24          // Allow fractions up to 24
            || out.minute < 0 || out.minute >= 60   // Allow fractions up to 60
            || out.second < 0 || out.second >= 61   // Allow fractions up to leap second
        ) {
            return null;
        }

        return out;
    }

    return null;
}
