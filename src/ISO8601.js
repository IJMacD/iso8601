export class DateTimeSpec {
    /** @type {?number} */
    millennium;
    /** @type {?number} */
    century;
    /** @type {?number} */
    decade;
    /** @type {?number} */
    year;
    /** @type {?number} */
    month;
    /** @type {?number} */
    day;
    /** @type {?number} */
    hour;
    /** @type {?number} */
    minute;
    /** @type {?number} */
    second;
    /** @type {?number} */
    weekYear;
    /** @type {?number} */
    week;
    /** @type {?number} */
    yearDay;
    /** @type {Date} */
    start;
    /** @type {Date} */
    end;

    /**
     *
     * @param {string} input
     */
    constructor (input) {
        if (/^T/.test(input)) {
            return Object.assign(this, { ...parseTime(input.substr(1)), start: null, end: null });
        }

        if (/T/.test(input)) {
            const [dateInput, timeInput] = input.split("T", 2);

            const dt = {
                ...parseTime(timeInput),
                ...parseDate(dateInput),
            };

            if (typeof dt.day !== "number" && typeof dt.yearDay !== "number") {
                console.log(dt);
                // We didn't have a single day specified so a time is invalid
                throw new Error("Invalid data time format " + input);
            }

            // Since we have a time we'll reset the parsed date back to the same for start/end
            dt.end.setDate(dt.start.getDate());

            // Since we had a time component we *must* at least have an hour component
            dt.start.setHours(dt.hour);

            // Now start finding what granularity was provided
            if (typeof dt.minute === "number") {
                dt.end.setHours(dt.hour);
                dt.start.setMinutes(dt.minute);

                if (typeof dt.second === "number") {
                    dt.end.setMinutes(dt.minute);

                    dt.start.setSeconds(dt.second);
                    if (dt.second % 1) {
                        dt.start.setMilliseconds((dt.second % 1) * 1000);
                        dt.end.setMilliseconds(dt.start.getMilliseconds() + 1);
                    } else {
                        dt.end.setSeconds(dt.second + 1);
                    }
                } else {
                    dt.end.setMinutes(dt.minute + 1);
                }
            } else {
                dt.end.setHours(dt.hour + 1);
            }

            return Object.assign(this, dt);
        }

        if (/:/.test(input)) {
            return Object.assign(this, { ...parseTime(input), start: null, end: null });
        }

        return Object.assign(this, parseDate(input));
    }
}

/**
 * @typedef TimeSpec
 * @property {number} [hour]
 * @property {number} [minute]
 * @property {number} [second]
 */

/**
 * @typedef DateTimePeriodSpec
 * @property {number} [years]
 * @property {number} [months]
 * @property {number} [weeks]
 * @property {number} [days]
 * @property {number} [hours]
 * @property {number} [minutes]
 * @property {number} [seconds]
 */

export class DateTimeIntervalSpec {
    /** @type {?DateTimeSpec} */
    first = null;
    /** @type {?DateTimeSpec} */
    last = null;
    /** @type {?DateTimePeriodSpec} */
    period = null;
    /** @type {?number} */
    repetitions = 0;
    /** @type {Date} */
    start;
    /** @type {?Date} */
    end = null;

    /**
     * @param {string} input
     */
    constructor (input) {
        const m = /^R(\d*)\//.exec(input);
        if(m) {
            if (m[1]) {
                this.repetitions = +m[1];
            } else {
                this.repetitions = Infinity;
            }

            input = input.substr(m[0].length);
        }

        if (!/\//.test(input)) {
            throw new Error("Invalid range " + input);
        }

        const [partA, partB] = input.split("/", 2);

        try {
            const first = new DateTimeSpec(partA);

            try {
                const last = new DateTimeSpec(partB);

                return Object.assign(this, { first, last, start: first.start, end: last.end });
            } catch (e) {
                try {
                    const period = parsePeriod(partB);

                    return Object.assign(this, { first, period, start: first.start, end: addDateTimeAndPeriod(first, period) });
                }
                catch (e) {
                    throw new Error("Invalid range part " + partB);
                }
            }
        } catch (e) {
            try {
                const period = parsePeriod(partA);

                try {
                    const last = new DateTimeSpec(partB);

                    return Object.assign(this, { period, last, start: subtractPeriodFromDateTime(period, last), end: last.end });
                } catch (e) {
                    throw new Error("Invalid range part " + partB);
                }
            } catch (e) {
                throw new Error("Invalid range part " + partA);
            }
        }

        // unreachable
    }
}

