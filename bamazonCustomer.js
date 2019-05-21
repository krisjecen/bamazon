// bamazon app using node, MySQL, inquirer, and cli-table
'use strict'
// =============================================================================
// Requirements
// =============================================================================
var mysql = require('mysql');
var inquirer = require('inquirer');
var Table = require('cli-table');

// =============================================================================
// bamazon database configuration & connection
// =============================================================================
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
    // console.log('connected as id ' + connection.threadId)
});


// =============================================================================
// functions
// =============================================================================

// -----------------------------------------------------------------------------
// complete the customer's order by updating the db, displaying order total,
// and displaying the updated inventory list
// -----------------------------------------------------------------------------

function placeOrder(customerOrder, inventory) {
  // decrement inventory
  var updatedQuantity = inventory[parseInt(customerOrder.selectedItem) - 1].qty - customerOrder.itemQty;
  // shorthand for the query
  var invUpdate = inventory[parseInt(customerOrder.selectedItem) - 1].sku;
  // update db with new quantity for the ordered product
  connection.query(
    'UPDATE products SET ? WHERE ?',
    [
      {
        qty: updatedQuantity
      },
      {
        sku: invUpdate
      }
    ],
    function (err, res) {
      if (err) throw err
    }
  )

  // calculate and display total cost of order to customer
  var totalCost = parseInt(customerOrder.itemQty) * inventory[parseInt(customerOrder.selectedItem) - 1].price;
  console.log(`\nOrder total: $${totalCost} \nThank you for your order!`);

  // display the updated inventory
  displayFullInventory()

}

// -----------------------------------------------------------------------------
// check if sufficient stock
// -----------------------------------------------------------------------------

function checkIfEnoughStock(customerOrder, inventory) {
  // check that the quantity desired is positive and not more than the available stock
  if (parseInt(customerOrder.itemQty) > 0 && parseInt(customerOrder.itemQty) <= inventory[parseInt(customerOrder.selectedItem) - 1].qty) {
    console.log("Your order is being placed...")
    placeOrder(customerOrder, inventory)
  } else {
    console.log(`
    Insufficient stock. Care for something else?
    `)
    // wait one second to let the customer see the error message, then prompt again
    setTimeout(promptCustomer, 1000, inventory)
  };
}

// -----------------------------------------------------------------------------
// ask the customer for the sku and quantity of their desired item
// -----------------------------------------------------------------------------

function promptCustomer(inventory) {

  inquirer
    .prompt([
      {
        type: 'number',
        message: 'What is the sku of the product you wish to purchase?',
        name: 'selectedItem'
      },

      {
        type: 'number',
        message: 'How many of that product would you like to purchase?',
        name: 'itemQty'
      }
    ])
    .then(function (customerOrder) {
      // check that the sku entered actually corresponds to a listed product
      if (1 <= parseInt(customerOrder.selectedItem) && parseInt(customerOrder.selectedItem) <= inventory.length) {
        checkIfEnoughStock(customerOrder, inventory)
      } else {
        console.log(`
    The sku entry ${customerOrder.selectedItem} is invalid.
    Please enter an sku number from the inventory above.
        `)
        // wait one second to let the customer see the error message, then prompt again
        setTimeout(promptCustomer, 1000, inventory)
      }
    });
};

// -----------------------------------------------------------------------------
// display all items for sale
// -----------------------------------------------------------------------------
function displayFullInventory () {
    var inventoryHeaders = [];

    connection.query('DESCRIBE products', function (err, headers) {
        if (err) throw err;
        // create headers for the table from the inventory db
        for (var headerCount = 0; headerCount < headers.length; headerCount++) {
            let columnHeader = headers[headerCount].Field;
            inventoryHeaders.push(columnHeader)
        };
        
    });

    connection.query('SELECT * FROM products', function (err, inventory) {
      if (err) throw err

      // instantiate the table (cli-table)
      var fullInventory = new Table({
        head: inventoryHeaders,
        colWidths: [5, 40, 40, 10, 10]
      });
    
      // this loop walks through the data object we get from the SELECT
      for (var i = 0; i < inventory.length; i++) {
        // then makes an array for each item that we read through in the response
        let inventoryItem = [
          inventory[i].sku, 
          inventory[i].product_name, 
          inventory[i].department_name, 
          `$${inventory[i].price}`, 
          inventory[i].qty
        ];
        // add each inventory item to our inventory array
        fullInventory.push(inventoryItem)
      }
      
      // displays the full inventory to the customer
      console.log(fullInventory.toString());

      promptCustomer(inventory)
    });
};


// =============================================================================
// initializing the app (on start)
// =============================================================================
displayFullInventory();

// end