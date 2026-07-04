const readline = require("readline");
const fs = require("fs");
const data = fs.readFileSync("database.json", "utf8");

let users = JSON.parse(data);
let currentUser = null;
let currentPage = null;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function captureInput() {
  rl.question("", (answer) => {
    switch (answer) {
      case "0":
        exitInput();
        break;
      case "1":
        logout();
        break;
      case "2":
        showLogin();
        break;
      case "3":
        showSignin();
        break;
      case "4":
        showMyProfile();
        break;
      case "5":
        showCreateOfter();
        break;
      case "6":
        showSignin();
        break;
      case "E":
        editProfile();
        break;
      case "D":
        deleteUser(currentUser, users);
        break;
      case "L":
        logout();
        break;
      default:
        console.log(`Invalid command.
        0 - Exit.`);
        exitInput();
        break;
    }
  });
}
//                     FLOW'S PAGE
function showHome() {
  currentPage = "HOME";
  console.log(`

    __________________________________________
    ******************************************
    *                                        * 
    *              - UMS-CLI -               *
    *                                        *
    ******************************************
    ¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨ 
                                             `);
  console.log(`
    Select do you need trought the numbers :

     2 - Login
     3 - Sign in\n\n\n\n\n\n
     0 - Exit`);

  captureInput();
}

function showLogin() {
  currentPage = "LOGIN";
  console.log(`

   __________________________________________
   ******************************************
   *                                        * 
   *            - LOGIN SCREEN -            *
   *                                        *
   ******************************************
   ========================================== 
                                            `);

  console.log(`
    

     1 - Home
     3 - Sign in\n\n\n\n\n\n
     0 - Exit`);

  login(users);
}
function showSignin() {
  currentPage = "SIGNIN";
  console.log(`

   __________________________________________
   ******************************************
   *                                        * 
   *           - SIGN IN SCREEN -           *
   *                                        *
   ******************************************
   ========================================== 
                                             `);
  console.log(`
  
   Follow the steps to Sign in:

    `);

  createUser();
}

function showDashBoard() {
  currentPage = "DASHBOARD";
  console.log(`

     __________________________________________
     ******************************************
     *                                        * 
     *          Welcome your Dashboard        *
     *                                        *
     ******************************************
     ¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨
                                      L- Logout `);
  console.log(` 
      4- My Profile 
      5- Create Ofter 
      6- Ofter  
      7- Search Users
      8- Permitions 
      9- Donations \n\n\n 
      0 - Exit`);

  captureInput();
  verifyProfile(currentUser);
}
function showMyProfile() {
  currentPage = "PROFILE";
  verifyProfile(currentUser);
  console.log(`

     __________________________________________
     ******************************************
     *                                        * 
     *          Welcome your Profile          *
     *                                        *
     ¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨ 
     ******************************************
                                    L- Logout`);
  if (!currentUser.fullProfile) {
    console.log(`   
        Complete your registration : \n\n`);
  }
  console.log(`
        Nome:        ${currentUser.fullName || "Unfinished"} \n  
        Endereço:    ${currentUser.adress || "Unfinished"} \n
        Data Nasc.:  ${currentUser.birthDate || "Unfinished"} \n
        Gênero:      ${currentUser.gender || "Unfinished"} \n
        Email:       ${currentUser.email || "Unfinished"}  \n\n
        Plano:       ${currentUser.plan || "Unfinished"} \n `);
  console.log(` 
          ${currentUser.fullProfile}
          
          E - Edit     D - Delete     0 - Exit `);

  captureInput();
}
//          ****  DATA VALIDATION  ****
function nameValidation(fullName) {
  if (!fullName || /\d/.test(fullName) || fullName.length < 8) {
    inputErr(fullName);
    return false;
  }
  return true;
}
function emailValidation(email) {
  if (!email || !/\./.test(email) || !/@/.test(email)) {
    inputErr(email);
    return false;
  }
  return true;
}
function passwordValidation(password) {
  if (
    password.length < 6 ||
    !password ||
    !/\d/.test(password) ||
    !/[a-z]/.test(password) ||
    !/[A-Z]/.test(password)
  ) {
    inputErr(password);
    return false;
  }
  return true;
}
function birthDateValidation(birthDate) {
  if (!birthDate || !/\d{2}\/\d{2}\/\d{4}/.test(birthDate)) {
    inputErr(birthDate);
    return false;
  }
  return true;
}
function genderValidation(gender) {
  if (!gender || /\d/.test(gender) || gender.length < 4) {
    inputErr(gender);
    return false;
  }
  return true;
}
function stateValidation(state) {
  if (!state || /\d/.test(state) || state.length < 4) {
    inputErr(state);
    return false;
  }
  return true;
}
function countryValidation(country) {
  if (!country || /\d/.test(country) || country.length < 2) {
    inputErr(country);
    return false;
  }
  return true;
}

//                   *****  FLOW FUNCTION SYSTEM  ****

