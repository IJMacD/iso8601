import { parseTime } from "../parseTime"

describe("Expanded", () => {
    test("Hour", () => {
        expect(parseTime("00")).toStrictEqual({hour:  0});
        expect(parseTime("01")).toStrictEqual({hour:  1});
        expect(parseTime("10")).toStrictEqual({hour: 10});
        expect(parseTime("20")).toStrictEqual({hour: 20});
        expect(parseTime("23")).toStrictEqual({hour: 23});
    });

    test("Hour:Minute", () => {
        expect(parseTime("00:00")).toStrictEqual({hour:  0, minute: 0});
        expect(parseTime("01:01")).toStrictEqual({hour:  1, minute: 1});
        expect(parseTime("10:30")).toStrictEqual({hour: 10, minute: 30});
        expect(parseTime("20:59")).toStrictEqual({hour: 20, minute: 59});
        expect(parseTime("23:34")).toStrictEqual({hour: 23, minute: 34});
    });

    test("Hour:Minute:Second", () => {
        expect(parseTime("00:00:00")).toStrictEqual({hour:  0, minute: 0,   second: 0});
        expect(parseTime("01:01:01")).toStrictEqual({hour:  1, minute: 1,   second: 1});
        expect(parseTime("10:30:57")).toStrictEqual({hour: 10, minute: 30,  second: 57});
        expect(parseTime("20:59:59")).toStrictEqual({hour: 20, minute: 59,  second: 59});
        expect(parseTime("23:34:00")).toStrictEqual({hour: 23, minute: 34,  second: 0});
    });
});

describe("Compressed", () => {
    test("HourMinute", () => {
        expect(parseTime("0000")).toStrictEqual({hour:  0, minute: 0});
        expect(parseTime("0101")).toStrictEqual({hour:  1, minute: 1});
        expect(parseTime("1030")).toStrictEqual({hour: 10, minute: 30});
        expect(parseTime("2059")).toStrictEqual({hour: 20, minute: 59});
        expect(parseTime("2334")).toStrictEqual({hour: 23, minute: 34});
    });

    test("HourMinuteSecond", () => {
        expect(parseTime("000000")).toStrictEqual({hour:  0, minute: 0,   second: 0});
        expect(parseTime("010101")).toStrictEqual({hour:  1, minute: 1,   second: 1});
        expect(parseTime("103057")).toStrictEqual({hour: 10, minute: 30,  second: 57});
        expect(parseTime("205959")).toStrictEqual({hour: 20, minute: 59,  second: 59});
        expect(parseTime("233400")).toStrictEqual({hour: 23, minute: 34,  second: 0});
    });
});

describe("Time Zone", () => {
    describe("Expanded", () => {
        test("Z", () => {
            expect(parseTime("00Z")).toStrictEqual({hour:  0,   zoneHour: 0, zoneMinute: 0 });
            expect(parseTime("01Z")).toStrictEqual({hour:  1,   zoneHour: 0, zoneMinute: 0 });
            expect(parseTime("00:00Z")).toStrictEqual({hour:  0, minute: 0, zoneHour: 0, zoneMinute: 0 });
            expect(parseTime("01:01Z")).toStrictEqual({hour:  1, minute: 1, zoneHour: 0, zoneMinute: 0 });
            expect(parseTime("00:00:00Z")).toStrictEqual({hour:  0, minute: 0,   second: 0, zoneHour: 0, zoneMinute: 0 });
            expect(parseTime("01:01:01Z")).toStrictEqual({hour:  1, minute: 1,   second: 1, zoneHour: 0, zoneMinute: 0 });
        });

        test("ZoneHour",() => {
            expect(parseTime("01+00")).toStrictEqual({hour:  1,   zoneHour: 0 });
            expect(parseTime("01+01")).toStrictEqual({hour:  1,   zoneHour: 1 });
            expect(parseTime("01+20")).toStrictEqual({hour:  1,   zoneHour: 20 });
            expect(parseTime("01-01")).toStrictEqual({hour:  1,   zoneHour: -1 });
            expect(parseTime("01-20")).toStrictEqual({hour:  1,   zoneHour: -20 });
            // U+2212 MINUS SIGN
            expect(parseTime("01−01")).toStrictEqual({hour:  1,   zoneHour: -1 });
            expect(parseTime("01−20")).toStrictEqual({hour:  1,   zoneHour: -20 });
        });

        test("ZoneHour:ZoneMinute", () => {
            expect(parseTime("01+00:00")).toStrictEqual({hour:  1,   zoneHour: 0, zoneMinute: 0 });
            expect(parseTime("01+01:05")).toStrictEqual({hour:  1,   zoneHour: 1, zoneMinute: 5 });
            expect(parseTime("01+20:15")).toStrictEqual({hour:  1,   zoneHour: 20, zoneMinute: 15 });
            expect(parseTime("01-01:30")).toStrictEqual({hour:  1,   zoneHour: -1, zoneMinute: 30 });
            expect(parseTime("01-20:45")).toStrictEqual({hour:  1,   zoneHour: -20, zoneMinute: 45 });
            // U+2212 MINUS SIGN
            expect(parseTime("01−01:30")).toStrictEqual({hour:  1,   zoneHour: -1, zoneMinute: 30 });
            expect(parseTime("01−20:45")).toStrictEqual({hour:  1,   zoneHour: -20, zoneMinute: 45 });
        });

    });

    describe("Compressed", () => {
        test("ZoneHourZoneMinute", () => {
            expect(parseTime("01+0000")).toStrictEqual({hour:  1,   zoneHour: 0, zoneMinute: 0 });
            expect(parseTime("01+0105")).toStrictEqual({hour:  1,   zoneHour: 1, zoneMinute: 5 });
            expect(parseTime("01+2015")).toStrictEqual({hour:  1,   zoneHour: 20, zoneMinute: 15 });
            expect(parseTime("01-0130")).toStrictEqual({hour:  1,   zoneHour: -1, zoneMinute: 30 });
            expect(parseTime("01-2045")).toStrictEqual({hour:  1,   zoneHour: -20, zoneMinute: 45 });
            // U+2212 MINUS SIGN
            expect(parseTime("01−0130")).toStrictEqual({hour:  1,   zoneHour: -1, zoneMinute: 30 });
            expect(parseTime("01−2045")).toStrictEqual({hour:  1,   zoneHour: -20, zoneMinute: 45 });
        });
    });
});

