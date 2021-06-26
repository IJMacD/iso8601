import { parseDate } from "../parseDate";
import { validateDateSpec } from "../validateDateSpec";

test("Months", () => {
    expect(validateDateSpec(parseDate("2000-00"))).toBe(false);
    expect(validateDateSpec(parseDate("2000-13"))).toBe(false);
    expect(validateDateSpec(parseDate("2000-99"))).toBe(false);
});

test("Days of Month", () => {
    expect(validateDateSpec(parseDate("2000-01-00"))).toBe(false);
    expect(validateDateSpec(parseDate("2000-01-31"))).toBe(true);
    expect(validateDateSpec(parseDate("2000-01-32"))).toBe(false);
    expect(validateDateSpec(parseDate("2000-04-30"))).toBe(true);
    expect(validateDateSpec(parseDate("2000-04-31"))).toBe(false);
    expect(validateDateSpec(parseDate("2000-02-29"))).toBe(true);
    expect(validateDateSpec(parseDate("2000-02-30"))).toBe(false);
    expect(validateDateSpec(parseDate("2001-02-29"))).toBe(false);
});

test("Days of Week", () => {
    expect(validateDateSpec(parseDate("2000-W01-0"))).toBe(false);
    expect(validateDateSpec(parseDate("2000-W01-1"))).toBe(true);
    expect(validateDateSpec(parseDate("2000-W01-7"))).toBe(true);
    expect(validateDateSpec(parseDate("2000-W01-8"))).toBe(false);
});

test("Days of Year", () => {
    expect(validateDateSpec(parseDate("2000-000"))).toBe(false);
    expect(validateDateSpec(parseDate("2000-130"))).toBe(true);
    expect(validateDateSpec(parseDate("2000-999"))).toBe(false);
});

test("Week 53", () => {
    expect(validateDateSpec(parseDate("2000-W53"))).toBe(false);
    expect(validateDateSpec(parseDate("2001-W53"))).toBe(false);
    expect(validateDateSpec(parseDate("2002-W53"))).toBe(false);
    expect(validateDateSpec(parseDate("2003-W53"))).toBe(false);
    expect(validateDateSpec(parseDate("2004-W53"))).toBe(true);
    expect(validateDateSpec(parseDate("2005-W53"))).toBe(false);
    expect(validateDateSpec(parseDate("2006-W53"))).toBe(false);
    expect(validateDateSpec(parseDate("2007-W53"))).toBe(false);
    expect(validateDateSpec(parseDate("2008-W53"))).toBe(false);
    expect(validateDateSpec(parseDate("2009-W53"))).toBe(true);
    expect(validateDateSpec(parseDate("2010-W53"))).toBe(false);
    expect(validateDateSpec(parseDate("2011-W53"))).toBe(false);
    expect(validateDateSpec(parseDate("2012-W53"))).toBe(false);
    expect(validateDateSpec(parseDate("2013-W53"))).toBe(false);
    expect(validateDateSpec(parseDate("2014-W53"))).toBe(false);
    expect(validateDateSpec(parseDate("2015-W53"))).toBe(true);
    expect(validateDateSpec(parseDate("2016-W53"))).toBe(false);
    expect(validateDateSpec(parseDate("2017-W53"))).toBe(false);
    expect(validateDateSpec(parseDate("2018-W53"))).toBe(false);
    expect(validateDateSpec(parseDate("2019-W53"))).toBe(false);
    expect(validateDateSpec(parseDate("2020-W53"))).toBe(true);
    expect(validateDateSpec(parseDate("2021-W53"))).toBe(false);
    expect(validateDateSpec(parseDate("2022-W53"))).toBe(false);
    expect(validateDateSpec(parseDate("2023-W53"))).toBe(false);
    expect(validateDateSpec(parseDate("2024-W53"))).toBe(false);
    expect(validateDateSpec(parseDate("2025-W53"))).toBe(false);
    expect(validateDateSpec(parseDate("2026-W53"))).toBe(true);
    expect(validateDateSpec(parseDate("2027-W53"))).toBe(false);
    expect(validateDateSpec(parseDate("2028-W53"))).toBe(false);
    expect(validateDateSpec(parseDate("2029-W53"))).toBe(false);
    expect(validateDateSpec(parseDate("2030-W53"))).toBe(false);
    expect(validateDateSpec(parseDate("2031-W53"))).toBe(false);
    expect(validateDateSpec(parseDate("2032-W53"))).toBe(true);


    expect(validateDateSpec(parseDate("2000-W531"))).toBe(false);
    expect(validateDateSpec(parseDate("2001-W531"))).toBe(false);
    expect(validateDateSpec(parseDate("2002-W531"))).toBe(false);
    expect(validateDateSpec(parseDate("2003-W531"))).toBe(false);
    expect(validateDateSpec(parseDate("2004-W531"))).toBe(true);
});

