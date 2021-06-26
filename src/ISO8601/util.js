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

/**
 * @param {number} n
 */
export function rationalise (n) {
    const sign = Math.sign(n);
    n = Math.abs(n);

    let int = 0;
    if (n >= 1) {
        int = Math.floor(n);
        n -= int;
    }

    const e = 1e-10; // Number.MIN_VALUE; // 5e-324

    // Check for integers
    if (n < e) {
        return [ 1, sign * int ];
    }

    let num_a = 0;
    let num_b = 1;
    let denom_a = 1;
    let denom_b = 1;

    let i = 0;
    const iteration_limit = 1e6;

    let num = num_a + num_b;
    let denom = denom_a + denom_b;
    while (Math.abs((num / denom) - n) > e && i < iteration_limit) {
        if ((num / denom) > n) {
            num_b = num;
            denom_b = denom;
        } else {
            num_a = num;
            denom_a = denom;
        }

        num = num_a + num_b;
        denom = denom_a + denom_b;
        i++;
    }

    return [ denom,  sign * (int * denom + num) ];
}