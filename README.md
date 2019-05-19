# bamazon
Bamazon is an online-store command line interface application that uses Node.js and mySQL.

:tv: Watch my video demo of the app [on YouTube here](https://youtu.be/5ejw0vY9WKw). It's less than two minutes! :tv:

# features
* Displays Bamazon store inventory (sku, product name, department name, price, & quantity)
* Prompts customer for order info
* Verifies that the sku provided matches the sku of an available product
* Checks available stock and provides an error message if stock is insufficient to fulfill the order
* Provides the total cost of the order to the customer
* Updates the database with each purchase and redisplays available inventory quantities

# Node.js packages used
* MySQL: to store a database of the Bamazon inventory which is updated with each purchase
* inquirer: to prompt the user about the product and quantity they'd like to purchase
* cli-table: to display the Bamazon store inventory in an elegant fashion in the terminal

# future work, coming soon
* Viewing inventory with low stock
* Increasing the available stock for a product (using the CLI)
* Adding new products (using the CLI)
