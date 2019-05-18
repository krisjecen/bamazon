// requirements
var mysql = require('mysql');
var inquirer = require('inquirer');
var Table = require('cli-table');


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
  });


// display all items for sale to the customer when the app is run

// -----------------------------------------------------------------------------
// function to prompt the customer about what they would like to purchase
// -----------------------------------------------------------------------------

function promptCustomer() {

  inquirer
    .prompt([
      // prompt customer: ask for sku of the product they want to buy
      {
        type: 'number',
        message: 'What is the sku of the product you wish to purchase?',
        name: 'selectedItem'
      },
      // prompt customer: ask for quantity of the product they want to buy
      {
        type: 'number',
        message: 'How many of that product would you like to purchase?',
        name: 'itemQty'
        //default: 1
      }
    ])
    .then(function(customerOrder){
      // check to see if sufficient stock exists for the order
      console.log(customerOrder.selectedItem);
      console.log(customerOrder.itemQty);
      
    });
};

// -----------------------------------------------------------------------------
// function to display all items for sale upon starting app
// -----------------------------------------------------------------------------
function displayFullInventory () {
    var inventoryHeaders = [];

    connection.query('DESCRIBE products', function (err, res) {
        if (err) throw err;

        for (var headerCount = 0; headerCount < res.length; headerCount++) {
            let columnHeader = res[headerCount].Field;
            inventoryHeaders.push(columnHeader)
        };
        
    });

    connection.query('SELECT * FROM products', function (err, res) {
      if (err) throw err

      // instantiate
      var fullInventory = new Table({
        head: inventoryHeaders,
        colWidths: [5, 40, 40, 10, 10]
      });
    
      // write a for loop that walks through the data object we get from the SELECT
      // table is an Array, so you can `push`, `unshift`, `splice` and friends
      for (var i = 0; i < res.length; i++) {
        // makes an array of each item that we read through in the response
        let inventoryItem = [res[i].sku, res[i].product_name, res[i].department_name, res[i].price, res[i].qty];
        // adds each inventory item to our array
        fullInventory.push(inventoryItem)
      }
      
      // displays the full inventory to the customer
      console.log(fullInventory.toString());

      connection.end()

      promptCustomer()
    });
};


// upon running the program with node bamazonCustomer
displayFullInventory();




// if insufficient, display "insufficient quantity" or similar
// fulfill the customer's order by decreasing the stock (update db)

// calculate and display the total cost of their purchase

