console.log("U ovom malom projektu nije naglasak na dizajnu stranice!")
console.log("Pokraj svakog reda u kodu je pomocu komentara objasnjenjo zasto koristimo isti!");
console.log("Ivica M | imartinkovic97@gmail.com");
let carts = document.querySelectorAll('.acart'); //Provjera svih dodanih itema pod classom acart
let CouponIsUsed = localStorage.getItem("UsedCoupon"); //Provjera iskoristenosti kupona(dodano na početak zbog više provjera)
let products = [
    {name: "Iphone 13 pro max",tag:"iphone13promax", img:"1.jpg" ,price: 900,AddedtoCart: 0}, //0
    {name: "Samsung Galaxy S22",tag:"sgs22", img:"2.jpg" ,price: 800,AddedtoCart: 0}, //1
    {name: "PlayStation 5",tag:"ps5", img:"3.jpg" ,price: 650,AddedtoCart: 0}, //2
    {name: "XBOX",tag:"xbox", img:"4.jpg" ,price: 700,AddedtoCart: 0}  //3
]

for(let i=0; i < carts.length; i++)
{
    carts[i].addEventListener("click", () => { //klikom na svaki "cart" dodat ce isti u kosaricu
        cartsNum(products[i]); //products[i] oznacava na koji proizvod je kliknuto, sto ce nam biti potrebno za dodavanje odabranog proizvoda u kosaricu
        Cost(products[i]);//Dodavanje proizvoda pomocu kojeg cemo izracunati cijenu za odabrani proizvod
    })
}
function OnLoad() //kod svakog refresha stranice, povlacit ce podatke iz l.storage AKO postoje(moramo ju manualno pozivati)
{

    let prodNumber = localStorage.getItem("cartsNum"); //
    if(prodNumber) {
        document.querySelector(".cart span").textContent = prodNumber; //Promjena broja proizvoda u kosarici
    }
}
function cartsNum(product) {
    let prodNumber = localStorage.getItem("cartsNum"); //default je string
    prodNumber = parseInt(prodNumber); //Dodano zbog zbrajanja, prodNumber je po defaultu string.
    if(prodNumber) //Ako prodNumber postoji u l.storage dodat će + 1
    {
        localStorage.setItem("cartsNum", prodNumber + 1);
        document.querySelector(".cart span").textContent = prodNumber + 1; //Promjena broja proizvoda u kosarici
    }
    else //Postavljanje cartsNum na 1(kako bih izbjegao NaN vrijednost) i ako prodNumber ne postoji u l.storage, postavit ce ga na 0
    {
        localStorage.setItem("cartsNum", 1);
        document.querySelector(".cart span").textContent = 1; //
    }
    setItems(product); //klikom na odabrani proizvod pozivamo funkciju koja ce dodati proizvod u l.storage
}
function Cost(product)
{
    let TotalPrice = localStorage.getItem("Total");

    if(TotalPrice != null) //Ako je drugacije od null dodat ce stare cijene i zbrojiti sa novim proizvodom
    {
        TotalPrice = parseInt(TotalPrice);//Iz stringa u broj
        localStorage.setItem("Total", TotalPrice + product.price);
    }
    else { //Ako prvi puta dodajemo proizvod dodat ce cijenu samog proizvoda
        localStorage.setItem("Total", product.price);
    }
}
function setItems(product)
{
    let cartItems = localStorage.getItem("productsAddinCart");//Učitava prijašnje proizvode dodane u kosaricu ukoliko postoje
    cartItems = JSON.parse(cartItems);
    if(cartItems != null)//Ako vec imamo dodan proizvod
    {
        if(cartItems[product.tag] == undefined) { //Ako je odabrani proizvod jednak undefined, dodajemo odabrani proizvod ostalim proizvodima koji se trenutno nalaze u l.storage pomocu JS operatora (...)
            cartItems  =  {
                ...cartItems,[product.tag]: product
            }
        }
        cartItems[product.tag].AddedtoCart += 1;
    }
    else //Ako nemamo dodan ni jedan proizvod 
    {
        product.AddedtoCart = 1;
        cartItems = {
            [product.tag]: product
        }
    }
    localStorage.setItem("productsAddinCart", JSON.stringify(cartItems)); //Koristimo json zato sto su products spremljeni u json formatu red:5
}

