/**
 * @param {string} input
 * @returns {import(".").DateTimePeriodSpec}
 */
export function parsePeriod(input) {
    if (!/^P/.test(input)) {
        return null;
    }

    const [datePart, timePart] = input.substr(1).split("T");

    const out = {};

    let m = /(\d+(?:\.\d+)?)Y/.exec(datePart);
    if (m) {
        out.years = +m[1];
    }

    m = /(\d+(?:\.\d+)?)M/.exec(datePart);
    if (m) {
        out.months = +m[1];
    }

    m = /(\d+(?:\.\d+)?)W/.exec(datePart);
    if (m) {
        out.weeks = +m[1];
    }

    m = /(\d+(?:\.\d+)?)D/.exec(datePart);
    if (m) {
        out.days = +m[1];
    }

    m = /(\d+(?:\.\d+)?)H/.exec(timePart);
    if (m) {
        out.hours = +m[1];
    }

    m = /(\d+(?:\.\d+)?)M/.exec(timePart);
    if (m) {
        out.minutes = +m[1];
    }

    m = /(\d+(?:\.\d+)?)S/.exec(timePart);
    if (m) {
        out.seconds = +m[1];
    }

    return out;
}
