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
let operationHistory = [{}];

buttonsNumber.forEach((numbers) => {
  numbers.addEventListener("click", (event) => {
    if (
      numbers &&
      calculatorState.previousValue !== "" &&
      calculatorState.operator !== ""
    ) {
      calculatorState.currentValue += event.target.innerText;
      display.innerText = calculatorState.currentValue;
    }
    if (numbers && calculatorState.operator === "") {
      calculatorState.previousValue += event.target.innerText;
      display.innerText = calculatorState.previousValue;
    }
    commaValidation(
      calculatorState.previousValue,
      calculatorState.currentValue,
    );

    // if (calculatorState.previousValue && calculatorState.operator !== "") {
    //   display.innerText = calculatorState.currentValue;
    // } else {
    //   display.innerText = calculatorState.previousValue;
    // }
  });
});

buttonsOperator.forEach((operators) => {
  operators.addEventListener("click", (event) => {
    calculatorState.operator = event.target.dataset.operation;

    if (calculatorState.operator) {
      history.innerText +=
        calculatorState.previousValue + calculatorState.operator;
      display.innerText = "";
      console.log(calculatorState.previousValue);
      console.log(calculatorState.currentValue);
      commaValidation(
        calculatorState.previousValue,
        calculatorState.currentValue,
      );
    }
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

  if (calculatorState.operator === "+") {
    display.innerText = sum(
      calculatorState.previousValue,
      calculatorState.currentValue,
    );
  }
  if (calculatorState.operator === "-") {
    display.innerText = subtraction(
      calculatorState.previousValue,
      calculatorState.currentValue,
    );
  }
  if (calculatorState.operator === "/") {
    display.innerText = division(
      calculatorState.previousValue,
      calculatorState.currentValue,
    );
  }
  if (calculatorState.operator === "*") {
    display.innerText = multiply(
      calculatorState.previousValue,
      calculatorState.currentValue,
    );
  }
  if (calculatorState.operator === "%") {
    display.innerText = percetange(
      calculatorState.previousValue,
      calculatorState.currentValue,
    );
  }
  commaValidation(calculatorState.previousValue, calculatorState.currentValue);
});

buttonCancel.addEventListener("click", (event) => {
  display.innerText = "";
  history.innerText = "";
  calculatorState.previousValue = "";
  calculatorState.operator = "";
  calculatorState.currentValue = "";
});

function sum(previousValue, currentValue) {
  return Number(previousValue) + Number(currentValue);
}
function subtraction(previousValue, currentValue) {
  return Number(previousValue) - Number(currentValue);
}
function division(previousValue, currentValue) {
  return Number(previousValue) / Number(currentValue);
}
function multiply(previousValue, currentValue) {
  return Number(previousValue) * Number(currentValue);
}
function percetange(previousValue, currentValue) {
  return (Number(previousValue) * Number(currentValue)) / 100;
}

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
    }
    console.log([commaC, commaP]);
  }
}
