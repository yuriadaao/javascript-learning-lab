const readline = require("readline");
const fs = require("fs");
const { count } = require("console");
const usersDB = fs.readFileSync("usersDB.json", "utf8");
const managersDB = fs.readFileSync("managersDB.json", "utf8");
const offersDB = fs.readFileSync("offersDB.json", "utf-8");
const currentDate = Date.now();
let users = JSON.parse(usersDB);
let managers = JSON.parse(managersDB);
let offers = JSON.parse(offersDB);
let currentUser = null;
let currentManager = null;
let currentOffer = null;
let currentPage = null;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function oneActionInput() {
  switch (currentPage) {
    case "DONATIONS":
      validateBuyDonation();
      break;
    case "CREATE OFFER":
      createOffer();
      break;
    case "OFFERS":
      break;
    default:
      logout();
      break;
  }
}
function twoActionInput() {
  switch (currentPage) {
    case "DONATIONS":
      validateListDonation();
      break;
    case "CREATE OFFER":
      showListOffer();
      break;
    case "OFFERS":
      break;
    default:
      validateLogin();
      break;
  }
}
function threeActionInput() {
  switch (currentPage) {
    case "DONATIONS":
      validateLastDonation();
      break;
    case "CREATE Offer":
      createOffer();
      break;
    case "Offer":
      favoriteOffer();
      break;
    default:
      signInValidate();
      break;
  }
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
    case "DONATIONS":
      showDashBoard();
      break;
    case "CREATE OFFERS":
      createOffer();
      break;
    default:
      showDashBoard();
      break;
  }
}
function categoryInput(category) {
  switch (category) {
    case "1":
      return "BARCO";
      break;
    case "2":
      return "BUGGY";
      break;
    case "3":
      return "TRANSFER";
      break;
    case "4":
      return "QUADRI";
      break;
    default:
      inputErr(category);
      return false;
  }
}

