import { DateTimeInterval } from "./DateTimeInterval";
import { DateTime } from "./DateTime";
import { getIntervalInstances } from "./intervals";
import { isValidDate } from "./util";

export { DateTime, DateTimeInterval, isValidDate, getIntervalInstances };

/**
 * @typedef DateSpec
 * @property {number} [millennium]
 * @property {number} [century]
 * @property {number} [decade]
 * @property {number} [year]
 * @property {number} [yearDay]
 * @property {number} [week]
 * @property {number} [weekDay]
 * @property {number} [month]
 * @property {number} [day]
 */

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

/**
 * @typedef DateTimeIntervalSpec
 * @property {DateTime} [first]
 * @property {DateTime} [last]
 * @property {DateTimePeriodSpec} [period]
 * @property {number} [repetitions]
 */


/**
 * @param {string} input
 */
export function parse (input) {
    const dateTimeSpec = DateTime.parse(input);
    if (dateTimeSpec) {
        return new DateTime(dateTimeSpec);
    }

    const dateTimeIntervalSpec = DateTimeInterval.parse(input);
    if (dateTimeIntervalSpec) {
        return new DateTimeInterval(dateTimeIntervalSpec);
    }

    // throw new Error(`Invalid input: '${input}' Parsing error: ${e.message}`);
    return null;
}