OnLoad(); //Manualno pozivanje funkcije za učitavanje spremljene kosarice
Cart(); //manualno pozivanje funkcije za ucitavanje proizvoda na cart stranici 

/*CART PAGE*/
function Cart()
{
    let cartItems = localStorage.getItem("productsAddinCart"); //ucitavanje proizvoda koji su dodani u kosaricu
    let totalPrice = localStorage.getItem("Total"); //ucitavanje cijene proizvoda koji su dodani u kosaricu
    cartItems = JSON.parse(cartItems) 
    let pContainer = document.querySelector(".products");
    
    if(cartItems) //Provjera postoji li ista spremljeno u l.storage pod "productsAddinCart"
    {
        pContainer.innerHTML = "";
        Object.values(cartItems).map(item => {
            pContainer.innerHTML += 
            `
            <div class="p-title">
            <img src="./img/${item.img}" />
            <span>${item.name}</span>
            </div>

            <div class="p-price">$${item.price}</div>

            <div class="p-items">
            
            <span style="margin:0px 10px 5px 10px"> ${item.AddedtoCart} </span> 
            </div>

            <div class="p-total">
            $${item.AddedtoCart * item.price}
            </div>
            `
        }); //Provjera objekata koji su dodani u kosaricu pomocu loopa
        pContainer.innerHTML += 
            `
            <div class="TotalPrice">
            <span class="priceTitle">
            TOTAL            
            </span>
            <span class="totalac">
            $${totalPrice},00
            </span></div>
            <div class="discount">
            <div class="discountInfo"><h5>Use coupon code: discount20</h5></div>
            <form onsubmit="">
            <label style="width:50px;">
            <input type="text" name="coupon" id="in" class="coupon" title="Enter coupon" >
            <span id="usernameError"></span></label>
            <input type="button" value="Submit" onClick="validate()" /></form>

            <span id="message"></span>
            <span id="error"></span>
            </div>
            <div class="empty" onClick="paynow()"><button>Pay now</button></div>
            <div class="empty" onClick="removeitems()"><button>Empty cart</button></div>
            `
            
            if(JSON.parse(CouponIsUsed) === true) //Ispisivanje poruke kod svakog refresha stranice
            {
                document.getElementById('message').innerHTML="Coupon applied!";
                document.getElementById('error').innerHTML="";
            }
    }
    else { pContainer.innerHTML = "Your cart is empty"; }

}

function validate() {
    //koristio sam var zato sto ce se popust samo u ovoj funkciji koristiti
    var mycoupon = "DISCOUNT20";
    var coupon = mycoupon.trim();
    var input = document.getElementById('in').value;
    
    if(input.toUpperCase() == coupon.toUpperCase()) {
        if(JSON.parse(CouponIsUsed) === true) //Ispisivanje poruke kod svakog refresha stranice
        {
            document.getElementById('message').innerHTML="";
            document.getElementById('error').innerHTML="Coupon is already used";
            return;
        }
        let totalPrice = localStorage.getItem("Total"); //ucitavanje cijene proizvoda koji su dodani u kosaricu
        Totalac = parseInt(totalPrice - 20); //Dobijeni string pretvaramo u Int kako bih mogli oduzeti 20(popust)
        localStorage.setItem("Total", Totalac); //Update konacne cijene
        localStorage.setItem("UsedCoupon", true); //Oznacavamo da je promotivni kod iskoristen(potrebno zbog provjere)
        location.reload();
        Cart();
        return true;
    } else {
        document.getElementById('error').innerHTML="Invalid coupon";
        document.getElementById('message').innerHTML="";
        return false;
    }
}
function removeitems()
{
    localStorage.clear(); //brisanje svega iz l.storagea
    location.reload();
}

