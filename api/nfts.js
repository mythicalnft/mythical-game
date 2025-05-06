const Blockfrost = require('@blockfrost/blockfrost-js');

module.exports = async (req, res) => {
    // Agregar encabezados de CORS
    res.setHeader('Access-Control-Allow-Origin', 'https://mythicalnft.github.io');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    const blockfrost = new Blockfrost({
        projectId: 'YOUR_BLOCKFROST_API_KEY', // Asegúrate de que tu API Key de Blockfrost esté aquí
        network: 'preprod'
    });

    const address = req.query.address;
    try {
        const assets = await blockfrost.addressesAssets(address);
        const nfts = assets.filter(asset => asset.asset.startsWith('0af26c4f3a8d3223c5fc22c666da02473c8c39d1b29a36723f3eb4b5'));
        res.json(nfts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
