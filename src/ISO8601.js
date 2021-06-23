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
    zoneHour;
    /** @type {?number} */
    zoneMinute;
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
     * @param {DateTimeSpec} relativeTo
     */
    constructor (input, relativeTo = null) {
        if (relativeTo) {
            return Object.assign(this, parseEndDate(input, relativeTo));
        }

        // if (/^T/.test(input)) {
        //     return Object.assign(this, { ...parseTime(input.substr(1)), start: null, end: null });
        // }

        if (/T/.test(input)) {
            const [dateInput, timeInput] = input.split("T", 2);

            const dt = {
                ...parseTime(timeInput),
                ...parseDate(dateInput),
            };

            if (typeof dt.day !== "number"
                && typeof dt.yearDay !== "number"
                && typeof dt.weekDay !== "number"
            ) {
                // We didn't have a single day specified so a time is invalid
                throw new Error("Invalid data time format " + input);
            }

            if (typeof dt.hour === "number") {
                // Since we have a time we'll reset the parsed date back to the same for start/end
                dt.end.setDate(dt.start.getDate());

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
            }

            if (typeof dt.zoneHour === "number") {
                let offset = 0;
                if (typeof dt.zoneMinute === "number") {
                    offset = dt.zoneHour * 60 + Math.sign(dt.zoneHour) * dt.zoneMinute;
                } else {
                    offset = dt.zoneHour * 60;
                }

                const currOffset = dt.start.getTimezoneOffset();
                const delta = -(offset + currOffset) * 60 * 1000;

                dt.start.setTime(+dt.start + delta);
                dt.end.setTime(+dt.end + delta);
            }

            return Object.assign(this, dt);
        }

        // if (/:/.test(input)) {
        //     return Object.assign(this, { ...parseTime(input), start: null, end: null });
        // }

        return Object.assign(this, parseDate(input));
    }
}

/**
 * @typedef TimeSpec
 * @property {number} [hour]
 * @property {number} [minute]
 * @property {number} [second]
 * @property {number} [zoneHour]
 * @property {number} [zoneMinute]
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
                const last = new DateTimeSpec(partB, first);

                return Object.assign(this, { first, last, start: first.start, end: last.start });
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

    // Check for four or more digit year
    let m = /^([+-]\d{4,}|\d{4})/.exec(input);

    if (!m) {
        throw new Error("Invalid date format (bad year) " + input);
    }

    const year = +m[0];
    input = input.substr(m[0].length);

    if (input.length === 0) {
        const start = new Date(year, 0, 1);
        // Catch date constructor problems with years 0 to 99
        start.setFullYear(year);

        const end = new Date(year + 1, 0, 1);
        // Catch date constructor problems with years 0 to 99
        end.setFullYear(year + 1);

        return {
            year,
            start,
            end,
        };
    }

    m = /^-(\d{2})$/.exec(input);
    if (m) {
        const start = new Date(year, +m[1] - 1, 1);
        // Catch date constructor problems with years 0 to 99
        start.setFullYear(year);

        const end = new Date(year, +m[1], 1);
        // Catch date constructor problems with years 0 to 99
        end.setFullYear(year);

        return {
            year,
            month: +m[1],
            start,
            end,
        };
    }

    m = /^-?(\d{2})-?(\d{2})$/.exec(input);
    if (m) {
        const start = new Date(year, +m[1] - 1, +m[2]);
        // Catch date constructor problems with years 0 to 99
        start.setFullYear(year);

        const end = new Date(year, +m[1] - 1, +m[2] + 1);
        // Catch date constructor problems with years 0 to 99
        end.setFullYear(year);

        return {
            year,
            month: +m[1],
            day: +m[2],
            start,
            end,
        };
    }

    m = /^-?W(\d{2})$/.exec(input);
    if (m) {

        const week = +m[1];
        if (week < 1 || week > 53) {
            throw new Error("Invalid date format " + input);
        }

        const s = new Date(year, 0, 1);
        // Catch date constructor problems with years 0 to 99
        s.setFullYear(year);

        // getDay(): 0 - 6; Sun - Mon
        const offset = [2, 1, 0, -1, -2, 4, 3][s.getDay()];

        s.setDate(offset);

        const start = new Date(+s + ((week - 1) * 7 * 86400000));

        if (week === 53 && start.getFullYear() !== year) {
            throw new Error("Invalid date format " + input);
        }

        return {
            weekYear: year,
            week,
            start,
            end: new Date(start.getFullYear(), start.getMonth(), start.getDate() + 7),
        };
    }

    m = /^-?W(\d{2})-?(\d)$/.exec(input);
    if (m) {
        const week = +m[1];
        if (week < 1 || week > 53) {
            throw new Error("Invalid date format " + input);
        }

        const weekDay = +m[2];
        if (weekDay < 1 || weekDay > 7) {
            throw new Error("Invalid date format " + input);
        }

        const s = new Date(year, 0, 1);
        // Catch date constructor problems with years 0 to 99
        s.setFullYear(year);

        // getDay(): 0 - 6; Sun - Mon
        const offset = [2, 1, 0, -1, -2, 4, 3][s.getDay()];

        s.setDate(offset);

        const start = new Date(+s + ((week - 1) * 7 * 86400000));

        start.setDate(start.getDate() + weekDay - 1);

        if (week === 53 && start.getFullYear() !== year) {
            throw new Error("Invalid date format " + input);
        }

        return {
            weekYear: year,
            week,
            weekDay,
            start,
            end: new Date(start.getFullYear(), start.getMonth(), start.getDate() + 1),
        };
    }

    m = /^-?(\d{3})$/.exec(input);
    if (m) {
        const s = new Date(year, 0, 1);
        // Catch date constructor problems with years 0 to 99
        s.setFullYear(year);

        const yearDay = +m[1];

        if (yearDay < 1 || yearDay > 366) {
            throw new Error("Invalid date format " + input);
        }

        const start = new Date(+s + ((yearDay - 1) * 86400000));

        if (start.getFullYear() !== year) {
            throw new Error("Invalid date format " + input);
        }

        return {
            year,
            yearDay,
            start,
            end: new Date(year, start.getMonth(), start.getDate() + 1),
        };
    }

    throw new Error("Invalid date format " + input);
}

/**
 * @param {string} input
 * @param {DateTimeSpec} startDate
 */
