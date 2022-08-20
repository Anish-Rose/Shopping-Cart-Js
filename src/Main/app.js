//dom elements
let products = document.querySelector(".products");
let add = document.querySelectorAll(".add");
let minus = document.querySelectorAll(".minus");
let productCards = document.querySelector(".modal-body");
let cartContainer = document.querySelector(".cart-items");
let badge = document.querySelector(".fa-shopping-cart");
let cart = document.querySelector(".badge");
let searchItems = document.querySelector(".search");
let filterData = shoppingData;
let cartItem = JSON.parse(localStorage.getItem("data")) || [];

let itemCalculation = () => {
  try {
    cart.innerHTML = cartItem
      .map((prev) => prev.quantity)
      .reduce((x, y) => x + y);
  } catch (error) {
    cart.innerHTML = 0;
  }
};

let total = () => {
  try {
    let total = cartItem
      .map((cart) => {
        let search = shoppingData.find((product) => cart.id === product.id);
        return search.price * cart.quantity;
      })
      .reduce((x, y) => x + y);
    document.querySelector(".total").innerHTML = `₹${total}.00`;
  } catch (error) {
    document.querySelector(".total").innerHTML = "$0";
  }
};

//Product cards
let generateShop = () => {
  return (products.innerHTML = filterData
    .map((product) => {
      const { id, title, image, desc, price } = product;
      let search = cartItem.find((product) => product.id === id);
      return `
    <div class="products-container">
    <div class="product-image">
        <img src="${image}
            alt="Image Not Loaded">
    </div>
    <div class="product-details">
        <h2 class="title">${title}</h2>
        <p class="desc">${desc}</p>
        <p class="price">₹${price}</p>
        <div class="product-buttons">
            <i class="fa fa-plus add" aria-hidden="true" onclick=Add(${[
              id,
            ]})></i>
            <h1 class="quantity" id="${id}">${
        search === undefined ? 0 : search.quantity
      }</h1>
            <i class="fa fa-minus minus" aria-hidden="true" onclick=Minus(${[
              id,
            ]})></i>
        </div>
    </div>
  </div>`;
    })
    .join(""));
};

//cart items
let card = () => {
  if (cartItem.length != 0) {
    document.querySelector(".total").style.display = "block";
    const x = (productCards.innerHTML = cartItem
      .map((cart) => {
        let search = shoppingData.find((product) => cart.id === product.id);
        return `
          <table class="table table-image">
          <thead>
              <tr>
                  <th scope="col">Product</th>
                  <th scope="col">Title</th>
                  <th scope="col">Price</th>
                  <th scope="col">Qty</th>
                  <th scope="col">Total</th>
                  <th scope="col">Actions</th>
              </tr>
          </thead>
          <tbody>
              <tr class="">
                  <td class="w-25">
                      <img src="${search.image}"
                          class="img-fluid img-thumbnail" alt="Empty Cart">
                  </td>
                  <td>${search.title}</td>
                  <td>₹${search.price}</td>
                  <td class="qty">
                  <input type="number"  class="form-control cart-qty" id="input1"  value="${
                    cart.quantity
                  }">
                  </td>
                  <td>₹${cart.quantity * search.price}</td>
                  <td id="delete" onclick="DeleteItem(${cart.id})">
                      <a href="#" class="btn btn-danger btn-sm">
                          <i class="fa fa-times"></i>
                      </a>
                  </td>
              </tr>
          </tbody>
          </table>
        `;
      })
      .join(""));
  } else {
    document.querySelector(".total").style.display = "none";
    productCards.innerHTML = `
      <div class="modal-body d-flex justify-content-center align-items-center">
      <h2 class="  text-dark w-100 text-center">CART IS EMPTY</h2>
      <img src="https://img.icons8.com/external-flaticons-lineal-color-flat-icons/344/external-empty-cart-web-store-flaticons-lineal-color-flat-icons.png"></div>
      `;
  }
};

badge.addEventListener("click", () => card());

let Add = (id) => {
  let product = cartItem.find((product) => product.id == id);

  product === undefined
    ? cartItem.push({ id: id, quantity: 1 })
    : (product.quantity += 1);
  cartItem = cartItem.filter((product) => product.quantity != 0);
  card();
  generateShop();
  total();
  itemCalculation();
  localStorage.setItem("data", JSON.stringify(cartItem));
};

let Minus = (id) => {
  let product = cartItem.find((product) => product.id === id);

  if (product == undefined) return;
  else if (product.quantity === 0) return;
  else {
    product.quantity -= 1;
  }
  cartItem = cartItem.filter((product) => product.quantity != 0);
  generateShop();
  card();
  total();
  itemCalculation();
  localStorage.setItem("data", JSON.stringify(cartItem));
};

let DeleteItem = (id) => {
  cartItem = cartItem.filter((product) => product.id != id);
  generateShop();
  itemCalculation();
  card();
  total();
  localStorage.setItem("data", JSON.stringify(cartItem));
};
searchItems.addEventListener("input", (e) => {
  //search items
  let search = e.target.value;
  filterData = shoppingData.filter((product) => {
    return product.title.toLowerCase().includes(search.toLowerCase());
  });
  generateShop();
  if (filterData.length == 0) {
    products.innerHTML = `
    <div class="d-flex justify-content-center align-items-center ">
    <img src="https://www.wholesalegang.com/assets/imgs/noproduct.png" alt = "Product Not Found">
    </div>
    `;
  }
});

//Function Calls
generateShop();
itemCalculation();
card();
total();
