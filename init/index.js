const Listing = require("../models/listing.js");
const mongoose = require("mongoose");
const initData = require("./data.js");

const mongo_url = "mongodb://127.0.0.1:27017/wanderlust"

main().then(() => {
    console.log("connection success")
}).catch(err => console.log(err));


async function main() {
    await mongoose.connect(mongo_url)
};

let initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj, owner: "6531013d4f6962600c2b8613"}))
    await Listing.insertMany(initData.data);
    console.log("successfully inserted");
};

initDB();

