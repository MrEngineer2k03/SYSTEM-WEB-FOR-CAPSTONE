// ------------------------------
// Data & Utilities
// ------------------------------
const fmtDate = ts => new Date(ts).toLocaleString();
const relTime = ts => {
  const d = Date.now() - new Date(ts).getTime();
  const m = Math.round(d/60000), h = Math.round(m/60), dd = Math.round(h/24);
  if (m < 60) return m + "m ago";
  if (h < 48) return h + "h ago";
  return dd + "d ago";
};
const uid = () => Math.random().toString(36).slice(2,9);

const BIN_TYPES = [
  { type:"Paper", color:"linear-gradient(90deg,#22c55e,#38bdf8)" },
  { type:"Plastic", color:"linear-gradient(90deg,#38bdf8,#6366f1)" },
  { type:"Metal", color:"linear-gradient(90deg,#f59e0b,#ef4444)" },
  { type:"E-Waste", color:"linear-gradient(90deg,#a855f7,#22c55e)" },
];

// Battery status helpers
const getBatteryStatus = (battery) => {
  if (battery >= 75) return { level: 'high', color: '#22c55e', text: 'Excellent' };
  if (battery >= 50) return { level: 'medium', color: '#f59e0b', text: 'Good' };
  if (battery >= 25) return { level: 'medium', color: '#f59e0b', text: 'Fair' };
  return { level: 'low', color: '#ef4444', text: 'Low' };
};

// Desktop and Mobile coordinates for bins with battery levels
let demoBins = [
  { 
    id:"CANTEEN BIN-1", 
    type:"Paper", 
    filled:38, 
    battery: 85,
    lastCollected: Date.now()-1000*60*60*36, 
    desktop: { lat:40, lng:40 },
    mobile: { lat:35, lng:38 }
  },
  { 
    id:"CANTEEN BIN-2", 
    type:"Plastic", 
    filled:38, 
    battery: 72,
    lastCollected: Date.now()-1000*60*60*36, 
    desktop: { lat:43, lng:40 },
    mobile: { lat:38, lng:38 }
  },
  { 
    id:"CANTEEN BIN-3", 
    type:"Metal", 
    filled:38, 
    battery: 45,
    lastCollected: Date.now()-1000*60*60*36, 
    desktop: { lat:46, lng:40 },
    mobile: { lat:41, lng:38 }
  },
  { 
    id:"CANTEEN BIN-4", 
    type:"E-Waste", 
    filled:38, 
    battery: 15,
    lastCollected: Date.now()-1000*60*60*36, 
    desktop: { lat:49, lng:40 },
    mobile: { lat:44, lng:38 }
  },
  { 
    id:"REGISTRAR BIN-1", 
    type:"Paper", 
    filled:95, 
    battery: 92,
    lastCollected: Date.now()-1000*60*60*5, 
    desktop: { lat:40, lng:81 },
    mobile: { lat:35, lng:78 }
  },
  { 
    id:"REGISTRAR BIN-2", 
    type:"Plastic", 
    filled:95, 
    battery: 78,
    lastCollected: Date.now()-1000*60*60*5, 
    desktop: { lat:43, lng:81 },
    mobile: { lat:38, lng:78 }
  },
  { 
    id:"REGISTRAR BIN-3", 
    type:"Metal", 
    filled:95, 
    battery: 55,
    lastCollected: Date.now()-1000*60*60*5, 
    desktop: { lat:46, lng:81 },
    mobile: { lat:41, lng:78 }
  },
  { 
    id:"REGISTRAR BIN-4", 
    type:"E-Waste", 
    filled:95, 
    battery: 23,
    lastCollected: Date.now()-1000*60*60*5, 
    desktop: { lat:49, lng:81 },
    mobile: { lat:44, lng:78 }
  },
];

// Demo store rewards
const storeItems = [
  { id:"st1", title:"Free Coffee", cost:20 },
  { id:"st2", title:"Canteen 10% Voucher", cost:50 },
  { id:"st3", title:"Ballpen", cost:100 },
];

// Local storage helpers
const save = (k,v) => localStorage.setItem(k, JSON.stringify(v));
const load = k => { try{ return JSON.parse(localStorage.getItem(k)); }catch{return null;} };

// ------------------------------
// Auth System
// ------------------------------
let currentUser = null;
let users = load("users") || {};

function showAuth(msg=""){
  document.querySelector("#auth").classList.remove("hidden");
  document.querySelector("#app").classList.add("hidden");
  if(msg) document.querySelector("#authMsg").textContent = msg;
}
function showApp(){
  document.querySelector("#auth").classList.add("hidden");
  document.querySelector("#app").classList.remove("hidden");
  renderApp();
}

