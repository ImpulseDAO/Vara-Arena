# Create Voucher for [BattleShip](https://github.com/gear-foundation/dapps/tree/master/frontend/battleship)

This project allows you to create vouchers. Before running the backend server, it is essential to have a deployed contract and an account with a balance.

## Create and Deploy an Account to Testnet

1. Build the smart contract as mentioned in the documentation. You can find an example build command in the [smart contract build example](https://github.com/gear-foundation/dapps/tree/master/contracts/battleship).

2. Build and run user interface. Example build and run commands in the [frontend app example](https://github.com/gear-foundation/dapps/tree/master/frontend/battleship).

3. For instructions on creating a Testnet account and deploying the contract, please refer to the [documentation](https://wiki.gear-tech.io/docs/getting-started-in-5-minutes/#deploy-your-smart-contract-to-the-testnet).

4. Export the Testnet account credentials to a file, such as "account.json," and place it in the root folder of your project.

### Declare Environment Variables:
Create a `.env` file; `.env.example` will let you know what variables are expected.

- `NODE_ADDRESS`: The network address used by the contract.
- `GAME_ADDRESS`: The program ID of the deployed contract within your application.
- `PATH_TO_KEYS`: The path to your account file (e.g., "account.json") that you created and exported.
- `KEYRING_PASSPHRASE`: The passphrase used when creating your account.

## Run server
Before running the application, you need to create an account and export it to the root folder of the "account.json" form.  The account must have a balance.

## Using Yarn

1. Install [Yarn](https://classic.yarnpkg.com/en/docs/install)

2. Install dependencies the project
   ```bash
   yarn install
   yarn build
   ```
3. Run server

   ```bash
   yarn start
   ```
