const cl = console.log;

const proName = document.getElementById("proName");
const model = document.getElementById("model");
const price = document.getElementById("price");
const category = document.getElementById("category");
const image = document.getElementById("image");
const addPro = document.getElementById("addPro");
const updatePro = document.getElementById("updatePro");
const productContainer = document.getElementById("productContainer");
// cl(productContainer)
const spinner = document.getElementById("spinner");
const prodForm = document.getElementById("prodForm");

const base_url = `https://bhagyashri-s-first-database-default-rtdb.firebaseio.com`;
const product_url = `${base_url}/products.json`;

//state mngment

let state = {
  productArr: [],
  editId: null,
};

//snackbar function
function snackbar(msg, icon) {
  Swal.fire({
    title: msg,
    icon: icon,
    timer: 3000,
  });
}

//spinner function

function spinnerHandler(flag) {
  if (flag) {
    spinner.classList.remove("d-none");
  } else {
    spinner.classList.add("d-none");
  }
}

//function nestedObjtoArr

function nestedObjtoArr(obj) {
  for (const key in obj) {
    obj[key].id = key;
    state.productArr.unshift(obj[key]);
  }
}

//rendering
function rendering(arr) {
  let res = "";

  arr.forEach((ele, i) => {
    res += `<tr id="${ele.id}">
                                    <td>${i + 1}</td>
                                    <td>${ele.productName}</td>
                                    <td>${ele.model}</td>
                                    <td>${ele.price}</td>
                                    <td>${ele.category}</td>
                                    <td><img src="${ele.image}" alt=""></td>
                                    <td class="ml-4"><button onclick="onEdit(this)" class="btn btn-sm btn-warning text-white">Edit</button>
                                    </td>
                                    <td class="ml-4"><button onclick="onRemove(this)" class="btn btn-sm btn-danger text-white ">Remove</button>
                                    </td>
                                </tr>`;
  });
  productContainer.innerHTML = res;
}

function fetchProducts() {
  spinnerHandler(true);
  fetch(product_url, {
    method: "GET",
    body: null,
    headers: {
      "content-type": "application/json",
      auth: "JWT token",
    },
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error("error");
      }
      return res.json();
    })
    .then((data) => {
      // cl(data)
      nestedObjtoArr(data);
      rendering(state.productArr);
    })
    .catch((err) => {
      cl(err);
      snackbar(err, "error");
    })
    .finally(() => {
      spinnerHandler();
    });
}

fetchProducts();

//create

function onSubmit(eve) {
  eve.preventDefault();

  let newProd = {
    productName: proName.value,
    model: model.value,
    price: price.value,
    image: image.value,
    category: category.value,
  };
  // cl(category.value)
  // cl('hjbjhbjhb')

  spinnerHandler(true);

  fetch(product_url, {
    method: "POST",
    body: JSON.stringify(newProd),
    headers: {
      "content-type": "application/json",
      auth: "JWT token",
    },
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error("error");
      }
      return res.json();
    })
    .then((data) => {
      newProd.id = data.name;
      state.productArr.unshift(newProd);

      let tr = document.createElement("tr");
      tr.id = data.name;
      tr.innerHTML = `<td>${state.productArr.length}</td>
                                    <td>${newProd.productName}</td>
                                    <td>${newProd.model}</td>
                                    <td>${newProd.price}</td>
                                    <td>${newProd.category}</td>
                                    <td><img src="${newProd.image}" alt=""></td>
                                    <td class="ml-4"><button onclick="onEdit(this)" class="btn btn-sm btn-warning text-white">Edit</button>
                                    </td>
                                    <td class="ml-4"><button onclick="onRemove(this)" class="btn btn-sm btn-danger text-white ">Remove</button>
                                    </td>`;
      productContainer.prepend(tr);
      let srno = document.querySelectorAll(
        "#productContainer tr td:first-child",
      );
      srno.forEach((e, i) => {
        e.innerText = i + 1;
      });
      prodForm.reset();
    })
    .catch((err) => {
      cl(err);
      snackbar(err, "error");
    })
    .finally(() => {
      spinnerHandler();
    });
}

//edit

function onEdit(ele) {
  let editId = ele.closest("tr").id;
  // cl(editId)

  state.editId = editId;

  let editObj = state.productArr.find((e) => e.id === editId);
  // cl(editObj)

  proName.value = editObj.productName;
  model.value = editObj.model;
  price.value = editObj.price;
  category.value = editObj.category;
  image.value = editObj.image;

  addPro.classList.add("d-none");
  updatePro.classList.remove("d-none");
}

//update

function onUpdate() {
  let updateId = state.editId;
  // cl(updateId)

  let updateObj = {
    productName: proName.value,
    model: model.value,
    price: price.value,
    image: image.value,
    category: category.value,
  };

  let update_url = `${base_url}/products/${updateId}.json`;
  spinnerHandler(true);

  fetch(update_url, {
    method: "PATCH",
    body: JSON.stringify(updateObj),
    headers: {
      "content-type": "apllication/json",
      auth: "JWT token",
    },
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error("error");
      }
      return res.json();
    })
    .then((data) => {
      let getIndex = state.productArr.find((e) => e.id === updateId);
      state.productArr[getIndex] = updateObj;

      let tr = document.getElementById(updateId).children;
      tr[1].innerText = updateObj.productName;
      tr[2].innerText = updateObj.model;
      tr[3].innerText = updateObj.price;
      tr[5].innerText = updateObj.category;
      tr[4].innerText = updateObj.image;

      prodForm.reset();
      snackbar(
        `Product with name ${updateObj.productName} updated successfully`,
        "success",
      );

      addPro.classList.remove("d-none");
      updatePro.classList.add("d-none");
    })
    .catch((err) => {
      cl(err);
      snackbar(err, "error");
    })
    .finally(() => {
      spinnerHandler();
    });
}

//remove

function onRemove(ele) {
  let removeId = ele.closest("tr").id;
  // cl(removeId)

  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
        spinnerHandler(true)
      let remove_url = `${base_url}/products/${removeId}.json`;

      fetch(remove_url, {
        method: "DELETE",
        body: null,
        headers: {
          "content-type": "application/json",
          auth: "JWT token",
        },
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error("error");
          }
          return res.json();
        })
        .then((data) => {
          let get_idx = state.productArr.findIndex((e) => e.id === removeId);
          state.productArr.splice(get_idx, 1);

          ele.closest("tr").remove();

          let srno = document.querySelectorAll(
            "#productContainer tr td:first-child",
          );
          srno.forEach((e, i) => {
            e.innerText = i + 1;
          });
        })
        .catch(err =>{
            cl(err)
            snackbar(err,'error')
        })
        .finally(()=>{
            spinnerHandler()
        })
    }
  });
}

prodForm.addEventListener("submit", onSubmit);
updatePro.addEventListener("click", onUpdate);