// Login / Register
document.querySelector("#authSubmit").onclick = () => {
  const user = document.querySelector("#authUser").value.trim();
  const pass = document.querySelector("#authPass").value.trim();
  const mode = document.querySelector("#authTitle").textContent;

  if(!user || !pass){
    document.querySelector("#authMsg").textContent = "Enter username & password.";
    return;
  }
  if(mode === "Login"){
    if(users[user] && users[user].pass === pass){
      currentUser = user;
      showApp();
    }else{
      document.querySelector("#authMsg").textContent = "Invalid credentials.";
    }
  }else{
    if(users[user]){
      document.querySelector("#authMsg").textContent = "User already exists.";
    }else{
      users[user] = { pass, points:0 };
      save("users", users);
      currentUser = user;
      showApp();
    }
  }
};
document.querySelector("#authToggle").onclick = () => {
  const title = document.querySelector("#authTitle");
  const btn = document.querySelector("#authSubmit");
  if(title.textContent === "Login"){
    title.textContent = "Register";
    btn.textContent = "Register";
    document.querySelector("#authToggle").textContent = "Back to login";
  }else{
    title.textContent = "Login";
    btn.textContent = "Login";
    document.querySelector("#authToggle").textContent = "Create account";
  }
};

// Logout
document.querySelector("#logout").onclick = e => {
  e.preventDefault();
  currentUser = null;
  showAuth("Logged out.");
};

// ------------------------------
// App Rendering
// ------------------------------
function renderApp(){
  if(!currentUser) return;

  // Update sidebar & header
  document.querySelector("#sideUser").textContent = currentUser;
  document.querySelector("#topUser").textContent = currentUser;
  document.querySelector("#sidePoints").textContent = users[currentUser].points;
  document.querySelector("#topPoints").textContent = users[currentUser].points;
  document.querySelector("#storePoints").textContent = users[currentUser].points;
  document.querySelector("#profUser").value = currentUser;
  document.querySelector("#profPass").value = "";

  // Render bins
  const grid = document.querySelector("#binsGrid");
  grid.innerHTML = "";
  demoBins.forEach(bin=>{
    const t = BIN_TYPES.find(t=>t.type===bin.type);
    const batteryStatus = getBatteryStatus(bin.battery);
    
    const card = document.createElement("div");
    card.className = "card bin-card";
    card.innerHTML = `
      <div class="bin-head">
        <strong>${bin.id}</strong>
        <span class="pill">${bin.type}</span>
      </div>
      <div class="progress"><div class="bar" style="width:${bin.filled}%; background:${t.color}"></div></div>
      <div class="row-between">
        <span class="muted">${bin.filled}% full</span>
        <span class="muted">Last Collected: ${relTime(bin.lastCollected)}</span>
      </div>
      <div class="battery-section">
        <div class="battery-icon">
          <div class="battery-fill battery-${batteryStatus.level}" style="width: ${bin.battery}%"></div>
        </div>
        <span class="battery-text" style="color: ${batteryStatus.color}">${bin.battery}%</span>
        <span class="battery-status">${batteryStatus.text}</span>
      </div>
      <div class="actions">
        <button class="btn ghost small" onclick="collectBin('${bin.id}')">Collect</button>
        <button class="btn ghost small" onclick="addPoints('${bin.id}')">+Points</button>
      </div>
    `;
    grid.appendChild(card);
  });

  // Render store
  const sg = document.querySelector("#storeGrid");
  sg.innerHTML = "";
  storeItems.forEach(item=>{
    const el = document.createElement("div");
    el.className="card store-item";
    el.innerHTML = `
   <div class="title">${item.title}</div>
    <div class="muted" style="margin-top:8px;">Cost: ${item.cost}</div>
    <button class="btn" style="margin-top:10px;" onclick="redeem('${item.id}')">Redeem</button>
`;
    sg.appendChild(el);
  });

  // Render both maps
  renderDesktopMap();
  renderMobileMap();
}

// ------------------------------
// Bin Actions
// ------------------------------
function collectBin(id){
  const b = demoBins.find(x=>x.id===id);
  if(b){
    b.filled = 0;
    b.lastCollected = Date.now();
    // Simulate minor battery drain from collection process
    b.battery = Math.max(0, b.battery - Math.floor(Math.random() * 3 + 1));
    renderApp();
  }
}
function addPoints(id){
  users[currentUser].points += 5;
  save("users", users);
  renderApp();
}
function simulateCollect(){
  const dt = document.querySelector("#collectTime").value;
  if(!dt) return;
  demoBins.forEach(b=>{
    b.lastCollected = new Date(dt).getTime();
    // Simulate battery drain during collection
    b.battery = Math.max(0, b.battery - Math.floor(Math.random() * 5 + 1));
  });
  renderApp();
}
function randomizeLevels(){
  demoBins.forEach(b=>b.filled = Math.floor(Math.random()*100));
  renderApp();
}

// Battery simulation functions
function randomizeBatteries(){
  demoBins.forEach(b=>{
    b.battery = Math.floor(Math.random() * 100);
  });
  renderApp();
}

