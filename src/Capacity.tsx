import { ChangeEvent, useEffect, useRef, useState } from 'react';

export function Capacity() {
    const [countPerYear, setCountPerYear] = useState(365000000);
    const [readToWriteRatio, setReadToWriteRatio] = useState(100);
    const [sizePerObject, setSizeObject] = useState(1000000);
    const [capacityModelRatio, setCapacityModelRatio] = useState(.7);
    const [objectTtlYears, setObjectTtlYears] = useState(10);
    const [cacheRatio, setCacheRatio] = useState(.2);
    const [cacheTtlDays, setCacheTtlDays] = useState(1);

    function count(timeUnit: ITimeUnitKey) {
        return Math.round(countPerYear / timeUnits[timeUnit]);
    }

    function setCount(timeUnit: ITimeUnitKey) {
        return function (e: ChangeEvent<HTMLInputElement>) {
            e.preventDefault();
            const v = e.target.value;
            if (v === "") setCountPerYear(0);
            if (!Number.isSafeInteger(Number(v)) || Number.isNaN(Number(v))) return;
            setCountPerYear(Math.round(Number(v) * timeUnits[timeUnit]))
        }
    }

    return (
        <div>
            <div style={{ display: "flex" }}>
                <div style={{ marginRight: 20 }}>
                    <table>
                        <tbody>
                            <tr>
                                <td>Object Size</td>
                                <td><Input type="bytes" value={sizePerObject} onChange={e => { e.preventDefault(); Number.isSafeInteger(Number(e.target.value)) && setSizeObject(Number(e.target.value)) }} /></td>
                            </tr>
                            <tr>
                                <td>Storage TTL (years)</td>
                                <td><input value={objectTtlYears} onChange={e => { e.preventDefault(); Number.isSafeInteger(Number(e.target.value)) && setObjectTtlYears(Number(e.target.value)) }} /></td>
                            </tr>
                            <tr>
                                <td>Storage Capacity Model (percent)</td>
                                <td><input value={Math.round(capacityModelRatio * 100)} onChange={e => { e.preventDefault(); Number.isSafeInteger(Number(e.target.value)) && setCapacityModelRatio(Number(e.target.value) / 100) }} /></td>
                            </tr>
                        </tbody>
                    </table>

                </div>
                <div>
                    <table>
                        <tbody>
                            <tr>
                                <td>Read to Write Ratio</td>
                                <td><input value={readToWriteRatio} onChange={e => { e.preventDefault(); Number.isSafeInteger(Number(e.target.value)) && setReadToWriteRatio(Number(e.target.value)) }} /></td>
                            </tr>
                            <tr>
                                <td>Cache Ratio (percent)</td>
                                <td><input value={Math.round(cacheRatio * 100)} onChange={e => { e.preventDefault(); Number.isSafeInteger(Number(e.target.value)) && setCacheRatio(Number(e.target.value) / 100) }} /></td>
                            </tr>
                            <tr>
                                <td>Cache TTL (days)</td>
                                <td><input value={cacheTtlDays} onChange={e => { e.preventDefault(); Number.isSafeInteger(Number(e.target.value)) && setCacheTtlDays(Number(e.target.value)) }} /></td>
                            </tr>
                        </tbody>
                    </table>

                </div>
            </div>
            <table style={{ borderSpacing: 10 }}>
                <thead>
                    <tr>
                        <td></td>
                        <td>Second</td>
                        <td>Minute</td>
                        <td>Hour</td>
                        <td>Day</td>
                        <td>Week</td>
                        <td>Month</td>
                        <td>Year</td>
                        <td>In DB</td>
                        <td>In Cache</td>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Writes</td>
                        <td><Input type="count" value={count("second")} onChange={setCount("second")} /></td>
                        <td><Input type="count" value={count("minute")} onChange={setCount("minute")} /></td>
                        <td><Input type="count" value={count("hour")} onChange={setCount("hour")} /></td>
                        <td><Input type="count" value={count("day")} onChange={setCount("day")} /></td>
                        <td><Input type="count" value={count("week")} onChange={setCount("week")} /></td>
                        <td><Input type="count" value={count("month")} onChange={setCount("month")} /></td>
                        <td><Input type="count" value={count("year")} onChange={setCount("year")} /></td>
                        <td>{easyNumber(count("year") * objectTtlYears)}</td>
                        <td>{easyNumber(count("day") * cacheRatio * cacheTtlDays)}</td>
                    </tr>
                    <tr>
                        <td>Reads</td>
                        <td>{easyNumber(count("second") * readToWriteRatio)}</td>
                        <td>{easyNumber(count("minute") * readToWriteRatio)}</td>
                        <td>{easyNumber(count("hour") * readToWriteRatio)}</td>
                        <td>{easyNumber(count("day") * readToWriteRatio)}</td>
                        <td>{easyNumber(count("week") * readToWriteRatio)}</td>
                        <td>{easyNumber(count("month") * readToWriteRatio)}</td>
                        <td>{easyNumber(count("year") * readToWriteRatio)}</td>
                    </tr>
                    <tr>
                        <td>Upload</td>
                        <td>{easyBytes(count("second") * sizePerObject)}</td>
                        <td>{easyBytes(count("minute") * sizePerObject)}</td>
                        <td>{easyBytes(count("hour") * sizePerObject)}</td>
                        <td>{easyBytes(count("day") * sizePerObject)}</td>
                        <td>{easyBytes(count("week") * sizePerObject)}</td>
                        <td>{easyBytes(count("month") * sizePerObject)}</td>
                        <td>{easyBytes(count("year") * sizePerObject)}</td>
                        <td>{easyBytes(count("year") * sizePerObject * objectTtlYears)}</td>
                        <td>{easyBytes(count("day") * sizePerObject * cacheRatio * cacheTtlDays)}</td>
                    </tr>
                    <tr>
                        <td>Download</td>
                        <td>{easyBytes(count("second") * readToWriteRatio * sizePerObject)}</td>
                        <td>{easyBytes(count("minute") * readToWriteRatio * sizePerObject)}</td>
                        <td>{easyBytes(count("hour") * readToWriteRatio * sizePerObject)}</td>
                        <td>{easyBytes(count("day") * readToWriteRatio * sizePerObject)}</td>
                        <td>{easyBytes(count("week") * readToWriteRatio * sizePerObject)}</td>
                        <td>{easyBytes(count("month") * readToWriteRatio * sizePerObject)}</td>
                        <td>{easyBytes(count("year") * readToWriteRatio * sizePerObject)}</td>
                    </tr>
                </tbody>
            </table>

            <table>
                <tbody>
                    <tr>
                        <td>Total operations per second</td>
                        <td>
                            {easyNumber(count("second") * (readToWriteRatio + 1))}
                        </td>
                    </tr>
                    <tr>
                        <td>Total bandwidth per second</td>
                        <td>
                            {easyBytes(count("second") * (readToWriteRatio + 1) * sizePerObject)}/s
                        </td>
                    </tr>
                    <tr>
                        <td>
                            Total storage to maintain {Math.round(capacityModelRatio * 100)}% capacity
                        </td>
                        <td>
                            {easyBytes(count("year") * sizePerObject * objectTtlYears / capacityModelRatio)}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

function Input(props: { type: "count" | "bytes", value: number, onChange: (e: ChangeEvent<HTMLInputElement>) => void }) {
    const [focused, setFocused] = useState(false);
    const ref = useRef<HTMLInputElement>(null);
    useEffect(() => {
        if (!ref.current) return;
        ref.current.addEventListener("focus", () => setFocused(true));
        ref.current.addEventListener("blur", () => setFocused(false));
    }, []);

    let value: number | string = Math.round(props.value);
    if (!focused) {
        value = props.type === "count" ? easyNumber(value) : easyBytes(value);
    }

    return <input ref={ref} value={value} onChange={props.onChange} />
}

export function easyNumber(value: number) {
    return value >= 1000000000000 ? `${divide(value, 1000000000000)}T` :
        value >= 1000000000 ? `${divide(value, 1000000000)}B` :
            value >= 1000000 ? `${Math.round(value / 1000000)}M` :
                value >= 1000 ? `${Math.round(value / 1000)}K` :
                    Math.round(value);
}

export function easyBytes(value: number) {
    return (
        value >= 1_000_000_000_000_000_000_000 ? `${divide(value, 1_000_000_000_000_000_000_000)}ZB` :
            value >= 1_000_000_000_000_000_000 ? `${divide(value, 1_000_000_000_000_000_000)}EB` :
                value >= 1_000_000_000_000_000 ? `${divide(value, 1_000_000_000_000_000)}PB` :
                    value >= 1_000_000_000_000 ? `${divide(value, 1_000_000_000_000)}TB` :
                        value >= 1_000_000_000 ? `${Math.round(value / 1_000_000_000)}GB` :
                            value >= 1_000_000 ? `${Math.round(value / 1_000_000)}MB` :
                                value >= 1_000 ? `${Math.round(value / 1_000)}KB` :
                                    `${Math.round(value)}B`);
}

function divide(value: number, denominator: number) {
    let result = Math.round(value / denominator);
    if (result < 10)
        result = Math.round(value / denominator * 10) / 10;
    return result
}




export const timeUnits = {
    second: 365 * 24 * 60 * 60,
    minute: 365 * 24 * 60,
    hour: 365 * 24,
    day: 365,
    week: 52,
    month: 12,
    year: 1,
} as const;

export type ITimeUnitKey = keyof typeof timeUnits;

export function convertTimeUnit(value: number, from: ITimeUnitKey, to: ITimeUnitKey) {
    return value * (timeUnits[from] / timeUnits[to])
}