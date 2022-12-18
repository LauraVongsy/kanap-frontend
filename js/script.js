//Récupération des produits de l'API
fetch("http://localhost:3000/api/products/")
    .then(function (res) {
        if (res.ok) {
            return res.json();
        }
    })
    .then(function (value) {
        value.forEach((product) => {
            document.getElementById("items").innerHTML += getArticle(product);
        });
    }); //pour chaque value restituée par l'API on applique la fonction ci dessus

//intégration d'élements dynamiques dans le HTML
function getArticle(product) {
    var article = '<a href="./product.html?id=' + product._id + ' ">';
    article += "<article>";
    article +=
        ' <img src="' + product.imageUrl + '" alt="' + product.altText + '">';
    article += ' <h3 class="productName">' + product.name + "</h3> ";
    article += '<p class="productDescription">' + product.description + "</p>";
    article += " </article>";
    article += "</a>";
    return article;
}
