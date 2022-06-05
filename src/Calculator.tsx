import { useEffect, useState } from "react";
import { convertTimeUnit, easyBytes, easyNumber, ITimeUnitKey, timeUnits } from "./Capacity";
import TextareaAutosize from "react-textarea-autosize";
export interface IResult {
    type: "number" | "bytes", value: number
}

const commentsPattern = /[a-z:]+/ig;
export function Calculator(props: {
    results: { title: string, result: IResult | undefined, timeDenominator: ITimeUnitKey | undefined }[]
    close: () => void,
    update: (state: { title: string, result: IResult | undefined, timeDenominator: ITimeUnitKey | undefined }) => void;
}) {
    const { results } = props;
    const [title, setTitle] = useState("");
    const [expression, setExpression] = useState("");
    const [timeDenominator, setTimeDenominator] = useState<ITimeUnitKey>();
    const [result, setResult] = useState<{ type: "number" | "bytes", value: number }>();
    const easy = result?.type === "bytes" ? easyBytes : easyNumber;
    useEffect(() => {
        props.update({ title, timeDenominator, result })
    }, [title, timeDenominator, result]);
    useEffect(() => {
        if (expression === "") {
            setResult(undefined);
            return;
        }

        let expandedExpr = expression.replaceAll(/\s/g, " ");
        let isBytes = false;

        results.forEach(result => {
            expandedExpr = expandedExpr.replaceAll(`{${result.title}}`, `${result.result?.value}`);
        });

        let match: RegExpMatchArray | null = null;
        while (match = expandedExpr.match(/([0-9]+\s*(bytes|kb|mb|gb|tb|pb|k|m|b))($|[^a-z])/i)!) {
            const startIndex = match.index!;
            isBytes = isBytes || ["bytes", "kb", "mb", "gb", "tb", "pb"].some(size => (match![1]).endsWith(size));

            expandedExpr = expandedExpr.substring(0, startIndex) +
                match[1]
                    .replaceAll(" ", "")
                    .replaceAll("\n", " ")
                    .replaceAll("\r", " ")
                    .replaceAll("bytes", " ")
                    .replaceAll("kb", "000")
                    .replaceAll("mb", "000000")
                    .replaceAll("gb", "000000000")
                    .replaceAll("tb", "000000000000")
                    .replaceAll("pb", "000000000000000")
                    .replaceAll("k", "000")
                    .replaceAll("m", "000000")
                    .replaceAll("b", "000000000") +
                match[3] + expandedExpr.substring(startIndex + match[0].length);
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
    }, [expression, results]);

    return <div style={{ width: 350, padding: 10, background: "#00000005", borderRadius: 5, boxShadow: "0 0 25px -5px #0003" }}>
        <div style={{ display: "flex" }}>
            <input style={{ width: "100%" }} placeholder="title" value={title} onChange={e => { e.preventDefault(); setTitle(e.target.value) }} />
            <button style={{ padding: "0px 10px" }} onClick={props.close}>x</button>
        </div>
        <TextareaAutosize
            placeholder="expression"
            style={{ width: "100%", resize: "none" }}
            value={expression}
            onChange={e => { e.preventDefault(); setExpression(e.target.value) }} />
        <div style={{ marginBottom: 10 }}>
            <select style={{ width: "100%" }}
                value={timeDenominator} onChange={e => setTimeDenominator(e.target.value as any)}>
                <option key={"undefined"} value={undefined}></option>
                {Object.keys(timeUnits).map(unit => <option key={unit} value={unit}>per {unit}</option>)}
            </select>
        </div>
        {result?.value !== undefined && !timeDenominator && (<div>
            {easy(result.value)}
        </div>
        )}
        {result?.value !== undefined && timeDenominator && <div style={{ display: "flex", flexWrap: "wrap" }}> {
            Object.keys(timeUnits).map(key => <div key={key} style={{ marginRight: 10 }}>
                {easy(convertTimeUnit(result.value, timeDenominator, key as any))}
                <span style={{ color: "#0006" }}>/{key === "month" ? "mo" : key.substring(0, 1)}</span>
            </div>)
        }
        </div>}
    </div>

}