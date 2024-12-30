let title = document.getElementById('title');
let price = document.getElementById('price');
let taxes = document.getElementById('taxes');
let ads = document.getElementById('ads');
let discount = document.getElementById('discount');
let total = document.getElementById('total');
let count = document.getElementById('count');
let category = document.getElementById('category');
let submit = document.getElementById('submit');
let mood = 'create';
let tmp;

//get total
function getTotal() {
    if (price.value != '') {
        let result = (+price.value + +taxes.value + +ads.value) - +discount.value;
        total.innerHTML = result;
        total.style.background = '#040';
        total.style.display = "inline-block";

    }
    else {
        total.innerHTML = '';
        total.style.display = "none";
    }
}

//create product
let dataPro;
if (localStorage.products != null) {
    dataPro = JSON.parse(localStorage.products)
} else {
    dataPro = [];
}

submit.onclick = function () {

    let newPro = {
        title: title.value.toLowerCase(),
        price: price.value,
        taxes: taxes.value,
        ads: ads.value,
        discount: discount.value,
        total: total.innerHTML,
        count: count.value,
        category: category.value.toLowerCase(),
    }

    //clean data
    if (title.value != ''
        && price.value != ''
        && category.value != ''
        && newPro.count <= 100) {
        //count product
        if (mood === 'create') {
            if (newPro.count > 1) {
                for (let i = 0; i < newPro.count; i++) {
                    dataPro.push(newPro);

                }
            } else {
                dataPro.push(newPro);
            }
        } else {
            dataPro[tmp] = newPro;
            mood = 'create';
            submit.innerHTML = 'Create';
            count.style.display = 'block';
        }
        clearData()
    }

    //save data
    localStorage.setItem('products', JSON.stringify(dataPro))

    showData()
}

//clear inputs
function clearData() {
    title.value = '';
    price.value = '';
    taxes.value = '';
    ads.value = '';
    discount.value = '';
    total.innerHTML = '';
    count.value = '';
    category.value = '';
}

//read data
function showData() {
    getTotal();
    let table = '';
    for (let i = 0; i < dataPro.length; i++) {
        table += `
                <tr>
                    <td>${i + 1}</td>
                    <td>${dataPro[i].title}</td>
                    <td>${dataPro[i].price}</td>
                    <td>${dataPro[i].taxes}</td>
                    <td>${dataPro[i].ads}</td>
                    <td>${dataPro[i].discount}</td>
                    <td>${dataPro[i].total}</td>
                    <td>${dataPro[i].category}</td>
                    <td><button onclick="updateData(${i})" id="update">Update </button></td>
                    <td><button onclick="deleteData(${i})" id="delete">Delete</button></td>
                </tr>
        `;
    }
    document.getElementById('tbody').innerHTML = table;

    let btnDelete = document.getElementById('deleteAll');
    if (dataPro.length > 0) {
        btnDelete.innerHTML = `
        <button onclick="deleteAll()">Delete All (${dataPro.length})</button>
        `
    } else {
        btnDelete.innerHTML = '';
    }

}
showData()


//delete product
function deleteData(i) {
    if (confirm("Are you sure you want to delete this product?")) {
        dataPro.splice(i, 1);
        localStorage.products = JSON.stringify(dataPro);
        showData();
    }
}

function deleteAll() {
    if (confirm("Are you sure you want to delete all products?")) {
        localStorage.clear();
        dataPro.splice(0);
        showData();
    }
}


//update product

function updateData(i) {
    title.value = dataPro[i].title;
    price.value = dataPro[i].price;
    taxes.value = dataPro[i].taxes;
    ads.value = dataPro[i].ads;
    discount.value = dataPro[i].discount;
    getTotal();
    count.style.display = 'none';
    category.value = dataPro[i].category;
    submit.innerHTML = 'Update';
    mood = 'update';
    tmp = i;
    scroll({
        top: 0,
        behavior: 'smooth',
    })
}

//search
let searchMood = 'title';
function getSearchMood(id) {
    let search = document.getElementById('search');
    if (id == 'searchTitle') {
        searchMood = 'title';
    } else {
        searchMood = 'category'
    }
    search.placeholder = 'Search By ' + searchMood;
    search.focus();
    search.value = '';
    showData();
}

function searchData(value) {
    let table = '';
    let filteredData = [];

    for (let i = 0; i < dataPro.length; i++) {
        if (searchMood === 'title' && dataPro[i].title.includes(value.toLowerCase())) {
            filteredData.push(dataPro[i]);
        } else if (searchMood === 'category' && dataPro[i].category.includes(value.toLowerCase())) {
            filteredData.push(dataPro[i]);
        }
    }

    // Generate table rows for the filtered data
    for (let i = 0; i < filteredData.length; i++) {
        table += `
            <tr>
                <td>${i + 1}</td>
                <td>${filteredData[i].title}</td>
                <td>${filteredData[i].price}</td>
                <td>${filteredData[i].taxes}</td>
                <td>${filteredData[i].ads}</td>
                <td>${filteredData[i].discount}</td>
                <td>${filteredData[i].total}</td>
                <td>${filteredData[i].category}</td>
                <td><button onclick="updateData(${dataPro.indexOf(filteredData[i])})" id="update">Update </button></td>
                <td><button onclick="deleteData(${dataPro.indexOf(filteredData[i])})" id="delete">Delete</button></td>
            </tr>
        `;
    }

    document.getElementById('tbody').innerHTML = table;

    // Update the "Delete All" button for filtered results
    let btnDelete = document.getElementById('deleteAll');
    if (filteredData.length > 0) {
        btnDelete.innerHTML = `
        <button onclick="deleteAllFiltered()">Delete All (${filteredData.length})</button>
        `;
    } else {
        btnDelete.innerHTML = '';
    }
}

// Function to delete all filtered items
function deleteAllFiltered() {
    if (confirm("Are you sure you want to delete all filtered products?")) {
        let searchValue = document.getElementById('search').value.toLowerCase();
        dataPro = dataPro.filter(item => {
            if (searchMood === 'title') {
                return !item.title.toLowerCase().includes(searchValue);
            } else if (searchMood === 'category') {
                return !item.category.toLowerCase().includes(searchValue);
            }
            return true;
        });
        localStorage.setItem('products', JSON.stringify(dataPro));
        showData();
    }
}

// Button Scroll

let btnScroll = document.getElementById('btnScroll');

window.onscroll = function () {
    if (scrollY >= 400) {
        btnScroll.style.display = 'block';
    } else {
        btnScroll.style.display = 'none';
    }
}
btnScroll.onclick = function () {
    scroll({
        left: 0,
        top: 0,
        behavior: "smooth",
    })
}


