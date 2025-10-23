# Plugin ARASAAC pour draw.io

## Vue d'ensemble

Ce plugin permet d'intégrer la recherche et l'importation de pictogrammes ARASAAC directement dans l'éditeur draw.io (diagrams.net). Il offre une interface intuitive pour rechercher parmi plus de 11 500 pictogrammes libres et les insérer facilement dans vos diagrammes.

## Contexte pédagogique

L'intégration d'ARASAAC dans draw.io répond à un besoin spécifique dans le domaine des technologies assistives. ARASAAC (Aragonese Portal of Augmentative and Alternative Communication) constitue une ressource essentielle pour créer des supports de communication adaptés. En permettant l'accès direct à cette bibliothèque depuis draw.io, nous facilitons la création de documents visuels accessibles sans avoir à jongler entre plusieurs applications.

## Fonctionnalités

Le plugin offre les capacités suivantes :

- **Recherche multilingue** : recherchez des pictogrammes en français, anglais, espagnol, allemand ou italien
- **Aperçu visuel** : visualisez les pictogrammes avant de les insérer
- **Insertion directe** : cliquez sur un pictogramme pour l'ajouter instantanément au diagramme
- **Navigation paginée** : explorez facilement de nombreux résultats avec un système de pagination
- **Intégration native** : le plugin s'intègre parfaitement dans l'interface draw.io

## Architecture technique

### Structure du plugin

Le plugin suit l'architecture standard des plugins draw.io en utilisant la fonction `Draw.loadPlugin()`. Cette approche garantit une initialisation correcte dans l'environnement draw.io et un accès aux APIs nécessaires.

### Communication avec l'API ARASAAC

Le plugin communique avec deux endpoints principaux d'ARASAAC :

1. **API de recherche** : `https://api.arasaac.org/api/pictograms/search/{query}`
   - Retourne une liste de pictogrammes correspondant au terme recherché
   - Les résultats incluent les métadonnées multilingues

2. **Serveur d'images** : `https://static.arasaac.org/pictograms/{id}/{id}_500.png`
   - Fournit les images des pictogrammes en format PNG 500px
   - Permet l'affichage et l'insertion dans draw.io

### Gestion de l'interface utilisateur

L'interface de recherche est construite dynamiquement en JavaScript pur, sans dépendances externes. Cela assure une compatibilité maximale et des performances optimales. La structure comprend trois sections principales : la configuration de recherche (langue et terme), la zone d'affichage des résultats en grille, et les contrôles de pagination.

## Installation

### Méthode 1 : Installation locale (recommandée)

Cette méthode vous permet d'utiliser le plugin avec draw.io Desktop ou la version web :

