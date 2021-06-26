import { parseDate } from "./parseDate";
import { parseTime } from "./parseTime";
import { rationalise } from "./util";

export class DateTime {
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
    week;
    /** @type {?number} */
    weekDay;
    /** @type {?number} */
    yearDay;

    /**
     *
     * @param {import(".").DateSpec & import(".").TimeSpec} options
     */
    constructor (options) {
        Object.assign(this, options);
    }

    get start () {
        const { year, yearDay, week, weekDay, month = 1, day = 1 } = this;

        let start;

        // Handle Date Part

        if (typeof this.millennium === "number") {
            start = new Date(this.millennium * 1000, 0, 1);
            // Catch date constructor problems with years 0 to 99
            start.setFullYear(this.millennium * 1000);
        }

        else if (typeof this.century === "number") {
            start = new Date(this.century * 100, 0, 1);
            // Catch date constructor problems with years 0 to 99
            start.setFullYear(this.century * 100);
        }

        else if (typeof this.decade === "number") {
            start = new Date(this.decade * 10, 0, 1);
            // Catch date constructor problems with years 0 to 99
            start.setFullYear(this.decade * 10);
        }

        else {
            if (typeof year !== "number") {
                throw Error("Invalid DateTime");
            }

            // Defaults to first of year
            start = new Date(year, month - 1, day);
            // Catch date constructor problems with years 0 to 99
            start.setFullYear(year);

            if (typeof yearDay === "number") {
                start = new Date(+start + ((yearDay - 1) * 86400000));
            }

            else if (typeof week === "number") {

                // getDay(): 0 - 6; Sun - Mon
                const offset = [2, 1, 0, -1, -2, 4, 3][start.getDay()];

                start.setDate(offset);

                start = new Date(+start + ((week - 1) * 7 * 86400000));

                if (typeof weekDay === "number") {
                    start.setDate(start.getDate() + weekDay - 1);
                }
            }
        }

        // Handle Time Part (including fractions)
        const {
            hour,
            minute = (hour % 1) * 60,
            second =  (minute % 1) * 60,
        } = this;
        const millisecond = (second % 1) * 1000;

        if (typeof hour === "number") {
            start.setHours(hour);

            if (typeof minute === "number") {
                start.setMinutes(minute);

                if (typeof second === "number") {
                    start.setSeconds(second);

                    if (typeof millisecond === "number") {
                        start.setMilliseconds(millisecond);
                    }
                }
            }
        }

        // Handle Time Zone
        if (typeof this.zoneHour === "number") {
            let offset = this.zoneHour * 60;

            if (typeof this.zoneMinute === "number") {
                offset += Math.sign(this.zoneHour) * this.zoneMinute;
            }

            const currOffset = start.getTimezoneOffset();
            const delta = -(offset + currOffset) * 60 * 1000;

            start.setTime(+start + delta);
        }


        return start;
    }

    get end () {
        const end = new Date(this.start);

        if (typeof this.second === "number") {
            // Handle Fractions
            if (this.second % 1) {
                const [ denom ] = rationalise(this.second % 1);
                const milliseconds = (1 / denom) * 1000;
                end.setTime(+end.getTime() + milliseconds);
            } else {
                end.setSeconds(this.second + 1);
            }
        }
        else if (typeof this.minute === "number") {
            // Handle Fractions
            if (this.minute % 1) {
                const [ denom ] = rationalise(this.minute % 1);
                const seconds = (1 / denom) * 60;
                end.setTime(+end.getTime() + seconds * 1000);
            } else {
                end.setMinutes(this.minute + 1);
            }
        }
        else if (typeof this.hour === "number") {
            // Handle Fractions
            if (this.hour % 1) {
                const [ denom ] = rationalise(this.hour % 1);
                const minutes = (1 / denom) * 60;
                end.setTime(+end.getTime() + minutes * 60 * 1000);
            } else {
                end.setHours(this.hour + 1);
            }
        }
        else if (typeof this.day === "number") {
            end.setDate(this.day + 1);
        }
        else if (typeof this.month === "number") {
            end.setMonth(this.month);
        }
        else if (typeof this.yearDay === "number") {
            end.setDate(end.getDate() + 1);
        }
        else if (typeof this.weekDay === "number") {
            end.setDate(end.getDate() + 1);
        }
        else if (typeof this.week === "number") {
            end.setDate(end.getDate() + 7);
        }
        else if (typeof this.year === "number") {
            end.setFullYear(this.year + 1);
        }
        else if (typeof this.decade === "number") {
            end.setFullYear((this.decade + 1) * 10);
        }
        else if (typeof this.century === "number") {
            end.setFullYear((this.century + 1) * 100);
        }
        else if (typeof this.millennium === "number") {
            end.setFullYear((this.millennium + 1) * 1000);
        }

        return end;
    }

    toJSON () {
        return ({
            ...this,
            start: this.start.toISOString(),
            end: this.end.toISOString(),
        });
    }

    /**
     *
     * @param {string} input
     * @returns {import(".").DateSpec & import(".").TimeSpec}
     */
    static parse (input) {

        if (/T/.test(input)) {
            const [dateInput, timeInput] = input.split("T", 2);

            const dateSpec = parseDate(dateInput);
            const timeSpec = parseTime(timeInput);

            // Both parts must be valid
            if (dateSpec === null || timeSpec === null) {
                return null;
            }

            // The date part must specify a specific day
            if (typeof dateSpec.day !== "number"
                && typeof dateSpec.weekDay !== "number"
                && typeof dateSpec.yearDay !== "number"
            ) {
                return null
            }

            return { ...dateSpec, ...timeSpec };
        }

        return parseDate(input);
    }
}