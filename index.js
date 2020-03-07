const products = [
        {"id": 1, "name": "Wheat", "price": 2.35, "quantity": 5, imgSrc:"Heads-wheat-grains.jpg"},
        {"id": 2, "name": "Mango", "price": 3.5, "quantity": 10, imgSrc:"mangoes-chopped-and-fresh.jpg"},
        {"id": 3, "name": "Bread", "price": 5.5, "quantity": 10, imgSrc:"yeast bread.jpg"},
        {"id": 4, "name": "vegetables", "price": 7.4, "quantity": 10, imgSrc:"intro_cream_of_crop.jpg"},
        {"id": 5, "name": "oranges", "price": 1.7, "quantity": 10, imgSrc:"darling-oranges-1.png"}
        ];

var selected_items = [];
const ITEMS_KEY = "products.key";



function addItem({id, name, price, quantity}){
    //var id = Date.now();
    if(selected_items == null){
        selected_items = []
    }
    selected_items.push({id:id, name:name, price:price, quantity:1})
}

/*
function removeItem(name){
    selected_items = JSON.parse(localStorage.getItem(ITEMS_KEY))
    console.log("remove items function called...####")
    if(selected_items != null){
        console.log("selected items are not null")
        selected_items.find((item, index) => {
            if(item.name == name){
                selected_items.splice(index, 1)
                return item
            }
        })
    }
}
*/

function removeItem(id){
    selected_items = JSON.parse(localStorage.getItem(ITEMS_KEY))
    console.log("remove items function called...####")
    if(selected_items != null){
        console.log("selected items are not null")
        selected_items.find((item, index) => {
            if(item.id == id){
                selected_items.splice(index, 1)
                return item
            }
        })
    }
}



function save(){
    localStorage.setItem(ITEMS_KEY, JSON.stringify(selected_items))
}

var container = document.getElementsByClassName('container')[0]
console.log(container)

console.log(products)
products.forEach(product => {
    if(product.quantity > 0){
        container.append(getItemsContainer(product))
    }
})

//container.append(getItemsContainer({"name": "Wheat", "price": "2.35"}))
//console.log(items_container)


function getItemsContainer({id, name, price, imgSrc}){
    var items_container = document.createElement('div')
    items_container.classList.add('items-Container')
    
    var content = `<div class="image-container">
                    <img class="avatar" src="images/${imgSrc}" alt="photo">
                    </div>
                    <div class="info-container" id="${id}">
                    <div class="info">Name: ${name}</div>
                    <div class="info">price: ${price}</div>
                    <div class="info"><button class="add_to_cart">Add To Cart!</button></div>
                    </div>`
    items_container.innerHTML = content
    return items_container
}




function onCheckoutClick(){
    
    if(isCartEmpty()){
        alert("no item")
    }
    else{
        var picked_items = document.getElementsByClassName("picked-items")[0]
        picked_items.innerHTML = null
        fetchCartItems()
        var popup_container = document.getElementsByClassName("popup-container")[0]
        var popup_container_background = document.getElementById("background")
        console.log(popup_container)
        
        if(!popup_container.hasAttribute("style")){
            //popup_container.setAttribute("style", "visibility: visible;")
            popup_container.style.setProperty("opacity", 1)
            popup_container.style.setProperty("visibility", "visible")
            popup_container_background.style.visibility = "visible"
            //popup_container.style.opacity = "1"
            updateTotalItems()
            updateTotalPrice()
            updateBabage(getItemsLocalStorage())
        }
        else{
            if(popup_container.style.visibility == "visible"){
                popup_container.style.setProperty("opacity", "0")
                popup_container.style.setProperty("visibility", "hidden")
                //popup_container.style.visibility = "hidden"
                //popup_container.style.opacity = "0"
            }
            else{
                popup_container.style.setProperty("opacity", "1")
                popup_container.style.setProperty("visibility", "visible")
                popup_container_background.style.visibility = "visible"
                //popup_container.style.opacity = "1"
                updateTotalItems()
                updateTotalPrice()
                updateBabage(getItemsLocalStorage())
            }
        }
    }

    
}

function isCartEmpty(){
    selected_items = JSON.parse(localStorage.getItem(ITEMS_KEY))
    console.log(selected_items)

    if(selected_items.length == 0){
        //document.getElementsByClassName("order-now")[0].disabled = true
        //alert("disable place order")
        return true
    }
    else{
        return false
    }
    
}