/**
 * @param {string} input
 */
export function parse (input) {
    try {
        return new DateTimeSpec(input);
    } catch (e) {}

    try {
        return new DateTimeIntervalSpec(input);
    } catch (e) {}

    throw new Error("Invalid input " + input);
}

/**
 * @param {string} input
 */
function parseDate (input) {
    if (/^\d$/.test(input)) {
        const start = new Date(+input * 1000, 0, 1);
        // Catch date constructor problems with years 0 to 99
        start.setFullYear(+input * 1000);

        const end = new Date((+input + 1) * 1000, 0, 1);
        // Catch date constructor problems with years 0 to 99
        end.setFullYear((+input + 1) * 1000);

        return {
            millennium: +input,
            start,
            end,
        };
    }

    if (/^\d\d$/.test(input)) {
        const start = new Date(+input * 100, 0, 1);
        // Catch date constructor problems with years 0 to 99
        start.setFullYear(+input * 100);

        const end = new Date((+input + 1) * 100, 0, 1);
        // Catch date constructor problems with years 0 to 99
        end.setFullYear((+input + 1) * 100);

        return {
            century: +input,
            start,
            end,
        };
    }

    if (/^\d{3}$/.test(input)) {
        const start = new Date(+input * 10, 0, 1);
        // Catch date constructor problems with years 0 to 99
        start.setFullYear(+input * 10);

        const end = new Date((+input + 1) * 10, 0, 1);
        // Catch date constructor problems with years 0 to 99
        end.setFullYear((+input + 1) * 10);

        return {
            decade: +input,
            start,
            end,
        };
    }

    if (/^\d{4}$/.test(input)) {
        const start = new Date(+input, 0, 1);
        // Catch date constructor problems with years 0 to 99
        start.setFullYear(+input);

        const end = new Date(+input + 1, 0, 1);
        // Catch date constructor problems with years 0 to 99
        end.setFullYear(+input + 1);

        return {
            year: +input,
            start,
            end,
        };
    }

    let m = /^(\d{4})-(\d{2})$/.exec(input);
    if (m) {
        const start = new Date(+m[1], +m[2] - 1, 1);
        // Catch date constructor problems with years 0 to 99
        start.setFullYear(+m[1]);

        const end = new Date(+m[1], +m[2], 1);
        // Catch date constructor problems with years 0 to 99
        end.setFullYear(+m[1]);

        return {
            year: +m[1],
            month: +m[2],
            start,
            end,
        };
    }

    m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(input);
    if (m) {
        const start = new Date(+m[1], +m[2] - 1, +m[3]);
        // Catch date constructor problems with years 0 to 99
        start.setFullYear(+m[1]);

        const end = new Date(+m[1], +m[2] - 1, +m[3] + 1);
        // Catch date constructor problems with years 0 to 99
        end.setFullYear(+m[1]);

        return {
            year: +m[1],
            month: +m[2],
            day: +m[3],
            start,
            end,
        };
    }

    m = /^(\d{4})-W(\d{2})$/.exec(input);
    if (m) {
        const s = new Date(+m[1], 0, 1);
        // Catch date constructor problems with years 0 to 99
        s.setFullYear(+m[1]);

        // TODO: adjust for year/weekYear mis-match when necessary
        const start = new Date(+s + ((+m[2] - 1) * 7 * 86400000));

        // TODO: Check how often the following trick works
        //       (It works for 2021 at least)
        start.setDate(start.getDate() - start.getDay() + 8);

        return {
            weekYear: +m[1],
            week: +m[2],
            start,
            end: new Date(start.getFullYear(), start.getMonth(), start.getDate() + 7),
        };
    }

    m = /^(\d{4})-(\d{3})$/.exec(input);
    if (m) {
        const s = new Date(+m[1], 0, 1);
        // Catch date constructor problems with years 0 to 99
        s.setFullYear(+m[1]);

        const start = new Date(+s + ((+m[2] - 1) * 86400000));

        return {
            year: +m[1],
            yearDay: +m[2],
            start,
            end: new Date(+m[1], start.getMonth(), start.getDate() + 1),
        };
    }

    throw new Error("Invalid date format " + input);
}

/**
 * @param {string} input
 * @returns {TimeSpec}
 */
