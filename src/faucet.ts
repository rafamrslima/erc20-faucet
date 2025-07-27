import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { ethers } from "ethers";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const provider = new ethers.JsonRpcProvider(process.env.ALCHEMY_API_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);

const tokenAbi = [
    "function transfer(address to, uint256 amount) public returns (bool)",
    "function decimals() public view returns (uint8)"
]

const token = new ethers.Contract(process.env.TOKEN_ADDRESS!, tokenAbi, wallet);

app.post("/faucet", async (req, res) => {
    const address = req.body.address;

    if (!address || !ethers.isAddress(address))
        return res.status(400).json({ error: "Invalid wallet address." });

    try {
        const decimals: number = await token.decimals();
        const amount = ethers.parseUnits("100", decimals);

        const tx = await token.transfer(address, amount);
        await tx.wait();

        return res.json({ success: true, txHash: tx.hash });
    } catch (err) {
        console.error("Transaction failed:", err);
        return res.status(500).json({ error: "Transaction failed." });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Faucet running on port ${PORT}`);
});