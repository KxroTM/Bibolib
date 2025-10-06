@echo off
echo ========================================
echo    🚀 Démarrage de BiboLib Frontend
echo ========================================
echo.

REM Vérifier si Node.js est installé
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js n'est pas installé !
    echo.
    echo Veuillez installer Node.js depuis : https://nodejs.org
    pause
    exit /b 1
)

echo ✅ Node.js détecté
node --version

REM Vérifier si les dépendances sont installées
if not exist "node_modules" (
    echo.
    echo 📦 Installation des dépendances...
    call npm install
    if %errorlevel% neq 0 (
        echo ❌ Erreur lors de l'installation des dépendances
        pause
        exit /b 1
    )
) else (
    echo ✅ Dépendances déjà installées
)

echo.
echo 🎯 Démarrage de l'application...
echo 📱 L'application sera accessible sur : http://localhost:3000
echo.
echo 👤 Compte admin de test :
echo    📧 Email    : admin@bibolib.fr
echo    🔐 Password : admin123
echo.
echo ⚡ Appuyez sur Ctrl+C pour arrêter l'application
echo.

REM Démarrer l'application
call npm start

pause