function fetchCartItems() {
    selected_items = JSON.parse(localStorage.getItem(ITEMS_KEY))
    console.log(selected_items)

    //if there is no item in localstorage then disable orderNow button
    if(isCartEmpty()){
        alert("no items found in localstorage.")
    }
    else{

        var picked_items = document.getElementsByClassName("picked-items")[0]
        var picked_item = document.createElement('div')
        picked_item.classList.add('picked_item')
        picked_item.innerHTML = `<table class="items-table"></table>`
        console.log(picked_item)
        console.log(picked_item.children[0])
        if(selected_items != null){
            selected_items.forEach((item, index) => {
                picked_item.children[0].append(generatePickedItemElement(++index, item))
            })
            console.log(picked_item)
            picked_items.append(picked_item)
        }
    }
    //----------
    
    
}

function generatePickedItemElement(index, {id, name , price, quantity}){
    
    var table_row = document.createElement('tr')
    table_row.classList.add("active")
    var content = `<td><div>${index}</div></td>
                            <td><div>${name}</div></td>
                            <td><div>${price}</div></td>
                            <td><div><input id="${id}" class="quantity" name="quantity" type="number" value="${quantity}" min="1" max="${getProductById(id).quantity}" onChange="onQuantityChange(event)" style="width: 40px;"></td>
                            </div><td>
                            <div><button id="${id}" class="remove-item">remove</button></div>
                            </td>
                    `
    table_row.innerHTML = content
    return table_row
}


document.addEventListener('click', (event) => {
    console.log(event.target)
    console.log(event.target.children)
    console.log(event.target.parentElement)
    console.log(event.target.className)

    if(event.target.className == "add_to_cart") {
        
        var parent = event.target.parentElement.parentElement
        
        var id = parseInt(parent.getAttribute("id"))
        var product = getProductById(id)
        console.log(product)


        if(!isSelected(product.id)){
            
            addItem(product)
            save()
            updateBabage(getItemsLocalStorage())
        }
        else{
            alert("The item is aleary exist in Cart.")
        }
        

    }
    
    var popup_container = document.getElementsByClassName("popup-container")[0]
    
    if((event.target.className != "checkout-btn") && popup_container.style.visibility == "visible"){
        console.log("yes block")

        if(event.target.className == "popup-container" || event.target.parentElement.className == "popup-container"){
            console.log("dont hide it")
        }
        else{
            console.log("hide it")
        }
    }

    if(event.target.className == "remove-item") {
        var id = parseInt(event.target.getAttribute("id"))
        var productRow = event.target.parentElement.parentElement.parentElement
        productRow.classList.remove("active")

        removeItem(id)
        save()

        setTimeout(() => {
            productRow.remove()
            console.log(isCartEmpty())
        }, 500);

        updateTotalItems(event)
        updateTotalPrice()
        updateBabage(getItemsLocalStorage())

        
    }

    if(event.target.className == "popup_back-Container"){
        var popup_container = document.getElementsByClassName("popup-container")[0]
        var popup_container_background = document.getElementById("background")
        popup_container.style.setProperty("opacity", "0")
        popup_container.style.setProperty("visibility", "hidden")
        popup_container_background.style.visibility = "hidden"
    }

    if(event.target.name == "add"){
        var babage = document.getElementsByClassName('babage')[0]
        var num = parseInt(babage.innerText)
        console.log(num)
        babage.innerText = num+1

        var elem = document.createElement('div')
        elem.innerText = "item "+ (num+1)

        var picked_items = document.getElementsByClassName("picked-items")[0]
        picked_items.append(elem)
    }
    
})


var picked_items = document.getElementsByClassName("picked-items")[0]
console.log(picked_items)
console.log(picked_items.childElementCount)

var add = document.getElementsByName("add")[0]
console.log(add)


console.log(document.readyState)


function getTotalItems(){
    var quantity = document.getElementsByName("quantity")
    return quantity
}

function getTotalItemsLocalStorage() {
    var totalItems = 0 
    selected_items = JSON.parse(localStorage.getItem(ITEMS_KEY))
    selected_items.forEach(product => {
        totalItems += product.quantity
    })
    return totalItems
}

function getItemsLocalStorage() {
    selected_items = JSON.parse(localStorage.getItem(ITEMS_KEY))
    return selected_items.length
}

/*
function updateTotalItems() {
    var total = 0
    var totalItems = getTotalItems()
    totalItems.forEach(item => {

        var id = parseInt(item.getAttribute("id"))
        console.log(id)
        var maxQuantity = getProductById(id).quantity
        console.log(parseInt(item.value))
        var quantity = parseInt(item.value)
        
        if(quantity < 1) {
            item.value = 1
            quantity = 1
        }
        else if(quantity > maxQuantity){
            item.value = maxQuantity
            quantity = maxQuantity
        }
        total += quantity
    })

    var total_items = document.getElementsByName("total-items")[0]
    total_items.innerText = total
}
*/

