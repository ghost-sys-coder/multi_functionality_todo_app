//Get the Variables 

// Designing The Dark Theme 

const container = document.querySelector('.container');
const themeButton = container.querySelector(".btn");


//Saving Theme To LocalStorage
const darkMode = localStorage.getItem("darkMode");
console.log(darkMode);

function disableDarkMode() {
    themeButton.innerHTML=`<i class="fas fa-moon icon"></i>`;
    container.classList.remove("changeTheme");
    localStorage.setItem("darkMode", "disabled");
    console.log(darkMode);
}
function enableDarkMode() {
    themeButton.innerHTML=`<i class="fas fa-sun icon"></i>`;
    container.classList.add("changeTheme");
    localStorage.setItem("darkMode", "enabled");
    console.log(darkMode);
}
if(darkMode === "enabled") {
    enableDarkMode();
}
function switchTheme() {
    if(localStorage.getItem("darkMode") !== "enabled") {
        enableDarkMode();
        
    } else {
        disableDarkMode();
    }
}

themeButton.addEventListener("click", switchTheme);



//Adding Items to the List Functionality
const addButton = container.querySelector(".add--btn");
const inputBox = container.querySelector("#input");
const listContainer = container.querySelector(".lists");

//Error Function
function messageAlert(message, myClass) {
    const topCover = container.querySelector(".top__cover");
    const topContainerHeading = topCover.querySelector(".top__container--heading");


    const alertDIV = document.createElement("div");
    alertDIV.classList.add(myClass);
    const alertMsg = document.createElement("p");
    alertMsg.textContent = message;

    alertDIV.appendChild(alertMsg);
    
    topCover.insertBefore(alertDIV, topContainerHeading);

    //The Alert Message disappears after 3s

    setTimeout(()=> {
        alertDIV.remove();
    }, 3000);
}


const addItem = (event)=> {
    const inputValue = inputBox.value;
    if(inputValue === "") {
       messageAlert("Input cannot be Empty!","error");
    } else {
       const todoDIV = document.createElement("div");
       todoDIV.setAttribute("draggable", true);
       todoDIV.classList.add("todo--item");
       todoDIV.innerHTML = `
       
       <div>
        <input onClick="completedItem(this)" type="radio" name="radio" class="radioBtn">
        <li class="list--item">${inputValue}</li>
        </div>
        <div>
        <i onClick="deleteItem(this)" class="fas fa-trash trash-icon"></i>
        </div>
       
       `
       listContainer.appendChild(todoDIV);

       //Save to LocalStorage
       savingToLocalStorage(inputValue);

       inputBox.value = "";
    }

}

addButton.addEventListener("click", addItem);


//Deleting Items from the List 

let deleteItem = (event)=> {
   event.parentElement.parentElement.remove();
   deleteFromLocalStorage(event);

   messageAlert("Item Successfully Deleted", "success");
}



//SAVING TO LOCAL STORAGE

function savingToLocalStorage(item) {
    let items;
    if(localStorage.getItem("items") === null) {
        items = [];
    } else {
        items = JSON.parse(localStorage.getItem("items"));
    }

    items.push(item);
    localStorage.setItem("items", JSON.stringify(items));
}

//Retrieving From Local Storage 
function retrievingFromLocalStorage(item) {
    let items;
    if(localStorage.getItem("items") === null) {
        items = [];
    } else {
        items = JSON.parse(localStorage.getItem("items"));
    }

    items.forEach((item)=> {
        const todoDIV = document.createElement("div");
        todoDIV.setAttribute("draggable", true);
        todoDIV.classList.add("todo--item");
        todoDIV.innerHTML = `
        
        <div>
         <input onClick="completedItem(this)" type="radio" name="radio" class="radioBtn">
         <li class="list--item">${item}</li>
         </div>
         <div>
         <i onClick="deleteItem(this)" class="fas fa-trash trash-icon"></i>
         </div>
        
        `
        listContainer.appendChild(todoDIV);
    });
}

