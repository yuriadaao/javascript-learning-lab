const display = document.querySelector(".calculator__display-current");
const history = document.querySelector(".calculator__display-history");
const buttonCancel = document.querySelector(".calculator__button--cancel");
const buttonEqual = document.querySelector(".calculator__button--equal");
const buttonComma = document.querySelector(".calculator__button--comma");
const buttonsNumber = document.querySelectorAll(".calculator__button--number");
const buttonsOperator = document.querySelectorAll(
  ".calculator__button--operator",
);

let calculatorState = { previousValue: "", operator: "", currentValue: "" }; // State (responsability operation)

let operationHistory = [];

buttonsNumber.forEach((numbers) => {
  numbers.addEventListener("click", (event) => {
    if (numbers && calculatorState.operator !== "") {
      calculatorState.currentValue += event.target.innerText;
      display.innerText = calculatorState.currentValue;
    }

    if (numbers && calculatorState.operator === "") {
      calculatorState.previousValue += event.target.innerText;
      display.innerText = calculatorState.previousValue;
    }

    console.log(calculatorState);
    commaValidation(
      calculatorState.previousValue,
      calculatorState.currentValue,
    );
  });
});

buttonsOperator.forEach((operators) => {
  operators.addEventListener("click", (event) => {
    calculatorState.operator += event.target.dataset.operation;

    if (operators) {
      operatorValidation();
    }
    commaValidation(
      calculatorState.previousValue,
      calculatorState.currentValue,
    );
    console.log(calculatorState);
    console.log(calculatorState.operator.length);
  });
});

buttonComma.addEventListener("click", (event) => {
  if (buttonComma && calculatorState.operator !== "") {
    calculatorState.currentValue += event.target.dataset.operation;
    display.innerText = calculatorState.currentValue;
    commaValidation(
      calculatorState.previousValue,
      calculatorState.currentValue,
    );
  }
  if (buttonComma && calculatorState.operator === "") {
    calculatorState.previousValue += event.target.dataset.operation;
    display.innerText = calculatorState.previousValue;
    commaValidation(
      calculatorState.previousValue,
      calculatorState.currentValue,
    );
  }
});

buttonEqual.addEventListener("click", (event) => {
  history.innerText =
    calculatorState.previousValue +
    calculatorState.operator +
    calculatorState.currentValue;
  display.innerText = result(
    calculatorState.previousValue,
    calculatorState.currentValue,
    calculatorState.operator,
  );
  calculatorState.previousValue = result(
    calculatorState.previousValue,
    calculatorState.currentValue,
    calculatorState.operator,
  );

  commaValidation(calculatorState.previousValue, calculatorState.currentValue);
});

buttonCancel.addEventListener("click", (event) => {
  display.innerText = "";
  history.innerText = "";
  if (
    calculatorState.previousValue !== "" ||
    calculatorState.previousValue !== "" ||
    calculatorState.previousValue !== ""
  ) {
    resetState();
  } else {
    operationHistory = [];
  }
});

let result = (previousValue, currentValue, operator) => {
  if (operator === "+") {
    return Number(previousValue) + Number(currentValue);
  } else if (operator === "-") {
    return Number(previousValue) - Number(currentValue);
  } else if (operator === "/") {
    return Number(previousValue) / Number(currentValue);
  } else if (operator === "*") {
    return Number(previousValue) * Number(currentValue);
  } else if (operator === "%") {
    return (Number(previousValue) * Number(currentValue)) / 100;
  }
};

function commaValidation(previousValue, currentValue) {
  let commaP = 0;
  let commaC = 0;

  for (let i = 0; i <= previousValue.length; i++) {
    if (previousValue[i] === ".") {
      commaP += 1;
    }
    if (commaP > 1) {
      previousValue = "";
      display.innerText = "err.";
      history.innerText = "";
    }
  }
  for (let i = 0; i <= currentValue.length; i++) {
    if (currentValue[i] === ".") {
      commaC += 1;
    }
    if (commaC > 1) {
      currentValue = "";
      display.innerText = "err.";
      history.innerText = "";
      resetState();
    }
  }
}
function operatorValidation() {
  if (calculatorState.operator.length == 2) {
    calculatorState.operator = calculatorState.operator[1];
    calculatorState.currentValue = "";
    display.innerText =
      calculatorState.previousValue + calculatorState.operator;
  }
  if (calculatorState.operator.length > 2) {
    display.innerText = "err.";
    history.innerText = "";
    resetState();
  } else if (
    calculatorState.operator !== "" &&
    calculatorState.operator[1] === "-"
  ) {
    display.innerText = calculatorState.currentValue = "-";
    calculatorState.operator = calculatorState.operator[0];
  } else if (
    calculatorState.operator === "-" &&
    calculatorState.previousValue === ""
  ) {
    display.innerText = calculatorState.previousValue = "-";
    calculatorState.operator = "";
  } else if (
    calculatorState.previousValue !== "" &&
    calculatorState.previousValue !== "-"
  ) {
    display.innerText = "";
    history.innerText =
      calculatorState.previousValue + calculatorState.operator;
  }
}
// function historyOperation(previousValue, currentValue, operator) {
//   operationHistory += operationHistory.push(previousValue);
//   operationHistory += operationHistory.push(operator);
//   operationHistory += operationHistory.push(currentValue);

//   return operationHistory;
// }
function resetState() {
  calculatorState.previousValue = "";
  calculatorState.currentValue = "";
  calculatorState.operator = "";
}
