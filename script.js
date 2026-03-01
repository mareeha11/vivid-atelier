let currentStep = 1;
let cartQty = 0;

let selection = {
    fabricSource: "",
    fabric: null,
    neckline: null,
    sleeve: null
};

// Data Arrays
const fabrics = [
    { id: "F1", name: "Bridgerton Garden", img: "images/fabric/Bridgerton_Garden.webp" },
    { id: "F2", name: "Celestial Castles", img: "images/fabric/Celestial_Castles.webp" },
    { id: "F3", name: "Lavender Paisley", img: "images/fabric/LavenderPaisley.webp" },
    { id: "F4", name: "Maroon Bloom", img: "images/fabric/MaroonBloom.webp" },
    { id: "F5", name: "Orange Blocks", img: "images/fabric/Orange_Blocks.webp" },
    { id: "F6", name: "Chandler", img: "images/fabric/purple.webp" }
];

const necklines = [
    { id: "N1", name: "VN-001", img: "images/necklines/1.jpg" },
    { id: "N2", name: "VN-002", img: "images/necklines/2.jpg" },
    { id: "N3", name: "VN-003", img: "images/necklines/3.jpg" },
    { id: "N4", name: "VN-004", img: "images/necklines/4.jpg" },
    { id: "N5", name: "VN-005", img: "images/necklines/5.jpg" },
    { id: "N6", name: "VN-006", img: "images/necklines/6.jpg" }
];

const sleeves = [
    { id: "S1", name: "Arabic", img: "images/sleeves/arabic.jpeg" },
    { id: "S2", name: "Layered", img: "images/sleeves/layered.jpeg" },
    { id: "S3", name: "Normal", img: "images/sleeves/normal.jpeg" },
    { id: "S4", name: "Wide", img: "images/sleeves/wide.jpeg" }
];

document.addEventListener("DOMContentLoaded", () => {
    renderGrid("fabricGallery", fabrics, "fabric");
    renderGrid("necklineGrid", necklines, "neckline");
    renderGrid("sleeveGrid", sleeves, "sleeve");
});

// --- Render Grids ---
function renderGrid(containerId, items, type) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = "";
    items.forEach(item => {
        const div = document.createElement("div");
        div.classList.add("grid-item");
        div.innerHTML = `<img src="${item.img}" alt="${item.name}"><p>${item.name}</p>`;
        div.onclick = () => {
            Array.from(container.children).forEach(c => c.classList.remove("selected"));
            div.classList.add("selected");
            selection[type] = item;
        };
        container.appendChild(div);
    });
}

function getRandomPrice(min = 1000, max = 2500) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// --- Step Navigation ---
function handleFabricSource(val) {
    selection.fabricSource = val;
    document.getElementById('mainHeader').classList.add('header-hidden');
    document.getElementById('customerUploadArea').style.display = (val === "Customer") ? "block" : "none";
    document.getElementById('vividFabricArea').style.display = (val === "Vivid Collection") ? "block" : "none";
    nextStep(1);
}

function previewUpload(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = e => {
            document.getElementById('uploadPreview').innerHTML = `<img src="${e.target.result}" style="width:100px; margin-top:10px; border:1px solid #590533;">`;
            selection.fabric = { name: "Custom Fabric", img: e.target.result };
        };
        reader.readAsDataURL(input.files[0]);
    }
}

function nextStep(step) {
    if (step === 2) {
        if (selection.fabricSource === "Customer" && !document.getElementById('ownFabricPhoto').files[0]) {
            alert("Please upload your fabric photo."); return;
        }
        if (selection.fabricSource === "Vivid Collection" && !selection.fabric) {
            alert("Please select a fabric."); return;
        }
    }
    if (step === 3 && !selection.neckline) { alert("Please select a neckline."); return; }
    if (step === 4 && !selection.sleeve) { alert("Please select a sleeve."); return; }

    document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
    currentStep = step + 1;
    document.getElementById(`step${currentStep}`).classList.add('active');

    if (currentStep === 6) renderCart();
    window.scrollTo(0, 0);
}

