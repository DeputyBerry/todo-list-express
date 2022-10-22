
const deleteBtn = document.querySelectorAll('.fa-trash')
const item = document.querySelectorAll('.item span')
const itemCompleted = document.querySelectorAll('.item span.completed')

// for each element with the class of fa-trash, add an event listener
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})

// for each element with the class of '.item span', add an event listener
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})

// for each element with the class of '.item span.completed', add an event listener
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})

// promise based function to delete an item from the database
async function deleteItem(){
    // selects the inner text of the span element
    const itemText = this.parentNode.childNodes[1].innerText
    // try block which will send a delete request to the server
    try{
        // variable which fetches the deleteItem route
        const response = await fetch('deleteItem', {
            // method of the request
            method: 'delete',
            // headers of the request
            headers: {'Content-Type': 'application/json'},
            // body of the request
            body: JSON.stringify({
                // the item to be deleted
              'itemFromJS': itemText
            })
          })
        // variable which will hold the response from the server
        const data = await response.json()
        console.log(data)
        // reloads the page
        location.reload()
    // catch block which will log any errors
    }catch(err){
        console.log(err)
    }
}

// promise based function to add an item to the database
async function markComplete(){
    // selects the inner text of the span element
    const itemText = this.parentNode.childNodes[1].innerText
    // try block which will send a put request to the server
    try{
        const response = await fetch('markComplete', {
            // method of the request
            method: 'put',
            // headers of the request
            headers: {'Content-Type': 'application/json'},
            // body of the request
            body: JSON.stringify({
                // the item to be added
                'itemFromJS': itemText
            })
          })
        //   variable which will hold the response from the server
        const data = await response.json()
        console.log(data)
        location.reload()
        //   catch block which will log any errors
    }catch(err){
        console.log(err)
    }
}

// 
async function markUnComplete(){
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        const response = await fetch('markUnComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        const data = await response.json()
        console.log(data)
        location.reload()

    }catch(err){
        console.log(err)
    }
}