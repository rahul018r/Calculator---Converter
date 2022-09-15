import React from "react";

import { ACTIONS } from "../App";

const DigitButton = ({ dispatch, operation, className }) => {
  return (
    <button
      className={className}
      onClick={() =>
        dispatch({ type: ACTIONS.CHOOSE_OPERATION, payload: { operation } })
      }
    >
      {operation}
    </button>
  );
};
export default DigitButton;
