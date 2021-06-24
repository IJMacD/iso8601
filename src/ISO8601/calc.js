import { getMonthLength } from "./util";

/**
 *
 * @param {DateTimeSpec} dateTime
 * @param {DateTimePeriodSpec} period
 * @returns {Date}
 */

export function addDateTimeAndPeriod(dateTime, period) {
    return addDateAndPeriod(dateTime.start, period);
}
/**
 *
 * @param {DateTimePeriodSpec} period
 * @param {DateTimeSpec} dateTime
 * @returns {Date}
 */
export function subtractPeriodFromDateTime (period, dateTime) {
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
 *
 * @param {Date} date
 * @param {DateTimePeriodSpec} period
 * @returns {Date}
 */
export function addDateAndPeriod(date, period) {
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
