/**
 * Plugin ARASAAC pour draw.io
 * Permet de rechercher et d'importer des pictogrammes ARASAAC directement dans draw.io
 * 
 * Installation :
 * 1. Sauvegarder ce fichier localement
 * 2. Dans draw.io : Extras > Plugins > Add
 * 3. Sélectionner ce fichier et cliquer sur Apply
 * 4. Redémarrer draw.io
 */

Draw.loadPlugin(function(ui) {
    // Configuration de l'API ARASAAC
    const ARASAAC_API_URL = 'https://api.arasaac.org/api/pictograms';
    const ARASAAC_IMAGE_URL = 'https://static.arasaac.org/pictograms';
    
    // Configuration par défaut
    let currentLanguage = 'fr';
    let currentPage = 1;
    let searchResults = [];
    const resultsPerPage = 20;
    
    /**
     * Fonction de recherche dans l'API ARASAAC
     */
    async function searchArasaac(query, language) {
        try {
            const url = `${ARASAAC_API_URL}/search/${encodeURIComponent(query)}`;
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Erreur lors de la recherche ARASAAC:', error);
            ui.showError('Erreur', 'Impossible de contacter le serveur ARASAAC', 'OK');
            return [];
        }
    }
    
    /**
     * Récupérer l'URL de l'image d'un pictogramme
     */
    function getPictogramImageUrl(pictogramId) {
        return `${ARASAAC_IMAGE_URL}/${pictogramId}/${pictogramId}_500.png`;
    }
    
    /**
     * Créer la fenêtre de dialogue de recherche
     */
    function createSearchDialog() {
        const graph = ui.editor.graph;
        
        // Créer le conteneur principal
        const container = document.createElement('div');
        container.style.padding = '20px';
        container.style.width = '600px';
        container.style.maxHeight = '700px';
        container.style.overflow = 'auto';
        
        // Titre
        const title = document.createElement('h3');
        title.textContent = 'Recherche de pictogrammes ARASAAC';
        title.style.marginTop = '0';
        container.appendChild(title);
        
        // Section de recherche
        const searchSection = document.createElement('div');
        searchSection.style.marginBottom = '20px';
        
        // Sélecteur de langue
        const languageLabel = document.createElement('label');
        languageLabel.textContent = 'Langue : ';
        languageLabel.style.marginRight = '10px';
        
        const languageSelect = document.createElement('select');
        languageSelect.style.marginRight = '20px';
        languageSelect.style.padding = '5px';
        
        const languages = [
            { code: 'fr', name: 'Français' },
            { code: 'en', name: 'English' },
            { code: 'es', name: 'Español' },
            { code: 'de', name: 'Deutsch' },
            { code: 'it', name: 'Italiano' }
        ];
        
        languages.forEach(lang => {
            const option = document.createElement('option');
            option.value = lang.code;
            option.textContent = lang.name;
            if (lang.code === currentLanguage) {
                option.selected = true;
            }
            languageSelect.appendChild(option);
        });
        
        languageSelect.addEventListener('change', function() {
            currentLanguage = this.value;
        });
        
        // Champ de recherche
        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.placeholder = 'Entrez un mot-clé...';
        searchInput.style.width = '300px';
        searchInput.style.padding = '8px';
        searchInput.style.marginRight = '10px';
        searchInput.style.border = '1px solid #ccc';
        searchInput.style.borderRadius = '4px';
        
        // Bouton de recherche
        const searchButton = document.createElement('button');
        searchButton.textContent = 'Rechercher';
        searchButton.style.padding = '8px 15px';
        searchButton.style.backgroundColor = '#4CAF50';
        searchButton.style.color = 'white';
        searchButton.style.border = 'none';
        searchButton.style.borderRadius = '4px';
        searchButton.style.cursor = 'pointer';
        
        searchSection.appendChild(languageLabel);
        searchSection.appendChild(languageSelect);
        searchSection.appendChild(document.createElement('br'));
        searchSection.appendChild(document.createElement('br'));
        searchSection.appendChild(searchInput);
        searchSection.appendChild(searchButton);
        
        container.appendChild(searchSection);
        
        // Zone de résultats
        const resultsContainer = document.createElement('div');
        resultsContainer.style.display = 'grid';
        resultsContainer.style.gridTemplateColumns = 'repeat(4, 1fr)';
        resultsContainer.style.gap = '15px';
        resultsContainer.style.marginTop = '20px';
        
        container.appendChild(resultsContainer);
        
        // Zone de pagination
        const paginationContainer = document.createElement('div');
        paginationContainer.style.marginTop = '20px';
        paginationContainer.style.textAlign = 'center';
        
        container.appendChild(paginationContainer);
        
        /**
         * Afficher les résultats de recherche
         */
        function displayResults(results, page = 1) {
            resultsContainer.innerHTML = '';
            paginationContainer.innerHTML = '';
            
            if (results.length === 0) {
                const noResults = document.createElement('div');
                noResults.textContent = 'Aucun résultat trouvé';
                noResults.style.gridColumn = '1 / -1';
                noResults.style.textAlign = 'center';
                noResults.style.padding = '20px';
                noResults.style.color = '#666';
                resultsContainer.appendChild(noResults);
                return;
            }
            
            const startIndex = (page - 1) * resultsPerPage;
            const endIndex = Math.min(startIndex + resultsPerPage, results.length);
            const pageResults = results.slice(startIndex, endIndex);
            
            pageResults.forEach(result => {
                const pictogramCard = document.createElement('div');
                pictogramCard.style.border = '1px solid #ddd';
                pictogramCard.style.borderRadius = '8px';
                pictogramCard.style.padding = '10px';
                pictogramCard.style.textAlign = 'center';
                pictogramCard.style.cursor = 'pointer';
                pictogramCard.style.transition = 'transform 0.2s';
                
                pictogramCard.addEventListener('mouseenter', function() {
                    this.style.transform = 'scale(1.05)';
                    this.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
                });
                
                pictogramCard.addEventListener('mouseleave', function() {
                    this.style.transform = 'scale(1)';
                    this.style.boxShadow = 'none';
                });
                
                const img = document.createElement('img');
                img.src = getPictogramImageUrl(result._id);
                img.style.width = '100%';
                img.style.height = 'auto';
                img.style.maxHeight = '120px';
                img.style.objectFit = 'contain';
                
                // Trouver le nom dans la langue sélectionnée
                let pictogramName = result._id;
                if (result.keywords && result.keywords.length > 0) {
                    const keyword = result.keywords.find(k => k.language === currentLanguage);
                    if (keyword && keyword.keyword) {
                        pictogramName = keyword.keyword;
                    }
                }
                
                const name = document.createElement('div');
                name.textContent = pictogramName;
                name.style.marginTop = '8px';
                name.style.fontSize = '12px';
                name.style.wordBreak = 'break-word';
                
                pictogramCard.appendChild(img);
                pictogramCard.appendChild(name);
                
                // Événement de clic pour insérer le pictogramme
                pictogramCard.addEventListener('click', function() {
                    insertPictogram(result._id, pictogramName, img.src);
                    dlg.close();
                });
                
                resultsContainer.appendChild(pictogramCard);
            });
            
            // Pagination
            if (results.length > resultsPerPage) {
                const totalPages = Math.ceil(results.length / resultsPerPage);
                
                const pageInfo = document.createElement('span');
                pageInfo.textContent = `Page ${page} sur ${totalPages} (${results.length} résultats)`;
                pageInfo.style.marginRight = '15px';
                paginationContainer.appendChild(pageInfo);
                
                if (page > 1) {
                    const prevButton = document.createElement('button');
                    prevButton.textContent = '← Précédent';
                    prevButton.style.marginRight = '10px';
                    prevButton.style.padding = '5px 10px';
                    prevButton.style.cursor = 'pointer';
                    prevButton.addEventListener('click', function() {
                        currentPage = page - 1;
                        displayResults(results, currentPage);
                    });
                    paginationContainer.appendChild(prevButton);
                }
                
                if (page < totalPages) {
                    const nextButton = document.createElement('button');
                    nextButton.textContent = 'Suivant →';
                    nextButton.style.padding = '5px 10px';
                    nextButton.style.cursor = 'pointer';
                    nextButton.addEventListener('click', function() {
                        currentPage = page + 1;
                        displayResults(results, currentPage);
                    });
                    paginationContainer.appendChild(nextButton);
                }
            }
        }
        
        /**
         * Fonction pour insérer le pictogramme dans le diagramme
         */
        function insertPictogram(pictogramId, name, imageUrl) {
            const model = graph.getModel();
            const parent = graph.getDefaultParent();
            
            model.beginUpdate();
            try {
                // Créer une forme d'image avec le pictogramme
                const imageWidth = 120;
                const imageHeight = 120;
                
                // Position centrale ou au dernier point cliqué
                const view = graph.view;
                const x = (graph.container.scrollLeft + graph.container.clientWidth / 2) / view.scale - imageWidth / 2;
                const y = (graph.container.scrollTop + graph.container.clientHeight / 2) / view.scale - imageHeight / 2;
                
                // Créer le vertex avec l'image
                const vertex = graph.insertVertex(
                    parent, 
                    null, 
                    name, 
                    x, 
                    y, 
                    imageWidth, 
                    imageHeight,
                    'shape=image;image=' + imageUrl + ';verticalAlign=bottom;verticalLabelPosition=top;'
                );
                
                // Sélectionner le vertex nouvellement créé
                graph.setSelectionCell(vertex);
            } finally {
                model.endUpdate();
            }
            
            ui.showAlert('Pictogramme ajouté', 'Le pictogramme "' + name + '" a été ajouté au diagramme');
        }
        
        /**
         * Gérer la recherche
         */
        async function performSearch() {
            const query = searchInput.value.trim();
            
            if (query.length === 0) {
                ui.showError('Erreur', 'Veuillez entrer un mot-clé', 'OK');
                return;
            }
            
            // Afficher un indicateur de chargement
            resultsContainer.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; padding: 20px;">Recherche en cours...</div>';
            
            const results = await searchArasaac(query, currentLanguage);
            searchResults = results;
            currentPage = 1;
            displayResults(searchResults, currentPage);
        }
        
        // Événements
        searchButton.addEventListener('click', performSearch);
        
        searchInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                performSearch();
            }
        });
        
        // Créer et afficher la boîte de dialogue
        const dlg = new CustomDialog(ui, container, null, null, 'Fermer');
        ui.showDialog(dlg.container, 650, 750, true, false);
    }
    
    /**
     * Ajouter l'action au menu
     */
    ui.actions.addAction('arasaacSearch', function() {
        createSearchDialog();
    });
    
    /**
     * Ajouter au menu Extras
     */
    var menu = ui.menus.get('extras');
    if (menu) {
        menu.addSeparator();
        menu.addItem('Rechercher ARASAAC', null, function() {
            ui.actions.get('arasaacSearch').funct();
        });
    }
    
    /**
     * Ajouter au menu contextuel (clic droit)
     */
    const origMenuCreatePopupMenu = ui.menus.createPopupMenu;
    ui.menus.createPopupMenu = function(menu, cell, evt) {
        origMenuCreatePopupMenu.apply(this, arguments);
        
        // Ajouter un séparateur et l'option de recherche ARASAAC
        menu.addSeparator();
        this.addMenuItems(menu, ['arasaacSearch'], null, evt);
    };
});
