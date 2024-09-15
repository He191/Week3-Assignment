let cookieCount = (localStorage.getItem("cookieCount") === null) ? 0 : Number(localStorage.getItem("cookieCount"));
let cookiePerSecond = (localStorage.getItem("cookiePerSecond") === null) ? 1 : Number(localStorage.getItem("cookiePerSecond"));
let apiDataLength = 0;

// store the shop Upgrade from the API
async function getShopUpgrade(){
    const response = await fetch ("https://cookie-upgrade-api.vercel.app/api/upgrades");
// I need my data to be written in json.
    const data = await response.json();
    return data;
}

// I am going to make a function that displays the data on my page with using of DOM element.
//const upgradeContainer = document.getElementById("shopupgrade-container");
const upgradeContainer = document.getElementById("shopupgrade-container");

// Reference to the "Cookies Per Second" element
const cookiesPerSecondElement = document.getElementById("cookies-per-second");
const cookiesTotal = document.getElementById("cookies-total");

function creatshopupgrade(id,name,cost,increase){
    
    const cookieRaw = document.createElement("section");
    cookieRaw.id = "cookie-raw";
    upgradeContainer.appendChild(cookieRaw);

    const purchasedQuantityLocal = document.createElement("h3");
    const nameLocal = document.createElement("h3");
    const costLocal = document.createElement("h3");
    const increaseLocal = document.createElement("h3");
    const buttonLocal = document.createElement("button");

    purchasedQuantityLocal.textContent= (localStorage.getItem(`purchased-quantity`+id) === null) ? 0 : Number(localStorage.getItem(`purchased-quantity`+id));
    purchasedQuantityLocal.id="purchased-quantity"+id;
    purchasedQuantityLocal.className="purchased-quantity";
    nameLocal.textContent=name;
    costLocal.textContent="$c "+cost;
    increaseLocal.textContent="+"+increase;
    buttonLocal.textContent="Buy";
    buttonLocal.id="buy-button"+id;
    
    cookieRaw.appendChild(purchasedQuantityLocal);
    cookieRaw.appendChild(nameLocal);
    cookieRaw.appendChild(costLocal);
    cookieRaw.appendChild(increaseLocal);
    cookieRaw.appendChild(buttonLocal);
}

// Function to update the cookies per second display
function updateCookiesPerSecond() {
    cookiesPerSecondElement.textContent = `Cookies Per Second: ${cookiePerSecond}`;
    cookiesTotal.textContent = `Cookies Total: ${cookieCount}`;
}

async function displayshopUpgrade(){
    const shopupgradeData= await getShopUpgrade();
    apiDataLength = shopupgradeData.length;
    
    for (let i = 0 ; i < apiDataLength ; i++){

        creatshopupgrade(shopupgradeData[i].id,shopupgradeData[i].name,shopupgradeData[i].cost,shopupgradeData[i].increase);
        
        let purchasedQuantityId = "purchased-quantity"+(i+1);
        let purchasedQuantity = document.querySelector(`#${purchasedQuantityId}`);

        let buttonId = "buy-button"+(i+1);
        let buyButton = document.querySelector(`#${buttonId}`);
        
        buyButton.addEventListener("click",() => {
            if(cookieCount >= shopupgradeData[i].cost){
                cookiePerSecond = cookiePerSecond + shopupgradeData[i].increase;
                cookieCount = cookieCount - shopupgradeData[i].cost;
                purchasedQuantity.textContent = Number(purchasedQuantity.textContent) + 1;
            }
        })

    }

}

// Example of how to update cookiesPerSecond (you should call this function when cookiesPerSecond changes)
function incrementCookies() {
    cookieCount += cookiePerSecond;
    updateCookiesPerSecond();

    localStorage.setItem("cookiePerSecond",cookiePerSecond);
    localStorage.setItem("cookieCount",cookieCount);

    for (let i = 0 ; i < apiDataLength ; i++){

        let purchasedQuantityId = "purchased-quantity"+(i+1);
        let purchasedQuantity = document.querySelector(`#${purchasedQuantityId}`);

        localStorage.setItem(purchasedQuantityId,purchasedQuantity.textContent);
    }
}

function main(){

    displayshopUpgrade();
    setInterval(incrementCookies,1000);

    const cookieButton = document.querySelector("#cookie-button");
    cookieButton.addEventListener("click",() => {
        cookieCount = cookieCount + 100;
    })

    const resetButton = document.querySelector("#reset-button");
    resetButton.addEventListener("click",() => {
        cookieCount =0;
        cookiePerSecond=1;

        for (let i = 0 ; i < apiDataLength ; i++){

            let purchasedQuantityId = "purchased-quantity"+(i+1);
            let purchasedQuantity = document.querySelector(`#${purchasedQuantityId}`);
    
            purchasedQuantity.textContent = 0;
            
        }
    })

}

main();

    