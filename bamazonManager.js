var mysql = require("mysql");
var inquirer = require("inquirer");

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "1Nedsacstate!",
  database: "bamazon"
});

// connect to the mysql server and sql database
connection.connect(function (err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  // run the start function after the connection is made to prompt the user
  start();
});

function start() {
  console.log("Displaying all the available products...\n")
  connection.query("SELECT * from products",
    function (err, res) {
      for (var i = 0; i < res.length; i++) {
        console.log("Id: " + res[i].item_id + " | " + "Name: " + res[i].product_name + " | " + "Price: " + res[i].price);
      }
      // Log all results of select statements
      promptManager();
    })
};

function promptManager() {
  connection.query("SELECT * FROM products", function (err, results) {
    if (err) throw err;
    inquirer.prompt({
        name: "menu",
        type: "rawlist",
        message: "Select any of the below options",
        choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
      })
      .then(function (answer) {
        if (answer.menu === "View Products for Sale") {
          viewProd();
        } else if (answer.menu === "View Low Inventory") {
          viewLow();
        } else if (answer.menu === "Add to Inventory") {
          viewAdd();
        } else {
          addNew();
        }
      });
  })
}

function viewProd() {
  connection.query("SELECT * FROM products",
  function (err, res) {
    console.log(res);
    for (var i = 0; i < res.length; i++) {
      console.log("Id: " + res[i].item_id + " | " + "Name: " + res[i].product_name + " | " + "Price: " + res[i].price + " | " + "Quantity: " + res[i].stock_quantity);
    }
    // Log all results of select statements
  })
}


function viewLow() {
  connection.query("SELECT * FROM products WHERE stock_quantity < 5",
  function (err, res) {
    for (var i = 0; i < res.length; i++) {
      console.log("Id: " + res[i].item_id + " | " + "Name: " + res[i].product_name + " | " + "Price: " + res[i].price + " | " + "Quantity: " + res[i].stock_quantity);
    }
    // Log all results of select statements
  })
}

