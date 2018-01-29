var mysql = require('mysql')
var inquirer = require('inquirer')
var itemInCart; 
var requestedQty; 
var userPrice; 
var connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,

  // Your username
  user: 'root',

  // Your password
  password: '',
  database: 'bamazonDB'
})

function showWhatsInStock(continuation) {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
         for (var i = 0; i < res.length; i++) {
            //  console.table(r);
            let r = res[i];
            console.log([r.item_id, r.product, r.department_name, r.price, r.stock_quantity].join('\t ||') + '\n')

            //  console.log("Id: " + res[i].item_id + "\t || " + res[i].product + "\t || " + res[i].department_name + "\t|| " + res[i].price + "\t|| " + res[i].stock_quantity);
         }  
         if(continuation) continuation(err, res);
    });
}

function showAndPromptUser() {
    showWhatsInStock(promptUser);
}

function promptUser () {
  inquirer.prompt([
    {
      type: 'list',
      name: 'id',
      message: "What you would like to buy today? Above is a list of what's in stock. Please select an ID",
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
      itemInCart = answers.id;
      getQuantity(itemInCart);
  });
};

function getQuantity (itemInCart) {
  inquirer.prompt([{
    type: 'input',
    name: 'quantity',
    message: 'How many do you want to purchase?'
}]).then(answers => {
    requestedQty = answers.quantity; 
    checkQuantity(itemInCart, requestedQty);
  })
}

function checkQuantity (itemInCart, requestedQty) {
  console.log('Checking available quantity...\n')
    connection.query('SELECT * from products', function (err, res) {
        if (err) throw err;
        console.log(res);
        for (var i = 0; i < res.length; i++) {
            if (res[i].item_id == itemInCart)  {
                userPrice = res[i].price;
                if (res[i].stock_quantity < requestedQty) {
                    console.log("There is insufficient stock of this item!");
                    promptUser();
                }
                else if (res[i].stock_quantity >= requestedQty) {
                    placeOrder(res[i].stock_quantity, requestedQty, userPrice, itemInCart)
                }
            }
        }
    });
};

function placeOrder (stockQuantity, requestedQty, userPrice, itemInCart) {
    var totalCost = requestedQty * userPrice;
    inquirer.prompt([{
        name: "confirm",
        type: "list",
        message: "Please confirm your purchase.",
        choices: [
            'YES',
            'NO'
        ]
    }]).then(answers => {
        if(answers.confirm =="YES") {
            updateDB(stockQuantity, requestedQty, userPrice, itemInCart);
        }
        if (answers.confirm == "NO") {
            console.log("Okay, please place another order then.");
            promptUser();
        }
    })
}

function updateDB(stockQuantity, requestedQty, userPrice, itemInCart) {
    var updatedQuantity = stockQuantity - requestedQty;
    console.log("Awesome! Remaining stock: " + updatedQuantity);
    connection.query(
        "UPDATE products SET ? WHERE ?",
            [{
                stock_quantity: 
                updatedQuantity
            }, 
             {
                 item_id: itemInCart
            }],
            function (err) {
                if (err) throw err;
                console.log("Thanks for purchasing!");
            });
    };

showAndPromptUser();