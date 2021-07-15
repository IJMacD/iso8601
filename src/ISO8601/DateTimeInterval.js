import { addDateTimeAndPeriod, subtractPeriodFromDateTime } from "./calc";
import { DateTime } from "./DateTime";
import { parseEndDate } from "./parseEndDate";
import { parsePeriod } from "./parsePeriod";

export class DateTimeInterval {
    /** @type {?DateTime} */
    first;
    /** @type {?DateTime} */
    last;
    /** @type {?import(".").DateTimePeriodSpec} */
    period;
    /** @type {?number} */
    repetitions;

    /**
     * @param {import(".").DateTimeIntervalSpec} options
     */
    constructor(options) {
        Object.assign(this, options);
    }

    get start () {
        if (this.first) {
            return this.first.start;
        }

        if (this.period && this.last) {
            return subtractPeriodFromDateTime(this.period, this.last);
        }

        throw new Error("DateTimeInterval was underspecified")
    }

    get end () {
        if (this.last) {
            return this.last.start;
        }

        if (this.first && this.period) {
            return addDateTimeAndPeriod(this.first, this.period);
        }

        throw new Error("DateTimeInterval was underspecified");
    }

    /**
     *
     * @param {string} input
     * @returns {import(".").DateTimeIntervalSpec}
     */
    static parse (input) {
        let repetitions = 0;

        const m = /^R(\d*)\//.exec(input);
        if (m) {
            if (m[1]) {
                repetitions = +m[1];
            } else {
                repetitions = Infinity;
            }

            input = input.substr(m[0].length);
        }

        if (!/\//.test(input)) {
            // "Invalid range " + input;
            return null;
        }

        const [partA, partB] = input.split("/", 2);

        const specA = DateTime.parse(partA);

        if (specA) {
            const first = new DateTime(specA);

            const specB = parseEndDate(partB, first);

            if (specB) {
                const last = new DateTime(specB);
                return { first, last, repetitions };
            }

            const period = parsePeriod(partB);

            if (period) {
                return { first, period, repetitions };
            }

            // "Range part is not a valid period " + partB;
            return null;
        }

        // console.debug(e.message);

        const period = parsePeriod(partA);

        if (period) {
            const specB = DateTime.parse(partB);

            if (specB) {
                const last = new DateTime(specB);

                return { period, last, repetitions };
            }
        }

        // "Range part is not valid DateTime: " + partB;
        return null;
    }
}
