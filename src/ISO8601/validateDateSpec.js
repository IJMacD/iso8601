import { DateTime, isValidDate } from ".";
import { getMonthLength } from "./util";

/**
 * Checks if date spec object is valid
 * Always returns a boolean
 * @param {import(".").DateSpec} spec
 * @returns {boolean}
 */
export function validateDateSpec (spec) {
    if (spec === null) {
        return false;
    };

    const { millennium, century, decade, year, month, day, week, weekDay, yearDay } = spec;

    // Millennium, Centry and Decase must be alone
    if (typeof millennium === "number" || typeof century === "number" || typeof decade === "number") {
        return Object.keys(spec).length === 1;
    }

    // For everything else we must have a year
    if (typeof year !== "number")
        return false;

    if (typeof month === "number") {
        if (month < 1 || month > 12) {
            return false;
        }

        if (typeof day === "number") {
            if (day < 1) {
                return false;
            }

            const monthDays = getMonthLength({ year, month, day });

            if (day > monthDays) {
                return false;
            }
        }

        return true;
    }

    if (typeof week === "number") {

        if (week < 1 || week > 53) {
            return false;
        }

        // Catch bad week 53
        if (!isValidWeek({ year, week })) {
            return false;
        }

        if (typeof weekDay === "number") {
            if (weekDay < 1 || weekDay > 7) {
                return false;
            }
        }

        return true;
    }

    if (typeof yearDay === "number") {
        if (yearDay < 1 || yearDay > 366) {
            return false;
        }

        // Weed out invalid day 366
        const check = new DateTime({ year, yearDay});
        if (yearDay === 366 && isValidDate(check.start) && check.start.getFullYear() !== year) {
            return false;
        }

        return true;
    }

    // `day` and `weekDay` are invalid without `month` and `week` respectively
    if (typeof day === "number" || typeof weekDay === "number") {
        return false;
    }

    // Must just be a year
    return Object.keys(spec).length === 1;
}

function isValidWeek({ year, week }) {
    if (week < 1 || week > 53) {
        return false;
    }

    // Week 53 needs extra validation
    if (week === 53) {
        const check = new DateTime({ year, week });

        // If it's not a vaild date then it's probably too far into the future
        // we won't bother validating in that case
        if (!isValidDate(check.start)) {
            return true;
        }

        // Monday's year must be same as calnedar year
        if (check.start.getFullYear() !== year) {
            return false;
        }

        // Monday's date must be either 27 or 28
        const d = check.start.getDate();
        if (d < 27 || d > 28) {
            return false;
        }
    }

    return true;
}
