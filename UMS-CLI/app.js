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
//    ********* CAPTURA DE ENTRADAS ********** (ANDAMENTO)

// Donation input
function donationInput() {
  rl.question("Enter the option do you want : ", (answer) => {
    switch (answer) {
      case "0":
        exitInput();
        break;
      case "1":
        buyDonation();
        break;
      case "2":
        listDonation();
        break;
      case "3":
        lastDonation();
        break;
      default:
        inputErr(answer);
        break;
    }
  });
}
// Input Exit || Back
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
    default:
      showDashBoard();
      break;
  }
}
// Input Global
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
        showOfter();
        break;
      case "6":
        showDonations();
        break;
      case "7":
        searchUser();
        break;
      case "8":
        createOfter();
        break;
      case "9":
        permitions();
        break;
      case "E":
        editProfile();
        break;
      case "D":
        deleteUser();
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
// Aparence settings
function renderHeader() {
  if (
    currentPage === "HOME" ||
    currentPage === "LOGIN" ||
    currentPage === "SIGNIN"
  ) {
    console.log(`  
    ╔═════════════════════════════════════════════════════════════╗
    ║                                                             ║
    ║                          UMS - CLI                          ║
    ║                                                             ║
    ╚═════════════════════════════════════════════════════════════╝
      Page: ${currentPage}                      
      User: ---                    
      Plan: ---                    
     _____________________________________________________________`);
  } else {
    console.log(`  
    ╔═════════════════════════════════════════════════════════════╗
    ║                                                             ║
    ║                          UMS - CLI                          ║
    ║                                                             ║
    ╚═════════════════════════════════════════════════════════════╝
      Page: ${currentPage}          
      User: ${currentUser.fullName}  
      Plan: ${currentUser.plan}      
     _____________________________________________________________
                                                        L- Logout`);
  }
}
function renderProfile(user) {
  console.log(`
        Nome:        ${user.fullName || "Unfinished"} \n  
        Endereço:    ${user.adress || "Unfinished"} \n
        Data Nasc.:  ${user.birthDate || "Unfinished"} \n
        Gênero:      ${user.gender || "Unfinished"} \n
        Email:       ${user.email || "Unfinished"}  \n\n
        Plano:       ${user.plan || "Unfinished"} \n 
      ____________________________________________________`);
  return;
}
function renderFooter() {
  if (currentPage !== "PROFILE") {
    console.log(`
    ___________________________________________________________     
 \n                                                  0 - Exit `);
  } else {
    console.log(`
    ___________________________________________________________    
 \n E - Edit                 D - Delete              0 - Exit `);
  }
}
function renderTotal(array) {
  console.log(
    `
                                                   Total : ${array.length}`,
  );
}

//                     FLOW'S PAGE

//      Página Home
function showHome() {
  currentPage = "HOME";
  renderHeader();
  console.log(`
     Select do you need trought the numbers :

     2 - Login
     3 - Sign in\n\n\n
     `);

  captureInput();
  renderFooter();
}
//      Página Login
function showLogin() {
  currentPage = "LOGIN";
  renderHeader();

  console.log(`    

     1 - Home
     3 - Sign in\n\n\n
     `);

  login();
  captureInput();
  renderFooter();
}

//      Página Inscrição
function showSignin() {
  currentPage = "SIGNIN";
  renderHeader();
  console.log(`
  
   Follow the steps to Sign in:

    `);

  createUser();
  captureInput();
  renderFooter();
}
//      Página DashBoard
function showDashBoard() {
  currentPage = "DASHBOARD";
  renderHeader();
  if (!currentUser.fullProfile) {
    console.log(`   
     You need finish your registration! `);
  }

  console.log(` 
      4- My Profile 
      5- Ofter 
      6- Donations  
      7- Search Users
      8- Create Ofters 
      9- Permitions \n\n`);

  renderFooter();
  captureInput();
}

//      Página Perfil
function showMyProfile() {
  currentPage = "PROFILE";
  verifyProfile(currentUser);
  renderHeader();
  if (!currentUser.fullProfile) {
    console.log(`   
        Complete your registration : \n`);
  }
  renderProfile(currentUser);
  renderFooter();
  captureInput();
  verifyProfile();
  saveUser(users);
}
// Página de Doações

function showDonations() {
  currentPage = "DONATIONS";
  renderHeader();
  console.log(`

    1 - Choose a value to donation.
    2 - List your donations.
    3 - Repeat your last donation
    `);
  renderFooter();
  donationInput();
}

//      Página Mostrador de Resultados de Busca
function showResultSearch(data) {
  currentPage = `Result Search by (${data})`;
  renderHeader();
}

