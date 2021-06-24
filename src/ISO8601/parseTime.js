/**
 * @param {string} input
 * @returns {import(".").TimeSpec}
 */
export function parseTime(input) {
    let m;

    let out = {};

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

    m = /^(\d{2})$/.exec(input);
    if (m) {
        out.hour = +m[1];

        return out;
    }

    m = /^(\d{2}):?(\d{2})$/.exec(input);
    if (m) {
        out.hour = +m[1];
        out.minute = +m[2];

        return out;
    }

    m = /^(\d{2}):?(\d{2}):?(\d\d(?:\.\d+)?)$/.exec(input);
    if (m) {
        out.hour = +m[1];
        out.minute = +m[2];
        out.second = +m[3];

        return out;
    }

    return null;
}
