const axios = require("axios");
const fs = require("fs");
const path = require("path");

// const API_BASE = "https://blockchain.ibrahimgomaa.me";

const API_BASE = "http://localhost:4000";
const adminPrivateKey = "0x4a6d6453e733a2f8b5c46234886f0a4d08c1a717943e71d817da6694c37bee00";

const propertyTypes = ["House", "Land", "Apartment"];
const locations = ["New York", "Paris", "Tokyo", "London", "Berlin"];
const OUTPUT_FILE = path.join(__dirname, "seeded-users.json");

const imageUrls = [
  "https://picsum.photos/300/200?random=1",
  "https://picsum.photos/300/200?random=2",
  "https://picsum.photos/300/200?random=3",
  "https://picsum.photos/300/200?random=4",
  "https://picsum.photos/300/200?random=5",
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const generateRandomSerial = () => "SN-" + Math.floor(Math.random() * 1000000);
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

async function fetchImageBase64(url) {
  try {
    const response = await axios.get(url, {
      responseType: "arraybuffer",
    });
    const base64 = Buffer.from(response.data, "binary").toString("base64");
    const contentType = response.headers["content-type"] || "image/png";
    return `data:${contentType};base64,${base64}`;
  } catch (err) {
    console.error(`❌ Failed to fetch image: ${url}`, err.message);
    return null;
  }
}

async function registerProperty({ name, propertyType, serialNumber, location, imageBase64, owner }) {
  try {
    await axios.post(`${API_BASE}/property/register`, {
      adminPrivateKey,
      name,
      propertyType,
      serialNumber,
      location,
      imageBase64,
      owner,
    });
    console.log(`🏠 Property "${name}" registered to ${owner}`);
  } catch (err) {
    console.error(`❌ Failed to register property "${name}":`, err.response?.data?.error || err.message);
  }
}

async function main() {
  if (!fs.existsSync(OUTPUT_FILE)) {
    console.error(`❌ Could not find user file at ${OUTPUT_FILE}`);
    process.exit(1);
  }

  const users = JSON.parse(fs.readFileSync(OUTPUT_FILE, "utf-8"));

  for (const user of users) {
    const numProperties = getRandomInt(3, 6);
    console.log(`\n🔧 Adding ${numProperties} assets to ${user.userId}`);

    for (let i = 0; i < numProperties; i++) {
      const propertyType = propertyTypes[Math.floor(Math.random() * propertyTypes.length)];
      const propertyName = `${user.userId}'s ${propertyType} #${i + 1}`;
      const serialNumber = generateRandomSerial();
      const location = locations[Math.floor(Math.random() * locations.length)];
      const imageUrl = imageUrls[Math.floor(Math.random() * imageUrls.length)];
      const imageBase64 = await fetchImageBase64(imageUrl);

      if (!imageBase64) {
        console.warn("⚠️ Skipping property due to image fetch failure.");
        continue;
      }

      await registerProperty({
        name: propertyName,
        propertyType,
        serialNumber,
        location,
        imageBase64,
        owner: user.walletAddress,
      });

      await sleep(300); // gentle delay
    }
  }

  console.log("  Finished adding assets to all users.");
}

main();
