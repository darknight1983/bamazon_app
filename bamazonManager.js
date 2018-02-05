const inquirer = require('inquirer');
const mysql = require('mysql');
const Table = require('cli-table');


const connection = mysql.createConnection({
  host: '127.0.0.1',
  port: 3306,
  user: 'root',
  passwor: '',
  database: 'bamazonDB'
});

// I think it makes sense to store the functioality as properties on this
// object for future purposes. This functionality may be useful elsewhere in the
// application.

const bamazonManager = {
  items_available: 'SELECT * FROM products',
  // Create a reference to the options a manager can select.
  managerOptions: [
    'View Products for Sale',
    'View Low Inventory',
    'Add to Inventory',
    'Add New Product'
  ],
  viewSaleItems: function() {
    connection.query(this.items_available, (err, results, fields) => {
      if (err) {
        throw err;
      }
      var table = new Table({
        head: ['item_id', 'product_name', 'department_name', 'price', 'stock_quanity'],
        colWidth: [100, 200]
      });
      results.forEach((row) => {
        table.push([row.item_id, row.product_name, row.department_name, row.price, row.stock_quanity]);
      });
      console.log(table.toString());
    });
  },
  lowInventory: function() {

  },
  addInventory: function() {

  },
  newProduct: function() {

  },
  start: function() {
    inquirer.prompt({
      type: 'list',
      message: 'What action would you like to take today?',
      choices: this.managerOptions,
      name: 'command'
    }).then((answer) => {
      // Using switch statement to determine which action to take.
      switch(answer.command) {
        case this.managerOptions[0]:
        this.viewSaleItems();
        break;
      }

    })
  }
}

bamazonManager.start();