document.addEventListener("DOMContentLoaded", retrievingFromLocalStorage());


//Delete from Local Storage 

function deleteFromLocalStorage(item) {
    let items;

    if(localStorage.getItem("items") === null) {
        items = [];
    } else {
        items = JSON.parse(localStorage.getItem("items"));
    }
   
   console.log(item);
   const itemIndex = item.parentElement.parentElement.children[0];
   items.splice(itemIndex, 1);

   localStorage.setItem("items", JSON.stringify(items));
   
}







//FILTERS AND COMPLETED ITEMS SECTION

function completedItem(event) {
    event.nextElementSibling.classList.toggle("completed");
    messageAlert("Item Completed", "success");
}

//Show Completed Items Only 

const filterOptions = container.querySelectorAll(".item--filter");

function filterItems(event) {
    const items = listContainer.childNodes;

    items.forEach((item)=> {
        switch(event.target.innerHTML) {
            case "All":
                if(clearButton.clicked === true) {
                    clearItems()
                } {
                    item.style.display = "flex";
                }
                break;
            case "Completed":
                if(item.children[0].children[1].classList.contains("completed")) {
                    item.style.display = "flex";
                } else {
                    item.style.display = "none";
                }
                break;
            case "Active":
                if(!item.children[0].children[1].classList.contains("completed")) {
                    item.style.display = "flex";
                } else {
                    item.style.display = "none";
                }
                break;
        }
    })
}

filterOptions.forEach((filterOption)=> {
    filterOption.addEventListener("click", filterItems);
})

// Items Left and Clear Completed Items
const itemsLeftButton = container.querySelector(".filter__items--left");
const clearButton = container.querySelector(".filter__completed--clear");
const leftSpan = container.querySelector("#left");
console.log(leftSpan);

const itemsLeft = ()=> {
    const items = listContainer.childNodes;
    let newItem;
    
    items.forEach((item)=> {
        if(item.children[0].children[1].classList.contains("completed")) {
            item.style.display = "none";
        }
        
    })
}

itemsLeftButton.addEventListener("click", itemsLeft)

const clearItems = ()=>{
    const items = listContainer.childNodes;
    items.forEach((item)=> {
        if(item.children[0].children[1].classList.contains("completed")) {
            item.style.display = "none";
        } 
    })
}

clearButton.addEventListener("click", clearItems);







//DRAG AND DROP LIST ITEMS
document.addEventListener("DOMContentLoaded", ()=> {
    let items = listContainer.childNodes;
    
    
    function handleDragStart(e) {
        this.style.opacity = '0.4';
        
        dragSrcEl = this;
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', this.innerHTML);
      }
      function handleDragEnd(e) {
        this.style.opacity = '1';
        
        items.forEach((item)=> {
          item.classList.remove('over');
        })
      }
    
      function handleDragOver(e) {
        e.preventDefault();
        return false;
      }
      function handleDragEnter(e) {
        this.classList.add('over');
      }
      function handleDragLeave(e){
        this.classList.remove('over');
      }
      
      function handleDrop(e) {
        e.stopPropagation();
        
        if(dragSrcEl !== this) {
          dragSrcEl.innerHTML = this.innerHTML;
          this.innerHTML = e.dataTransfer.getData('text/html');
        } 
        return false;
      }
      // for( let i=0; i<items.length; i++) {
      //   items[i].addEventListener('dragstart', handleDragStart);
      //   items[i].addEventListener('dragend', handleDragEnd);
      // }
    
      items.forEach((item)=> {
        item.addEventListener('dragstart', handleDragStart);
        item.addEventListener('dragover', handleDragOver);
        item.addEventListener('dragenter', handleDragEnter);
        item.addEventListener('dragenter', handleDragLeave);
        item.addEventListener('dragend', handleDragEnd);
        item.addEventListener('drop', handleDrop);
      })

})