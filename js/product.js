//permet de récupérer l'URl de la page produit
var str = window.location.href;
var url = new URL(str);

// liste des constantes identifiant les éléments du produit sur la page produit.html
const idProduct = url.searchParams.get("id");
const itemImg = document.getElementsByClassName("item__img");
const itemName = document.getElementById("title");
const itemDescription = document.getElementById("description");
const itemColors = document.getElementById("colors");
const itemPrice = document.getElementById("price");
const itemQuantity = document.getElementById("quantity");
const btnAddToCart = document.getElementById("addToCart");

//récuperation des produits via l'API
fetch("http://localhost:3000/api/products/" + idProduct)
    .then((res) => {
        return res.json();
    })
    .then(function (value) {
        itemImg[0].innerHTML += getImage(value);
        itemName.innerHTML += getName(value);
        itemDescription.innerHTML += getDescription(value);
        itemColors.innerHTML += getColors(value);
        itemPrice.innerHTML += getPrice(value);
    });

//intégration d'éléments dynamiques dans le DOM via la technique de concaténation
function getImage(product) {
    var img =
        '<img src="' +
        product.imageUrl +
        '" alt="' +
        product.altTxt +
        '"></img>';

    return img;
}
function getName(product) {
    var name = product.name;
    return name;
}
function getDescription(product) {
    var description = product.description;
    return description;
}
function getColors(product) {
    var colors;
    for (let i = 0; i < product.colors.length; i++) {
        colors +=
            '<option value="' +
            product.colors[i] +
            '">' +
            product.colors[i] +
            "</option>";
    }
    return colors;
}
function getPrice(product) {
    var price = product.price;
    return price;
}

// ajouter des produits au panier
btnAddToCart.onclick = addToCart;

let panier;

function getPanier() {
    panier = JSON.parse(localStorage.getItem("panier"));
    if (panier === null) {
        panier = [];
    }
}

function updatePanier() {
    localStorage.setItem("panier", JSON.stringify(panier));
}

function addToCart() {
    let article = {
        articleId: idProduct,
        articleColor: itemColors.value,
        articleQuantity: Number(itemQuantity.value),
    };
    getPanier();

    if (
        article.articleColor !== "" &&
        article.articleQuantity > 0 &&
        article.articleQuantity <= 100
    ) {
        if (
            panier.find(
                (product) =>
                    product.articleColor === article.articleColor &&
                    product.articleId === article.articleId
            )
        ) {
            let productIndex = panier.findIndex(
                (product) =>
                    product.articleColor === article.articleColor &&
                    product.articleId === article.articleId
            );
            panier[productIndex].articleQuantity += article.articleQuantity;
            updatePanier();
            alert("votre produit a bien été ajouté au panier");
            //si l'article est déja dans le panier, on modifie seulement la quantité.
        } else {
            panier.push(article);
            updatePanier();
            alert("votre produit a bien été ajouté au panier");
        }
    } else {
        alert("veuillez entrer une quantité et une couleur.");
    }
}
