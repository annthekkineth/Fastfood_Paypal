const Order = require("./Order");

const OrderState = Object.freeze({
  WELCOMING: Symbol("welcoming"),
  ITEM: Symbol("item"),
  SIZE: Symbol("size"),
  DESSERT: Symbol("dessert"),
  TOPPINGS: Symbol("toppings"),
  DRINKS: Symbol("drinks"),
  SECOND: Symbol("second"),
});

var total = 0;
var count = 0;

module.exports = class ShwarmaOrder extends Order {
  constructor(sNumber, sUrl) {
    super(sNumber, sUrl);
    this.stateCur = OrderState.WELCOMING;
    this.sSize = "";
    this.sToppings = "";
    this.sSecondItem = "";
    this.sSecondSize = "";
    this.sSecondTopping = "";
    this.sDesserts = "";
    this.sItem = "";
  }
  handleInput(sInput) {
    let aReturn = [];
    switch (this.stateCur) {
      case OrderState.WELCOMING:
        this.stateCur = OrderState.ITEM;
        aReturn.push("Welcome to Ann's Dinner.");
        aReturn.push("What would you like to order? Shawarma or Noodles");
        total = 0;
        count = 0;
        break;
      case OrderState.ITEM:
        if (
          sInput.toLowerCase() == "shawarma" ||
          sInput.toLowerCase() == "noodles"
        ) {
          this.stateCur = OrderState.SIZE;
          if (count == 0) this.sItem = sInput;
          else this.sSecondItem = sInput;
          if (sInput.toLowerCase() == "shawarma") total = total + 7;
          else total = total + 9;
          aReturn.push("What size would you like? Large or small");
        } else {
          this.stateCur = OrderState.ITEM;
          aReturn.push("Please select from menu! Shawarma or Noodles");
        }
        break;
      case OrderState.SIZE:
        if (
          sInput.toLowerCase() == "large" ||
          sInput.toLowerCase() == "small"
        ) {
          this.stateCur = OrderState.TOPPINGS;
          if (count == 0) this.sSize = sInput;
          else this.sSecondSize = sInput;
          if (sInput.toLowerCase() == "large") total = total + 2;
          aReturn.push("What toppings would you like? Beef or Chicken.");
        } else {
          this.stateCur = OrderState.SIZE;
          aReturn.push("Please select large or small!");
        }
        break;
      case OrderState.TOPPINGS:
        if (
          sInput.toLowerCase() == "beef" ||
          sInput.toLowerCase() == "chicken"
        ) {
          this.stateCur = OrderState.SECOND;
          if (count == 0) this.sToppings = sInput;
          else this.sSecondTopping = sInput;
          total = total + 3;
          aReturn.push("Would you like to make another order?");
        } else {
          this.stateCur = OrderState.TOPPINGS;
          aReturn.push("Please select Beef or Chicken!");
        }
        break;
      case OrderState.SECOND:
        if (sInput.toLowerCase() == "no") {
          this.stateCur = OrderState.DESSERT;
          this.sSecond = sInput;
          total = total + 3;
          aReturn.push(
            "Would you like dessert with that? If yes, Cake or Icecream?"
          );
        } else {
          this.stateCur = OrderState.ITEM;
          count = 1;
          aReturn.push("What would you like to order? Shawarma or Noodles");
        }
        break;
      case OrderState.DESSERT:
        if (sInput.toLowerCase() == "no") {
          this.stateCur = OrderState.DRINKS;
          aReturn.push("Would you like drinks with that? Fanta or Coke");
        }
        else if (sInput.toLowerCase() == "cake" || sInput.toLowerCase() == "icecream") {
          this.sDesserts = sInput;
          this.stateCur = OrderState.DRINKS;
          aReturn.push("Would you like drinks with that? Fanta or Coke");
        } else {
          this.stateCur = OrderState.DESSERT;
          aReturn.push(
            "Please select Cake or Icecream if you need dessert! else, no"
          );
        }
        break;
      case OrderState.DRINKS:
        this.stateCur = OrderState.PAYMENT;
        // if (sInput.toLowerCase() == "no") {}
        if (sInput.toLowerCase() == "no" || sInput.toLowerCase() == "fanta" || sInput.toLowerCase() == "coke") {
            this.sDrinks = sInput;
            aReturn.push("Thank-you for your order of");
            aReturn.push(`${this.sSize} ${this.sItem} with ${this.sToppings}`);
            if (count == 1) {
              aReturn.push(
                ` and ${this.sSecondSize} ${this.sSecondItem} with ${this.sSecondTopping}`
              );
            }
            if (this.sDesserts) {
              total = total + 5;
              aReturn.push(`Dessert: ${this.sDesserts}`);
            }
            if (this.sDrinks != "no") {
              total = total + 5;
              aReturn.push(`Drink: ${this.sDrinks}`);
            }
            this.nOrder = total;
            aReturn.push(`Please pay for your order here`);
            aReturn.push(`${this.sUrl}/payment/${this.sNumber}/`);
          } else {
            this.stateCur = OrderState.DRINKS;
            aReturn.push(
              "Please select fanta or coke if you need a drink! else, no"
            );
          }
        
        break;
      case OrderState.PAYMENT:
        this.isDone(true);
        let d = new Date();
        d.setMinutes(d.getMinutes() + 20);
        aReturn.push(`Your order will be delivered at ${d.toTimeString()} to`);
        aReturn.push(Object.values(sInput.purchase_units[0].shipping.address));
        break;
    }
    return aReturn;
  }
  renderForm(sTitle = "-1", sAmount = "-1") {
    // your client id should be kept private
    if (sTitle != "-1") {
      this.sItem = sTitle;
    }
    if (sAmount != "-1") {
      this.nOrder = sAmount;
    }
    const sClientID =
      process.env.SB_CLIENT_ID ||
      "put your client id here for testing ... Make sure that you delete it before committing";
    return `
      <!DOCTYPE html>
  
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1"> <!-- Ensures optimal rendering on mobile devices. -->
        <meta http-equiv="X-UA-Compatible" content="IE=edge" /> <!-- Optimal Internet Explorer compatibility -->
      </head>
      
      <body>
        <script src="https://code.jquery.com/jquery-3.5.1.min.js"></script>
        <script
          src="https://www.paypal.com/sdk/js?client-id=${sClientID}"> // Required. Replace SB_CLIENT_ID with your sandbox client ID.
        </script>
        Thank you ${this.sNumber} for your ${this.sItem} order of $${this.nOrder}.
        <div id="paypal-button-container"></div>
  
        <script>
          paypal.Buttons({
              createOrder: function(data, actions) {
                // This function sets up the details of the transaction, including the amount and line item details.
                return actions.order.create({
                  purchase_units: [{
                    amount: {
                      value: '${this.nOrder}'
                    }
                  }]
                });
              },
              onApprove: function(data, actions) {
                // This function captures the funds from the transaction.
                return actions.order.capture().then(function(details) {
                  // This function shows a transaction success message to your buyer.
                  $.post(".", details, ()=>{
                    window.open("", "_self");
                    window.close(); 
                  });
                });
              }
          
            }).render('#paypal-button-container');
          // This function displays Smart Payment Buttons on your web page.
        </script>
      
      </body>
          
      `;
  }
};
