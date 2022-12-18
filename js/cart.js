// récupération des produits via l'API
fetch("http://localhost:3000/api/products/")
  .then((res) => {
    return res.json();
  })
  .then(function (data) {
    getProducts(data);
    removeFromCart(); //les fonctions sont lancées au début de la page
  });

let panier = JSON.parse(localStorage.getItem("panier"));
console.log(panier);

const cartItems = document.getElementById("cart__items");

let totalQuantity = 0;
let totalPrice = 0;

// fonction qui affiche les produits présents dans le panier
function getProducts(value) {
  panier.forEach((article) => {
    let productId = article.articleId;
    for (let i = 0; i < value.length; i++) {
      if (productId === value[i]._id) {
        cartItems.innerHTML += getArticleHtml(article, value[i]);
        totalQuantity += article.articleQuantity;
        totalPrice += totalQuantity * value[i].price;
        document.getElementById("totalQuantity").innerHTML = totalQuantity;
        document.getElementById("totalPrice").innerHTML = totalPrice;

        changeQuantity(); //fonction jouée ici pour que les quantités soient à jour dès l'affichage des produits
      }
    }
  });
}

//fonction qui affiche les prosuits du panier via la méthode de templating
function getArticleHtml(article, produit) {
  var articleHtml = "";
  articleHtml += `<article class="cart__item" data-id="${article.articleId}" data-color="${article.articleColor}">
  <div class="cart__item__img">
    <img src="${produit.imageUrl}" alt="${produit.altTxt}">
  </div>
  <div class="cart__item__content">
    <div class="cart__item__content__description">
      <h2>${produit.name}</h2>
      <p>${article.articleColor}</p>
      <p>${produit.price}€</p>
    </div>
    <div class="cart__item__content__settings">
      <div class="cart__item__content__settings__quantity">
        <p>Qté : </p>
        <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${article.articleQuantity}">
      </div>
      <div class="cart__item__content__settings__delete">
        <p class="deleteItem">Supprimer</p>
      </div>
    </div>
  </div>
</article>`;
  return articleHtml;
}

//fonction qui régit les changements de quantités d'articles
function changeQuantity() {
  let changeQty = document.querySelectorAll(".itemQuantity");

  for (let i = 0; i < changeQty.length; i++) {
    changeQty[i].addEventListener("change", (event) => {
      event.preventDefault();

      let modifQuantity = panier[i].articleQuantity;
      let modifValue = changeQty[i].valueAsNumber;

      const findModif = panier.find((e) => e.modifValue !== modifQuantity);
      findModif.articleQuantity = modifValue;
      panier[i].articleQuantity = findModif.articleQuantity;

      localStorage.setItem("panier", JSON.stringify(panier));
      location.reload();
    });
  }
}

//fonction qui supprime les articles
function removeFromCart() {
  let btnDelete = document.querySelectorAll(".deleteItem");

  for (let i = 0; i < btnDelete.length; i++) {
    btnDelete[i].addEventListener("click", (event) => {
      event.preventDefault();

      let idDelete = panier[i].articleId;
      let colorDelete = panier[i].articleColor;

      panier = panier.filter(
        (e) => e.articleId !== idDelete || e.articleColor !== colorDelete
      );

      localStorage.setItem("panier", JSON.stringify(panier));

      alert("Ce produit a bien été supprimé du panier");

      location.reload();
    });
  }
}
// Gestion du formulaire panier

//création des regex
let nameRegex = new RegExp("^[a-zA-Z-àâäéèêëïîôöùûüç]+$");
let emailRegex = new RegExp(
  "^([a-zA-Z0-9_.-àâäéèêëïîôöùûüç]+)@([da-z.-]+).([a-z.]{2,6})$"
);
let addressRegex = new RegExp(
  "^[0-9]{1,3}(?:(?:[,:. ]){1}[-a-zA-Zàâäéèêëïîôöùûüç]+)+"
);

function getForm() {
  //vérifie le prénom
  let firstNameInput = document.getElementById("firstName");
  firstNameInput.addEventListener("input", function () {
    if (nameRegex.test(firstNameInput.value) === false) {
      document.getElementById("firstNameErrorMsg").textContent =
        "Format du prénom incorrect";
    } else {
      document.getElementById("firstNameErrorMsg").textContent = "";
    }
  });

  // Vérifie le nom
  let lastNameInput = document.getElementById("lastName");
  lastNameInput.addEventListener("input", function () {
    if (nameRegex.test(lastNameInput.value) === false) {
      document.getElementById("lastNameErrorMsg").textContent =
        "Format du nom incorrect";
    } else {
      document.getElementById("lastNameErrorMsg").textContent = "";
    }
  });
  // Vérifie l'adresse
  let addressInput = document.getElementById("address");
  addressInput.addEventListener("input", function () {
    if (addressRegex.test(addressInput.value) === false) {
      document.getElementById("addressErrorMsg").textContent =
        "Format d'adresse incorrect";
    } else {
      document.getElementById("addressErrorMsg").textContent = "";
    }
  });
  //vérifie la ville
  let cityInput = document.getElementById("city");
  cityInput.addEventListener("input", function () {
    if (nameRegex.test(cityInput.value) === false) {
      document.getElementById("cityErrorMsg").textContent =
        "Nom de ville incorrect";
    } else {
      document.getElementById("cityErrorMsg").textContent = "";
    }
  });
  // Vérifie l'email
  let emailInput = document.getElementById("email");
  emailInput.addEventListener("input", function () {
    if (emailRegex.test(emailInput.value) === false) {
      document.getElementById("emailErrorMsg").textContent =
        "format e-mail incorrect";
    } else {
      document.getElementById("emailErrorMsg").textContent = "";
    }
  });
}
getForm();
//confirmation de la commande

function orderCart() {
  let btnOrder = document.getElementById("order");
  btnOrder.addEventListener("click", (e) => {
    e.preventDefault();

    if (!panier) {
      alert(
        "Votre panier est vide, veuillez sélectionner un article pour passer une commande"
      );
    } else if (
      !nameRegex.test(firstName.value) ||
      !nameRegex.test(lastName.value) ||
      !emailRegex.test(email.value) ||
      !nameRegex.test(city.value) ||
      !addressRegex.test(address.value)
    ) {
      alert("Veuillez remplir correctement tous les champs du formulaire");
    } else {
      /* si produit dans local storage et formulaire correct*/
      //création d'un tableau pour récuperer les ID produits
      let productIdCart = [];
      for (let i = 0; i < panier.length; i++) {
        productIdCart.push(panier[i].articleId);
      }
      console.log(productIdCart);

      let orderObject = {
        contact: {
          firstName: firstName.value,
          lastName: lastName.value,
          address: address.value,
          city: city.value,
          email: email.value,
        },
        products: productIdCart,
      };

      const postOptions = {
        method: "POST",
        body: JSON.stringify(orderObject),
        headers: {
          Accept: "application/json",
          "Content-type": "application/json",
        },
      };
      //Appel de l'API pour post les infos de la commande
      fetch("http://localhost:3000/api/products/order", postOptions)
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          const orderId = data.orderId;
          //envoie vers la page de de confirmation
          window.location.href = "confirmation.html" + "?orderId=" + orderId;
        })
        .catch((error) => {
          alert(error);
        });
    }
  });
}

orderCart();
