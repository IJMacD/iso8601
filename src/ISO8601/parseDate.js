import { DateTime } from "./DateTime";
import { getMonthLength, isValidDate } from "./util";

/**
 * Parses a date string into a DateSpec object
 * Returns null if the string was not valid
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

        if (month < 1 || month > 12) {
            return null;
        }

        return {
            year,
            month,
        };
    }

    m = /^-?(\d{2})-?(\d{2})$/.exec(input);
    if (m) {
        const month = +m[1];
        const day = +m[2];

        if (month < 1 || month > 12) {
            return null;
        }

        if (day < 1) {
            return null;
        }

        const s = {
            year,
            month,
            day,
        };

        const monthDays = getMonthLength(s);

        if (day > monthDays) {
            return null;
        }

        return s;
    }

    m = /^-?W(\d{2})$/.exec(input);
    if (m) {

        const week = +m[1];
        if (week < 1 || week > 53) {
            return null;
        }

        const spec = {
            year,
            week,
        };

        // Catch bad week 53
        const check = new DateTime(spec);
        if (week === 53 && isValidDate(check.start) && check.start.getFullYear() !== year) {
            return null;
        }

        return spec;
    }

    m = /^-?W(\d{2})-?(\d)$/.exec(input);
    if (m) {
        const week = +m[1];
        if (week < 1 || week > 53) {
            return null;
        }

        const weekDay = +m[2];
        if (weekDay < 1 || weekDay > 7) {
            return null;
        }

        const spec = {
            year,
            week,
            weekDay,
        };

        // Catch bad week 53
        const check = new DateTime(spec);
        if (week === 53 && isValidDate(check.start) && check.start.getFullYear() !== year) {
            return null;
        }

        return spec;
    }

    m = /^-?(\d{3})$/.exec(input);
    if (m) {
        const s = new Date(year, 0, 1);
        // Catch date constructor problems with years 0 to 99
        s.setFullYear(year);

        const yearDay = +m[1];

        if (yearDay < 1 || yearDay > 366) {
            return null;
        }

        const spec = {
            year,
            yearDay,
        };

        // Weed out invalid day 366
        const check = new DateTime(spec);
        if (yearDay === 366 && isValidDate(check.start) && check.start.getFullYear() !== year) {
            return null;
        }

        return spec;
    }

    return null;
}