function parseTime (input) {

    let m = /^(\d{2})$/.exec(input);
    if (m) {
        return {
            hour: +m[1],
        };
    }

    m = /^(\d{2}):(\d{2})$/.exec(input);
    if (m) {
        return {
            hour: +m[1],
            minute: +m[2],
        };
    }

    m = /^(\d{2}):(\d{2}):(\d\d(?:\.\d+)?)$/.exec(input);
    if (m) {
        return {
            hour: +m[1],
            minute: +m[2],
            second: +m[3],
        };
    }

    throw new Error("Invalid time format " + input);
}

/**
 * @param {string} input
 * @returns {DateTimePeriodSpec}
 */
function parsePeriod (input) {
    if (!/^P/.test(input)) {
        throw new Error("Invalid period " + input);
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

/**
 *
 * @param {DateTimeSpec} dateTime
 * @param {DateTimePeriodSpec} period
 * @returns {Date}
 */
export function addDateTimeAndPeriod (dateTime, period) {
    return addDateAndPeriod(dateTime.start, period);
}
/**
 *
 * @param {Date} date
 * @param {DateTimePeriodSpec} period
 * @returns {Date}
 */
export function addDateAndPeriod (date, period) {
    const d = new Date(date);

    if (period.years) {
        d.setFullYear(d.getFullYear() + period.years);

        const rem = period.years % 1;
        if (rem) {
            d.setMonth(d.getMonth() + rem * 12);
        }
    }

    if (period.months) {
        d.setMonth(d.getMonth() + period.months);

        const rem = period.months % 1;
        if (rem) {
            d.setDate(d.getDate() + rem * getMonthLength(d));
        }
    }

    if (period.weeks) {
        d.setDate(d.getDate() + period.weeks * 7);

        const rem = period.weeks % 1;
        if (rem) {
            d.setDate(d.getDate() + rem * 7);
        }
    }

    if (period.days) {
        d.setDate(d.getDate() + period.days);

        const rem = period.days % 1;
        if (rem) {
            d.setTime(+d + rem * 24 * 60 * 60 * 1000);
        }
    }

    if (period.hours) {
        d.setHours(d.getHours() + period.hours);

        const rem = period.hours % 1;
        if (rem) {
            d.setTime(+d + rem * 60 * 60 * 1000);
        }
    }

    if (period.minutes) {
        d.setMinutes(d.getMinutes() + period.minutes);

        const rem = period.minutes % 1;
        if (rem) {
            d.setTime(+d + rem * 60 * 1000);
        }
    }

    if (period.seconds) {
        d.setSeconds(d.getSeconds() + period.seconds);

        const rem = period.seconds % 1;
        if (rem) {
            d.setTime(+d + rem * 1000);
        }
    }

    return d;
}

/**
 * @param {Date} date
 */
function getMonthLength (date) {
    const m = date.getMonth();

    if (m === 1) {
        const y = date.getFullYear();

        return (y % 400 === 0 || (y % 4 === 0 && y % 100 !== 0)) ? 29 : 28;
    }

    return [31,0,31,30,31,30,31,31,30,31,30,31][m];
}

/**
 *
 * @param {DateTimePeriodSpec} period
 * @param {DateTimeSpec} dateTime
 * @returns {Date}
 */
function subtractPeriodFromDateTime (period, dateTime) {
    const d = new Date(dateTime.start);

    if (period.years) {
        d.setFullYear(d.getFullYear() - period.years);
    }

    if (period.months) {
        d.setMonth(d.getMonth() - period.months);
    }

    if (period.weeks) {
        d.setDate(d.getDate() - period.weeks * 7);
    }

    if (period.days) {
        d.setDate(d.getDate() - period.days);
    }

    if (period.hours) {
        d.setHours(d.getHours() - period.hours);
    }

    if (period.minutes) {
        d.setMinutes(d.getMinutes() - period.minutes);
    }

    if (period.seconds) {
        d.setSeconds(d.getSeconds() - period.seconds);
    }

    return d;
}

/**
 * @param {DateTimeIntervalSpec} value
 */
export function* getIntervalInstances (value) {
    let prevValue = value.start;

    // +2 because repetitions spec doesn't include the very start date or the end of the 0th period
    for (let i = 0; i < value.repetitions + 2; i++) {
        yield prevValue;
        prevValue = addDateAndPeriod(prevValue, value.period);
    }
}