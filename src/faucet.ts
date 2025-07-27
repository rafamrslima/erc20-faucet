import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { ethers } from "ethers";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

if (!process.env.ALCHEMY_API_URL || !process.env.PRIVATE_KEY || !process.env.TOKEN_ADDRESS) {
    console.error("Missing environment variables. Please set ALCHEMY_API_URL, PRIVATE_KEY, and TOKEN_ADDRESS.");
    process.exit(1);
}

const provider = new ethers.JsonRpcProvider(process.env.ALCHEMY_API_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);

const tokenAbi = [
    "function transfer(address to, uint256 amount) public returns (bool)",
    "function decimals() public view returns (uint8)"
]

const token = new ethers.Contract(process.env.TOKEN_ADDRESS!, tokenAbi, wallet);

// cooldown tracking (in-memory)
const lastClaim = new Map<string, number>();
const COOLDOWN_MINUTES = parseInt(process.env.COOLDOWN_MINUTES || "60");

app.post("/faucet", async (req, res) => {
    const address = req.body.address;

    if (!address || !ethers.isAddress(address))
        return res.status(400).json({ error: "Invalid wallet address." });

    const now = Date.now();
    if (lastClaim.has(address)) {
        const lastTime = lastClaim.get(address)!;
        const cooldownTime = COOLDOWN_MINUTES * 60 * 1000; 
        if (now - lastTime < cooldownTime) {
            return res.status(429).json({ error: "Please wait before claiming again." });
        }
    }

    try {
        const decimals: number = await token.decimals();
        const FAUCET_AMOUNT = process.env.FAUCET_AMOUNT || "100";
        const amount = ethers.parseUnits(FAUCET_AMOUNT, decimals);

        const tx = await token.transfer(address, amount);
        await tx.wait();

        lastClaim.set(address, now); 

        return res.json({ success: true, txHash: tx.hash });
    } catch (err) {
        console.error("Transaction failed:", err);
        return res.status(500).json({ error: "Transaction failed." });
    }
});


export default app;