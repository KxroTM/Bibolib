#!/bin/bash

echo "========================================"
echo "   🚀 Démarrage de BiboLib Frontend"
echo "========================================"
echo

# Vérifier si Node.js est installé
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé !"
    echo
    echo "Veuillez installer Node.js depuis : https://nodejs.org"
    exit 1
fi

echo "✅ Node.js détecté"
node --version

# Vérifier si les dépendances sont installées
if [ ! -d "node_modules" ]; then
    echo
    echo "📦 Installation des dépendances..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Erreur lors de l'installation des dépendances"
        exit 1
    fi
else
    echo "✅ Dépendances déjà installées"
fi

echo
echo "🎯 Démarrage de l'application..."
echo "📱 L'application sera accessible sur : http://localhost:3000"
echo
echo "👤 Compte admin de test :"
echo "   📧 Email    : admin@bibolib.fr"
echo "   🔐 Password : admin123"
echo
echo "⚡ Appuyez sur Ctrl+C pour arrêter l'application"
echo

# Démarrer l'application
npm start