function simulateSolarCharge(){
  demoBins.forEach(b=>{
    // Simulate solar charging - add 15-30% battery
    const chargeAmount = Math.floor(Math.random() * 15 + 15);
    b.battery = Math.min(100, b.battery + chargeAmount);
  });
  renderApp();
}

// ------------------------------
// Store Actions
// ------------------------------
function redeem(id){
  const item = storeItems.find(x=>x.id===id);
  if(!item) return;
  const u = users[currentUser];
  if(u.points >= item.cost){
    u.points -= item.cost;
    save("users", users);
    alert("Redeemed: "+item.title);
    renderApp();
  }else{
    alert("Not enough points!");
  }
}

// ------------------------------
// Profile Save
// ------------------------------
document.querySelector("#saveProfile").onclick = () => {
  const newUser = document.querySelector("#profUser").value.trim();
  const newPass = document.querySelector("#profPass").value.trim();

  if(newUser !== currentUser && users[newUser]){
    document.querySelector("#profMsg").textContent = "Username already exists.";
    return;
  }

  const oldData = users[currentUser];
  delete users[currentUser];
  users[newUser] = { pass: newPass || oldData.pass, points: oldData.points };
  currentUser = newUser;
  save("users", users);
  document.querySelector("#profMsg").textContent = "Profile saved!";
  renderApp();
};

// ------------------------------
// Map Rendering - Desktop
// ------------------------------
function renderDesktopMap(){
  const map = document.querySelector("#desktopMap");
  map.innerHTML = "";
  demoBins.forEach(b=>{
    const pin = document.createElement("div");
    pin.className = "pin";
    pin.style.left = b.desktop.lng+"%";
    pin.style.top = b.desktop.lat+"%";

    let color = "limegreen";
    if(b.type === "Paper") color = "#22c55e";
    if(b.type === "Plastic") color = "#3b82f6";
    if(b.type === "Metal") color = "#f59e0b";
    if(b.type === "E-Waste") color = "#a855f7";

    const batteryStatus = getBatteryStatus(b.battery);
    const lowBatteryClass = batteryStatus.level === 'low' ? 'low-battery' : '';

    pin.innerHTML = `<div class="dot ${lowBatteryClass}" style="background:${color}; box-shadow:0 0 6px ${color}80"></div><div class="label">${b.id}</div>`;
    pin.onclick = ()=>alert(`${b.id} – ${b.type} – ${b.filled}% full\nBattery: ${b.battery}% (${batteryStatus.text})\nLast collected: ${relTime(b.lastCollected)}`);
    map.appendChild(pin);
  });
}

// ------------------------------
// Map Rendering - Mobile
// ------------------------------
function renderMobileMap(){
  const map = document.querySelector("#mobileMap");
  map.innerHTML = "";
  demoBins.forEach(b=>{
    const pin = document.createElement("div");
    pin.className = "pin";
    pin.style.left = b.mobile.lng+"%";
    pin.style.top = b.mobile.lat+"%";

    let color = "limegreen";
    if(b.type === "Paper") color = "#22c55e";
    if(b.type === "Plastic") color = "#3b82f6";
    if(b.type === "Metal") color = "#f59e0b";
    if(b.type === "E-Waste") color = "#a855f7";

    const batteryStatus = getBatteryStatus(b.battery);
    const lowBatteryClass = batteryStatus.level === 'low' ? 'low-battery' : '';

    pin.innerHTML = `<div class="dot ${lowBatteryClass}" style="background:${color}; box-shadow:0 0 6px ${color}80"></div><div class="label">${b.id}</div>`;
    pin.onclick = ()=>alert(`${b.id} – ${b.type} – ${b.filled}% full\nBattery: ${b.battery}% (${batteryStatus.text})\nLast collected: ${relTime(b.lastCollected)}`);
    map.appendChild(pin);
  });
}

// ------------------------------
// Tabs Navigation
// ------------------------------
document.querySelectorAll(".nav-btn[data-tab]").forEach(btn=>{
  btn.onclick = ()=>{
    document.querySelectorAll(".nav-btn").forEach(b=>b.classList.remove("active"));
    btn.classList.add("active");
    const tab = btn.getAttribute("data-tab");
    document.querySelectorAll(".tab").forEach(t=>t.classList.remove("active"));
    document.querySelector("#tab-"+tab).classList.add("active");
  };
});

// Initialize the app
if(currentUser) {
  showApp();
} else {
  showAuth();
}

// Auto-simulate battery drain over time (optional)
setInterval(() => {
  demoBins.forEach(bin => {
    // Small chance of battery drain (simulating real usage)
    if(Math.random() < 0.1 && bin.battery > 0) {
      bin.battery = Math.max(0, bin.battery - 1);
    }
  });
  if(currentUser) {
    renderApp();
  }
}, 30000); // Update every 30 seconds