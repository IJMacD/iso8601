import { addDateAndPeriod } from "./calc";

/**
 * @param {import(".").DateTimeInterval} value
 * @returns {Generator<import(".").DateTimeInterval>}
 */


export function* getIntervalInstances(value) {
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
