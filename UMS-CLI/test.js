let user = [
  { email: "yuriadao@email.com", password: "yuri123", birthdate: "31/01/1991" },
  { email: "victor@email.com", password: "victor123", birthdate: "31/08/1991" },
  { email: "italo@email.com", password: "italo123", birthdate: "10/02/1991" },
];

function findUserByEmail(array, date) {
  return array.filter((user) => {
    if (!user.birthdate) {
      return;
    } else {
      let month = user.birthdate.split("/")[1];
      console.log(month);
      return month === date;
    }
  });
}

console.log(findUserByEmail(user, "01"));

// console.log(user.find((array) => array.email === "yuriadao@email.com"));

// function login(array, email, password) {
//   let tempUser = {};

//   array.filter((user) =>
//     user.email === email
//       ? (tempUser = { email: user.email, password: user.password })
//       : "Email incorreto",
//   );

//   array.filter((user) => user.password === password);

//   if (tempUser.email !== email || tempUser.password !== password) {
//     console.log("Usuário ou senha incorreto ! ");
//     console.log(tempUser);
//   } else {
//     console.log("Login Realizado com Sucesso");
//   }
// }

// login(user, "yuriadao@email.com", "italo5050");
// // console.log(user.some((user) => user.email === "yuriadao@email.com"));

// // function createID(array) {
// //   if (array.length === 0) {
// //     return 1;
// //   } else {
// //     let newId = array
// //       .map((array) => array.id)
// //       .reduce((acc, current) => (acc < current ? current : acc));
// //     return newId + 1;
// //   }
// // }

// // console.log(createID(user));

// function createVerify(mail, array) {
//   return array.some((user) =>
//     mail === user.email ? "E-mail já registrado" : "Cadastro Realizado",
//   );
// }

// console.log(createVerify("yuriadao@email.com", user));

function femaleValidation(gender) {
  gender.toLocaleLowerCase();
  if (
    gender === "feminino" ||
    gender === "femenino" ||
    gender === "female" ||
    gender === "mulher" ||
    gender === "mujer" ||
    gender === "woman"
  ) {
    return gender === "Mulher Cisgênero";
  }
}
