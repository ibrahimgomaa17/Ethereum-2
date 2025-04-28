const axios = require("axios");
const fs = require("fs");
const path = require("path");

const API_BASE = "http://localhost:4000";
const adminPrivateKey = "0x4a6d6453e733a2f8b5c46234886f0a4d08c1a717943e71d817da6694c37bee00";

const usersToCreate = ["alice", "bob", "charlie", "diana", "eve"];
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

async function registerUser(userId) {
  try {
    const response = await axios.post(`${API_BASE}/user/register`, { userId });
    console.log(`  Registered user: ${userId}`);
    return response.data;
  } catch (err) {
    console.error(`❌ Failed to register user "${userId}":`, err.response?.data?.error || err.message);
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
  const registeredUsers = [];

  for (const userId of usersToCreate) {
    const userData = await registerUser(userId);
    if (userData) {
      registeredUsers.push({
        userId: userData.userId,
        walletAddress: userData.walletAddress,
        privateKey: userData.privateKey,
      });
    }
    await sleep(500);
  }

  for (const user of registeredUsers) {
    const numberOfProperties = Math.floor(Math.random() * 3) + 1;

    for (let i = 0; i < numberOfProperties; i++) {
      const propertyName = `${user.userId}'s ${propertyTypes[i % propertyTypes.length]}`;
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
        propertyType: propertyTypes[i % propertyTypes.length],
        serialNumber,
        location,
        imageBase64,
        owner: user.walletAddress,
      });

      await sleep(500);
    }
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(registeredUsers, null, 2));
  console.log(`📁 Users saved to ${OUTPUT_FILE}`);
  console.log("  Seeding complete.");
}

main();
