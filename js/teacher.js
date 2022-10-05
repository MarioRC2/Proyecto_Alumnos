const teacherList = [
   {
      Usuario: "Oscarz90",
      Nombre: "Oscar",
      apellidoPaterno: "Martinez",
      apellidoMaterno: "Sanchez",
      Edad: "32",
      Contraseña: "1990",
   },
   {
      Usuario: "MarioRC1",
      Nombre: "Mario",
      apellidoPaterno: "Ramirez",
      apellidoMaterno: "Cortez",
      Edad: "32",
      Contraseña: "1990",
   },
   {
      Usuario: "AllanAlcala",
      Nombre: "Allan",
      apellidoPaterno: "Alcala",
      apellidoMaterno: "",
      Edad: "32",
      Contraseña: "1990",
   },
];

const form = document.getElementById("form_control");
const User = document.getElementById("User");
const Password = document.getElementById("Password");

form.addEventListener("submit", function (e) {
   e.preventDefault();

   const loginIsValid = validateUser();

   if (loginIsValid) {
      document.location.href = "/html/alumnos.html";
   } else {
   }
});

function validateUser() {
   const validate = teacherList.filter((user) => user.Usuario === User?.value);

   if (validate.length == 0) {
      return false;
   }
   if (validate[0].Contraseña != Password?.value) {
      return false;
   }
   localStorage.setItem("user", JSON.stringify(validate));
   return true;
}
