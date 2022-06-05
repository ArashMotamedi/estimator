import { useState } from 'react';
import { createUseStyles } from 'react-jss';
import './App.css';
import { Calculator } from './Calculator';
import { Capacity } from './Capacity';
import { Link, useParams } from "react-router-dom";
import { Calculators } from './Calculators';

export function App() {
  const { mode } = useParams<{ mode: "capacity" | "calculator" }>();
  const styles = useStyles();
  return <div>
    <div style={{ marginBottom: 20 }}>
      <h1 style={{ marginBottom: 5 }}>System Design Estimator</h1>
      <a href="https://systemestimator.com">systemestimator.com</a> • <a href="https://github.com/arashmotamedi/estimator">github.com/arashmotamedi/estimator</a>
    </div>
    <div className={styles.tabContainer}>
      <Link to="/capacity" style={{ color: "inherit", textDecoration: "none" }}>
        <div className={classNames(styles.tabButton, [styles.active, mode === "capacity"])}>Capacity</div>
      </Link>
      <Link to="/calculator" style={{ color: "inherit", textDecoration: "none" }}>
        <div className={classNames(styles.tabButton, [styles.active, mode === "calculator"])}>Calculator</div>
      </Link>
    </div>
    <div>

      <div style={{ display: mode === "calculator" ? "unset" : "none" }}><Calculators /></div>
      <div style={{ display: mode === "capacity" ? "unset" : "none" }}><Capacity /></div>
    </div>
  </div>
}

const useStyles = createUseStyles({
  tabContainer: {
    display: "flex",
    marginBottom: 10,
  },
  tabButton: {
    padding: 10,
    cursor: "pointer",
    background: "#00000008",
    borderRadius: 3,
    marginRight: 5,
    "&:hover": {
      background: "#0001",
    }
  },
  active: {
    fontWeight: 500,
    background: "#0002",
    "&:hover": {
      background: "#0003",
    }
  }
})

function classNames(...names: (string | [string, boolean])[]) {
  return names.map(name => typeof name === "string" ? name : name[1] ? name[0] : undefined).filter(name => !!name).join(" ");
}