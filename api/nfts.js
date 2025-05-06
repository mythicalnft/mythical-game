const Blockfrost = require('@blockfrost/blockfrost-js');

module.exports = async (req, res) => {
    // Configurar encabezados de CORS (no necesario si frontend y backend están en el mismo dominio, pero lo dejamos por si decides usar GitHub Pages de nuevo)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Manejar solicitudes OPTIONS (preflight)
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    const blockfrost = new Blockfrost({
        projectId: preprodYnFO7lfgPJlgJSvXbCnh8LspzVzOYUu0, // Reemplaza con tu API Key de Blockfrost
        network: 'preprod'
    });

    const address = req.query.address;
    try {
        const assets = await blockfrost.addressesAssets(address);
        const nfts = assets.filter(asset => asset.asset.startsWith('0af26c4f3a8d3223c5fc22c666da02473c8c39d1b29a36723f3eb4b5'));

        // Obtener metadatos para cada NFT
        const nftsWithMetadata = await Promise.all(nfts.map(async (nft) => {
            const metadata = await blockfrost.assetsById(nft.asset);
            const onchainMetadata = metadata.onchain_metadata || {};
            return {
                asset: nft.asset,
                asset_name: onchainMetadata.name || `NFT ${nft.asset.slice(0, 8)}`,
                image: onchainMetadata.image ? onchainMetadata.image.replace('ipfs://', 'https://ipfs.io/ipfs/') : null
            };
        }));

        res.json(nftsWithMetadata);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
