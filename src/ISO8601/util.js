/**
 * @param {Date|import(".").DateSpec} date
 */
export function getMonthLength (date) {
    let y, m;

    if (date instanceof Date) {
        y = date.getFullYear();
        m = date.getMonth();
    } else {
        y = date.year;
        m = date.month - 1;
    }

    if (m === 1) {
        return (y % 400 === 0 || (y % 4 === 0 && y % 100 !== 0)) ? 29 : 28;
    }

    return [31, 0, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][m];
}

/**
 * @param {Date} date
 */
export function isValidDate(date) {
    return date instanceof Date && !isNaN(+date);
}
