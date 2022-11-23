let form = document.forms[0];
let input = document.getElementById("name");

form.onsubmit = (e) => {
  e.preventDefault();
  let name = form.children.name.value;
  if (name != "") {
    info.name = name;
    clearCardContainer();
    getInfo(name);
    addName(name);
    form.reset();
  }
};

input.onkeydown = (e) => {
  if (e.which === 32) {
    e.preventDefault();
  }
};

let getInfo = (name) => {
  Promise.all([fetchAge(name), fetchNationality(name), fetchGender(name)])
    .then((response) => {
      info.age = response[0].age;
      info.gender = response[2].gender;
      let countriesArray = response[1].country;
      let stringOfIDs = "";
      countriesArray.forEach((country) => {
        stringOfIDs += country.country_id + ",";
      });
      return fetchCountries(stringOfIDs);
    })
    .then((response) => {
      // console.log(response);
      let nameSpan = document.querySelector("main section div p span");
      nameSpan.innerText = info.name;
      genderAndAge();
      createCard(response);
    })
    .catch((error) => {
      console.log(error);
    });
};

let fetchAge = async (name) => {
  const response = await fetch(`https://api.agify.io?name=${name}`);
  return await response.json();
};

let fetchNationality = async (name) => {
  const response = await fetch(`https://api.nationalize.io?name=${name}`);
  return await response.json();
};

let fetchGender = async (name) => {
  const response = await fetch(`https://api.genderize.io?name=${name}`);
  return await response.json();
};

let fetchCountries = async (ids) => {
  const response = await fetch(
    `https://restcountries.com/v3.1/alpha?codes=${ids}`
  );
  return await response.json();
};

let addName = (name) => {
  let namesExists = localStorage.getItem("names");
  if (namesExists) {
    let names = localStorage.getItem("names");
    let namesArray = JSON.parse(names);
    let namesSet = new Set();
    namesArray.forEach((element) => {
      namesSet.add(element);
    });
    namesSet.add(name);
    let newArray = [...namesSet];
    localStorage.setItem("names", JSON.stringify(newArray));
  } else {
    let newArray = [name];
    localStorage.setItem("names", JSON.stringify(newArray));
  }
  insertUl();
};

let genderAndAge = () => {
  let i = document.querySelector("i");
  let numberP = document.querySelector("p.number");
  if (info.gender === "male") {
    if (i.classList.contains("fa-person")) {
    } else {
      i.classList.remove("fa-person-dress", "dark");
      i.classList.add("fa-person");
    }
  } else {
    if (i.classList.contains("fa-person-dress")) {
    } else {
      i.classList.remove("fa-person");
      i.classList.add("fa-person-dress");
    }
  }
  numberP.classList.remove("dark");
  if (info.age < 10) {
    numberP.innerText = "0" + String(info.age);
  } else {
    numberP.innerText = info.age;
  }
};

let createCard = (obj) => {
  let cardsContainer = document.querySelector(".cards-container");
  for (let i = 0; i < obj.length; i++) {
    let countryName = obj[i].name.common;
    let div = document.createElement("div");
    let img = document.createElement("img");
    let p = document.createElement("p");
    let pText = document.createTextNode(countryName);
    p.append(pText);
    img.src = obj[i].flags.png;
    img.alt = countryName + " flag image";
    div.append(img);
    div.append(p);
    cardsContainer.append(div);
  }
};

let clearCardContainer = () => {
  let cardsContainer = document.querySelector(".cards-container");
  while (cardsContainer.lastChild) {
    cardsContainer.lastElementChild.remove();
  }
};

let insertUl = () => {
  clearUl();
  let namesExists = localStorage.getItem("names");
  if (namesExists) {
    let ul = document.querySelector("ul");
    let names = localStorage.getItem("names");
    let namesArray = JSON.parse(names);
    namesArray.forEach((name) => {
      let li = document.createElement("li");
      let liText = document.createTextNode(name);
      li.append(liText);
      ul.append(li);
      li.addEventListener("click", () => {
        clearCardContainer();
        addName(name);
        getInfo(name);
      });
    });
  }
};

let clearUl = () => {
  let ul = document.querySelector("ul");
  while (ul.lastChild) {
    ul.lastElementChild.remove();
  }
};

insertUl();
let info = {
  name: "",
  gender: "",
  age: "",
};
