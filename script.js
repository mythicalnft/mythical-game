const walletStatus = document.getElementById('walletStatus');
const cardList = document.getElementById('cardList');
const connectWalletButton = document.getElementById('connectWallet');
const tokenCount = document.getElementById('tokenCount');
const battleModal = document.getElementById('battleModal');
const battleResult = document.getElementById('battleResult');

let defaultCards = [];

let missionState = {
    currentMission: null,
    enemiesToDefeat: 0,
    enemiesDefeated: 0,
    rewards: 0,
    rewardAmount: 0
};

async function connectWallet() {
    try {
        if (!window.cardano || !window.cardano.lace) {
            throw new Error('Lace Wallet no está instalado. Por favor, instálalo.');
        }
        const laceApi = await window.cardano.lace.enable();
        const addresses = await laceApi.getUsedAddresses();
        if (addresses.length === 0) {
            throw new Error('No se encontraron direcciones en la billetera.');
        }
        walletStatus.textContent = `Billetera conectada: ${addresses[0].slice(0, 10)}...`;

        const response = await fetch(`https://mythical-tcg-backend.vercel.app/api/nfts?address=${addresses[0]}`);
        const nfts = await response.json();
        if (nfts.length === 0) {
            cardList.innerHTML = '<p>No se encontraron NFTs con tu Policy ID.</p>';
            return;
        }
        defaultCards = nfts.map((nft, index) => ({
            id: index + 1,
            name: nft.asset_name,
            attack: 50,
            defense: 50,
            magic: 50,
            rarity: "Rara",
            image: nft.image || `https://picsum.photos/200/150?random=${index + 1}` // Usa la imagen del NFT o una placeholder
        }));
        displayCards(defaultCards);
    } catch (error) {
        console.error('Error al conectar la billetera o cargar NFTs:', error);
        walletStatus.textContent = `Error: ${error.message}`;
    }
}

function displayCards(cards) {
    cardList.innerHTML = '';
    if (!cards || cards.length === 0) {
        cardList.innerHTML = '<p>No se encontraron cartas.</p>';
        return;
    }
    cards.forEach(card => {
        const cardDiv = document.createElement('div');
        cardDiv.className = `card ${card.rarity.toLowerCase()}`;
        cardDiv.innerHTML = `
            <img src="${card.image}" alt="${card.name}">
            <h3>${card.name}</h3>
            <p>Ataque: ${card.attack} | Defensa: ${card.defense} | Magia: ${card.magic}</p>
            <p>Rareza: ${card.rarity}</p>
            <button onclick="selectCard(${card.id})">Seleccionar</button>
        `;
        cardList.appendChild(cardDiv);
    });
}

function showModal(message) {
    battleResult.textContent = message;
    battleModal.style.display = 'block';
}

function closeModal() {
    battleModal.style.display = 'none';
}

function updateTokenCount() {
    tokenCount.textContent = missionState.rewards.toFixed(1);
}

function selectCard(cardId) {
    const card = defaultCards.find(c => c.id === cardId);
    const enemy = defaultCards[Math.floor(Math.random() * defaultCards.length)];
    const attribute = ['attack', 'defense', 'magic'][Math.floor(Math.random() * 3)];
    const result = card[attribute] > enemy[attribute]
        ? `¡Ganaste! ${card.name} (${attribute}: ${card[attribute]}) venció a ${enemy.name} (${attribute}: ${enemy[attribute]})`
        : `Perdiste. ${enemy.name} (${attribute}: ${enemy[attribute]}) venció a ${card.name} (${attribute}: ${card[attribute]})`;
    
    if (missionState.currentMission && result.includes('¡Ganaste!')) {
        missionState.enemiesDefeated++;
        if (missionState.enemiesDefeated >= missionState.enemiesToDefeat) {
            missionState.rewards += missionState.rewardAmount;
            updateTokenCount();
            showModal(`¡Misión completada! Has ganado ${missionState.rewardAmount} MythicToken. Total acumulado: ${missionState.rewards.toFixed(1)} MythicToken.`);
            missionState.currentMission = null;
            missionState.enemiesToDefeat = 0;
            missionState.enemiesDefeated = 0;
            missionState.rewardAmount = 0;
        } else {
            showModal(`${result} Enemigos derrotados: ${missionState.enemiesDefeated}/${missionState.enemiesToDefeat}`);
        }
    } else {
        showModal(result);
    }
}

function startMission(missionName, enemiesToDefeat, rewardAmount) {
    missionState.currentMission = missionName;
    missionState.enemiesToDefeat = enemiesToDefeat;
    missionState.enemiesDefeated = 0;
    missionState.rewardAmount = rewardAmount;
    walletStatus.textContent = `Misión iniciada: ${missionName === 'Chaneque' ? 'El Chaneque del Humedal' : missionName === 'Axolotl' ? 'El Guardián del Axolotl' : 'La Danza del Tlaloc'}. Derrota ${enemiesToDefeat} enemigos.`;
}

connectWalletButton.addEventListener('click', connectWallet);
walletStatus.textContent = 'Haz clic en "Conectar Billetera" para empezar.';
updateTokenCount();