function parseEndDate (input, startDate) {
    let [ maybeDatePart, timePart ] = input.split("T", 2);

    /** @type {any} */
    let candidate = Object.assign({}, startDate);

    let m = /^(\d{2})$/.exec(maybeDatePart);
    if (m) {
        let { year, month, day, hour, minute, second } = startDate;

        const start = new Date(startDate.start);
        const end = new Date(startDate.end);

        if (!timePart) {
            if (typeof second === "number") {
                second = +m[1];

                if (second > 61) {
                    throw new Error("Are you sure you want second to be " + second);
                }

                start.setSeconds(second);
                end.setSeconds(second + 1);
            } else if (typeof minute === "number") {
                minute = +m[1];

                if (minute > 60) {
                    throw new Error("Are you sure you want minute to be " + minute);
                }

                start.setMinutes(minute);
                end.setMinutes(minute + 1);
            } else if (typeof hour === "number") {
                hour = +m[1];

                if (hour > 23) {
                    throw new Error("Are you sure you want hout to be " + hour);
                }

                start.setHours(hour);
                end.setHours(hour + 1);
            } else if (typeof day === "number") {
                day = +m[1];

                start.setDate(day);
                end.setDate(day + 1);

                if (day > getMonthLength(start)) {
                    throw new Error("Are you sure you want day to be " + day);
                }
            } else if (typeof month === "number") {
                month = +m[1];

                if (month > 12) {
                    throw new Error("Are you sure you want month to be " + month);
                }

                start.setMonth(month - 1);
                end.setMonth(month);
            } else {
                throw new Error("Invalid end date " + maybeDatePart);
            }
        }
        else {
            if (typeof day === "number") {
                day = +m[1];
                start.setDate(day);
                end.setDate(day + 1);

                if (day > getMonthLength(start)) {
                    throw new Error("Are you sure you want day to be " + day);
                }
            } else if (typeof month === "number") {
                month = +m[1];
                start.setMonth(month - 1);
                end.setMonth(month);

                if (month > 12) {
                    throw new Error("Are you sure you want month to be " + month);
                }
            } else {
                throw new Error("Invalid end date " + maybeDatePart);
            }
        }

        candidate = { year, month, day, hour, minute, second, start, end };
    }
    else {
        m = /^(\d{2})-(\d{2})$/.exec(maybeDatePart);
        if (m) {
            let { year, month, day, hour, minute, second } = startDate;

            const start = new Date(startDate.start);
            const end = new Date(startDate.end);

            if (typeof day !== "number" || typeof month !== "number") {
                throw new Error("Invalid end date " + maybeDatePart);
            }

            month = +m[1];
            day = +m[2];

            start.setMonth(month - 1);
            end.setMonth(month - 1);

            start.setDate(day);
            end.setDate(day + 1);

            if (month > 12) {
                throw new Error("Are you sure you want month to be " + month);
            }

            if (day > getMonthLength(start)) {
                throw new Error("Are you sure you want day to be " + day);
            }

            candidate = { year, month, day, hour, minute, second, start, end };
        } else {
            try {
                return parseDate(maybeDatePart);
            } catch (e) {}

            timePart = maybeDatePart;
        }
    }

    if (timePart) {
        m = /^(\d{2}):(\d{2})$/.exec(timePart);
        if (m) {
            let { year, month, day, hour, minute, second } = candidate;

            const start = new Date(candidate.start);
            const end = new Date(candidate.end);

            if (typeof second === "number") {
                minute = +m[1];
                second = +m[2];

                start.setMinutes(minute);
                end.setMinutes(minute);

                start.setSeconds(second);
                end.setSeconds(second + 1);
            } else if (typeof minute === "number") {
                hour = +m[1];
                minute = +m[2];

                start.setHours(hour);
                end.setHours(hour);

                start.setMinutes(minute);
                end.setMinutes(minute + 1);

                if (hour > 23) {
                    throw new Error("Are you sure you want hour to be " + hour);
                }

                if (minute > 60) {
                    throw new Error("Are you sure you want minute to be " + minute);
                }
            } else {
                throw new Error("Invalid end date " + input);
            }

            candidate = { year, month, day, hour, minute, second, start, end };
        } else {
            const t = parseTime(timePart);

            const start = new Date(candidate.start);
            const end = new Date(candidate.end);

            start.setHours(t.hour);
            end.setHours(t.hour);

            start.setMinutes(t.minute);
            end.setMinutes(t.minute);

            start.setSeconds(t.second);
            end.setSeconds(t.second + 1);

            Object.assign(candidate, t, { start, end });

            if (t.hour > 23) {
                throw new Error("Are you sure you want hours to be " + t.hour);
            }

            if (t.minute > 60) {
                throw new Error("Are you sure you want minutes to be " + t.minute);
            }

            if (t.second > 61) {
                throw new Error("Are you sure you want seconds to be " + t.second);
            }
        }
    }

    if (candidate) {
        return candidate;
    }

    return new DateTimeSpec(input);
}

/**
 * @param {string} input
 * @returns {TimeSpec}
 */
function parseTime (input) {
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
    if (m && input.length == 0) {
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
 * @returns {Generator<DateTimeIntervalSpec>}
 */
export function* getIntervalInstances (value) {
    let prevValue = {
        start: value.start,
        end: value.end,
        period: value.period,
        first: null,
        last: null,
        repetitions: 0,
    };

    // +1 because repetitions spec doesn't include the very start date or the end of the 0th period
    for (let i = 0; i < value.repetitions + 1; i++) {
        yield prevValue;
        if (value.period) {
            prevValue = {
                start: prevValue.end,
                end: addDateAndPeriod(prevValue.end, value.period),
                period: value.period,
                first: null,
                last: null,
                repetitions: null,
            };
        } else {
            // Many errors due to leap days/seconds
            // TODO: Implement {DateTime - DateTime = Period}
            const delta = +prevValue.end - +prevValue.start;

            prevValue = {
                start: prevValue.end,
                end: new Date(+prevValue.end + delta),
                period: null,
                first: null,
                last: null,
                repetitions: null,
            };
        }
    }
}