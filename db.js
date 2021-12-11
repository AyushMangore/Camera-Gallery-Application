// In this file we will use Index DB database, to use the database
// open data base 
// create object store
// transactions

// IndexedDB is a transactional database system, like an SQL-based RDBMS. 
// However, unlike SQL-based RDBMSes, which use fixed-column tables, 
// IndexedDB is a JavaScript-based object-oriented database. 
// IndexedDB lets you store and retrieve objects that are indexed with a key; 
// any objects supported by the structured clone algorithm can be stored. 
// You need to specify the database schema, open a connection to your database, 
// and then retrieve and update data within a series of transactions.

// The basic pattern that IndexedDB encourages is the following:

// Open a database.
// Create an object store in the database.
// Start a transaction and make a request to do some database operation, like adding or retrieving data.
// Wait for the operation to complete by listening to the right kind of DOM event.
// Do something with the results (which can be found on the request object).
// With these big concepts under our belts, we can get to more concrete stuff.

// Step one is to open the database by using open function of our indexdDB
// After opening the database we will add event listener of success.
// then we will assign the result to a variable, if any error occured then we will simply log
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
    // basically we will create two object store, one for videos and another for photos
    db.createObjectStore("video",{ keyPath: "id" });
    db.createObjectStore("image",{ keyPath: "id" });
     // key path is used for unique identification

    
})