// --------------- INTEGRANDO BUSCA DE USUÁRIO  ------------ //
function searchUser() {
  currentPage = "SEARCH";
  renderHeader();
  console.log(`
     ATENTION!
      =====================================================\n  
         Choose one of the options below to filter \n
      =====================================================\n 
     "name"\n
     "birthdate"\n
     "gender"\n
     "adress"
    `);
  renderFooter();
  if (captureInput) {
    dataSelect(searchName, searchMonth, searchGender, searchAdress);
  }
}

// Buscando por Nome
function searchName() {
  let result;

  rl.question("Insert the name you need found: ", (name) => {
    if (!name || /\d/.test(name)) {
      inputErr(name);
      return;
    } else {
      result = users.filter((user) =>
        user.fullName.toLowerCase().includes(name.toLocaleLowerCase()),
      );
      showResultSearch(name);
      result.map((user) => renderProfile(user));
      renderTotal(result);
      renderFooter();
      captureInput();
    }
  });
}

// Buscando por Mês de aniversário
function searchMonth() {
  let result;
  rl.question("Insert a month (01-12):  ", (month) => {
    if (!month || !/\d/.test(month)) {
      inputErr(month);
      return;
    }
    result = users.filter((user) => {
      if (!user.birthDate) return;
      else {
        let userMonth = user.birthDate.split("/")[1];
        return userMonth === month;
      }
    });

    showResultSearch(month);
    result.map((user) => renderProfile(user));
    renderTotal(result);
    renderFooter();
    captureInput();
  });
}
//Buscando por Genero
function searchGender() {
  let result;
  rl.question("Insert witch gender do you need found: ", (gender) => {
    if (genderValidation(gender)) {
      gender = genderValidation(gender);
      result = users.filter((user) => {
        if (!user.gender) return;
        else {
          return user.gender === gender;
        }
      });
      showResultSearch(gender);
      result.map((user) => renderProfile(user));
      renderTotal(result);
      renderFooter();
      captureInput();
    }
  });
}
//busca Através do Endereço
function searchAdress() {
  let result;
  rl.question("Insert state you need found: ", (state) => {
    if (stateValidation(state)) {
      result = users.filter((user) =>
        user.adress.toLowerCase().includes(state.toLocaleLowerCase()),
      );
      showResultSearch(state);
      result.map((user) => renderProfile(user));
      renderTotal(result);
      renderFooter();
      captureInput();
    }
  });
}

