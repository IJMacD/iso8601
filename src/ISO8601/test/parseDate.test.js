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