function prevStep(step) {
    document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
    currentStep = step - 1;
    if(currentStep === 1) document.getElementById('mainHeader').classList.remove('header-hidden');
    document.getElementById(`step${currentStep}`).classList.add('active');
}

// --- Cart Operations ---
function addToCart() {
    const deliveryDate = document.getElementById('deliveryDate').value;
    if (!deliveryDate) { alert("Please select a delivery date."); return; }

    cartQty = 1;
    document.getElementById('cartCount').textContent = cartQty;
    nextStep(5);
}

function goToCart() {
    if (cartQty > 0) {
        document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
        currentStep = 6;
        document.getElementById('step6').classList.add('active');
        renderCart();
    } else {
        alert("Your cart is empty. Please complete the customization.");
    }
}

function renderCart() {
    const list = document.getElementById('cartItemsList');
    const totalDisplay = document.querySelector(".estimated-amount");
    const customizationBtn = document.querySelector(".btn-submit-cart");
    const cartHeader = document.querySelector(".cart-header-row"); 
    const cartFooter = document.querySelector(".cart-footer"); 
    const taxNote = document.querySelector(".tax-note");

    if (cartQty === 0) {
        if(cartHeader) cartHeader.style.display = 'none';
        if(cartFooter) cartFooter.style.display = 'none';
        if(customizationBtn) customizationBtn.style.display = 'none';
        if(taxNote) taxNote.style.display = 'none';

        list.innerHTML = `
            <div class="empty-cart">
                <h2>Your cart is empty!</h2>
                <button onclick="continueShopping()">Continue Shopping</button>
            </div>
        `;
        return;
    }

    if(cartHeader) cartHeader.style.display = 'grid';
    if(cartFooter) cartFooter.style.display = 'flex';
    if(customizationBtn) customizationBtn.style.display = 'inline-block';
    if(taxNote) taxNote.style.display = 'block';

    const fType = document.getElementById('fabricType').value;
    const fLength = document.getElementById('fabricLength').value;
    const embDetail = document.getElementById('embroideryDetail').value === 'custom' ? 'Custom Embroidery' : 'Pattern-based';
    const stitching = document.getElementById('stitchingService').value;
    const neckSize = document.getElementById('necklineMeasurementSelect').value === 'Custom' 
                     ? document.getElementById('necklineCustomInput').value 
                     : document.getElementById('necklineMeasurementSelect').value;

    // RANDOM price per selection
    if (!selection.itemPrice) {
        selection.itemPrice = getRandomPrice(1200, 1800); // customize min/max as needed
    }

    const itemTotal = selection.itemPrice * cartQty;

    list.innerHTML = `
        <div class="cart-item-row">
            <div class="cart-product-col">
                <div class="cart-visual-stack-vertical">
                    <img src="${selection.fabric.img}" alt="Fabric">
                    <img src="${selection.neckline.img}" alt="Neckline">
                    <img src="${selection.sleeve.img}" alt="Sleeve">
                </div>
                <div class="product-details">
                    <strong class="product-title">${selection.fabric.name} Custom Mukhawar</strong>
                    <div class="info-grid">
                        <p><strong>Fabric:</strong> ${fType} | ${fLength}</p>
                        <p><strong>Neckline Style:</strong> ${selection.neckline.name} (Depth: ${neckSize}")</p>
                        <p><strong>Sleeve Style:</strong> ${selection.sleeve.name}</p>
                        <p><strong>Embroidery:</strong> ${embDetail}</p>
                        <p><strong>Stitching:</strong> ${stitching === 'Yes' ? 'Full Service' : 'Fabric Only'}</p>
                    </div>
                </div>
            </div>
            <div class="cart-quantity-col">
                <div class="quantity-wrapper-row">
                    <div class="quantity-box">
                        <button onclick="updateCartQty(-1)">−</button>
                        <span class="quantity-number">${cartQty}</span>
                        <button onclick="updateCartQty(1)">+</button>
                    </div>
                    <button class="delete-btn-action" onclick="removeCartItem()">
                        <i class="fa-regular fa-trash-can"></i>
                    </button>
                </div>
            </div>
            <div class="cart-total-col">
                Dhs. ${itemTotal.toFixed(2)}
            </div>
        </div>
    `;

    totalDisplay.textContent = `Dhs. ${itemTotal.toFixed(2)}`;
}

