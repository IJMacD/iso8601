import { parseDate } from "./parseDate";
import { parseTime } from "./parseTime";
import { getMonthLength } from "./util";

/**
 * @param {string} input
 * @param {import('.').DateTime} startDate
 */
export function parseEndDate(input, startDate) {
    let [maybeDatePart, timePart] = input.split("T", 2);

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
                    // "Are you sure you want second to be " + second;
                    return null;
                }

                start.setSeconds(second);
                end.setSeconds(second + 1);
            } else if (typeof minute === "number") {
                minute = +m[1];

                if (minute > 60) {
                    // "Are you sure you want minute to be " + minute;
                    return null;
                }

                start.setMinutes(minute);
                end.setMinutes(minute + 1);
            } else if (typeof hour === "number") {
                hour = +m[1];

                if (hour > 23) {
                    // "Are you sure you want hout to be " + hour;
                    return null;
                }

                start.setHours(hour);
                end.setHours(hour + 1);
            } else if (typeof day === "number") {
                day = +m[1];

                start.setDate(day);
                end.setDate(day + 1);

                if (day < 1 || day > getMonthLength(start)) {
                    // "Are you sure you want day to be " + day;
                    return null;
                }
            } else if (typeof month === "number") {
                month = +m[1];

                if (month < 1 || month > 12) {
                    // "Are you sure you want month to be " + month;
                    return null;
                }

                start.setMonth(month - 1);
                end.setMonth(month);
            } else {
                // "Invalid end date " + maybeDatePart;
                return null;
            }
        }
        else {
            if (typeof day === "number") {
                day = +m[1];
                start.setDate(day);
                end.setDate(day + 1);

                if (day > getMonthLength(start)) {
                    // "Are you sure you want day to be " + day;
                    return null;
                }
            } else if (typeof month === "number") {
                month = +m[1];
                start.setMonth(month - 1);
                end.setMonth(month);

                if (month > 12) {
                    // "Are you sure you want month to be " + month;
                    return null;
                }
            } else {
                // "Invalid end date " + maybeDatePart;
                return null;
            }
        }

        candidate = { year, month, day, hour, minute, second };
    }
    else {
        m = /^(\d{2})-(\d{2})$/.exec(maybeDatePart);
        if (m) {
            let { year, month, day, hour, minute, second } = startDate;

            const start = new Date(startDate.start);
            const end = new Date(startDate.end);

            if (typeof day !== "number" || typeof month !== "number") {
                // "Invalid end date " + maybeDatePart;
                return null;
            }

            month = +m[1];
            day = +m[2];

            start.setMonth(month - 1);
            end.setMonth(month - 1);

            start.setDate(day);
            end.setDate(day + 1);

            if (month < 1 || month > 12) {
                // "Are you sure you want month to be " + month;
                return null;
            }

            if (day < 1 || day > getMonthLength(start)) {
                // "Are you sure you want day to be " + day;
                return null;
            }

            candidate = { year, month, day, hour, minute, second };
        } else {
            const { year } = startDate;

            m = /^\d{3}$/.exec(maybeDatePart);
            if (m && typeof year === "number") {
                candidate = { year, yearDay: +m[0] };
            }
            else {
                const spec = parseDate(maybeDatePart);
                if (spec) {
                    return spec;
                }

                timePart = maybeDatePart;
            }
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
                    // "Are you sure you want hour to be " + hour;
                    return null;
                }

                if (minute > 60) {
                    // "Are you sure you want minute to be " + minute;
                    return null;
                }
            } else {
                // "Invalid end date " + input;
                return null;
            }

            candidate = { year, month, day, hour, minute, second };
        } else {
            const t = parseTime(timePart);

            if (!t) {
                return null;
            }

            const start = new Date(candidate.start);
            const end = new Date(candidate.end);

            start.setHours(t.hour);
            end.setHours(t.hour);

            start.setMinutes(t.minute);
            end.setMinutes(t.minute);

            start.setSeconds(t.second);
            end.setSeconds(t.second + 1);

            Object.assign(candidate, t);

            if (t.hour > 23) {
                // "Are you sure you want hours to be " + t.hour;
                return null;
            }

            if (t.minute > 60) {
                // "Are you sure you want minutes to be " + t.minute;
                return null;
            }

            if (t.second > 61) {
                // "Are you sure you want seconds to be " + t.second;
                return null;
            }
        }
    }

    return candidate;
}
