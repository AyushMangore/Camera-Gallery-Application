// open data base 
// create object store
// transactions

let db;
let openRequest = indexedDB.open("myDataBase");
openRequest.addEventListener("success", (e) => {
    console.log("DB success");
    db = openRequest.result;
})
openRequest.addEventListener("error", (e) => {
    console.log("DB error");
})
openRequest.addEventListener("upgradeneeded", (e) => {
    console.log("DB upgraded and for initial DB creation");
    db = openRequest.result;
    
    

    // create object store
    db.createObjectStore("video",{ keyPath: "id" });
    db.createObjectStore("image",{ keyPath: "id" });
    
    // key path is used for unique identification

    
})