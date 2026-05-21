const display = document.querySelector('.calculator__display-current');
const history = document.querySelector('.calculator__display-history');
const buttonCancel = document.querySelector("#calculator__button--cancel")
const buttonEqual = document.querySelector("#calculator__button--equal")
const buttonsNumber = document.querySelectorAll('.calculator__button--number');
const buttonsOperator = document.querySelectorAll('.calculator__button--operator');
let calculatorState = { previousValue : "" , operator: "" , currentValue : "" }; 



buttonsNumber.forEach((numbers) => {
  numbers.addEventListener("click", (event) => {
    if(calculatorState.previousValue !== "" && calculatorState.operator){
    calculatorState.currentValue += event.target.textContent;
    }else {
      calculatorState.previousValue += event.target.textContent;
    }

    if(calculatorState.previousValue && calculatorState.operator !== ""){
      display.innerText = calculatorState.currentValue;
      
    }else {
      display.innerText = calculatorState.previousValue;
    }
 
  }
  )

})

buttonsOperator.forEach((operators) => {
  operators.addEventListener("click", (event) => {
    calculatorState.operator = event.target.dataset.operation;
    
    if(calculatorState.operator) {
      history.innerText += calculatorState.previousValue + calculatorState.operator ;
      display.innerText = ""
      console.log(calculatorState.previousValue);
      console.log(calculatorState.currentValue);
    }
  }
)
})

buttonEqual.addEventListener("click", (event)=>{
  history.innerText = calculatorState.previousValue 
   + calculatorState.operator
   + calculatorState.currentValue;
  
  if (calculatorState.operator === "+"){
     display.innerText = sum(calculatorState.previousValue, calculatorState.currentValue);        
  }
  if (calculatorState.operator === "-"){
     display.innerText = subtraction(calculatorState.previousValue, calculatorState.currentValue);        
  }
  if (calculatorState.operator === "/"){
     display.innerText = division(calculatorState.previousValue, calculatorState.currentValue);        
  }
  if (calculatorState.operator === "*"){
     display.innerText = multiply(calculatorState.previousValue, calculatorState.currentValue);        
  }
  if (calculatorState.operator === "%"){
     display.innerText = percetange(calculatorState.previousValue, calculatorState.currentValue);        
  }
  
})

buttonCancel.addEventListener("click",(event)=>{
  display.innerText = "";
  history.innerText = "";
  calculatorState.previousValue ="";
  calculatorState.operator ="";
  calculatorState.currentValue="";
})



function sum(previousValue, currentValue){
   return Number(previousValue) + Number(currentValue);
}
function subtraction(previousValue, currentValue){
   return Number(previousValue) - Number(currentValue);
}
function division(previousValue, currentValue){
   return Number(previousValue) / Number(currentValue);
}
function multiply(previousValue, currentValue){
   return Number(previousValue) * Number(currentValue);
}
function percetange(previousValue, currentValue){
   return ((Number(previousValue) * Number(currentValue))/100);
}
