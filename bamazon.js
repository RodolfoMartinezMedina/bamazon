let mysql = require("mysql");
let inquirer = require("inquirer");
require('console.table');

let connection = mysql.createConnection({
 host: "localhost",

 // Your port; if not 3306
 port: 3306,

 // Your username
 user: "root",

 // Your password
 password: "Chidori@mysql",
 database: "bamazon_db"
});

connection.connect(function(err) {
 if (err) return 
 console.log("connected")
 getStarted();
 //updateItem();
});

const getStarted = function(){
    //Display all items, then...
    connection.query(`SELECT * FROM products`, function(err,res){
        if (err) throw err;
        console.table(res);
      
        
        //prompt the user
//First ask for product ID
inquirer.prompt(
    [
        {
            type:"input",
            name:"id",
            message: "what product ID would you like to buy? "
        }
    ]
).then(function(idResponse){
    let choiceID = parseInt(idResponse.id); //converts values into integer equivalent
    //second, ask for quantity
    inquirer.prompt(
        [
            {
                type:"input",
                name:"qty",
                message: `what quantity of product #${idResponse.id} would you like to buy? `
            }
        ]
    ).then(function(qtyResponse){
//check inventory
console.log(parseInt(qtyResponse.qty));
checkInventory(parseInt(qtyResponse.qty), choiceID);



});

});

});

}


const checkInventory = function(qty,id){
        connection.query(`select stock_quantity,price from products WHERE item_id = ${id}`,function(err,res){
            console.table(res);
            if(res[0].stock_quantity >= qty){

                //reduce the qty in the database by the qty requested
                connection.query(`UPDATE products SET stock_quantity = ${res[0].stock_quantity - qty} WHERE item_id = ${id}`);

                //display the total amount due (qty * price)
                console.log(`Your price is $${qty * res[0].price}`)
            }else{

                //if there's not enough, console.log()
                console.log(`There's not enough of product #${id} for you`);
            }

            connection.end();
        });
}