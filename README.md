# Cap Digital Scolaire

Application web responsive en français. Les exemples de cours utilisent les niveaux Grade 7 à Grade 13 et le tableau de bord démarre en Grade 9.

## Démarrage

Avec Node.js 22.12 ou supérieur `(npm)` :

```sh
npm ci
npm run dev
```

Vite affiche l’adresse de développement. `npm run build` prépare le site statique dans `dist/`.

## Explorer la démonstration

Le sélecteur en bas de la barre latérale permet de changer de profil. Le professeur peut publier un PDF ou une vidéo de moins de 2 Mo et ajouter une note. L’élève retrouve le support dans le niveau choisi. Le parent peut consulter les notes et les remarques de l’élève fictif. Le planificateur alimente l’agenda commun. Les autres espaces proposent le suivi pédagogique, les équipes et les demandes techniques.

Les changements restent dans le navigateur utilisé. Les profils de démonstration sont accessibles à tous les visiteurs. Utiliser uniquement des données fictives.

## Version Android

L’APK de démonstration est disponible dans [public/cap-digital-scolaire.apk](public/cap-digital-scolaire.apk). Il cible Android 15 et s’installe à partir d’Android 6. La compatibilité dépend également de la version d’Android System WebView. L’application embarque ses ressources et garde ses données dans son propre stockage local.

Pour reconstruire l’APK sous Linux, installer les dépendances avec `npm ci`, puis exécuter `android/build.sh`. Le script utilise Java, ECJ 3.40.0, Android SDK 35, Build Tools 35.0.0, zip et un keystore. Fournir les chemins par `ECJ_JAR`, `ANDROID_PLATFORM_JAR` et `ANDROID_BUILD_TOOLS`, puis la configuration de signature par `CAP_ANDROID_KEYSTORE`, `CAP_ANDROID_KEY_ALIAS` et `CAP_ANDROID_STORE_PASS`. Le premier argument facultatif fixe le chemin de sortie. Conserver le même certificat pour distribuer des mises à jour compatibles.