describe("Fractional", () => {
    describe("Expanded Fractional", () => {
        test("Hour", () => {
            expect(parseTime("00.3")).toStrictEqual({hour:  0.3});
            expect(parseTime("01.3")).toStrictEqual({hour:  1.3});
            expect(parseTime("10.3")).toStrictEqual({hour: 10.3});
            expect(parseTime("20.3")).toStrictEqual({hour: 20.3});
            expect(parseTime("23.3")).toStrictEqual({hour: 23.3});
            // Allow comma
            expect(parseTime("20,3")).toStrictEqual({hour: 20.3});
            expect(parseTime("23,3")).toStrictEqual({hour: 23.3});
        });

        test("Hour:Minute", () => {
            expect(parseTime("00:00.3")).toStrictEqual({hour:  0, minute: 0.3});
            expect(parseTime("01:01.3")).toStrictEqual({hour:  1, minute: 1.3});
            expect(parseTime("10:30.3")).toStrictEqual({hour: 10, minute: 30.3});
            expect(parseTime("20:59.3")).toStrictEqual({hour: 20, minute: 59.3});
            expect(parseTime("23:34.3")).toStrictEqual({hour: 23, minute: 34.3});
            // Allow comma
            expect(parseTime("20:59,3")).toStrictEqual({hour: 20, minute: 59.3});
            expect(parseTime("23:34,3")).toStrictEqual({hour: 23, minute: 34.3});
        });

        test("Hour:Minute:Second", () => {
            expect(parseTime("00:00:00.3")).toStrictEqual({hour:  0, minute: 0,   second: 0.3});
            expect(parseTime("01:01:01.3")).toStrictEqual({hour:  1, minute: 1,   second: 1.3});
            expect(parseTime("10:30:57.3")).toStrictEqual({hour: 10, minute: 30,  second: 57.3});
            expect(parseTime("20:59:59.3")).toStrictEqual({hour: 20, minute: 59,  second: 59.3});
            expect(parseTime("23:34:00.3")).toStrictEqual({hour: 23, minute: 34,  second: 0.3});
            // Allow Comma
            expect(parseTime("20:59:59,3")).toStrictEqual({hour: 20, minute: 59,  second: 59.3});
            expect(parseTime("23:34:00,3")).toStrictEqual({hour: 23, minute: 34,  second: 0.3});
        });
    });

    describe("Compressed Fractional", () => {
        test("Hour:Minute", () => {
            expect(parseTime("0000.3")).toStrictEqual({hour:  0, minute: 0.3});
            expect(parseTime("0101.3")).toStrictEqual({hour:  1, minute: 1.3});
            expect(parseTime("1030.3")).toStrictEqual({hour: 10, minute: 30.3});
            expect(parseTime("2059.3")).toStrictEqual({hour: 20, minute: 59.3});
            expect(parseTime("2334.3")).toStrictEqual({hour: 23, minute: 34.3});
        });

        test("Hour:Minute:Second", () => {
            expect(parseTime("000000.3")).toStrictEqual({hour:  0, minute: 0,   second: 0.3});
            expect(parseTime("010101.3")).toStrictEqual({hour:  1, minute: 1,   second: 1.3});
            expect(parseTime("103057.3")).toStrictEqual({hour: 10, minute: 30,  second: 57.3});
            expect(parseTime("205959.3")).toStrictEqual({hour: 20, minute: 59,  second: 59.3});
            expect(parseTime("233400.3")).toStrictEqual({hour: 23, minute: 34,  second: 0.3});
        });
    });
});
