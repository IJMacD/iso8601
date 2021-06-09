import { useState } from "react";
import * as ISO8601 from "../ISO8601";
import { DateTimeIntervalSpec, DateTimeSpec, getIntervalInstances } from "../ISO8601";

export default function ISO8601TestPage () {
    const [ inputValue, setInputValue ] = useState("");
    const testValues = ["2", "20", "202", "2021", "2021-01", "2021-01-18", "2021-01-18T15", "2021-01-18T15:30", "2021-01-18T15:30:00", "2021-W03", "2021-018", "2021-018T15", "2021-018T15:30", "2021-018T15:30:00", "2021-018T15:30:00.5"];

    let convertedInput, error;

    if (inputValue) {
        try {
            convertedInput = ISO8601.parse(inputValue);
        } catch (e) {
            error = e.message;
        }
    }

    return (
        <div style={{padding: "2em", display: "flex", flexDirection: "column" }}>
            <input value={inputValue} onChange={e => setInputValue(e.target.value)} style={{margin:4,fontSize:"1.5em"}} placeholder="Input" />
            { error && <p style={{color:"red"}}>{error}</p> }
            { convertedInput && <DateTimePreview value={convertedInput} label={inputValue} /> }
            <h2>Test Values</h2>
            {
                testValues.map(v => <DateTimePreview value={ISO8601.parse(v)} label={v} />)
            }
        </div>
    )
}

/**
 * @param {object} props
 * @param {import("../ISO8601").DateTimeSpec|import("../ISO8601").DateTimeIntervalSpec} props.value
 * @param {string} [props.label]
 * @returns
 */
function DateTimePreview ({ value, label = "" }) {
    const [ showCode, setShowCode ] = useState(false);
    const dateFormatter = new Intl.DateTimeFormat([], { dateStyle: "long", timeStyle: "long" });
    const pStyle = { margin: 0 };
    const labelStyle = { ...pStyle, fontFamily: "monospace", color: "#333" };
    const hintStyle = {color:"#666",fontSize:"0.8em"};
    const boxStyle = { margin: 4, padding: 8, border: "1px solid #333", cursor: "pointer" };

    const type = value instanceof DateTimeSpec ? "DateTime" : "DateTimeInterval";

    const repetitions = value instanceof DateTimeIntervalSpec ? getRepetitions(value, 100) : [];

    return (
        <div style={boxStyle} onClick={() => setShowCode(!showCode)}>
            { label && <p style={labelStyle}>Input: {label}</p> }
            <p style={pStyle}>
                <time dateTime={value.start.toISOString()}>{dateFormatter.format(value.start)}</time>
                <span style={hintStyle}> ≤ {type} &lt; </span>
                <time dateTime={value.end.toISOString()}>{dateFormatter.format(value.end)}</time>
            </p>
            {
                repetitions.map((d,i) =>
                    <p style={pStyle} key={i}>
                        {getOrdinal(i + 1)} Repetition: <time dateTime={d.toISOString()}>{dateFormatter.format(d)}</time>
                    </p>
                )
            }
            { showCode && <code>{JSON.stringify(value)}</code> }
        </div>
    );
}

/**
 * @param {ISO8601.DateTimeIntervalSpec} value
 */
function getRepetitions(value, maxRepetitions = 10) {
    if (value.repetitions === Infinity) {
        return generatorToArray(getIntervalInstances(value), maxRepetitions + 2).slice(2);
    }

    return [ ...ISO8601.getIntervalInstances(value) ].slice(2, 2 + maxRepetitions);
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