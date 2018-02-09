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
  lowest_quantity: 'SELECT * FROM products WHERE stock_quanity < 100',
  add_inventory: '',

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
      connection.end(); // I may prompt the user after the table is displayed
      // to give the user the option to perform another task.
    });
  },
  lowInventory: function() {
    connection.query(this.lowest_quantity, (err, results, fields) => {
      if (err) {
        throw err;
      }
      let table = new Table({
        head: ['item_id', 'product_name', 'stock_quanity'],
        colWidth: [100, 200]
      });
      results.forEach((row) => {
        table.push([row.item_id, row.product_name, row.stock_quanity])
      })
      console.log(table.toString());
      connection.end() // Consider prompting the user here!!!!!!!
    })
  },
  addInventory: function() {
    // Set variable to hold reference to the current number of items in stock
    // for the item that is selected by the manager.
    let allItemQuanitys = [];
  // The user should be able to take a look at the inventory to determine
  // what items should be replinished.
  connection.query(this.lowest_quantity, (err, results, fields) => {
    if (err) {
      throw err;
    }
    let table = new Table({
      head: ['item_id', 'product_name', 'stock_quanity'],
      colWidth: [100, 200]
    });
    results.forEach((row) => {
      // Push each item into an array for use after user determines which products
      // will be added to.
      allItemQuanitys.push({id: row.item_id, inStock: row.stock_quanity});
      table.push([row.item_id, row.product_name, row.stock_quanity]);
    })
    console.log(table.toString());
    inquirer.prompt({
      type: 'input',
      name: 'itemID',
      message: "What is the item_id of the product you would like to increase in inventory?"
    }).then((answer) => {
      let replinishedItem = Number(answer.itemID);
      inquirer.prompt({
        type: 'input',
        name: 'units',
        message: 'How many units would you like to increase the stock by?'
      }).then((answer) => {
        // Make the query to the database to add the units to that product category.
        let units = Number(answer.units);
        let correctItemQuanity = null;

        allItemQuanitys.forEach((item) => {
          if (item.id === replinishedItem) {
            correctItemQuanity = item.inStock;
          }
        });


        let newQuanity = correctItemQuanity + units
        let updateQuery = `UPDATE products SET stock_quanity = ${newQuanity} WHERE item_id = ${replinishedItem}`;
        connection.query(updateQuery, (err, results, fields) => {
          if (err) {
            throw err;
          }
          console.log("The inventory has been added increased for this product!");
          connection.end();
        })
      })
    })
  })


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
        case this.managerOptions[1]:
         this.lowInventory();
         break;
        case this.managerOptions[2]:
         this.addInventory();
         break;
      }

    })
  }
}

bamazonManager.start();