// Input Global
function captureInput() {
  rl.question("", (answer) => {
    answer = answer.toLocaleLowerCase();
    switch (answer) {
      case "0":
        exitInput();
        break;
      case "1":
        oneActionInput();
        break;
      case "2":
        twoActionInput();
        break;
      case "3":
        threeActionInput();
        break;
      case "4":
        showMyProfile();
        break;
      case "5":
        showOffer();
        break;
      case "6":
        showDonations();
        break;
      case "7":
        searchUser();
        break;
      case "8":
        showCreateOffer();
        break;
      case "9":
        permissions();
        break;
      case "e":
        currentEdit();
        break;
      case "d":
        currentDelete();
        break;
      case "l":
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

function currentEdit() {
  if (currentUser && currentPage === "PROFILE") {
    editUserProfile();
  } else if (currentManager && currentPage === "PROFILE") {
    editManagerProfile();
  } else {
    editMyOffers();
  }
}
function currentDelete() {
  if (currentUser && currentPage === "PROFILE") {
    deleteUser();
  } else if (currentManager && currentPage === "PROFILE") {
    deleteManager();
  } else {
    deleteOffer();
  }
}
// Aparence settings
function formatDescription(description) {
  let lastSpace = 0;
  let count = 0;
  for (let i = 0; i <= description.length - 1; i++) {
    count++;
    if (description[i] === " " || description[i] === ".") {
      lastSpace = i;
    }
    if (count === 50) {
      count = 0;

      description =
        description.slice(0, lastSpace) +
        "\n" +
        description.slice(lastSpace, description.length);
    }
  }
  return description;
}
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
  } else if (!currentManager) {
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
  } else {
    console.log(`  
    ╔═════════════════════════════════════════════════════════════╗
    ║                                                             ║
    ║                          UMS - CLI                          ║
    ║                                                             ║
    ╚═════════════════════════════════════════════════════════════╝
      Page:       ${currentPage}          
      Enterprise: ${currentManager.enterpriseName}  
      Plan:       ${currentManager.plan}      
     _____________________________________________________________
                                                        L- Logout`);
  }
}
function renderProfile() {
  if (currentManager) {
    console.log(`
          Nome:        ${currentManager.enterpriseName || "Unfinished"} \n  
          Endereço:    ${currentManager.address || "Unfinished"} \n
          Email:       ${currentManager.email || "Unfinished"}  \n\n
          Plano:       ${currentManager.plan || "Unfinished"} \n 
        ____________________________________________________`);
    return;
  } else {
    console.log(`
          Nome:        ${currentUser.fullName || "Unfinished"} \n  
          Endereço:    ${currentUser.address || "Unfinished"} \n
          Data Nasc.:  ${currentUser.birthDate || "Unfinished"} \n
          Gênero:      ${currentUser.gender || "Unfinished"} \n
          Email:       ${currentUser.email || "Unfinished"}  \n\n
          Plano:       ${currentUser.plan || "Unfinished"} \n 
        ____________________________________________________`);
    return;
  }
}
function renderFooter() {
  if (currentPage === "PROFILE" || currentPage === "SELECT OFFER") {
    console.log(`
      _______________________________________________________________    
     \n E - Edit                   D - Delete               0 - Exit `);
  } else {
    console.log(`
    _______________________________________________________________    
 \n                                                      0 - Exit `);
  }
}
function renderOffer(array) {
  console.log(`
          ID:   ${array.offerID} \n  
          Enteprise:   ${array.enterprise} \n  
          Expiration:  ${array.expirationDate} \n
          Descrip.:    \n${formatDescription(array.description)} \n\n
          Value:       R$ ${array.value} \n
        
        ________________________________________________________\n\n 
        `);
}

function renderTotal(array) {
  console.log(
    `
                                                   Total : ${array.length}`,
  );
}

function validateDashBoard() {
  if (currentUser.role === "ADMIN") {
    console.log(` 
      4- My Profile 
      5- Offer 
      6- Donations  
      7- Search Users
      8- Create Offers 
      9- Permissions \n\n`);
  } else if (!currentManager) {
    console.log(` 
      4- My Profile 
      5- Offer 
      6- Donations  \n\n`);
  } else {
    console.log(` 
      4- My Profile  
      6- Donations  
      7- Search Users
      8- Create Offers\n\n`);
  }
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

  validateLogin();
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
  if (currentUser && !verifyUserProfile()) {
    console.log(`   
     You need finish your registration! `);
  } else if (currentManager && !verifyManagerProfile()) {
    console.log(`   
     You need finish your registration! `);
  }
  validateDashBoard();
  renderFooter();
  captureInput();
}

//      Página Perfil
function showMyProfile() {
  currentPage = "PROFILE";
  renderHeader();
  if (currentUser && !verifyUserProfile()) {
    console.log(`   
        Complete your registration : \n`);
  } else if (currentManager && !verifyManagerProfile()) {
    console.log(`   
        Complete your registration : \n`);
  }
  renderProfile(currentUser);
  renderFooter();
  captureInput();
  save(users, "usersDB.json");
}
// Página de Doações

function showDonations() {
  currentPage = "DONATIONS";
  renderHeader();
  console.log(`
    Choose your option to continue :

    1 - Choose a value to donation.
    2 - List your donations.
    3 - Repeat your last donation
    `);
  renderFooter();
  captureInput();
}

function showOffer() {
  currentPage = "OFFERS";
  renderHeader();
  getActiveOffers(offers).map((offer) => renderOffer(offer));
  if (offers.length < 1) {
    console.log("   No offers were found...");
    captureInput();
  } else {
    rl.question("   To select any offer select your offerID: ", (id) => {
      if (id === "0") {
        showDashBoard();
      } else if (!id || !/\d/.test(id)) {
        inputErr(id);
      } else {
        return renderOffer(selectOffer(id));
      }
    });
  }
  renderFooter();
}

function showCreateOffer() {
  currentPage = "CREATE OFFER";
  renderHeader();
  console.log(`
    1 - Create Offer.
    2 - List Offer.
    `);
  renderFooter();
  captureInput();
}
function showListOffer() {
  currentPage = "LIST OFFER";
  renderHeader();
  listOffer();
  rl.question("   To select any offer select your offerID: ", (id) => {
    if (id === "0") {
      showCreateOffer();
    } else if (!id || !/\d/.test(id)) {
      inputErr(id);
    } else {
      showSelectOffer(id);
    }
  });
  renderFooter();
}

function selectOffer(id) {
  return offers.find((offer) => offer.offerID === Number(id));
}
function showSelectOffer(id) {
  currentPage = "SELECT OFFER";
  renderHeader();
  renderOffer(selectOffer(id));
  currentOffer = selectOffer(id);
  renderFooter();
  captureInput();
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
     "address"
    `);
  renderFooter();
  if (captureInput) {
    dataSelect(searchName, searchMonth, searchGender, searchAddress);
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
function searchAddress() {
  let result;
  rl.question("Insert state you need found: ", (state) => {
    if (stateValidation(state)) {
      result = users.filter((user) =>
        user.address.toLowerCase().includes(state.toLocaleLowerCase()),
      );
      showResultSearch(state);
      result.map((user) => renderProfile(user));
      renderTotal(result);
      renderFooter();
      captureInput();
    }
  });
}

// Conversão de string para data padrão
function parseBrDate(date) {
  const [day, month, year] = date.split("/");

  return new Date(year, month - 1, day);
}
function getActiveOffers(array) {
  return array.filter((user) => {
    return parseBrDate(user.expirationDate).getTime() > currentDate;
  });
}

//          ****  DATA VALIDATION  ****

function enterpriseNameValidation(enterprise) {
  if (!enterprise || !/[a-zA-Z]/.test(enterprise) || enterprise.length < 4) {
    inputErr(enterprise);
    captureInput();
  } else {
    return enterprise;
  }
}
function nameValidation(fullName) {
  if (!fullName || /\d/.test(fullName) || fullName.length < 6) {
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
function dateValidation(date) {
  if (!date || !/\d{2}\/\d{2}\/\d{4}/.test(date)) {
    inputErr(date);
    return false;
  }
  return date;
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
function descriptionValidation(description) {
  if (!description || description.length < 70 || description.length > 420) {
    inputErr("description");
    return false;
  }
  return true;
}
function priceValidation(value) {
  if (!value || !/\d/.test(value) || value % 10 !== 0) {
    inputErr(value);
    return false;
  }
  return true;
}
function createPrice(array) {
  rl.question("Enter an amount multiple of 10 to your offer: ", (value) => {
    if (priceValidation(value)) {
      value = Number(value).toFixed(2);
      array.value = value;
      console.log("Your Offer was created sucessfull");
      offers.push(array);
      save(offers, "offersDB.json");
      showCreateOffer();
    }
  });
}
function createDescription(array) {
  rl.question(
    "Enter a description for your offer. It must be between 90 and 400 characters long : ",
    (description) => {
      if (descriptionValidation(description)) {
        array.description = description;
        createPrice(array);
      }
    },
  );
}

// function createEnterprise(array) {
//   rl.question("Insert a enterprise name: ", (enterprise) => {
//     if (enterpriseNameValidation(enterprise)) {
//       array.enterprise = enterprise;
//       createDescription(array);
//     }
//   });
// }
function createDateExpiration(array) {
  rl.question("Insert a expiration date: ex.(xx/xx/xxx) ", (date) => {
    if (dateValidation(date)) {
      array.expirationDate = date;
      createDescription(array);
    }
  });
}

function categoryValidation(array) {
  if (
    array.category.length > 1 &&
    array.category.reduce((acc, current) => acc === current)
  ) {
    console.log("This category can't be registred");
    inputErr("Category");
    return false;
  } else if (array.category.length > 4) {
    console.log(
      "You have exceeded the number of categories that can be registered.",
    );
    inputErr("Category");
    return false;
  }
  return true;
}
function createCategory(array) {
  rl.question(
    `
    Choose a category to add in your offer : 
      1- Barco
      2- Buggy
      3- Transfer
      4- Quadri  `,
    (category) => {
      addCategory(array, category);
      rl.question(
        ` Your offer can have 4 categories, would you like add another one ? Y[yes]   N[no] `,
        (answer) => {
          if (
            answer.toLocaleLowerCase() !== "n" &&
            answer.toLocaleLowerCase() !== "y"
          ) {
            inputErr(answer);
          } else if (answer.toLocaleLowerCase() === "y") {
            rl.question(
              `
    Choose a category to add in your offer : 
      1- Barco
      2- Buggy
      3- Transfer
      4- Quadri  `,
              (category) => {
                addCategory(array, category);
                rl.question(
                  ` Would you like add another one ? Y[yes]   N[no] `,
                  (answer) => {
                    if (
                      answer.toLocaleLowerCase() !== "n" &&
                      answer.toLocaleLowerCase() !== "y"
                    ) {
                      inputErr(answer);
                    } else if (answer.toLocaleLowerCase() === "y") {
                      rl.question(
                        `
                        Choose a category to add in your offer : 
                          1- Barco
                          2- Buggy
                          3- Transfer
                          4- Quadri  `,
                        (category) => {
                          addCategory(array, category);
                          rl.question(
                            ` Would you like add another one ? Y[yes]   N[no] `,
                            (answer) => {
                              if (
                                answer.toLocaleLowerCase() !== "n" &&
                                answer.toLocaleLowerCase() !== "y"
                              ) {
                                inputErr(answer);
                              } else if (answer.toLocaleLowerCase() === "y") {
                                rl.question(
                                  `
                                Choose a category to add in your offer : 
                                  1- Barco
                                  2- Buggy
                                  3- Transfer
                                  4- Quadri  `,
                                  (category) => {
                                    addCategory(array, category);
                                    createDateExpiration(array);
                                  },
                                );
                              }
                              if (answer.toLocaleLowerCase() === "n") {
                                if (categoryValidation(array)) {
                                  createDateExpiration(array);
                                }
                              }
                            },
                          );
                        },
                      );
                    }
                    if (answer.toLocaleLowerCase() === "n") {
                      if (categoryValidation(array)) {
                        createDateExpiration(array);
                      }
                    }
                  },
                );
              },
            );
          }
          if (answer.toLocaleLowerCase() === "n") {
            if (categoryValidation(array)) {
              createDateExpiration(array);
            }
          }
        },
      );
    },
  );
}

function addCategory(array, category) {
  if (categoryValidation(array) && categoryInput(category)) {
    array.category.push(categoryInput(category));
  }
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
function signInValidate() {
  rl.question(
    `Choose your account type: \n
      Press 1 - To User   or 2 - To enterprise \n  `,
    (answer) => {
      if (answer === "0") {
        showHome();
      } else if (answer === "1") {
        createUser();
      } else if (answer === "2") {
        createManager();
      } else {
        inputErr(answer);
      }
    },
  );
}
function createManager() {
  let newManager = {
    id: createID(managers),
    enterpriseName: null,
    address: null,
    email: null,
    password: null,
    plan: "FREE",
    role: "Manager",
    donations: [],
    fullProfile: null,
  };
  rl.question("Please enter entreprise name: \n", (enterprise) => {
    if (nameValidation(enterprise)) {
      newManager.enterpriseName = enterprise;
      rl.question("Please insert your email: \n", (email) => {
        email = email.toLocaleLowerCase();
        if (findUserByEmail(managers, email) || findUserByEmail(users, email)) {
          inputErr("Email been registered");
        } else if (emailValidation(email)) {
          newManager.email = email;
          rl.question("Insert your password: \n", (password) => {
            if (passwordValidation(password, managers, newManager)) {
              rl.question("Confirm your password: \n", (rpassword) => {
                if (password !== rpassword) {
                  inputErr(password);
                  return;
                }
                newManager.password = password;
                currentManager = newManager;
                managers.push(currentManager);
                save(managers, "managersDB.json");
                showDashBoard();
              });
            }
          });
        }
      });
    }
  });
}
function createUser() {
  let newUser = {
    id: createID(users),
    fullName: null,
    birthDate: null,
    gender: null,
    address: null,
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
        email = email.toLocaleLowerCase();
        if (findUserByEmail(managers, email) || findUserByEmail(users, email)) {
          inputErr("Email been registered");
        } else if (emailValidation(email)) {
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
                save(users, "usersDB.json");
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
function validateLogin() {
  rl.question("Please insert your email : ", (email) => {
    email = email.toLocaleLowerCase();
    if (users.length === 0 && managers.length === 0) {
      showSignin();
    } else if (!emailValidation(email)) {
      inputErr(email);
    } else if (
      !findUserByEmail(managers, email) &&
      !findUserByEmail(users, email)
    ) {
      inputErr(email);
    } else if (managers.length !== 0 && findUserByEmail(managers, email)) {
      currentManager = findUserByEmail(managers, email);
      currentUser = null;
      managerLogin();
    } else if (users.length !== 0 && findUserByEmail(users, email)) {
      currentUser = findUserByEmail(users, email);
      currentManager = null;
      userLogin();
    } else {
      inputErr("Do you need Sign in to continue");
    }
  });
}
function managerLogin() {
  if (managers.length === 0) {
    showSignin();
  } else {
    rl.question("Now your password : ", (password) => {
      if (password !== currentManager.password) {
        inputErr(password);
        return;
      } else {
        verifyManagerProfile();
        showDashBoard();
        return currentManager;
      }
    });
  }
}
function userLogin() {
  if (users.length === 0) {
    showSignin();
  } else {
    rl.question("Now your password : ", (password) => {
      if (password !== currentUser.password) {
        inputErr(password);
        return;
      } else {
        verifyUserProfile();
        showDashBoard();
        return currentUser;
      }
    });
  }
}

// IMPLEMENTAÇÃO DE DOAÇÃO  ( AJUSTE DE VALIDAção *10)
function userBuyDonation() {
  rl.question(
    "Enter an amount multiple of 10 to donate : (10,00)  ",
    (value) => {
      if (priceValidation(value)) {
        rl.question(
          `R$:${value} Cofirm this Value ? \n Y[yes]     N[no]`,
          (answer) => {
            answer.toLocaleLowerCase();
            if (!answer || answer !== "y") inputErr(answer);
            else {
              currentUser.donations.push(value);
              currentUser.lastDonation = save(users, "usersDB.json");
              console.log(
                `The amount of R$${value} was successfully donated. Thank you! `,
              );
              showDonations();
            }
          },
        );
      }
    },
  );
}
function managerBuyDonation() {
  rl.question(
    "Enter an amount multiple of 10 to donate : (10,00)  ",
    (value) => {
      if (priceValidation(value)) {
        rl.question(
          `R$:${value} Cofirm this Value ? \n Y[yes]     N[no]`,
          (answer) => {
            answer.toLocaleLowerCase();
            if (!answer || answer !== "y") inputErr(answer);
            else {
              currentManager.donations.push(value);
              currentManager.lastDonation = save(managers, "managersDB.json");
              console.log(
                `The amount of R$${value} was successfully donated. Thank you! `,
              );
              showDonations();
            }
          },
        );
      }
    },
  );
}
function validateBuyDonation() {
  if (!currentManager) {
    userBuyDonation();
  } else {
    managerBuyDonation();
  }
  renderFooter();
  captureInput();
}
function userListDonation() {
  if (currentUser.donations.length === 0) {
    console.log(`You don't have any donations yet.`);
    // renderFooter();
    // captureInput();
  } else {
    console.log(`
     Donation's list : `);
    for (i of currentUser.donations) {
      console.log(`                       R$${Number(i).toFixed(2)}\n`);
    }
    console.log(
      `                          ${Number(totalDonation(currentUser)).toFixed(2)}`,
    );
  }
}
function managerListDonation() {
  if (currentManager.donations.length === 0) {
    console.log(`You don't have any donations yet.`);
    // renderFooter();
    // captureInput();
  } else {
    console.log(`
     Donation's list : `);
    for (i of currentManager.donations) {
      console.log(`                       R$${Number(i).toFixed(2)}\n`);
    }
    console.log(
      `                          ${Number(totalDonation(currentManager)).toFixed(2)}`,
    );
  }
}
function validateListDonation() {
  if (!currentManager) {
    userListDonation();
  } else {
    managerListDonation();
  }
  renderFooter();
  captureInput();
}

function userLastDonation() {
  let index = Number(currentUser.donations.length) - 1;

  if (currentUser.donations.length === 0) {
    console.log(`You dont have anything donation yet`);
    captureInput();
  } else {
    const lastDonation = Number(currentUser.donations[index]).toFixed(2);
    console.log(`
      Your last amount donation was R$${lastDonation}\n`);
    rl.question(
      "     Would you like repeat your last Donation ?  Y[yes]    N[no]",
      (answer) => {
        answer = answer.toLocaleLowerCase();
        if (answer && answer === "y") {
          currentUser.donations.push(lastDonation);
          console.log("Thank's for your contribuition");
          save(users, "usersDB.json");
          showDonations();
        } else if (answer && answer === "n") {
          showDonations();
        } else {
          inputErr("Key");
        }
      },
    );
  }
}
function managerLastDonation() {
  let index = Number(currentManager.donations.length) - 1;

  if (currentManager.donations.length === 0) {
    console.log(`You dont have anything donation yet`);
    captureInput();
  } else {
    const lastDonation = Number(currentManager.donations[index]).toFixed(2);
    console.log(`
      Your last amount donation was R$${lastDonation}\n`);
    rl.question(
      "     Would you like repeat your last Donation ?  Y[yes]    N[no]",
      (answer) => {
        answer = answer.toLocaleLowerCase();
        if (answer && answer === "y") {
          currentManager.donations.push(lastDonation);
          console.log("Thank's for your contribuition");
          save(managers, "managersDB.json");
          showDonations();
        } else if (answer && answer === "n") {
          showDonations();
        } else {
          inputErr("Key");
        }
      },
    );
  }
}

function validateLastDonation() {
  if (!currentManager) {
    userLastDonation();
  } else {
    managerLastDonation();
  }

  renderFooter();
}
// ************* IMPLEMENTAR TOTAL !!
function totalDonation(user) {
  if (user.donations.length > 1) {
    return user.donations.reduce(
      (acc, current) => Number(acc) + Number(current),
    );
  } else if ((user.donations.length = 1)) {
    return user.donations;
  } else {
    return "0,00";
  }
}

function createOffer() {
  const newOffer = {
    userID: currentManager.id,
    offerID: createID(offers),
    category: [],
    expirationDate: null,
    enterprise: currentManager.enterpriseName,
    description: null,
    value: null,
  };
  createCategory(newOffer);
}

function listOffer() {
  let listOffer = offers.filter((offer) => offer.userID === currentManager.id);

  if (listOffer.length < 1) {
    console.log("You don't have yet anyone offer");
    showCreateOffer();
  } else {
    listOffer.map((offer) => renderOffer(offer));
  }
  return listOffer;
}
function favoriteOffer() {}
// ENCONTRANDO USUÁRIO POR EMAIL
function findUserByEmail(array, email) {
  const user = array.find((user) => user.email === email);
  if (!user) {
    return false;
  }
  return user;
}

//   *****************Editando Dados **************

// Editando nome
function editEnterpriseName() {
  rl.question("Choose new  name: \n", (enterprise) => {
    if (nameValidation(fullName)) {
      currentManager.enterpriseName = enterprise;
      showMyProfile();
    }
  });
}
function editEnterpriseAddress() {
  rl.question("Enter your Address: \n", (address) => {
    if (nameValidation(address)) {
      currentManager.address = address;
      showMyProfile();
    }
  });
}
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
    if (dateValidation(birthDate)) {
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
function editAddress() {
  rl.question("Enter your state: \n", (state) => {
    if (stateValidation(state)) {
      rl.question("Enter your country: ", (country) => {
        if (countryValidation(country)) {
          currentUser.address = `${state}, ${country}`;
          showMyProfile();
        }
      });
    }
  });
}
function editDescription() {
  rl.question(
    "Enter a description for your offer. It must be between 90 and 400 characters long : ",
    (description) => {
      if (descriptionValidation(description)) {
        currentOffer.description = description;
        save(offers, "offersDB.json");
        currentOffer = null;
        showListOffer();
      }
    },
  );
}
function editValue() {
  rl.question("Enter an amount multiple of 10 to your offer: ", (value) => {
    if (priceValidation(value)) {
      value = Number(value).toFixed(2);
      currentOffer.value = value;
      save(offers, "offersDB.json");
      showListOffer();
    }
  });
}

// Fluxo de Edição
function editMyOffers() {
  console.log(`
  ATENTION!
  =====================================================\n  
  Only the following options can be changed. 
  Choose one of them:\n
  =====================================================\n 
     "description"\n
     "value"\n
    `);
  if (captureInput) {
    dataOfferSelect(editDescription, editValue);
  }
}
function editUserProfile() {
  console.log(`
  ATENTION!
  =====================================================\n  
  Only the following options can be changed. 
  Choose one of them:\n
  =====================================================\n 
     "name"\n
     "birthdate"\n
     "gender"\n
     "address"
    `);
  if (captureInput) {
    dataSelect(editName, editBirthDate, editGender, editAddress);
  }
}
function editManagerProfile() {
  console.log(`
  ATENTION!
  =====================================================\n  
  Only the following options can be changed. 
  Choose one of them:\n
  =====================================================\n 
     "enterprise"\n
     "address"
    `);
  if (captureInput) {
    dataManagerSelect(editEnterpriseName, editEnterpriseAddress);
  }
}
function dataUserSelect() {
  rl.question(" Choose an option:  ", (data) => {
    if (
      data !== "name" &&
      data !== "birthdate" &&
      data !== "gender" &&
      data !== "address"
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
        case "address":
          editAddress();
          break;
      }
    }
  });
}
function dataOfferSelect() {
  rl.question(" Choose an option:  ", (data) => {
    if (data !== "description" && data !== "value") {
      inputErr(data);
      return;
    } else {
      switch (data) {
        case "description":
          editDescription();
          break;
        case "value":
          editValue();
          break;
        default:
          showDashBoard();
          break;
      }
    }
  });
}
function dataManagerSelect() {
  rl.question(" Choose an option:  ", (data) => {
    if (data !== "address" && data !== "enterprise") {
      inputErr(data);
      return;
    } else {
      switch (data) {
        case "enterprise":
          editEnterpriseName();
          break;
        case "address":
          editEnterpriseAddress();
          break;
        default:
          showMyProfile();
          break;
      }
    }
  });
}
// Deletando Usuário ( Atualmente possuí Bug de replicação quando o banco é zerado)
function deleteManager() {
  console.log(`Press "Y" to confirm`);
  rl.question("Do you really want to delete this? ", (answer) => {
    answer = answer.toLocaleLowerCase();
    if (answer !== "y") {
      inputErr(answer);
    } else if (answer === "0") {
      showMyProfile();
    } else if (answer === "y" && managers.length === 1) {
      managers = [];
      save(managers, "managersDB.json");
      logout();
    } else {
      const managersUpdate = managers.filter(
        (manager) => manager.id !== currentManager.id,
      );
      managers = managersUpdate;
      save(managers, "managersDB.json");
      logout();
    }
  });
}
function deleteUser() {
  console.log(`Press "Y" to confirm`);
  rl.question("Do you really want to delete this? ", (answer) => {
    answer = answer.toLocaleLowerCase();
    if (answer !== "y") {
      inputErr(answer);
    } else if (answer === "0") {
      showMyProfile();
    } else if (answer === "y" && users.length === 1) {
      users = [];
      save(users, "usersDB.json");
      logout();
    } else {
      const usersUpdate = users.filter((user) => user.id !== currentUser.id);
      users = usersUpdate;
      save(users, "usersDB.json");
      logout();
    }
  });
}
function deleteOffer() {
  console.log(`Press "Y" to confirm`);
  rl.question("Do you really want to delete this? ", (answer) => {
    answer = answer.toLocaleLowerCase();
    if (answer !== "y") {
      inputErr(answer);
    }
    if (answer === "0") {
      showCreateOffer();
    } else if (answer === "y" && offers.length === 1) {
      offers = [];
      currentPage = null;
      save(offers, "offersDB.json");
      showCreateOffer();
    } else {
      const offersUpdate = offers.filter(
        (offer) => offer.id !== currentOffer.id,
      );
      offers = usersUpdate;
      currentPage = null;
      save(offers, "offersDB.json");
      showListOffer();
    }
  });
}
// Verifica integridade de perfil
function verifyManagerProfile() {
  if (!currentManager.enterprise || !currentManager.address) {
    return (currentManager.fullProfile = false);
  } else {
    return (currentManager.fullProfile = true);
  }
}
function verifyUserProfile() {
  if (
    !currentUser.fullName ||
    !currentUser.birthDate ||
    !currentUser.gender ||
    !currentUser.address
  ) {
    return (currentUser.fullProfile = false);
  } else {
    return (currentUser.fullProfile = true);
  }
}

//Salvando no Banco
function save(array, database) {
  fs.writeFileSync(database, JSON.stringify(array));
}

//Saindo do Usuário
function logout() {
  currentUser = null;
  currentManager = null;
  currentOffer = null;
  currentPage = null;
  showHome();
}
//Gerenciamento de permissões
function checkPermissions() {}
//*********     INPUT SETTINGS    *********
function inputErr(data) {
  console.log(`
      Invalid ${data}, please try again
      
       1- Home           0- Exit  `);
  captureInput();
}

showHome();
