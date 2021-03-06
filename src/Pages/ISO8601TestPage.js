import { useEffect, useState } from "react";
import * as ISO8601 from "../ISO8601";

export default function ISO8601TestPage () {
    const [ inputValue, setInputValue ] = useState(getHashValue);
    const [ showExamples, setShowExamples ] = useState(false);
    const testValues = ["2", "20", "202", "2021", "2021-01", "2021-01-18", "2021-01-18T15", "2021-01-18T15:30", "2021-01-18T15:30:00", "2021-W03", "2021-W03-1", "2021-018", "20210623", "2021174", "2021W25", "2021W253", "2021-018T15", "2021-018T15.5", "2021-018T15:30","2021-018T15:30.5", "2021-018T15:30:00", "2021-018T15:30:00.5", "2021051T10−05", "2021051T10+09", "20210510T14Z", "20210510TZ", "2021-018/P1M", "2021-018/P1DT1M", "R5/2021-018/P1W", "R3/2012-10-01T14:12:01/10T16:19:35", "R2/2012-10-01T14:12/12-10T16:19", "R2/2012-10-01T14:12:01/12-10T16:19" ];

    useEffect(() => {
        const title = `ISO8601 - ${inputValue}`;
        window.history.replaceState(null, title, `#${inputValue}`);
        document.title = title;
    }, [inputValue]);

    useEffect(() => {
        function cb () {
            setInputValue(getHashValue());
        }

        window.addEventListener("hashchange", cb);

        return () => window.removeEventListener("hashchange", cb);
    }, []);

    let convertedInput, error;

    if (inputValue) {
        convertedInput = ISO8601.parse(inputValue);
        if (!convertedInput) {
            error = "Invalid Input: " + inputValue;
        }
    }

    const exampleHeaderClass = showExamples ?
        "CollapsibleHeader CollapsibleHeader--expanded" :
        "CollapsibleHeader";

    return (
        <div style={{padding: "2em", display: "flex", flexDirection: "column" }}>
            <input value={inputValue} onChange={e => setInputValue(e.target.value)} style={{margin:4,fontSize:"1.5em"}} placeholder="Input" />
            { error && <p style={{color:"red"}}>{error}</p> }
            { convertedInput && <DateTimePreview value={convertedInput} label={`Input: ${inputValue}`} /> }
            <h2 onClick={() => setShowExamples(!showExamples)} className={exampleHeaderClass}>
                <span>Examples</span>
                <ArrowIndicator invert={showExamples} style={{ width: 16 }} />
            </h2>
            {
                showExamples && testValues.map((v, i) => <DateTimePreview value={ISO8601.parse(v)} label={`Input: ${v}`} key={i} />)
            }
        </div>
    )
}

function getHashValue() {
    if (window.location.hash.length > 1) {
        return decodeURIComponent(window.location.hash.substr(1));
    }
    return "";
}

/**
 * @param {object} props
 * @param {import("../ISO8601").DateTime|import("../ISO8601").DateTimeInterval} props.value
 * @param {string} [props.label]
 * @returns
 */
function DateTimePreview ({ value, label = "" }) {
    const [ showCode, setShowCode ] = useState(false);

    // JUST FOR TESTING
    if (!value) {
        return <div style={{color:"red"}}>STILL TESTING</div>;
    }

    const pStyle = { margin: 0 };
    const labelStyle = { ...pStyle, fontFamily: "monospace", color: "#333" };
    const hintStyle = {color:"#666",fontSize:"0.8em"};
    const boxStyle = { margin: 4, padding: 8, border: "1px solid #333", cursor: "pointer" };

    const type = value instanceof ISO8601.DateTime ? "DateTime" : "DateTimeInterval";

    let repetitions = [];

    if (value instanceof ISO8601.DateTimeInterval) {
        try {
            repetitions = getRepetitions(value, 100);
        } catch (e) {
            // JUST FOR TESTING
            return <div style={{color:"red"}}>STILL TESTING</div>;
        }
    }

    if (!ISO8601.isValidDate(value.start) || !ISO8601.isValidDate(value.end)) {
        return <code style={{color:"darkred"}}>Javascript Date error {JSON.stringify(value)}</code>;
    }

    return (
        <div style={boxStyle} onClick={() => setShowCode(!showCode)}>
            { label && <p style={labelStyle}>{label}</p> }
            <p style={pStyle}>
                <time dateTime={toISOString(value.start)}>{dateFormat(value.start)}</time>
                <span style={hintStyle}> ≤ {type} &lt; </span>
                <time dateTime={toISOString(value.end)}>{dateFormat(value.end)}</time>
            </p>
            {
                repetitions.map((d,i) =>
                    <p style={pStyle} key={i}>
                        <time dateTime={toISOString(d.start)}>{dateFormat(d.start)}</time>
                        <span style={hintStyle}> ≤ {type} &lt; </span>
                        <time dateTime={toISOString(d.end)}>{dateFormat(d.end)}</time>
                        {' '}<span style={hintStyle}>({getOrdinal(i + 1)} Repetition)</span>
                    </p>
                )
            }
            { value instanceof ISO8601.DateTimeInterval && repetitions.length < value.repetitions &&
                <p style={{...pStyle, ...hintStyle}}>&hellip; {value.repetitions - repetitions.length} more not shown</p>
            }
            { showCode && <code>{JSON.stringify(value)}</code> }
        </div>
    );
}

/**
 * @param {ISO8601.DateTimeInterval} value
 */
function getRepetitions(value, maxRepetitions = 10) {
    if (value.repetitions === Infinity) {
        return generatorToArray(ISO8601.getIntervalInstances(value), maxRepetitions + 1).slice(1);
    }

    return [ ...ISO8601.getIntervalInstances(value) ].slice(1, 1 + maxRepetitions);
}

function getOrdinal (n) {
    if (n === 11 || n === 12 || n === 13) return `${n}th`;
    if (n % 10 === 1) return `${n}st`;
    if (n % 10 === 2) return `${n}nd`;
    if (n % 10 === 3) return `${n}rd`;
    return `${n}th`;
}

/**
 * @template T
 * @param {Generator<T, void, unknown>} generator
 * @param {number} maxLength
 * @returns {T[]}
 */
function generatorToArray (generator, maxLength) {
    const list = [];
    let i = 0;

    while (i++ < maxLength) {
        const result = generator.next();

        if (!result.done && typeof result.value !== "undefined") {
            list.push(result.value);
        } else {
            break;
        }
    }

    return list;
}

/**
 * Intl.DateTimeFormat is so finicky about negative years and super positive years.
 * @param {Date} date
 */
 function dateFormat (date) {
    if (!ISO8601.isValidDate(date)) {
        return <code style={{color:"darkred"}}>Javascript Date error</code>;
    }

    if (date.getFullYear() < 0)
        return toISOString(date);

    try {
        const formatter = new Intl.DateTimeFormat([], { dateStyle: "long", timeStyle: "long" });
        return formatter.format(date);
    } catch (e) {
        return toISOString(date);
    }
}

/**
 * Date.prototype.toISOString also doesn't like really large dates
 * @param {Date} date
 */
function toISOString (date) {
    if (!ISO8601.isValidDate(date)) {
        return null;
    }

    try {
        return date.toISOString();
    } catch (e) {
        return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
    }
}

function ArrowIndicator ({ invert, style }) {
    const d = invert ?
        "M 0 7 L 5 2 L 10 7 Z" :
        "M 0 2 L 5 7 L 10 2 Z";

    return <svg viewBox="0 0 10 10" style={style}>
        <path d={d} />
    </svg>
}