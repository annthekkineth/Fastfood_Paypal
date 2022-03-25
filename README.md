This project is an mobile application which allows the user to order food by SMS. Payment can be done usinf a paypal account. The link for payment will be send as SMS, after which the order will be placed.

To build:

1. Clone the project.
2. Run `npm install` on the terminal to install all dependencies.

To run:

1. Sign up for paypal developer sandbox (https://developer.paypal.com) and get a client id.
2. `SB_CLIENT_ID=<put_in_your_client_id> npm start`.

Output:

1. Type a text like 'Hi' and press send icon.
2. Follow the instructions and choose the item from menu.
3. Click the payment link to be directed to paypal.
4. For testing, use the credentials that can be created in the paypal.
5. After payment, the success message with receipt and food arrival time will be send as SMS.
