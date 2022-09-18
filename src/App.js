import { useReducer } from "react";
import "./App.css";

import DigitButton from "./components/DigitButton";
import OperationButton from "./components/OperationButton";

export const ACTIONS = {
  ADD_DIGIT: "add-digit",
  DELETE_DIGIT: "delete-digit",
  CHOOSE_OPERATION: "choose-operation",
  EVALUATE: "evaluate",
  CLEAR: "clear",
};

const reducer = (state, { type, payload }) => {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if (state.overWrite) {
        return { ...state, currentOperand: payload.digit, overWrite: false };
      }
      if (payload.digit === "0" && state.currentOperand === "0") return state;
      if (payload.digit === "." && state.currentOperand.includes("."))
        return state;
      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`,
      };

    case ACTIONS.CHOOSE_OPERATION:
      if (state.currentOperand == null && state.previousOperand == null)
        return state;
      if (state.currentOperand == null) {
        return {
          ...state,
          operation: payload.operation,
        };
      }
      if (state.previousOperand == null) {
        return {
          ...state,
          operation: payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null,
        };
      }
      return {
        ...state,
        previousOperand: evaluate(state),
        operation: payload.operation,
        currentOperand: null,
      };

    case ACTIONS.CLEAR:
      console.log("clear");
      return {};

    case ACTIONS.DELETE_DIGIT:
      if (state.overWrite) {
        return {
          ...state,
          currentOperand: null,
          overWrite: false,
        };
      }
      if (state.currentOperand == null) return state;
      if (state.currentOperand.length === 1) {
        return { ...state, currentOperand: null };
      }

      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1),
      };
    case ACTIONS.EVALUATE:
      if (
        state.operation == null ||
        state.currentOperand == null ||
        state.previousOperand == null
      ) {
        return state;
      }

      return {
        ...state,
        previousOperand: null,
        operation: null,
        currentOperand: null,
        evaluatedResult: evaluate(state),
        overWrite: true,
      };
    default:
      break;
  }
};

const evaluate = ({ currentOperand, previousOperand, operation }) => {
  const prev = parseFloat(previousOperand);
  const curr = parseFloat(currentOperand);
  if (isNaN(prev) || isNaN(curr)) return "";

  let computation = "";
  switch (operation) {
    case "+":
      computation = prev + curr;
      break;
    case "-":
      computation = prev - curr;
      break;
    case "*":
      computation = prev * curr;
      break;
    case "/":
      computation = prev / curr;
      break;

    default:
      break;
  }

  return computation.toString();
};

const FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
});

const formatOperand = (operand) => {
  if (operand == null) return;
  const [int, dec] = operand.split(".");
  if (dec == null) return FORMATTER.format(int);

  return `${FORMATTER.format(int)}.${dec}`;
};
const formatResult = (operand) => {
  if (operand == null) return;
  const [int, dec] = operand.split(".");
  if (dec == null) return FORMATTER.format(int);

  FORMATTER.format(int);
  let result = int + "0." + dec;
  result = Number(result).toFixed(5);
  result.toString();
  return result;
};

function App() {
  const [
    { currentOperand, evaluatedResult, previousOperand, operation },
    dispatch,
  ] = useReducer(reducer, {});

  return (
    <div className="container grid justify-center mt-12">
      <div className="output flex flex-col items-end justify-around">
        <div className="previous-operand text-white">
          {formatOperand(previousOperand)} {operation}
        </div>
        <div className="current-operand text-white text-4xl">
          {formatOperand(currentOperand) || formatResult(evaluatedResult)}
        </div>
      </div>
      <div
        className="AC btn  m-[1px] col-span-2 flex justify-center items-center"
        onClick={() => dispatch({ type: ACTIONS.CLEAR })}
      >
        AC
      </div>
      <div
        className="DEL btn  m-[1px] flex justify-center items-center"
        onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}
      >
        DEL
      </div>
      <OperationButton className="btn" operation="/" dispatch={dispatch} />
      <DigitButton className="btn" digit="1" dispatch={dispatch} />
      <DigitButton className="btn" digit="2" dispatch={dispatch} />
      <DigitButton className="btn" digit="3" dispatch={dispatch} />

      <OperationButton className="btn" operation="*" dispatch={dispatch} />

      <DigitButton className="btn" digit="4" dispatch={dispatch} />
      <DigitButton className="btn" digit="5" dispatch={dispatch} />
      <DigitButton className="btn" digit="6" dispatch={dispatch} />

      <OperationButton className="btn" operation="+" dispatch={dispatch} />

      <DigitButton className="btn" digit="7" dispatch={dispatch} />
      <DigitButton className="btn" digit="8" dispatch={dispatch} />
      <DigitButton className="btn" digit="9" dispatch={dispatch} />

      <OperationButton className="btn" operation="-" dispatch={dispatch} />

      <DigitButton className="btn" digit="." dispatch={dispatch} />
      <DigitButton className="btn" digit="0" dispatch={dispatch} />

      <button
        className="btn col-span-2"
        onClick={() => dispatch({ type: ACTIONS.EVALUATE })}
      >
        =
      </button>
    </div>
  );
}

export default App;
