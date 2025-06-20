const express = require('express');
const path = require('path');

const app = express();
const PORT = 7894;

app.use(express.static(__dirname));

const allowedTools = ['stackers', 'credits', 'xp', 'economy', 'zahsell', 'pay'];
app.get('/:tool', (req, res, next) => {
    if (allowedTools.includes(req.params.tool)) {
        res.sendFile(path.join(__dirname, `${req.params.tool}.html`));
    } else {
        next();
    }
});

// Page d'accueil
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Serveur lancé sur http://localhost:${PORT}`);
});
