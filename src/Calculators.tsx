import { useEffect, useState } from "react";
import { createUseStyles } from "react-jss"
import { Calculator, IResult } from "./Calculator";
import { ITimeUnitKey } from "./Capacity";
import { produce } from "immer";

export function Calculators() {
    const styles = useStyles();
    const [calculators, setCalculators] = useState([Date.now()]);
    const [results, setResults] = useState<Record<number, { title: string; result: IResult | undefined, timeDenominator: ITimeUnitKey | undefined }>>({});

    return <div className={styles.container}>
        {calculators.map((id, i) => <Calculator
            key={id}
            close={() => {
                setResults(produce(results, r => { delete r[id] }))
                if (calculators.length === 1) setCalculators([Date.now()]);
                else setCalculators([...calculators.slice(0, i), ...calculators.slice(i + 1)])
            }}
            update={state => {
                if (JSON.stringify(results[id]) !== JSON.stringify(state))
                    setResults(produce(results, r => {
                        r[id] = state;
                    }))
            }}
            results={Object.values(results)}
        />)}
        <div>
            <button onClick={() => {
                setCalculators([...calculators, Date.now()])
            }}>+</button>
        </div>
    </div>
}

const useStyles = createUseStyles({
    container: {
        display: "flex",
        flexWrap: "wrap",
        gap: 10,
    },

})