const TokenBucket = require('./rate-limiting-algorithms/TokenBucket');
const LeakyBucket = require('./rate-limiting-algorithms/LeakyBucket');

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function login(username) {
  const timestamp = new Date().toISOString().slice(11, 23);
  console.log(`[${timestamp}] Logging in user: ${username}`);
}

// ----------------------------------------------------
// 1. TOKEN BUCKET DEMO (Burst allowed immediately)
// ----------------------------------------------------
async function testTokenBucket() {
  console.log("==========================================");
  console.log("1. TOKEN BUCKET DEMO (Capacity: 3, Rate: 2/s)");
  console.log("==========================================");

  const bucket = new TokenBucket(3, 2);

  function sendTokenRequest(user) {
    bucket.allow()
      ? login(user)
      : console.log(`dropped login for ${user} by rate limiter`);
  }

  console.log("--- burst of 5 ---");
  for (let i = 1; i <= 5; i++) sendTokenRequest(`user${i}`); // first 3 pass immediately, 2 dropped

  console.log("--- wait 1s (refills ~2 tokens) ---");
  await sleep(1000);
  for (let i = 6; i <= 9; i++) sendTokenRequest(`user${i}`); // ~2 pass, 2 dropped
}

// ----------------------------------------------------
// 2. LEAKY BUCKET DEMO (Traffic Shaping / Constant Rate)
// ----------------------------------------------------
async function testLeakyBucket() {
  console.log("\n==========================================");
  console.log("2. LEAKY BUCKET DEMO (Capacity: 3, Leak Rate: 2/s)");
  console.log("==========================================");

  const leaky = new LeakyBucket(3, 2); // capacity of 3, leaks 1 request every 500ms

  function sendLeakyRequest(user) {
    const accepted = leaky.add(() => login(user));
    if (!accepted) {
      console.log(`dropped login for ${user} (leaky bucket queue full)`);
    }
  }

  console.log("--- burst of 5 arriving at once ---");
  for (let i = 1; i <= 5; i++) sendLeakyRequest(`user${i}`); // first 3 queued, 2 dropped

  // Wait 2.5s to let the queue finish leaking all 3 items (at 500ms intervals)
  await sleep(2500);

  console.log("--- send 2 more requests ---");
  sendLeakyRequest("user6");
  sendLeakyRequest("user7");

  // Wait 1.5s for remaining to drain
  await sleep(1500);
}

async function main() {
  await testTokenBucket();
  await testLeakyBucket();
}

main();
