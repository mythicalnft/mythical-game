const walletStatus = document.getElementById('walletStatus');
const cardList = document.getElementById('cardList');
const connectWalletButton = document.getElementById('connectWallet');

const defaultCards = [
    { id: 1, name: "Chaneque", attack: 30, defense: 20, magic: 40, rarity: "Común" },
    { id: 2, name: "Quetzalcóatl", attack: 80, defense: 60, magic: 90, rarity: "Legendaria" }
];

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
        displayCards(defaultCards);
    } catch (error) {
        console.error('Error al conectar la billetera:', error);
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
            <h3>${card.name}</h3>
            <p>Ataque: ${card.attack} | Defensa: ${card.defense} | Magia: ${card.magic}</p>
            <p>Rareza: ${card.rarity}</p>
            <button onclick="selectCard(${card.id})">Seleccionar</button>
        `;
        cardList.appendChild(cardDiv);
    });
}

function selectCard(cardId) {
    const card = defaultCards.find(c => c.id === cardId);
    const enemy = defaultCards[Math.floor(Math.random() * defaultCards.length)];
    const attribute = ['attack', 'defense', 'magic'][Math.floor(Math.random() * 3)];
    const result = card[attribute] > enemy[attribute]
        ? `¡Ganaste! ${card.name} (${attribute}: ${card[attribute]}) venció a ${enemy.name} (${attribute}: ${enemy[attribute]})`
        : `Perdiste. ${enemy.name} (${attribute}: ${enemy[attribute]}) venció a ${card.name} (${attribute}: ${card[attribute]})`;
    walletStatus.textContent = result;
}

connectWalletButton.addEventListener('click', connectWallet);
walletStatus.textContent = 'Haz clic en "Conectar Billetera" para empezar.';

