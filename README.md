# Faucet

A simple ERC-20 token faucet built with Node.js, Express, and ethers.js.

## Features
- Sends a fixed amount of ERC-20 tokens to a provided wallet address
- Uses environment variables for sensitive configuration
- CORS enabled for cross-origin requests

## Requirements
- Node.js (v18 or higher recommended)
- An Ethereum node provider (e.g., Alchemy)
- ERC-20 token contract address
- Private key with sufficient token balance

## Setup
1. Clone the repository:
   ```sh
   git clone <your-repo-url>
   cd Faucet
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```env
   ALCHEMY_API_URL=your_alchemy_rpc_url
   PRIVATE_KEY=your_private_key
   TOKEN_ADDRESS=your_erc20_token_address
   PORT=3000 # optional, defaults to 3000
   ```

4. Build the project (optional, if you want to compile without starting):
   ```sh
   npm run build
   ```

5. Start the server (this will build and run from `dist/server.js`):
   ```sh
   npm start
   ```

## Usage
Send a POST request to `/faucet` with a JSON body:
```json
{
  "address": "0xYourWalletAddress"
}
```

Example using `curl`:
```sh
curl -X POST http://localhost:3000/faucet \
  -H "Content-Type: application/json" \
  -d '{"address": "0xYourWalletAddress"}'
```

## Security Notes
- Never commit your `.env` file or private keys to version control.
- Limit faucet usage to prevent abuse.

## License
MIT
