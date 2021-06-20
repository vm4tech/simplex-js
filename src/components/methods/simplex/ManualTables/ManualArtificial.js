import React, { useRef } from "react";
import "../../simplex.css";
import { otherSteps } from "../artifcialBasis/manualArtificial";
var Fraction = require("fraction.js");

function censor(key, value) {
  if (typeof value == "string") {
    return undefined;
  }
  return value;
}
export default function ManualTables(props) {
  let r = [];
  let table = [];
  let restr = [];
  let simplex = [];
  let artificial = [];
  let simHistory = props.simplexTable;
  const artLastStep = useRef(0);
  let artHistory = props.artificialBasisTable;
  let mainColor = "green";
  let helpColor = "yellow";
  //   const prevTh = useRef(null);
  //   const prevColor = useRef(null);
  const prevTh = useRef(null);
  const prevColor = useRef(null);
  const arrSelected = useRef([]);
  function changeColor(event, param) {
    console.log("event", event);
    param.select = event.target.cloneNode(true);
    //   color: event.target.style.backgroundColor,

    if (prevTh.current != undefined)
      prevTh.current.target.style.backgroundColor = prevColor.current;
    prevColor.current = event.target.style.backgroundColor;
    prevTh.current = event;
    event.target.style.backgroundColor = "blue";
  }

  //   console.log("simtable", simParam.simplexTable);
  function parseSimplexTable() {
    simHistory.map((simParam) => {
      let simplexTable = simParam.simplexTable;
      let { colMin, rowMin } = simParam.pivot;
      let simStep = simParam.step;
      let simMaybe = simParam.maybe;
      let simCountVariables = simplexTable[0].length;
      let simCountRestrictions = simplexTable.length;
      let simAllParams = simParam.allParams;
      let count = 0;
      r = [];
      table = [];
      restr = [];

      restr.push(
        <th style={{ width: "40px" }}>
          x<sup>({simStep})</sup>
        </th>
      );
      simAllParams[1].map((el) => restr.push(<th>{el.param}</th>));
      restr.push(<th>b</th>);
      table.push(<tr style={{ textAlign: "center" }}>{restr}</tr>);
      for (let i = 0; i < simCountRestrictions; i++) {
        for (let j = 0; j < simCountVariables; j++) {
          if (j === 0) {
            if (i !== simCountRestrictions - 1)
              r.push(
                <td>
                  <b>{simAllParams[0][count].param}</b>
                </td>
              );
            else
              r.push(
                <td>
                  <b>p</b>
                </td>
              );
            count++;
          }
          if (
            i === rowMin &&
            j === colMin &&
            simStep !== simCountRestrictions - 1
          ) {
            r.push(
              <td
                onClick={(e) => {
                  changeColor(e, simParam);
                  nextArtificial(
                    simplexTable,
                    i,
                    j,
                    simplexTable[i][j],
                    simParam,
                    false
                  );
                }}
                style={{ backgroundColor: mainColor }}
              >
                {simplexTable[i][j]}
                {/* {new Fraction(simplexTable[i][j]).toFraction()} */}
              </td>
            );
          } else {
            let flag = 0;
            if (simMaybe !== undefined)
              simMaybe.map((e) =>
                e.row === i && e.column === j
                  ? (r.push(
                      <td
                        onClick={(e) => {
                          changeColor(e, simParam);
                          nextArtificial(
                            simplexTable,
                            i,
                            j,
                            simplexTable[i][j],
                            simParam,
                            false
                          );
                        }}
                        style={{ backgroundColor: helpColor }}
                      >
                        {simplexTable[i][j]}
                        {/* {new Fraction(simplexTable[i][j]).toFraction()} */}
                      </td>
                    ),
                    flag++)
                  : null
              );
            if (!flag) {
              r.push(<td>{simplexTable[i][j]}</td>);
            }
            // r.push(<td>{new Fraction(simplexTable[i][j]).toFraction()}</td>);
          }
        }
        table.push(<tr>{[...r]}</tr>);
        // TODO: Фикс блять этой хуйни (повторное нажатие на решение)
        r = [];
        if (simParam.select !== undefined)
          simParam.select.style.backgroundColor = "blue";
      }

      count = 0;
      simplex.push(
        <>
          <br />
          <table>{table}</table>
        </>
      );
      return;
    });
  }

  function parseArtificialTable() {
    artHistory.map((artParam) => {
      let artificialTable = artParam.artificialTable;
      let { colMin, rowMin } = artParam.pivot;
      let artMaybe = artParam.maybe;
      let artStep = artParam.step;
      let artCountVariables = artificialTable[0].length;
      let artCountRestrictions = artificialTable.length;
      let artAllParams = artParam.allParams;
      let count = 0;
      r = [];
      table = [];
      restr = [];
      restr.push(
        <th style={{ width: "40px" }}>
          x<sup>({artStep})</sup>
        </th>
      );
      artAllParams[1].map((el) => restr.push(<th>{el.param}</th>));
      restr.push(<th>b</th>);
      table.push(<tr style={{ textAlign: "center" }}>{restr}</tr>);
      for (let i = 0; i < artCountRestrictions; i++) {
        for (let j = 0; j < artCountVariables; j++) {
          if (j === 0) {
            if (i !== artCountRestrictions - 1)
              r.push(
                <td>
                  <b>{artAllParams[0][count].param}</b>
                </td>
              );
            else
              r.push(
                <td>
                  <b>p</b>
                </td>
              );
            count++;
          }

          if (
            i === rowMin &&
            j === colMin &&
            artStep !== artCountRestrictions - 1
          ) {
            r.push(
              <td
                onClick={(e) => {
                  changeColor(e, artParam);
                  nextArtificial(
                    artificialTable,
                    i,
                    j,
                    artificialTable[i][j],
                    artParam,
                    true
                  );
                }}
                style={{ backgroundColor: mainColor }}
              >
                {artificialTable[i][j]}
                {/* {new Fraction(simplexTable[i][j]).toFraction()} */}
              </td>
            );
          } else {
            let flag = 0;
            artMaybe.map((e) =>
              e.row === i && e.column === j
                ? (r.push(
                    <td
                      onClick={(e) => {
                        changeColor(e, artParam);
                        nextArtificial(
                          artificialTable,
                          i,
                          j,
                          artificialTable[i][j],
                          artParam,
                          true
                        );
                      }}
                      style={{ backgroundColor: helpColor }}
                    >
                      {artificialTable[i][j]}
                      {/* {new Fraction(simplexTable[i][j]).toFraction()} */}
                    </td>
                  ),
                  flag++)
                : null
            );
            if (!flag) {
              r.push(<td>{artificialTable[i][j]}</td>);
            }
            // r.push(<td>{new Fraction(simplexTable[i][j]).toFraction()}</td>);
          }
        }
        table.push(<tr>{[...r]}</tr>);
        // TODO: Фикс блять этой хуйни (повторное нажатие на решение)
        r = [];
        if (artParam.select !== undefined)
          artParam.select.style.backgroundColor = "blue";
      }

      count = 0;
      artificial.push(
        <>
          <br />
          <table>{table}</table>
        </>
      );
      return;
    });
  }

  function nextArtificial(
    table,
    pivotRow,
    pivotCol,
    pivotValue,
    param,
    artORsim
  ) {
    if (artORsim) {
      artHistory.splice(param.step + 1);
      simHistory = [];
      artLastStep.current = param.step + 1;
    }

    let all = otherSteps(
      JSON.parse(JSON.stringify(table)),
      { pivotRow, pivotCol, pivotValue },
      JSON.parse(JSON.stringify(param)),
      artHistory,
      simHistory,
      artORsim ? param.step + 1 : artLastStep.current,
      artORsim ? 0 : param.step + 1
    );

    props.setAnotherTable([...all]);
  }

  parseArtificialTable();
  if (simHistory !== undefined) parseSimplexTable();
  return (
    <div>
      Искусственный базис
      {artificial.map((table) => (
        <>{table}</>
      ))}
      <br />
      Симплекс метод
      {simplex.map((table) => (
        <>{table}</>
      ))}
    </div>
  );
}