function updateTotalItems(event) {
    console.log(event)
    if(event) {
        var inputValue = parseInt(event.target.value)
        var productId = parseInt(event.target.getAttribute("id"))
        event.target.value = getQuantityFromInvalidQuantity(productId, inputValue)
    }

    var totalItems = getTotalItemsLocalStorage()
    console.log(totalItems)
    var total_items = document.getElementsByName("total-items")[0]
    total_items.innerText = totalItems
}

if(document.readyState != "complete"){
    console.log("document is not ready. status: "+document.readyState)
    document.addEventListener("DOMContentLoader", ()=> {
        console.log("document is ready now!")
    })
}
else{
    ready()
}

function ready(){
    getTotalItems()
    console.log("calling ready function")
}


function onQuantityChange(event) {
    console.log("onQuantityChange..........function")
    //console.log(event.target)
    //console.log(event.target.getAttribute("id"))

    var id = parseInt(event.target.getAttribute("id"))
    var quantity = parseInt(event.target.value)

    console.log(id, getQuantityFromInvalidQuantity(id, quantity))

    updateQuantityLocalStorage(id, getQuantityFromInvalidQuantity(id, quantity))
    save()
    updateTotalItems(event)
    updateTotalPrice()
    //updateBabage(getTotalItemsLocalStorage())
}


function getQuantityFromInvalidQuantity(id, quantity) {
    console.log(id, quantity)
    var maxQuantity = getProductById(id).quantity

    if(quantity < 1){
        return 1
    }
    else if(quantity > getProductById(id).quantity) {
        return maxQuantity
    }
    else{
        return quantity
    }
}

/*
function updateTotalPrice(){
    var totalPrice = 0
    var items_table = document.getElementsByClassName("items-table")[0].rows
    console.log(items_table)

    for(i=0; i<items_table.length; i++){
        var price = items_table[i].cells[2].innerText
        var quantity = items_table[i].cells[3].firstElementChild.value
        console.log(items_table[i])
        console.log(price, quantity)
        price = parseFloat(price)
        quantity = parseInt(quantity)
        totalPrice += (price * quantity)
        console.log(totalPrice)

        
    }

    totalPrice = Math.round(totalPrice * 100) / 100
    var total_price = document.getElementsByName("total-price")[0]
    console.log(total_price)
    total_price.innerText = totalPrice
}

*/

function updateTotalPrice(){
    var total_price = document.getElementsByName("total-price")[0]
    var totalPrice = 0

    selected_items = JSON.parse(localStorage.getItem(ITEMS_KEY))
    if(selected_items != null) {
        selected_items.forEach(product => {
            totalPrice += (product.price * product.quantity)
        })
    }
    
    totalPrice = Math.round(totalPrice * 100) / 100
    total_price.innerText = totalPrice
}


function orderNow(){
    var totalItems = document.getElementsByName("total-items")[0].innerText
    var totalPrice = document.getElementsByName("total-price")[0].innerText

    console.log("order placed successfully \ntotal items: "+totalItems+"\ntotal price: "+totalPrice)
    alert("order placed successfully \ntotal items: "+totalItems+"\ntotal price: "+totalPrice)
}


function updateBabage(number = 0){
    if(typeof(number) == "number"){
        console.log(number)
        var babage = document.getElementsByClassName("babage")[0]
        babage.innerText = number
    }
}




/*
function getTotalItemsLocalStorage(){
    selected_items = JSON.parse(localStorage.getItem(ITEMS_KEY))
    if(selected_items != null) {
        console.log(selected_items.length)
        return selected_items.length
    }
    
}
*/

function isSelected(id){
    selected_items = JSON.parse(localStorage.getItem(ITEMS_KEY))
    if(selected_items != null) {
        var isSelected = selected_items.find(item => item.id === id)
        return isSelected
    }
    
}

function updateQuantityLocalStorage(id, quantity){
    selected_items = JSON.parse(localStorage.getItem(ITEMS_KEY))
    console.log(selected_items)
    if(selected_items != null) {
        selected_items.find(item => {
            if(item.id === id){
                item.quantity = parseInt(quantity)
            }
        })
    }
}






const products2 = [
    {"id": 1, "name": "Wheat", "price": "2.35", "quantity": 5},
    {"id": 2, "name": "Mango", "price": "3.5", "quantity": 10},
    {"id": 3, "name": "Bread", "price": "5.5", "quantity": 10},
    {"id": 4, "name": "vegetables", "price": "7.4", "quantity": 10},
    {"id": 5, "name": "oranges", "price": "1.7", "quantity": 10}
    ];


var _id = 1
var pro = products2.find(product => {
    if(product.id = _id) {
        product.quantity = 10
    }  
})

console.log(pro)

console.log(products2)





























function getProductById(id){
    return products.find(product => product.id === id)
}

console.log(getProductById(1))






updateBabage(getItemsLocalStorage())