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
// check if sufficient stock
// -----------------------------------------------------------------------------

function checkIfEnoughStock(customerOrder, inventory) {

  if (parseInt(customerOrder.itemQty) <= inventory[parseInt(customerOrder.selectedItem) - 1].qty) {
    console.log("Looks like there is sufficient stock to fulfill your order!")

  } else {
    console.log(`
    Insufficient stock. Care for something else?
    `)
    setTimeout(promptCustomer, 1000, inventory)
  };
}

// -----------------------------------------------------------------------------
// function to prompt the customer about what they would like to purchase
// -----------------------------------------------------------------------------

function promptCustomer(inventory) {

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
    .then(function (customerOrder) {
      if (1 <= parseInt(customerOrder.selectedItem) && parseInt(customerOrder.selectedItem) <= inventory.length) {
        checkIfEnoughStock(customerOrder, inventory)
      } else {
        console.log(`
    The sku entry ${customerOrder.selectedItem} is invalid.
    Please enter an sku number from the inventory above.
        `)
        setTimeout(promptCustomer, 1000, inventory)
      }
    });
};

// -----------------------------------------------------------------------------
// function to display all items for sale upon starting app
// -----------------------------------------------------------------------------
function displayFullInventory () {
    var inventoryHeaders = [];

    connection.query('DESCRIBE products', function (err, headers) {
        if (err) throw err;

        for (var headerCount = 0; headerCount < headers.length; headerCount++) {
            let columnHeader = headers[headerCount].Field;
            inventoryHeaders.push(columnHeader)
        };
        
    });

    connection.query('SELECT * FROM products', function (err, inventory) {
      if (err) throw err

      // instantiate
      var fullInventory = new Table({
        head: inventoryHeaders,
        colWidths: [5, 40, 40, 10, 10]
      });
    
      // write a for loop that walks through the data object we get from the SELECT
      // table is an Array, so you can `push`, `unshift`, `splice` and friends
      for (var i = 0; i < inventory.length; i++) {
        // makes an array of each item that we read through in the response
        let inventoryItem = [
          inventory[i].sku, 
          inventory[i].product_name, 
          inventory[i].department_name, 
          inventory[i].price, 
          inventory[i].qty
        ];
        // adds each inventory item to our array
        fullInventory.push(inventoryItem)
      }
      
      // displays the full inventory to the customer
      console.log(fullInventory.toString());

      connection.end()

      promptCustomer(inventory)
    });
};


// upon running the program with node bamazonCustomer
displayFullInventory();




// if insufficient, display "insufficient quantity" or similar
// fulfill the customer's order by decreasing the stock (update db)

// calculate and display the total cost of their purchase

