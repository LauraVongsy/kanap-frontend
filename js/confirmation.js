// recuperation de l'url et du numéro de commande
let searchString = window.location.search;
let urlParams = new URLSearchParams(searchString);
let orderId = urlParams.get('orderId');

//intégration du numéro de commande dans l'HTML
let orderNumber = document.getElementById('orderId');
orderNumber.innerHTML = orderId + ' <br> Merci de votre commande ! <br> A bientôt';

//suppression du localStorage
let removeStorage = window.localStorage;
removeStorage.clear();