const mysql = require('mysql');
const inquirer = require('inquirer');
const Table = require('cli-table'); // Module that creates tables in the console.


// Create a connection to the sql database.
const connection = mysql.createConnection({
  host: '127.0.0.1',
  port: 3306,
  user: 'root',
  passwor: '',
  database: 'bamazonDB'
});


const Bamazon = {
  items_available: 'SELECT * FROM products',
  item_id: null,
  item_quanity: null,
  run: function() {
    connection.query(this.items_available, (err, results, fields) => {
      if (err) {
        throw err;
      }
      var table = new Table({
        head: ['item_id', 'product_name', 'department_name', 'price', 'stock_quanity'],
        colWidth: [100, 200]
      })
      results.forEach((row) => {
        table.push([row.item_id, row.product_name, row.department_name, row.price, row.stock_quanity]);
      });
      console.log(table.toString());
      this.promptCustomer();
    });
  },
  makeOrder: function(id, quanity, inStock, price) {
    // Use arguements to build database query.
    let query = `UPDATE products SET stock_quanity = ${inStock - quanity} WHERE item_id = ${id}`;

    // Make the order and update the database.
    connection.query(query, (err, results, fields) => {
      if (err) {
        throw err;
      }

      let orderAmount = (quanity * price);
      // Show the customer the total amount that the would have to pay for the order.
      console.log(`Your total is $${orderAmount}`);
    })

  },
  checkInventory(id, quanity) {
    // Method responsible for making sure there is enough units to fill the customers order.
    connection.query(`SELECT stock_quanity, price FROM products WHERE item_id = ${id}`, (err, results, fields) => {
      if (err) {
        throw err;
      }
      // Create a reference to the number of items and the price of the item.
      let inStock = results[0].stock_quanity;
      let price = results[0].price;

      // Compare the quantity from the db to the amount the customer would like to purchase.
      (results[0].stock_quanity > quanity) ?
      this.makeOrder(id, quanity, inStock, price) :
       console.log(`We currently dont have that amount in stock.`);
       connection.end();
    })
  },
  promptCustomer: function() {
    inquirer.prompt({
      type: 'input',
      name: 'id',
      message: 'What is the item_id of the product you would like to buy?'
    }).then((answer) => {
      // Store the ID in while prompting the customer for quanity.
      this.item_id = answer.id;
      inquirer.prompt({
        type: 'input',
        name: 'quanity',
        message: 'How many units would you like to buy?'
      }).then((answer) => {
        //Store a reference to the quantity the customer would like to buy.
        this.item_quanity = answer.quanity;
        // Check the database to confirm if the order can be made or not.
        this.checkInventory(this.item_id, this.item_quanity)
      })
    })
  }
}


Bamazon.run(); // To start the application.

module.exports = Bamazon;