//          ****  DATA VALIDATION  ****
function nameValidation(fullName) {
  if (!fullName || /\d/.test(fullName) || fullName.length < 8) {
    inputErr(fullName);
    return false;
  }
  return fullName;
}
function emailValidation(email) {
  email = email.toLocaleLowerCase();
  if (!email || !/\./.test(email) || !/@/.test(email)) {
    inputErr(email);
    return false;
  }
  return email;
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
  return password;
}
function birthDateValidation(birthDate) {
  if (!birthDate || !/\d{2}\/\d{2}\/\d{4}/.test(birthDate)) {
    inputErr(birthDate);
    return false;
  }
  return birthDate;
}
function genderValidation(gender) {
  gender = gender.toLocaleLowerCase();
  if (!gender || /\d/.test(gender) || gender.length < 4) {
    inputErr(gender);
    return false;
  } else if (maleValidation(gender)) {
    return (gender = "Homem Cisgênero");
  } else if (femaleValidation(gender)) {
    return (gender = "Mulher Cisgênero");
  } else {
    return (gender = "LGBTQIA+");
  }
}
function maleValidation(gender) {
  if (
    gender === "masculino" ||
    gender === "macho" ||
    gender === "male" ||
    gender === "homem" ||
    gender === "hombre" ||
    gender === "man"
  ) {
    return true;
  } else {
    return false;
  }
}
function femaleValidation(gender) {
  if (
    gender === "feminino" ||
    gender === "femenino" ||
    gender === "female" ||
    gender === "mulher" ||
    gender === "mujer" ||
    gender === "woman"
  ) {
    return true;
  } else {
    return false;
  }
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
// CRIAÇÃO DE USUÁRIOS
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
    fullProfile: null,
  };
  rl.question("Please enter your full name: \n", (fullName) => {
    if (nameValidation(fullName)) {
      newUser.fullName = fullName;
      rl.question("Please insert your email: \n", (email) => {
        if (emailValidation(email, users)) {
          newUser.email = email;
          rl.question("Insert your password: \n", (password) => {
            if (passwordValidation(password, users, newUser)) {
              rl.question("Confirm your password: \n", (rpassword) => {
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

function login() {
  if (users.length === 0) {
    showSignin();
  } else {
    rl.question("Please insert your email : ", (email) => {
      email = email.toLocaleLowerCase();
      if (emailValidation(email)) {
        currentUser = findUserByEmail(users, email);

        rl.question("Now your password : ", (password) => {
          if (password !== currentUser.password) {
            inputErr(password);
            return;
          } else {
            verifyProfile();
            showDashBoard();
            return currentUser;
          }
        });
      }
    });
  }
}

// IMPLEMENTAÇÃO DE DOAÇÃO  ( AJUSTE DE VALIDAção *10)
function buyDonation() {
  rl.question(
    "Enter an amount multiple of 10 to donate : (10,00)  ",
    (value) => {
      if (!value || !/\d/.test(value) || value % 10 !== 0) {
        inputErr(value);
        return false;
      } else {
        rl.question(
          `R$:${value} Cofirm this Value ? \n Y[yes]     N[no]`,
          (answer) => {
            if (!answer || answer !== "Y") inputErr(answer);
            else {
              currentUser.donations.push(value);
              currentUser.lastDonation = saveUser(users);
              console.log(
                `The amount of R$${value} was successfully donated. Thank you! `,
              );
              renderFooter();
              donationInput();
            }
          },
        );
      }
    },
  );
}
function listDonation() {
  if (currentUser.donations.length === 0) {
    console.log(`You don't have any donations yet.`);
    renderFooter();
    donationInput();
  } else {
    console.log(`
     Lista de Doações: `);
    for (i of currentUser.donations) {
      console.log(`                       R$${Number(i).toFixed(2)}`);
    }
    renderFooter();
    donationInput();
  }
}
function lastDonation() {
  let index = Number(currentUser.donations.length) - 1;
  if (currentUser.donations.length === 0) {
    console.log(`You dont have anything donation yet`);
  } else {
    console.log(
      `Last amount donation was R$${Number(currentUser.donations[index]).toFixed(2)}\n`,
    );
    renderFooter();
    donationInput();
    return;
  }
}
function totalDonation() {}
// ENCONTRANDO USUÁRIO POR EMAIL
function findUserByEmail(array, email) {
  const user = array.find((user) => user.email === email);
  if (!user) {
    inputErr(email);
  }
  return user;
}

//   *****************Editando Dados **************

// Editando nome
function editName() {
  rl.question("Enter your full name: \n", (fullName) => {
    if (nameValidation(fullName)) {
      currentUser.fullName = fullName;
      showMyProfile();
    }
  });
}

//Editando data de nascimento
function editBirthDate() {
  rl.question("Enter your Birth date:'ex.:(13/09/1991)'\n ", (birthDate) => {
    if (birthDateValidation(birthDate)) {
      currentUser.birthDate = birthDate;
      showMyProfile();
    }
  });
}
//Editando Gênero
function editGender() {
  rl.question("Enter your gender: \n", (gender) => {
    if (genderValidation(gender)) {
      currentUser.gender = genderValidation(gender);
      showMyProfile();
    }
  });
}
//Editando endereço
function editAdress() {
  rl.question("Enter your state: \n", (state) => {
    if (stateValidation(state)) {
      rl.question("Enter your country: ", (country) => {
        if (countryValidation(country)) {
          currentUser.adress = `${state}, ${country}`;
          showMyProfile();
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
  if (captureInput) {
    dataSelect(editName, editBirthDate, editGender, editAdress);
  }
}
function dataSelect(firstCall, secondCall, thirdCall, forthCall) {
  rl.question(" Choose an option:  ", (data) => {
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
          firstCall();
          break;
        case "birthdate":
          secondCall();
          break;
        case "gender":
          thirdCall();
          break;
        case "adress":
          forthCall();
          break;
      }
    }
  });
}
// Deletando Usuário ( Atualmente possuí Bug de replicação quando o banco é zerado)
function deleteUser() {
  console.log(`Press "Y" to confirm`);
  rl.question("Do you really want to delete this? ", (answer) => {
    if (answer !== "Y") {
      inputErr(answer);
    } else if (answer === "Y" && users.length <= 1) {
      users = [];
      saveUser(users);
      logout();
    } else {
      const usersUpdate = users.filter((user) => user.id !== currentUser.id);
      users = usersUpdate;
      saveUser(users);
      logout();
    }
  });
}
// Verifica integridade de perfil
function verifyProfile() {
  if (
    !currentUser.fullName ||
    !currentUser.birthDate ||
    !currentUser.gender ||
    !currentUser.adress
  ) {
    return (currentUser.fullProfile = false);
  } else {
    return (currentUser.fullProfile = true);
  }
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

showHome();
