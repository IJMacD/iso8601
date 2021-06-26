import { parseDate } from "../parseDate";

describe("Reduced Precision", () => {
    test("Millennium", () => {
        expect(parseDate("0")).toStrictEqual({millennium: 0});
        expect(parseDate("1")).toStrictEqual({millennium: 1});
        expect(parseDate("2")).toStrictEqual({millennium: 2});
        expect(parseDate("3")).toStrictEqual({millennium: 3});
    });

    test("Century", () => {
        expect(parseDate("00")).toStrictEqual({century: 0});
        expect(parseDate("01")).toStrictEqual({century: 1});
        expect(parseDate("20")).toStrictEqual({century: 20});
        expect(parseDate("35")).toStrictEqual({century: 35});
    });

    test("Decade", () => {
        expect(parseDate("000")).toStrictEqual({decade: 0});
        expect(parseDate("001")).toStrictEqual({decade: 1});
        expect(parseDate("020")).toStrictEqual({decade: 20});
        expect(parseDate("300")).toStrictEqual({decade: 300});
    });
});

describe("Expanded", () => {
    test("Year", () => {
        expect(parseDate("0000")).toStrictEqual({year: 0});
        expect(parseDate("0001")).toStrictEqual({year: 1});
        expect(parseDate("0200")).toStrictEqual({year: 200});
        expect(parseDate("3000")).toStrictEqual({year: 3000});
    });

    test("Year-Month", () => {
        expect(parseDate("2000-01")).toStrictEqual({year: 2000, month: 1});
        expect(parseDate("2000-02")).toStrictEqual({year: 2000, month: 2});
        expect(parseDate("2000-08")).toStrictEqual({year: 2000, month: 8});
        expect(parseDate("2000-12")).toStrictEqual({year: 2000, month: 12});
    });

    test("Year-Month-Day", () => {
        expect(parseDate("2000-01-01")).toStrictEqual({year: 2000, month: 1,    day: 1});
        expect(parseDate("2000-02-01")).toStrictEqual({year: 2000, month: 2,    day: 1});
        expect(parseDate("2000-06-01")).toStrictEqual({year: 2000, month: 6,    day: 1});
        expect(parseDate("2000-08-01")).toStrictEqual({year: 2000, month: 8,    day: 1});
        expect(parseDate("2000-12-01")).toStrictEqual({year: 2000, month: 12,   day: 1});

        expect(parseDate("2000-01-31")).toStrictEqual({year: 2000, month: 1,    day: 31});
        expect(parseDate("2000-02-29")).toStrictEqual({year: 2000, month: 2,    day: 29});
        expect(parseDate("2000-06-30")).toStrictEqual({year: 2000, month: 6,    day: 30});
        expect(parseDate("2000-08-31")).toStrictEqual({year: 2000, month: 8,    day: 31});
        expect(parseDate("2000-12-31")).toStrictEqual({year: 2000, month: 12,   day: 31});
    });

    test("Year-Week", () => {
        expect(parseDate("2000-W01")).toStrictEqual({year: 2000, week: 1});
        expect(parseDate("2000-W02")).toStrictEqual({year: 2000, week: 2});
        expect(parseDate("2000-W06")).toStrictEqual({year: 2000, week: 6});
        expect(parseDate("2000-W08")).toStrictEqual({year: 2000, week: 8});
        expect(parseDate("2000-W52")).toStrictEqual({year: 2000, week: 52});
        expect(parseDate("2004-W53")).toStrictEqual({year: 2004, week: 53});
    });

    test("Year-Week-WeekDay", () => {
        expect(parseDate("2000-W01-1")).toStrictEqual({year: 2000, week: 1,     weekDay: 1});
        expect(parseDate("2000-W02-1")).toStrictEqual({year: 2000, week: 2,     weekDay: 1});
        expect(parseDate("2000-W06-7")).toStrictEqual({year: 2000, week: 6,     weekDay: 7});
        expect(parseDate("2000-W08-7")).toStrictEqual({year: 2000, week: 8,     weekDay: 7});
        expect(parseDate("2000-W52-1")).toStrictEqual({year: 2000, week: 52,    weekDay: 1});
        expect(parseDate("2004-W53-1")).toStrictEqual({year: 2004, week: 53,    weekDay: 1});
    });

    test("Year-YearDay", () => {
        expect(parseDate("2000-001")).toStrictEqual({year: 2000, yearDay: 1});
        expect(parseDate("2000-002")).toStrictEqual({year: 2000, yearDay: 2});
        expect(parseDate("2000-006")).toStrictEqual({year: 2000, yearDay: 6});
        expect(parseDate("2000-052")).toStrictEqual({year: 2000, yearDay: 52});
        expect(parseDate("2000-053")).toStrictEqual({year: 2000, yearDay: 53});
        expect(parseDate("2000-108")).toStrictEqual({year: 2000, yearDay: 108});
        expect(parseDate("2000-366")).toStrictEqual({year: 2000, yearDay: 366});
        expect(parseDate("2001-365")).toStrictEqual({year: 2001, yearDay: 365});
    });
});

