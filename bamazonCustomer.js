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
  makeOrder: function(id, quanity) {


  },
  checkInventory(id, quanity) {
    // Method responsible for making sure there is enough units to fill the customers order.
    
  },
  promptCustomer: function() {
    inquirer.prompt({
      type: 'input',
      name: 'id',
      message: 'What is the ID of the project you would like to buy?'
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
