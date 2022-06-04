import { useEffect, useRef, useState } from "react";
import { convertTimeUnit, easyBytes, easyNumber, ITimeUnitKey, timeUnits } from "./Capacity";

const commentsPattern = /[a-z]+/g;
export function Calculator() {
    const sizer = useRef<HTMLDivElement>(null);
    const [expression, setExpression] = useState("");
    const [timeDenominator, setTimeDenominator] = useState<ITimeUnitKey>();
    const [result, setResult] = useState<{ type: "number" | "bytes", value: number }>();
    const easy = result?.type === "bytes" ? easyBytes : easyNumber;
    useEffect(() => {
        if (expression === "") {
            setResult(undefined);
            return;
        }

        let expandedExpr = expression.replaceAll(/\s/g, " ");
        let isBytes = false;

        let match: RegExpMatchArray | null = null;
        while (match = expandedExpr.match(/([0-9]+\s*(kb|mb|gb|tb|pb|k|m|b))($|[^a-z])/)!) {
            const startIndex = match.index!;
            isBytes = isBytes || ["kb", "mb", "gb", "tb", "pb"].some(size => (match![1]).endsWith(size));
            console.log({ startIndex, match: match[1] })

            expandedExpr = expandedExpr.substring(0, startIndex) +
                match[1]
                    .replaceAll(" ", "")
                    .replaceAll("\n", " ")
                    .replaceAll("\r", " ")
                    .replaceAll("kb", "000")
                    .replaceAll("mb", "000000")
                    .replaceAll("gb", "000000000")
                    .replaceAll("tb", "000000000000")
                    .replaceAll("pb", "000000000000000")
                    .replaceAll("k", "000")
                    .replaceAll("m", "000000")
                    .replaceAll("b", "000000000") +
                match[3] + expandedExpr.substring(startIndex + match[0].length);

            console.log(expandedExpr)
        }

        expandedExpr = expandedExpr
            .replaceAll(commentsPattern, " ");

        try {

            const value = eval(expandedExpr);
            setResult({
                type: isBytes ? "bytes" : "number", value
            });
        }
        catch (e) {
            setResult(undefined);
        }
    }, [expression]);

    return <div>
        <div ref={sizer} style={{ overflow: "hidden", width: 400, position: "absolute", visibility: "hidden", pointerEvents: "none" }}><pre>{expression.split("\n").map(line => line === "" ? " " : line).join("\n") || <> </>}</pre></div>
        <textarea style={{ width: 400, height: (sizer.current?.clientHeight ?? 0) + 20 }} value={expression} onChange={e => { e.preventDefault(); setExpression(e.target.value) }} />
        <div style={{marginBottom: 10}}>
            <select style={{ width: 150 }} value={timeDenominator} onChange={e => setTimeDenominator(e.target.value as any)}>
                <option value={undefined} />
                {Object.keys(timeUnits).map(unit => <option key={unit} value={unit}>per {unit}</option>)}
            </select>
        </div>
        {result && !timeDenominator && (<div>
            {easy(result.value)}
        </div>
        )}
        {result && timeDenominator && <> {
            Object.keys(timeUnits).map(key => <div key={key}>
                {easy(convertTimeUnit(result.value, timeDenominator, key as any))} per {key}
            </div>)
        }
        </>}
    </div>

}