describe("Compressed", () => {

    test("YearMonthDay", () => {
        expect(parseDate("20000101")).toStrictEqual({year: 2000, month: 1,    day: 1});
        expect(parseDate("20000201")).toStrictEqual({year: 2000, month: 2,    day: 1});
        expect(parseDate("20000601")).toStrictEqual({year: 2000, month: 6,    day: 1});
        expect(parseDate("20000801")).toStrictEqual({year: 2000, month: 8,    day: 1});
        expect(parseDate("20001201")).toStrictEqual({year: 2000, month: 12,   day: 1});

        expect(parseDate("20000131")).toStrictEqual({year: 2000, month: 1,    day: 31});
        expect(parseDate("20000229")).toStrictEqual({year: 2000, month: 2,    day: 29});
        expect(parseDate("20000630")).toStrictEqual({year: 2000, month: 6,    day: 30});
        expect(parseDate("20000831")).toStrictEqual({year: 2000, month: 8,    day: 31});
        expect(parseDate("20001231")).toStrictEqual({year: 2000, month: 12,   day: 31});
    });

    test("YearWeek", () => {
        expect(parseDate("2000W01")).toStrictEqual({year: 2000, week: 1});
        expect(parseDate("2000W02")).toStrictEqual({year: 2000, week: 2});
        expect(parseDate("2000W06")).toStrictEqual({year: 2000, week: 6});
        expect(parseDate("2000W08")).toStrictEqual({year: 2000, week: 8});
        expect(parseDate("2000W52")).toStrictEqual({year: 2000, week: 52});
        expect(parseDate("2004W53")).toStrictEqual({year: 2004, week: 53});
    });

    test("YearWeekWeekDay", () => {
        expect(parseDate("2000W011")).toStrictEqual({year: 2000, week: 1,     weekDay: 1});
        expect(parseDate("2000W021")).toStrictEqual({year: 2000, week: 2,     weekDay: 1});
        expect(parseDate("2000W067")).toStrictEqual({year: 2000, week: 6,     weekDay: 7});
        expect(parseDate("2000W087")).toStrictEqual({year: 2000, week: 8,     weekDay: 7});
        expect(parseDate("2000W521")).toStrictEqual({year: 2000, week: 52,    weekDay: 1});
        expect(parseDate("2004W531")).toStrictEqual({year: 2004, week: 53,    weekDay: 1});
    });

    test("YearYearDay", () => {
        expect(parseDate("2000001")).toStrictEqual({year: 2000, yearDay: 1});
        expect(parseDate("2000002")).toStrictEqual({year: 2000, yearDay: 2});
        expect(parseDate("2000006")).toStrictEqual({year: 2000, yearDay: 6});
        expect(parseDate("2000052")).toStrictEqual({year: 2000, yearDay: 52});
        expect(parseDate("2000053")).toStrictEqual({year: 2000, yearDay: 53});
        expect(parseDate("2000108")).toStrictEqual({year: 2000, yearDay: 108});
        expect(parseDate("2000366")).toStrictEqual({year: 2000, yearDay: 366});
        expect(parseDate("2001365")).toStrictEqual({year: 2001, yearDay: 365});
    });
});

