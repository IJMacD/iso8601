/**
 * Parses a date string into a DateSpec object
 * Returns null if no valid format could be matched
 * @param {string} input
 * @returns {import(".").DateSpec}
 */
export function parseDate (input) {
    if (/^\d$/.test(input)) {
        return {
            millennium: +input,
        };
    }

    if (/^\d\d$/.test(input)) {
        return {
            century: +input,
        };
    }

    if (/^\d{3}$/.test(input)) {
        return {
            decade: +input,
        };
    }

    // Check for four or more digit year
    let m = /^([+-]\d{4,}|\d{4})/.exec(input);

    if (!m) {
        return null;
    }

    const year = +m[0];
    input = input.substr(m[0].length);

    if (input.length === 0) {
        return {
            year,
        };
    }

    m = /^-(\d{2})$/.exec(input);
    if (m) {
        const month = +m[1];

        return {
            year,
            month,
        };
    }

    m = /^-?(\d{2})-?(\d{2})$/.exec(input);
    if (m) {
        const month = +m[1];
        const day = +m[2];

        return {
            year,
            month,
            day,
        };
    }

    m = /^-?W(\d{2})$/.exec(input);
    if (m) {
        const week = +m[1];

        return {
            year,
            week,
        };
    }

    m = /^-?W(\d{2})-?(\d)$/.exec(input);
    if (m) {
        const week = +m[1];
        const weekDay = +m[2];

        return {
            year,
            week,
            weekDay,
        };
    }

    m = /^-?(\d{3})$/.exec(input);
    if (m) {
        const yearDay = +m[1];

        return {
            year,
            yearDay,
        };
    }

    return null;
}
