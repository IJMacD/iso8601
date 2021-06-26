import { parseTime } from "../parseTime";
import { validateTimeSpec } from "../validateTimeSpec";

test("Invalid", () => {
    expect(validateTimeSpec(parseTime("0"))).toBe(false);
    expect(validateTimeSpec(parseTime("1"))).toBe(false);

    expect(validateTimeSpec(parseTime("24"))).toBe(false);
    expect(validateTimeSpec(parseTime("30"))).toBe(false);

    expect(validateTimeSpec(parseTime("000"))).toBe(false);
    expect(validateTimeSpec(parseTime("001"))).toBe(false);

    expect(validateTimeSpec(parseTime("24:30"))).toBe(false);
    expect(validateTimeSpec(parseTime("30:30"))).toBe(false);
    expect(validateTimeSpec(parseTime("00:60"))).toBe(false);
    expect(validateTimeSpec(parseTime("23:60"))).toBe(false);

    expect(validateTimeSpec(parseTime("00:30:61"))).toBe(false);
    expect(validateTimeSpec(parseTime("00:30:61"))).toBe(false);
    expect(validateTimeSpec(parseTime("23:30:61"))).toBe(false);
    expect(validateTimeSpec(parseTime("23:30:61"))).toBe(false);
    expect(validateTimeSpec(parseTime("00:60:10"))).toBe(false);
    expect(validateTimeSpec(parseTime("00:60:10"))).toBe(false);
    expect(validateTimeSpec(parseTime("23:60:10"))).toBe(false);
    expect(validateTimeSpec(parseTime("23:60:10"))).toBe(false);

    expect(validateTimeSpec(parseTime("00+000"))).toBe(false);
    expect(validateTimeSpec(parseTime("00Z+00"))).toBe(false);
    expect(validateTimeSpec(parseTime("00+00Z"))).toBe(false);

    expect(validateTimeSpec(parseTime("23.3:10.3"))).toBe(false);
    expect(validateTimeSpec(parseTime("23:10.3:10.3"))).toBe(false);
});