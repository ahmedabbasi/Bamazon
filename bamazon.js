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
      promptUser();
    })
};

function promptUser() {
  connection.query("SELECT * FROM products", function (err, results) {
    if (err) throw err;
    inquirer.prompt([{
          name: "item_id",
          type: "input",
          message: "Please enter the Id of the product you would like to purchase.",


        },
        {
          name: "amount",
          type: "input",
          message: "How many units of the product you would like to purchase?"
        }
      ])
      .then(function (answer) {
        //get the info of chosen item


        var chosenItem;
        for (var i = 0; i < results.length; i++) {
          if (results[i].item_id === parseInt(answer.item_id)) {
            chosenItem = results[i].stock_quantity;
            
          }
        }
        

        if (chosenItem >= parseInt(answer.amount)) {

          connection.query(
            "UPDATE products SET stock_quantity = (stock_quantity - ?) WHERE ?", [parseInt(answer.amount), {
              item_id: answer.item_id
            }],
            function (err, res) {
              if (err) throw err
              console.log("Item purchased successfully!");
              
            }
          )
        } else {
          // bid wasn't high enough, so apologize and start over
          console.log("Insufficient quantity!");
          start();
        }
      })
  })
}