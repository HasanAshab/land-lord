const DEFAULT_BLOCK_COUNT = 25;
let blockCount = DEFAULT_BLOCK_COUNT


function openModal(action) {
  document.getElementById('block-count').innerText = DEFAULT_BLOCK_COUNT;
  document.getElementById('action-btn').innerText = action;
  document.getElementById('modal-title').innerText = action === 'buy' ? 'How much block?' : 'Confirm action';
  document.getElementById('modal').style.display = 'block';
  updateBlockDetails();
}

function closeModal() {
  blockCount = DEFAULT_BLOCK_COUNT
  document.getElementById('modal').style.display = 'none';
}

function adjustBlockCount(amount) {
  blockCount += amount;
  if (blockCount < 1) blockCount = 1; // Minimum block count is 1
  document.getElementById('block-count').innerText = blockCount;
  updateBlockDetails();
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
  return JSON.parse(localStorage.getItem(name));
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

  calculateLandSellingPrice(blocks) {
    return this.purchasingPrice(blocks) / 2;
  }
}

// Instantiate LandPriceCalculator
const lPCalc = new LandPriceCalculator(200);

// Function to update modal block details
function updateBlockDetails() {
  const cs = closestSquare(blockCount);
  const remainingBlocks = blockCount - cs * cs;
  document.getElementById('block-details').innerText = `~ ${pretifyBlockCount(blockCount)}`;
  document.getElementById('cost-details').innerText = `Cost: ${lPCalc.purchasingPrice(blockCount)}$`;
}

// Function to handle modal actions (buy, sell, discard)
function executeAction() {
  closeModal();
}