// CRIAÇÃO DE ID'S
function createID(array) {
  if (array.length === 0) {
    return 1;
  } else {
    let newId = array
      .map((array) => array.id)
      .reduce((acc, current) => (acc < current ? current : acc));
    return newId + 1;
  }
}
// CRIAÇÃO DE USUÁRIOS --- (Resolvido)
function createUser() {
  let newUser = {
    id: createID(users),
    fullName: null,
    birthDate: null,
    gender: null,
    adress: null,
    email: null,
    password: null,
    plan: "FREE",
    role: "user",
    donations: [],
    fullProfile: false,
  };
  rl.question("Please enter your full name: \n", (fullName) => {
    if (nameValidation(fullName)) {
      newUser.fullName = fullName;
      rl.question("Please insert your email: ", (email) => {
        if (emailValidation(email, users)) {
          newUser.email = email;
          rl.question("Insert your password: ", (password) => {
            if (passwordValidation(password, users, newUser)) {
              rl.question("Confirm your password: ", (rpassword) => {
                if (password !== rpassword) {
                  inputErr(password);
                  return;
                }
                newUser.password = password;
                currentUser = newUser;
                users.push(currentUser);
                saveUser(users);
                showDashBoard();
              });
            }
          });
        }
      });
    }
  });
}

// LOGIN ITEGRATION

function login(array) {
  if (array.length === 0) showSignin();
  rl.question("Please insert your email : ", (email) => {
    if (emailValidation(email)) {
      currentUser = findUserByEmail(array, email);

      if (!currentUser || currentUser.email !== email) {
        inputErr(email);
        return;
      } else {
        rl.question("Now your password : ", (password) => {
          if (password !== currentUser.password) {
            inputErr(password);
            return;
          } else {
            showDashBoard();
            return currentUser;
          }
        });
      }
    }
  });
}
// ENCONTRANDO USUÁRIO POR EMAIL
function findUserByEmail(array, email) {
  const user = array.find((user) => user.email === email);
  if (!user) {
    inputErr(email);
  }
  return user;
}
// Editando nome
function editName() {
  rl.question("Enter your full name", (fullName) => {
    if (nameValidation(fullName)) {
      currentUser.fullName = fullName;
      saveUser(users);
    }
  });
}
//Editando data de nascimento
function editBirthDate() {
  console.log("ex.:(13/09/1991) ");
  rl.question("Enter your Birth date:\n ", (birthDate) => {
    if (birthDateValidation(birthDate)) {
      currentUser.birthDate = birthDate;
      saveUser(users);
    }
  });
}
//Editando Gênero
function editGender() {
  rl.question("Enter your gender: ", (gender) => {
    if (genderValidation(gender)) {
      currentUser.gender = gender;
      saveUser(users);
    }
  });
}
//Editando endereço
function editAdress() {
  rl.question("Enter your state: ", (state) => {
    if (stateValidation(state)) {
      rl.question("Enter your country: ", (country) => {
        if (countryValidation(country)) {
          currentUser.adress = `${state}, ${country}`;
          saveUser(users);
        }
      });
    }
  });
}
// Fluxo de Edição de perfil
function editProfile() {
  console.log(`
  ATENTION!
  =====================================================\n  
  Only the following options can be changed. 
  Choose one of them:\n
  =====================================================\n 
     "name"\n
     "birthdate"\n
     "gender"\n
     "adress"
    `);
  rl.question(" Enter the data to be changed:  ", (data) => {
    if (
      data !== "name" &&
      data !== "birthdate" &&
      data !== "gender" &&
      data !== "adress"
    ) {
      inputErr(data);
      return;
    } else {
      switch (data) {
        case "name":
          editName();
          break;
        case "birthdate":
          editBirthDate();
          break;
        case "gender":
          editGender();
          break;
        case "adress":
          editAdress();
          break;
      }
      showMyProfile();
    }
  });
}
// Deletando Usuário ( Atualmente possuí Bug de replicação quando o banco é zerado)
function deleteUser(user, array) {
  console.log(`Press "Y" to confirm`);
  rl.question("Do you really want to delete this? ", (answer) => {
    if (answer !== "Y") {
      inputErr(answer);
    } else if (answer === "Y" && array.length <= 1) {
      array = [];
      saveUser(array);
      logout();
    } else {
      const usersUpdate = array.filter((users) => users.id !== user.id);
      array = usersUpdate;
      saveUser(array);
      logout();
    }
  });
}
// Checagem de perfil (Parou de Funcionar)
function verifyProfile(array) {
  !array.fullName || !array.birthDate || !array.gender || !array.adress
    ? false
    : true;
  saveUser(array);
}
//Salvando no Banco
function saveUser(array) {
  fs.writeFileSync("database.json", JSON.stringify(array));
}
//Saindo do Usuário
function logout() {
  currentUser = null;
  showHome();
}
//*********     INPUT SETTINGS    *********
function inputErr(data) {
  console.log(`
      Invalid ${data}, please try again
      
       1- Home           0- Exit  `);
  captureInput();
}
function exitInput() {
  switch (currentPage) {
    case "HOME":
      rl.close();
      break;
    case "LOGIN":
      showHome();
      break;
    case "SIGNIN":
      showHome();
      break;
    case "DASHBOARD":
      logout();
      break;
    case "PROFILE":
      showDashBoard();
      break;
    case "CREATEOFTER":
      showDashBoard();
      break;
    case "OFTER":
      showDashBoard();
      break;
    case "SEARCH":
      showDashBoard();
      break;
    case "PERMITIONS":
      showDashBoard();
      break;
    case "DONATIONS":
      showDashBoard();
      break;
  }
}

showHome();
