// requirements
var mysql = require('mysql');
var inquirer = require('inquirer');

// need to connect to my bamazon database
var connection = mysql.createConnection({
    host: 'localhost',
    // Your port; if not 3306
    port: 3306,
    // Your sql username
    user: 'nodeUser',
    // Your password
    password: '',
    database: 'bamazon'
});

connection.connect(function (err) {
    if (err) throw err
    console.log('connected as id ' + connection.threadId)
    connection.end()
  });


// display all items for sale to the customer when the app is run

// prompt customer: ask for sku of the product they want to buy

// prompt customer: ask for quantity of the product they want to buy

// check to see if sufficient stock exists for the order
    // if insufficient, display "insufficient quantity" or similar


// fulfill the customer's order by decreasing the stock (update db)

// calculate and display the total cost of their purchase

