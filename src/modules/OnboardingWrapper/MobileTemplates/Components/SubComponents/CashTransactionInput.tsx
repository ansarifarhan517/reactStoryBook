import React from "react";
import { TextInput } from "ui-library";

interface ICashTransactionInputProps {
  negativeCashValue: number;
  setNegativeCashValue: (value: number) => void;
}

const CashTransactionInput = ({
  negativeCashValue,
  setNegativeCashValue,
}: ICashTransactionInputProps) => {
  const negativeValueHandle = (e: any) => {
    const inputNegValue = e.target.value;
    // Validate Negative Cash using a regular expression
    if ((/^\d+(\.\d{0,2})?$/.test(inputNegValue) || inputNegValue === "") && (inputNegValue === "" || parseFloat(inputNegValue) <= 100000)) {
      setNegativeCashValue(inputNegValue);
    }
  };
  return (
    <>
      <div className="col-md-2 col-lg-2">
        <div className="options-wrapper">
          <div className="box-inputNegValue">
            <TextInput
              id="negative_cash_key"
              type="text"
              value={negativeCashValue}
              placeholder="DA Negative Cash"
              onChange={negativeValueHandle}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default CashTransactionInput;
