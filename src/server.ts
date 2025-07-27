import app from "./faucet";

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Faucet running on port ${PORT}`);
});
