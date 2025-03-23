const axios = require("axios");
const fs = require("fs");
const path = require("path");

const API_BASE = "http://localhost:4000"; // change if needed
const adminPrivateKey = "0x4a6d6453e733a2f8b5c46234886f0a4d08c1a717943e71d817da6694c37bee00";

const usersToCreate = ["alice", "bob", "charlie", "diana", "eve"];
const propertyTypes = ["House", "Land", "Apartment"];
const locations = ["New York", "Paris", "Tokyo", "London", "Berlin"];
const OUTPUT_FILE = path.join(__dirname, "seeded-users.json");

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const generateRandomSerial = () => "SN-" + Math.floor(Math.random() * 1000000);

async function registerUser(userId) {
  try {
    const response = await axios.post(`${API_BASE}/user/register`, { userId });
    console.log(`✅ Registered user: ${userId}`);
    return response.data;
  } catch (err) {
    console.error(`❌ Failed to register user "${userId}":`, err.response?.data?.error || err.message);
    return null;
  }
}

async function registerProperty({ name, propertyType, serialNumber, location, owner }) {
  try {
    await axios.post(`${API_BASE}/property/register`, {
      adminPrivateKey,
      name,
      propertyType,
      serialNumber,
      location,
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
    await sleep(1000); // delay between registrations
  }

  for (const user of registeredUsers) {
    const numberOfProperties = Math.floor(Math.random() * 3) + 1;

    for (let i = 0; i < numberOfProperties; i++) {
      const propertyName = `${user.userId}'s ${propertyTypes[i % propertyTypes.length]}`;
      const serialNumber = generateRandomSerial();
      const location = locations[Math.floor(Math.random() * locations.length)];

      await registerProperty({
        name: propertyName,
        propertyType: propertyTypes[i % propertyTypes.length],
        serialNumber,
        location,
        owner: user.walletAddress,
      });

      await sleep(1000);
    }
  }

  // Write users to JSON file
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(registeredUsers, null, 2));
  console.log(`📁 Users saved to ${OUTPUT_FILE}`);
  console.log("✅ Seeding complete.");
}

main();
