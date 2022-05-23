import { ChangeEvent, useEffect, useRef, useState } from 'react';
import './App.css';

export function App() {
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
      <div style={{marginBottom: 20}}>
        <h1 style={{ marginBottom: 5 }}>System Design Estimator</h1>
        <a href="https://github.com/arashmotamedi/estimator">https://github.com/arashmotamedi/estimator</a>
      </div>
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
            <td><Input type="count" value={count("seconds")} onChange={setCount("seconds")} /></td>
            <td><Input type="count" value={count("minutes")} onChange={setCount("minutes")} /></td>
            <td><Input type="count" value={count("hours")} onChange={setCount("hours")} /></td>
            <td><Input type="count" value={count("days")} onChange={setCount("days")} /></td>
            <td><Input type="count" value={count("weeks")} onChange={setCount("weeks")} /></td>
            <td><Input type="count" value={count("months")} onChange={setCount("months")} /></td>
            <td><Input type="count" value={count("years")} onChange={setCount("years")} /></td>
            <td>{easyNumber(count("years") * objectTtlYears)}</td>
            <td>{easyNumber(count("days") * cacheRatio * cacheTtlDays)}</td>
          </tr>
          <tr>
            <td>Reads</td>
            <td>{easyNumber(count("seconds") * readToWriteRatio)}</td>
            <td>{easyNumber(count("minutes") * readToWriteRatio)}</td>
            <td>{easyNumber(count("hours") * readToWriteRatio)}</td>
            <td>{easyNumber(count("days") * readToWriteRatio)}</td>
            <td>{easyNumber(count("weeks") * readToWriteRatio)}</td>
            <td>{easyNumber(count("months") * readToWriteRatio)}</td>
            <td>{easyNumber(count("years") * readToWriteRatio)}</td>
          </tr>
          <tr>
            <td>Upload</td>
            <td>{easyBytes(count("seconds") * sizePerObject)}</td>
            <td>{easyBytes(count("minutes") * sizePerObject)}</td>
            <td>{easyBytes(count("hours") * sizePerObject)}</td>
            <td>{easyBytes(count("days") * sizePerObject)}</td>
            <td>{easyBytes(count("weeks") * sizePerObject)}</td>
            <td>{easyBytes(count("months") * sizePerObject)}</td>
            <td>{easyBytes(count("years") * sizePerObject)}</td>
            <td>{easyBytes(count("years") * sizePerObject * objectTtlYears)}</td>
            <td>{easyBytes(count("days") * sizePerObject * cacheRatio * cacheTtlDays)}</td>
          </tr>
          <tr>
            <td>Download</td>
            <td>{easyBytes(count("seconds") * readToWriteRatio * sizePerObject)}</td>
            <td>{easyBytes(count("minutes") * readToWriteRatio * sizePerObject)}</td>
            <td>{easyBytes(count("hours") * readToWriteRatio * sizePerObject)}</td>
            <td>{easyBytes(count("days") * readToWriteRatio * sizePerObject)}</td>
            <td>{easyBytes(count("weeks") * readToWriteRatio * sizePerObject)}</td>
            <td>{easyBytes(count("months") * readToWriteRatio * sizePerObject)}</td>
            <td>{easyBytes(count("years") * readToWriteRatio * sizePerObject)}</td>
          </tr>
        </tbody>
      </table>

      <table>
        <tbody>
          <tr>
            <td>Total operations per second</td>
            <td>
              {easyNumber(count("seconds") * (readToWriteRatio + 1))}
            </td>
          </tr>
          <tr>
            <td>Total bandwidth per second</td>
            <td>
              {easyBytes(count("seconds") * (readToWriteRatio + 1) * sizePerObject)}/s
            </td>
          </tr>
          <tr>
            <td>
              Total storage to maintain {Math.round(capacityModelRatio * 100)}% capacity
            </td>
            <td>
              {easyBytes(count("years") * sizePerObject * objectTtlYears / capacityModelRatio)}
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

function easyNumber(value: number) {
  return value >= 1000000000000 ? `${divide(value, 1000000000000)}T` :
    value >= 1000000000 ? `${divide(value, 1000000000)}B` :
      value >= 1000000 ? `${Math.round(value / 1000000)}M` :
        value >= 1000 ? `${Math.round(value / 1000)}K` :
          value;
}

function easyBytes(value: number) {
  return value >= 1_000_000_000_000_000 ? `${divide(value, 1_000_000_000_000_000)}PB` :
    value >= 1_000_000_000_000 ? `${divide(value, 1_000_000_000_000)}TB` :
      value >= 1_000_000_000 ? `${Math.round(value / 1_000_000_000)}GB` :
        value >= 1_000_000 ? `${Math.round(value / 1_000_000)}MB` :
          value >= 1_000 ? `${Math.round(value / 1_000)}KB` :
            `${value}B`;
}

function divide(value: number, denominator: number) {
  let result = Math.round(value / denominator);
  if (result < 10)
    result = Math.round(value / denominator * 10) / 10;
  return result
}


const timeUnits = {
  seconds: 365 * 24 * 60 * 60,
  minutes: 365 * 24 * 60,
  hours: 365 * 24,
  days: 365,
  weeks: 52,
  months: 12,
  years: 1,
} as const;

type ITimeUnitKey = keyof typeof timeUnits;

