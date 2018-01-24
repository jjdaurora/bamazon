var mysql = require('mysql')
var inquirer = require('inquirer')
var itemInCart; 
var requestedQty; 
var userRequest; 
var connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,

  // Your username
  user: 'root',

  // Your password
  password: '',
  database: 'bamazonDB'
})

function showWhatsInStock() {
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;
        console.log("---------------------------------------------");
        for (var i = 0; i < results.length; i++) {
            console.log("Id: " + results[i].item_id + " -- " + results[i].product + " -- "
                + results[i].department_name + " -- " + results[i].price + "-- " + results[i].stock_quantity);
        }
    });
}

function promptUser () {
  showWhatsInStock(); 
  inquirer.prompt([
    {
      type: 'list',
      name: 'id',
      message: "What you would like to buy today? Above is a list of what's in stock.Please select an ID",
      choices: [
        '1',
        '2',
        '7',
        '8',
        '9',
        '10'
      ]
    }
  ]).then(answers => {
    console.log(answers.id)
      if (answers.id == '1' || answers.id == '2' || answers.id == '7' || answers.id == '8' || answers.id == '9' || answers.id == '10') {
      itemInCart = answers.id;
      getQuantity();
    }
    else {
     console.log("Sorry, we don't have that item in stock.")
    };
  });
};

function getQuantity () {
  inquirer.prompt([{
    type: 'input',
    name: 'quantity',
    message: 'How many do you want to purchase?'
}]).then(answers => {
    console.log(answers);
    requestedQty = answers.quantity; 
    checkQuantity(itemInCart);
  })
}

function checkQuantity (requestedQty) {
  console.log('Checking available quantity...\n')
    connection.query('SELECT * from products', function (err, res) {
        if (err) throw err
    
        for (var i = 0; i < res.length; i++) {
            if (res[i].item_id === requestedQty)  {
                userRequest = results[i];
            }
                if (res[i].stock_quantity < requestedQty) {
                    console.log("There is insufficient stock of this item!");
                    promptUser();
                }
                else if (res[i].stock_quantity >= requestedQty) {
                    showPrice(requestedQty, userRequest.price);
                    placeOrder(res[i.stock_quantity, requestedQty, userRequest])
                }
        }
        connection.end()
        console.log(itemsToBidOn)
});

function showPrice (quantity, price) {
    var total = quantity * price; 
    console.log("Cost per item is $" + price);
    console.log("Quantity ordered: " + quantity);
    console.log("TOTAL: $" + total);
}

function placeOrder (paramOne, paramTwo, paramThree) {
    inquirer.prompt([{
        name: "confirm",
        type: "list",
        message: "Please confirm your purchase.",
        choices: [
            'YES',
            'NO'
        ]
    }]).then(answers => {
        if(answers.confirm = "YES") {
            updateDB(paramOne, paramTwo, paramThree);
        }
        if (answers.confirm="NO") {
            console.log("Okay, please place another order then.");
            promptUser();
        }
    })
}

function updateDB(paramOne, paramTwo, paramThree) {
    const updatedQuantity = paramOne - paramTwo;
    connection.query(
        "UPDATE products SET ? WHERE ?",
            [{
                stock_quantity: 
                updatedQuantity}, 
             {
                 id: paramThree
            }],
            function (err) {
                if (err) throw err;
                conosle.log("Thanks for purchasing!");
            });
        connection.end();
    };
};

promptUser();