// RANDOM price helper
function getRandomPrice(min = 1000, max = 2000) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function continueShopping() {
    document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
    currentStep = 1;
    document.getElementById('step1').classList.add('active');
    document.getElementById('mainHeader').classList.remove('header-hidden');
}

function updateCartQty(val) {
    cartQty += val;
    if (cartQty < 1) cartQty = 1;
    document.getElementById('cartCount').textContent = cartQty;
    renderCart();
}

function removeCartItem() {
    cartQty = 0;
    document.getElementById('cartCount').textContent = "0";
    renderCart();
}

// --- Toggle functions ---
function toggleEmbroideryUpload() {
    const val = document.getElementById('embroideryDetail').value;
    document.getElementById('embroideryUploadArea').style.display = (val === 'custom') ? 'block' : 'none';
}

function toggleMeasurements() {
  const service = document.getElementById('stitchingService').value;
  const measurementsArea = document.getElementById('measurementsArea');
  const measurementType = document.getElementById('measurementType');
  const standardSizeArea = document.getElementById('standardSizeArea');
  const customMeasurementsArea = document.getElementById('customMeasurementsArea');

  if (service === 'Yes') {
    measurementsArea.style.display = 'block';

    // Auto-select based on measurement type
    if (measurementType.value === 'Standard') {
      standardSizeArea.style.display = 'block';
      customMeasurementsArea.style.display = 'none';
    } else {
      standardSizeArea.style.display = 'none';
      customMeasurementsArea.style.display = 'block';
    }
  } else {
    measurementsArea.style.display = 'none';
    standardSizeArea.style.display = 'none';
    customMeasurementsArea.style.display = 'none';
  }
}

function toggleMeasurementInput() {
  const type = document.getElementById('measurementType').value;
  const standardSizeArea = document.getElementById('standardSizeArea');
  const customMeasurementsArea = document.getElementById('customMeasurementsArea');

  if (type === 'Standard') {
    standardSizeArea.style.display = 'block';
    customMeasurementsArea.style.display = 'none';
  } else {
    standardSizeArea.style.display = 'none';
    customMeasurementsArea.style.display = 'block';
  }
}

function toggleCustomNecklineInput() {
    const val = document.getElementById('necklineMeasurementSelect').value;
    document.getElementById('necklineCustomInput').style.display = (val === 'Custom') ? 'block' : 'none';
}

// --- Submission ---
function submitCustomization() {
    if(cartQty === 0) return; 

    const overlay = document.getElementById('successMsg');

    // Initial popup content
    overlay.innerHTML = `
        <div class="success-card">
            <h3>Thank You!</h3>
            <p>All customized designs are subject to final approval by the <strong>Vivid Design Team</strong> to maintain brand aesthetics and quality standards.</p>
            <p class="countdown-text">This page will refresh in <span id="countdown">10</span> seconds.</p>
        </div>
    `;

    overlay.style.display = 'flex';

    // Countdown logic
    let seconds = 10;
    const countdownEl = document.getElementById('countdown');
    const timer = setInterval(() => {
        seconds--;
        countdownEl.textContent = seconds;
        if (seconds <= 0) {
            clearInterval(timer);
            location.reload(); // refresh after 7s
        }
    }, 1000);
}

function submitEmail() {
    const email = document.getElementById("subscribeEmail").value;
    if (email) { 
        alert("Subscription successful!");
        document.getElementById("subscribeEmail").value = "";
    }
}