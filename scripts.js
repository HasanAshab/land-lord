const DEFAULT_PROFILE = {
    owned: 0,
    rented: 0,
}
const DEFAULT_BLOCK_COUNT = 25;
let blockCount = DEFAULT_BLOCK_COUNT

let _action = "buy"

function openModal(action, name) {
    _action = action
    const actionBtn = document.getElementById('action-btn');
    document.getElementById('block-count').innerText = DEFAULT_BLOCK_COUNT;
    document.getElementById('modal-title').innerText = action === 'buy' ? 'How much block?' : 'Confirm action';
    document.getElementById('modal').style.display = 'block';

    actionBtn.innerText = action;
    actionBtn.addEventListener('click', () => executeAction(action, name));
    updateBlockDetails(action);
}

function closeModal() {
    blockCount = DEFAULT_BLOCK_COUNT
    document.getElementById('modal').style.display = 'none';
    document.getElementById('cost-details').style.display = 'block';
    document.getElementById('cost-details').style.color = 'red';
}

function adjustBlockCount(amount, action) {
    blockCount += amount;
    if (blockCount < 1) blockCount = 1; // Minimum block count is 1
    document.getElementById('block-count').innerText = blockCount;
    updateBlockDetails(action);
}


function closestSquare(num) {
    return Math.floor(Math.sqrt(num));
}

function pretifyBlockCount(totalBlocks) {
    const cs = closestSquare(totalBlocks);
    const remainingBlocks = totalBlocks - cs * cs;
    return remainingBlocks === 0
        ? `${cs} x ${cs}`
        : `${cs} x ${cs} (+${remainingBlocks})`;
}

function landProfileOf(name) {
    profile = localStorage.getItem(name)

    console.log(profile);
    
    return profile
        ? JSON.parse(profile)
        : DEFAULT_PROFILE;
}

function updateProfileOf(name, profile) {
    localStorage.setItem(name, JSON.stringify(profile));
}

class LandPriceCalculator {
    constructor(pricePerBlock) {
        this.pricePerBlock = pricePerBlock;
    }

    purchasingPrice(blocks) {
        return this.pricePerBlock * blocks;
    }

    rentingPrice(blocks) {
        return this.purchasingPrice(blocks) / 10;
    }

    sellingPrice(blocks) {
        return this.purchasingPrice(blocks) / 2;
    }
}

// Instantiate LandPriceCalculator
const lPCalc = new LandPriceCalculator(200);

// Function to update modal block details
function updateBlockDetails() {
    document.getElementById('block-details').innerText = `~ ${pretifyBlockCount(blockCount)}`;
    if (_action === 'buy') {
        const cost = lPCalc.purchasingPrice(blockCount);
        document.getElementById('cost-details').innerText = `Cost: ${cost}$`;
    } else if (_action === 'rent') {
        const cost = lPCalc.rentingPrice(blockCount);
        document.getElementById('cost-details').innerText = `Cost: ${cost}$/Month`;
    } else if (_action === 'sell') {
        const cost = lPCalc.sellingPrice(blockCount);
        document.getElementById('cost-details').innerText = `Cost: ${cost}$`;
        document.getElementById('cost-details').style.color = 'green';
    } else if (_action === 'discard') {
        document.getElementById('cost-details').style.display = 'none';
    }
}

// Function to handle modal actions (buy, sell, discard)
function executeAction(action, name) {
    if (action === 'buy') {
        const profile = landProfileOf(name);
        profile.owned += blockCount;
        updateProfileOf(name, profile);
    } else if (action === 'sell') {
        const profile = landProfileOf(name);
        profile.owned -= blockCount;
        updateProfileOf(name, profile);
    } else if (action === 'rent') {
        const profile = landProfileOf(name);
        profile.rented += blockCount;
        updateProfileOf(name, profile);
    } else if (action === 'discard') {
        const profile = landProfileOf(name);
        profile.rented -= blockCount;
        updateProfileOf(name, profile);
    }
    closeModal();
    loadProfileOf(name);
}


function enableEditing() {
    const blockCountSpan = document.getElementById('block-count');
    const currentCount = blockCountSpan.innerText;
    
    // Create an input field and set its value to the current block count
    const inputField = document.createElement('input');
    inputField.type = 'number';
    inputField.value = currentCount;
    inputField.min = 1;
    inputField.style.width = '50px'; // Adjust the width if needed
    
    // Replace the span with the input field
    blockCountSpan.replaceWith(inputField);
    
    // Focus the input field for immediate editing
    inputField.focus();
    
    // Handle when the user presses Enter or clicks outside the input field
    inputField.addEventListener('blur', saveBlockCount);
    inputField.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            saveBlockCount();
        }
    });
}

function saveBlockCount() {
    const inputField = document.querySelector('#modal input[type="number"]');
    let newBlockCount = parseInt(inputField.value);
    
    // Ensure the block count is at least 1
    if (isNaN(newBlockCount) || newBlockCount < 1) {
        newBlockCount = 1;
    }

    blockCount = newBlockCount;  // Update the global block count variable

    // Create a new span to replace the input field
    const blockCountSpan = document.createElement('span');
    blockCountSpan.id = 'block-count';
    blockCountSpan.innerText = newBlockCount;
    blockCountSpan.setAttribute('onclick', 'enableEditing()');
    
    // Replace the input field with the updated span
    inputField.replaceWith(blockCountSpan);
    
    // Update the block details based on the new block count
    updateBlockDetails();
}


function loadProfileOf(name) {
    const profile = landProfileOf(name);
    document.getElementById(`${name}-owned`).innerHTML = pretifyBlockCount(profile.owned);
    document.getElementById(`${name}-rented`).innerHTML = pretifyBlockCount(profile.rented);
    document.getElementById(`${name}-total-land`).innerHTML = pretifyBlockCount(profile.owned + profile.rented);
    document.getElementById(`${name}-rent`).innerHTML = lPCalc.rentingPrice(profile.rented);
}

function loadProfiles() {
    loadProfileOf('hasan');
    loadProfileOf('hossain');
}


loadProfiles()