describe("+- Year", () => {
    test("Year", () => {
        expect(parseDate("+0200")).toStrictEqual({  year: 200   });
        expect(parseDate("-0200")).toStrictEqual({  year: -200  });
        expect(parseDate("+02000")).toStrictEqual({ year: 2000  });
        expect(parseDate("-02000")).toStrictEqual({ year: -2000 });
        expect(parseDate("+20000")).toStrictEqual({ year: 20000 });
        expect(parseDate("-20000")).toStrictEqual({ year: -20000});
    });

    test("Year-Month", () => {
        expect(parseDate("+2000-01")).toStrictEqual({year: 2000,    month: 1});
        expect(parseDate("-2000-08")).toStrictEqual({year: -2000,   month: 8});
    });

    test("Year-Month-Day", () => {
        expect(parseDate("+2000-01-01")).toStrictEqual({    year: 2000,     month: 1,    day: 1});
        expect(parseDate("-2000-02-01")).toStrictEqual({    year: -2000,    month: 2,    day: 1});
        expect(parseDate("+20000-06-01")).toStrictEqual({   year: 20000,    month: 6,    day: 1});
        expect(parseDate("-20000-08-01")).toStrictEqual({   year: -20000,   month: 8,    day: 1});
    });

    test("Year-Week", () => {
        expect(parseDate("+2000-W01")).toStrictEqual({  year: 2000,     week: 1 });
        expect(parseDate("-2000-W02")).toStrictEqual({  year: -2000,    week: 2 });
        expect(parseDate("+20000-W06")).toStrictEqual({ year: 20000,    week: 6 });
        expect(parseDate("-20000-W08")).toStrictEqual({ year: -20000,   week: 8 });
    });

    test("Year-Week-WeekDay", () => {
        expect(parseDate("+2000-W01-1")).toStrictEqual({    year: 2000,     week: 1,     weekDay: 1});
        expect(parseDate("-2000-W02-1")).toStrictEqual({    year: -2000,    week: 2,     weekDay: 1});
        expect(parseDate("+20000-W06-7")).toStrictEqual({   year: 20000,    week: 6,     weekDay: 7});
        expect(parseDate("-20000-W08-7")).toStrictEqual({   year: -20000,   week: 8,     weekDay: 7});
    });

    test("Year-YearDay", () => {
        expect(parseDate("+2000-001")).toStrictEqual({  year: 2000,     yearDay: 1});
        expect(parseDate("-2000-002")).toStrictEqual({  year: -2000,    yearDay: 2});
        expect(parseDate("+20000-006")).toStrictEqual({ year: 20000,    yearDay: 6});
        expect(parseDate("-20000-052")).toStrictEqual({ year: -20000,   yearDay: 52});
    });
});