describe("Invalid", () => {
    test("Expanded", () => {
        expect(validateDateSpec(parseDate("-0"))).toBe(false);
        expect(validateDateSpec(parseDate("-1"))).toBe(false);
        expect(validateDateSpec(parseDate("-10"))).toBe(false);
        expect(validateDateSpec(parseDate("-100"))).toBe(false);

        expect(validateDateSpec(parseDate("2000-13"))).toBe(false);

        expect(validateDateSpec(parseDate("1001-02-29"))).toBe(false);
        expect(validateDateSpec(parseDate("2000-02-30"))).toBe(false);
        expect(validateDateSpec(parseDate("2000-06-00"))).toBe(false);
        expect(validateDateSpec(parseDate("2000-06-31"))).toBe(false);
        expect(validateDateSpec(parseDate("2000-08-00"))).toBe(false);
        expect(validateDateSpec(parseDate("2000-08-32"))).toBe(false);

        expect(validateDateSpec(parseDate("2000-W00"))).toBe(false);
        expect(validateDateSpec(parseDate("2000-W53"))).toBe(false);
        expect(validateDateSpec(parseDate("2001-W54"))).toBe(false);

        expect(validateDateSpec(parseDate("2000-W00-1"))).toBe(false);
        expect(validateDateSpec(parseDate("2000-W01-0"))).toBe(false);
        expect(validateDateSpec(parseDate("2000-W01-8"))).toBe(false);
        expect(validateDateSpec(parseDate("2000-W01-01"))).toBe(false);
        expect(validateDateSpec(parseDate("2000-W01-10"))).toBe(false);

        expect(validateDateSpec(parseDate("2000-000"))).toBe(false);
        expect(validateDateSpec(parseDate("2000-367"))).toBe(false);
        expect(validateDateSpec(parseDate("2001-366"))).toBe(false);
    });

    test("Condensed", () => {
        expect(validateDateSpec(parseDate("200013"))).toBe(false);

        expect(validateDateSpec(parseDate("10010229"))).toBe(false);
        expect(validateDateSpec(parseDate("20000230"))).toBe(false);
        expect(validateDateSpec(parseDate("20000600"))).toBe(false);
        expect(validateDateSpec(parseDate("20000631"))).toBe(false);
        expect(validateDateSpec(parseDate("20000800"))).toBe(false);
        expect(validateDateSpec(parseDate("20000832"))).toBe(false);

        expect(validateDateSpec(parseDate("2000W00"))).toBe(false);
        expect(validateDateSpec(parseDate("2000W53"))).toBe(false);
        expect(validateDateSpec(parseDate("2001W54"))).toBe(false);

        expect(validateDateSpec(parseDate("2000W010"))).toBe(false);
        expect(validateDateSpec(parseDate("2000W018"))).toBe(false);
        expect(validateDateSpec(parseDate("2000W0101"))).toBe(false);
        expect(validateDateSpec(parseDate("2000W0110"))).toBe(false);

        expect(validateDateSpec(parseDate("2000000"))).toBe(false);
        expect(validateDateSpec(parseDate("2000367"))).toBe(false);
        expect(validateDateSpec(parseDate("2001366"))).toBe(false);
    });
});