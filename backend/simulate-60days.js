const axios = require("axios");
const fs = require("fs");
const path = require("path");

const API_BASE = "https://blockchain.ibrahimgomaa.me";
const adminPrivateKey = "0x4a6d6453e733a2f8b5c46234886f0a4d08c1a717943e71d817da6694c37bee00";

const propertyTypes = ["House", "Land", "Apartment"];
const locations = ["New York", "Paris", "Tokyo", "London", "Berlin"];
const OUTPUT_FILE = path.join(__dirname, "seeded-users.json");
const LOG_DIR = path.join(__dirname, "logs");

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

if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR);

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

async function simulateAllDays() {
  const registeredUsers = [];

  for (let day = 1; day <= 60; day++) {
    const logLines = [];
    const logFile = path.join(LOG_DIR, `day-${day}.log`);
    const log = (msg) => {
      const line = `[${new Date().toISOString()}] ${msg}`;
      console.log(msg);
      logLines.push(line);
    };

    log(`📅 Simulating Day ${day}...`);

    // Register a new user
    const newUserId = `day${day}-user`;
    const userData = await registerUser(newUserId);
    if (userData) {
      const newUser = {
        userId: userData.userId,
        walletAddress: userData.walletAddress,
        privateKey: userData.privateKey,
      };
      registeredUsers.push(newUser);
      log(`  Registered new user: ${newUserId}`);
    } else {
      log(`❌ Failed to register new user: ${newUserId}`);
    }

    // Assign new properties to all users
    for (const user of registeredUsers) {
      const count = getRandomInt(3, 5);
      log(`→ Generating ${count} properties for ${user.userId}`);

      for (let i = 0; i < count; i++) {
        const propertyName = `${user.userId}'s ${propertyTypes[i % propertyTypes.length]} (Day ${day})`;
        const serialNumber = generateRandomSerial();
        const location = locations[Math.floor(Math.random() * locations.length)];
        const imageUrl = imageUrls[Math.floor(Math.random() * imageUrls.length)];
        const imageBase64 = await fetchImageBase64(imageUrl);

        if (!imageBase64) {
          log(`⚠️ Skipping ${propertyName} (image fetch failed)`);
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

        log(`🏠 Registered property "${propertyName}" for ${user.userId}`);
        await sleep(200); // throttle
      }
    }

    fs.writeFileSync(logFile, logLines.join("\n"));
    log(`📄 Log saved to logs/day-${day}.log`);
    console.log(`  Day ${day} complete.\n`);
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(registeredUsers, null, 2));
  console.log(`📁 All users saved to ${OUTPUT_FILE}`);
  console.log("🎉 60-Day Simulation Complete!");
}

simulateAllDays();