1. Téléchargez le fichier `arasaac-plugin.js`
2. Ouvrez draw.io (desktop ou web : https://app.diagrams.net)
3. Dans le menu, sélectionnez **Extras > Plugins**
4. Cliquez sur le bouton **Add**
5. Cliquez sur **Select File** et choisissez le fichier `arasaac-plugin.js`
6. Cliquez sur **OK** puis sur **Apply**
7. Rechargez la page ou redémarrez draw.io Desktop

### Méthode 2 : Chargement temporaire via URL

Pour tester le plugin sans installation permanente :

1. Hébergez le fichier `arasaac-plugin.js` sur un serveur web accessible
2. Ouvrez draw.io avec l'URL : `https://app.diagrams.net/?p=https://votre-serveur.com/arasaac-plugin.js`
3. Le plugin sera chargé pour cette session uniquement

### Vérification de l'installation

Une fois installé correctement, vous devriez voir l'option "Rechercher ARASAAC" dans le menu **Extras**.

## Utilisation

### Recherche de pictogrammes

Pour rechercher et insérer un pictogramme, suivez ces étapes :

1. **Ouvrir la fenêtre de recherche**
   - Menu : **Extras > Rechercher ARASAAC**
   - Ou clic droit dans le diagramme > **Rechercher ARASAAC**

2. **Configurer la recherche**
   - Sélectionnez votre langue dans le menu déroulant (français, anglais, espagnol, allemand, italien)
   - Entrez un mot-clé dans le champ de recherche (par exemple : "maison", "manger", "école")

3. **Lancer la recherche**
   - Cliquez sur le bouton "Rechercher" ou appuyez sur Entrée
   - Les résultats s'affichent en grille avec des vignettes

4. **Parcourir les résultats**
   - Si plus de 20 résultats, utilisez les boutons "Précédent" et "Suivant" pour naviguer
   - Survolez un pictogramme pour voir un effet de zoom

5. **Insérer un pictogramme**
   - Cliquez simplement sur le pictogramme souhaité
   - Il sera automatiquement ajouté au centre de votre vue actuelle
   - Le nom du pictogramme apparaît sous l'image

### Manipulation des pictogrammes insérés

Une fois insérés dans draw.io, les pictogrammes se comportent comme des images standards et peuvent être manipulés de plusieurs façons :

- **Redimensionner** : cliquez et faites glisser les poignées de redimensionnement
- **Déplacer** : cliquez et faites glisser le pictogramme
- **Dupliquer** : Ctrl+D (ou Cmd+D sur Mac)
- **Modifier le texte** : double-cliquez sur le texte sous l'image
- **Changer le style** : utilisez le panneau de formatage à droite

## Approche didactique et pédagogique

### Comprendre le fonctionnement du plugin

Du point de vue pédagogique, il est intéressant de comprendre comment ce plugin fonctionne pour mieux en apprécier les possibilités et limitations.

#### Le cycle de vie d'une recherche

Lorsque vous effectuez une recherche, voici ce qui se passe en coulisses :

1. **Capture de la requête** : le plugin récupère votre terme de recherche et la langue sélectionnée
2. **Appel API** : une requête HTTP est envoyée à l'API ARASAAC
3. **Traitement des données** : les résultats JSON sont parsés et filtrés
4. **Génération de l'interface** : les vignettes sont créées dynamiquement
5. **Gestion des interactions** : chaque élément devient cliquable pour l'insertion

#### Architecture modulaire

Le code est structuré en fonctions distinctes, chacune ayant une responsabilité claire :

- `searchArasaac()` : gère la communication avec l'API
- `getPictogramImageUrl()` : construit les URLs d'images
- `createSearchDialog()` : génère l'interface utilisateur
- `displayResults()` : affiche et pagine les résultats
- `insertPictogram()` : insère le pictogramme dans le diagramme

Cette séparation des responsabilités facilite la maintenance et permet de comprendre rapidement le flux de données.

### Limitations techniques à connaître

Il est important de comprendre certaines contraintes techniques pour une utilisation optimale :

1. **Connexion Internet requise** : le plugin doit accéder à l'API ARASAAC en ligne
2. **Pas de cache local** : chaque recherche interroge l'API à nouveau
3. **Limite de 20 résultats par page** : optimise les performances d'affichage
4. **Images en PNG 500px** : format fixe pour tous les pictogrammes

## Personnalisation avancée

### Modifier les paramètres par défaut

Si vous souhaitez adapter le plugin à vos besoins, vous pouvez modifier ces variables au début du code :

```javascript
// Langue par défaut
let currentLanguage = 'fr'; // Changez en 'en', 'es', 'de', ou 'it'

// Nombre de résultats par page
const resultsPerPage = 20; // Augmentez ou diminuez selon vos préférences

// Taille des pictogrammes insérés
const imageWidth = 120; // Largeur en pixels
const imageHeight = 120; // Hauteur en pixels
```

### Adapter le style visuel

Les styles CSS inline peuvent être modifiés pour adapter l'apparence de l'interface de recherche à vos préférences visuelles. Par exemple, pour changer les couleurs du bouton de recherche, modifiez ces lignes :

```javascript
searchButton.style.backgroundColor = '#4CAF50'; // Couleur de fond
searchButton.style.color = 'white'; // Couleur du texte
```

## Dépannage

### Le plugin ne s'affiche pas dans le menu

Vérifiez que le plugin a été correctement installé en suivant ces étapes :

1. Ouvrez **Extras > Plugins**
2. Vérifiez que `arasaac-plugin.js` apparaît dans la liste
3. Si absent, recommencez l'installation
4. Assurez-vous de recharger complètement draw.io après l'ajout

### Erreur "Impossible de contacter le serveur ARASAAC"

Ce problème peut avoir plusieurs causes :

- **Connexion Internet** : vérifiez votre connexion réseau
- **Pare-feu** : assurez-vous que l'accès à `api.arasaac.org` n'est pas bloqué
- **CORS** : si vous utilisez une version hébergée, vérifiez la configuration CORS

### Les pictogrammes ne s'affichent pas

Si les miniatures n'apparaissent pas dans les résultats de recherche :

1. Vérifiez l'accès à `static.arasaac.org` dans votre navigateur
2. Consultez la console développeur (F12) pour voir les erreurs éventuelles
3. Essayez de recharger la page

### Les images insérées apparaissent cassées

Cela peut indiquer un problème de chargement d'image :

- Vérifiez que les URLs d'images sont correctement formées
- Assurez-vous que draw.io peut charger des images externes
- Testez l'URL directement dans votre navigateur

## Intégration dans un workflow pédagogique

### Création de supports de communication

Ce plugin facilite grandement la création de tableaux de communication, plannings visuels et autres supports adaptés. Voici un exemple de workflow efficace :

1. **Préparer la structure** : créez d'abord la structure de votre document dans draw.io (grilles, zones, etc.)
2. **Rechercher les pictogrammes** : utilisez le plugin pour trouver et insérer les pictogrammes appropriés
3. **Organiser et labelliser** : disposez les pictogrammes et ajoutez du texte explicatif
4. **Exporter** : sauvegardez en PNG, SVG ou PDF selon vos besoins

### Collaboration avec d'autres outils

Le plugin ARASAAC s'intègre naturellement dans un écosystème d'outils pour les technologies assistives :

- **TLAB** : utilisez TLAB pour créer des tableaux de langage assisté structurés, puis enrichissez-les dans draw.io
- **Outils de CAA** : les pictogrammes insérés peuvent être exportés et réutilisés dans d'autres applications de communication
- **Documentation** : intégrez les diagrammes créés dans des documents Word, présentations PowerPoint, etc.

## Améliorations futures possibles

En tant que spécialiste des technologies assistives, vous pourriez envisager d'étendre ce plugin avec les fonctionnalités suivantes :

- **Favoris** : permettre de sauvegarder des pictogrammes fréquemment utilisés
- **Catégories** : navigation par catégories thématiques ARASAAC
- **Configuration des couleurs** : adapter la couleur de fond des pictogrammes
- **Export batch** : exporter plusieurs pictogrammes d'un coup
- **Synchronisation avec TLAB** : import/export de grilles TLAB

## Ressources complémentaires

### Documentation ARASAAC
- Site officiel : https://arasaac.org
- API documentation : https://api.arasaac.org
- Licence : Creative Commons BY-NC-SA

### Documentation draw.io
- Site officiel : https://www.diagrams.net
- Documentation plugins : https://www.drawio.com/doc/faq/plugins
- GitHub : https://github.com/jgraph/drawio

### Support et contribution
Pour signaler des bugs ou proposer des améliorations, vous pouvez :
- Ouvrir une issue sur le dépôt GitHub du projet
- Contacter l'équipe ARASAAC
- Partager vos retours d'expérience avec la communauté des technologies assistives

## Licence

Ce plugin utilise les pictogrammes ARASAAC qui sont la propriété du Gouvernement d'Aragon et ont été créés par Sergio Palao pour ARASAAC. Ils sont distribués sous licence Creative Commons BY-NC-SA.

Le code du plugin lui-même est fourni à des fins éducatives et peut être librement modifié et distribué dans le respect de la licence des pictogrammes.

## Conclusion

Ce plugin constitue un pont efficace entre deux outils essentiels dans le domaine des technologies assistives : la richesse de la bibliothèque ARASAAC et la flexibilité de l'éditeur draw.io. En comprenant son fonctionnement et ses possibilités, vous pouvez créer des supports de communication visuels de haute qualité de manière plus efficace.

L'approche modulaire et documentée du code permet également d'utiliser ce plugin comme base d'apprentissage pour comprendre comment créer des extensions pour draw.io, ouvrant ainsi la voie à d'autres innovations dans le domaine des technologies assistives.