test("Week 53", () => {
    expect(parseDate("2000-W53")).toBeNull();
    expect(parseDate("2001-W53")).toBeNull();
    expect(parseDate("2002-W53")).toBeNull();
    expect(parseDate("2003-W53")).toBeNull();
    expect(parseDate("2004-W53")).toStrictEqual({ year: 2004, week: 53 });  // 2004-12-27 Leap Year
    expect(parseDate("2005-W53")).toBeNull();
    expect(parseDate("2006-W53")).toBeNull();
    expect(parseDate("2007-W53")).toBeNull();
    expect(parseDate("2008-W53")).toBeNull();
    expect(parseDate("2009-W53")).toStrictEqual({ year: 2009, week: 53 });  // 2009-12-28
    expect(parseDate("2010-W53")).toBeNull();
    expect(parseDate("2011-W53")).toBeNull();
    expect(parseDate("2012-W53")).toBeNull();
    expect(parseDate("2013-W53")).toBeNull();
    expect(parseDate("2014-W53")).toBeNull();
    expect(parseDate("2015-W53")).toStrictEqual({ year: 2015, week: 53 });  // 2015-12-28
    expect(parseDate("2016-W53")).toBeNull();
    expect(parseDate("2017-W53")).toBeNull();
    expect(parseDate("2018-W53")).toBeNull();
    expect(parseDate("2019-W53")).toBeNull();
    expect(parseDate("2020-W53")).toStrictEqual({ year: 2020, week: 53 });  // 2020-12-28 Leap Year
    expect(parseDate("2021-W53")).toBeNull();
    expect(parseDate("2022-W53")).toBeNull();
    expect(parseDate("2023-W53")).toBeNull();
    expect(parseDate("2024-W53")).toBeNull();
    expect(parseDate("2025-W53")).toBeNull();
    expect(parseDate("2026-W53")).toStrictEqual({ year: 2026, week: 53 });  // 2026-12-28
    expect(parseDate("2027-W53")).toBeNull();
    expect(parseDate("2028-W53")).toBeNull();
    expect(parseDate("2029-W53")).toBeNull();
    expect(parseDate("2030-W53")).toBeNull();
    expect(parseDate("2031-W53")).toBeNull();
    expect(parseDate("2032-W53")).toStrictEqual({ year: 2032, week: 53 });  // 2026-12-27 Leap Year


    expect(parseDate("2000-W531")).toBeNull();
    expect(parseDate("2001-W531")).toBeNull();
    expect(parseDate("2002-W531")).toBeNull();
    expect(parseDate("2003-W531")).toBeNull();
    expect(parseDate("2004-W531")).toStrictEqual({ year: 2004, week: 53, weekDay: 1 });
});

describe("Invalid", () => {
    test("Expanded", () => {
        expect(parseDate("-0")).toBeNull();
        expect(parseDate("-1")).toBeNull();
        expect(parseDate("-10")).toBeNull();
        expect(parseDate("-100")).toBeNull();

        expect(parseDate("2000-13")).toBeNull();

        expect(parseDate("1001-02-29")).toBeNull();
        expect(parseDate("2000-02-30")).toBeNull();
        expect(parseDate("2000-06-00")).toBeNull();
        expect(parseDate("2000-06-31")).toBeNull();
        expect(parseDate("2000-08-00")).toBeNull();
        expect(parseDate("2000-08-32")).toBeNull();

        expect(parseDate("2000-W00")).toBeNull();
        expect(parseDate("2000-W53")).toBeNull();
        expect(parseDate("2001-W54")).toBeNull();

        expect(parseDate("2000-W00-1")).toBeNull();
        expect(parseDate("2000-W01-0")).toBeNull();
        expect(parseDate("2000-W01-8")).toBeNull();
        expect(parseDate("2000-W01-01")).toBeNull();
        expect(parseDate("2000-W01-10")).toBeNull();

        expect(parseDate("2000-000")).toBeNull();
        expect(parseDate("2000-367")).toBeNull();
        expect(parseDate("2001-366")).toBeNull();
    });

    test("Condensed", () => {
        expect(parseDate("200013")).toBeNull();

        expect(parseDate("10010229")).toBeNull();
        expect(parseDate("20000230")).toBeNull();
        expect(parseDate("20000600")).toBeNull();
        expect(parseDate("20000631")).toBeNull();
        expect(parseDate("20000800")).toBeNull();
        expect(parseDate("20000832")).toBeNull();

        expect(parseDate("2000W00")).toBeNull();
        expect(parseDate("2000W53")).toBeNull();
        expect(parseDate("2001W54")).toBeNull();

        expect(parseDate("2000W010")).toBeNull();
        expect(parseDate("2000W018")).toBeNull();
        expect(parseDate("2000W0101")).toBeNull();
        expect(parseDate("2000W0110")).toBeNull();

        expect(parseDate("2000000")).toBeNull();
        expect(parseDate("2000367")).toBeNull();
        expect(parseDate("2001366")).toBeNull();
    });
});