// Variable globale pour tracker le marqueur sélectionné
let currentSelectedMarker = null;

// Fonction optimisée pour créer les marqueurs
function createOptimizedMarkers() {
    // Créer un cache pour les icônes
    const iconCache = {};
    
    // Fonction pour obtenir une icône du cache ou en créer une nouvelle
    function getIcon(category) {
        const iconName = normalizeString(category);
        
        // Cas spéciaux pour certaines icônes SVG
        let iconUrl = `image/${iconName}.png`;
        if (iconName === 'apiculteur') {
            iconUrl = `image/apiculteur_V3.svg`;
        } else if (iconName === 'forets_et_parcs') {
            iconUrl = `image/arbre_V01.svg`;
        }
        
        if (!iconCache[iconName]) {
            iconCache[iconName] = L.icon({
                iconUrl: iconUrl,
                iconSize: [25, 25],
                iconAnchor: [12, 12],
                popupAnchor: [15, 0]
            });
        }
        return iconCache[iconName];
    }
    
    // Créer les marqueurs par lots
    const markersToAdd = [];
    
    // Parcourir tous les POIs
    poi.features.forEach(feature => {
        // Création de l'icône personnalisée depuis le cache
        const icon = getIcon(feature.properties.sous_cat);
        
        // Création du marqueur
        const marker = L.marker(
            [feature.geometry.coordinates[1], feature.geometry.coordinates[0]], 
            { icon: icon }
        );
        
        // Stockage des données pour la popup sans la créer immédiatement
        marker.poiData = feature.properties;
        

        
        // Gestion spéciale pour les bassins
        if (feature.properties.nom === "Orchidées sauvages - Bassin de la Vaucouleurs") {
            setupBassinHandler(marker, bassinVaucouleursLayer);
        } else if (feature.properties.nom === "Orchidées sauvages - Bassin de la Vesgre") {
            setupBassinHandler(marker, bassinVesgreLayer);
        } else {
            // Ajouter un gestionnaire d'événements pour créer la popup à la demande
            marker.on('click', function(e) {
                // Restaurer l'icône du marqueur précédemment sélectionné
                if (currentSelectedMarker && currentSelectedMarker !== this) {
                    const prevIconName = normalizeString(currentSelectedMarker.poiData.sous_cat);
                    let prevIconUrl = `image/${prevIconName}.png`;
                    if (prevIconName === 'apiculteur') {
                        prevIconUrl = `image/apiculteur_V3.svg`;
                    } else if (prevIconName === 'forets_et_parcs') {
                        prevIconUrl = `image/arbre_V01.svg`;
                    }
                    currentSelectedMarker.setIcon(L.icon({
                        iconUrl: prevIconUrl,
                        iconSize: [25, 25],
                        iconAnchor: [12, 12],
                        popupAnchor: [15, 0]
                    }));
                }
                
                // Supprimer l'effet des autres marqueurs
                document.querySelectorAll('.marker-active').forEach(el => {
                    el.classList.remove('marker-active');
                });
                
                // Effet sur l'icône
                const iconElement = this.getElement();
                if (iconElement) {
                    iconElement.classList.add('marker-active');
                    
                    // Changer l'icône en version violet pour tous les POI
                    const iconName = normalizeString(this.poiData.sous_cat);
                    this.setIcon(L.icon({
                        iconUrl: `image/${iconName}_violet.svg`,
                        iconSize: [25, 25],
                        iconAnchor: [12, 12],
                        popupAnchor: [15, 0]
                    }));
                }
                
                // Mettre à jour le marqueur sélectionné
                currentSelectedMarker = this;
                
                // Afficher dans le volet droit
                showPoiInSidePanel(this.poiData);
            });
        }
        
        // Stockage du marqueur avec ses catégories pour le filtrage
        const category = mapToFilterCategory(feature.properties.categorie);
        const subcategory = mapToFilterSubcategory(feature.properties.sous_cat);
        
        if (!allMarkers[category]) {
            allMarkers[category] = {};
        }
        
        if (!allMarkers[category][subcategory]) {
            allMarkers[category][subcategory] = [];
        }
        
        allMarkers[category][subcategory].push(marker);
        
        // Ajouter à la liste des marqueurs à ajouter
        markersToAdd.push(marker);
    });
    
    // Ajouter tous les marqueurs au cluster en une seule opération
    markers.addLayers(markersToAdd);
    
    // Ajouter le cluster à la carte
    map.addLayer(markers);
}

// Fonction pour afficher un POI dans le volet droit
let currentPoiData = null;

function showPoiInSidePanel(poiData) {
    // Sauvegarder les données du POI actuellement affiché
    currentPoiData = poiData;
    
    const sidePanel = document.getElementById('side-panel');
    const poiList = document.getElementById('poi-list');
    const panelHeader = sidePanel.querySelector('.side-panel-header h2');
    
    // Changer le titre
    const currentLanguage = localStorage.getItem('language') || 'fr';
    const displayName = (currentLanguage === 'en' && poiData.nom_en) ? poiData.nom_en : poiData.nom;
    panelHeader.textContent = currentLanguage === 'en' ? 'Point of Interest' : 'Point d\'Intérêt';
    
    // Créer le contenu du POI
    let content = `<div class="poi-detail">`;
    let logoHtml = '';
    if (poiData.patrimoine_encours) {
        logoHtml += `<a href="${poiData.patrimoine_encours}" target="_blank" title="Voir sur le site de la Fondation du Patrimoine"><img src="image/fond_black.png" alt="Fondation" style="float: left; height: 30px; margin-right: 10px;"></a>`;
    }
    if (poiData.fondation_courant) {
        logoHtml += `<a href="${poiData.fondation_courant}" target="_blank" title="Voir sur le site de la Fondation du Patrimoine"><img src="image/fondation.jpg" alt="Fondation" style="float: right; height: 30px; margin-left: 10px;"></a>`;
    }
    content += `<h3 style="text-align: center;">${logoHtml}${displayName}</h3>`;
    
    if (poiData.photo) {
        content += `<img src="${poiData.photo}" alt="${displayName}" class="poi-detail-image popup-thumbnail" 
                     data-full-img="${poiData.photo}"
                     data-photo2="${poiData.photo2 || ''}"
                     data-photo3="${poiData.photo3 || ''}"
                     data-photo4="${poiData.photo4 || ''}"
                     data-photo5="${poiData.photo5 || ''}"
                     data-photo6="${poiData.photo6 || ''}"
                     data-photo7="${poiData.photo7 || ''}"
                     data-photo8="${poiData.photo8 || ''}"
                     data-photo9="${poiData.photo9 || ''}"
                     data-photo10="${poiData.photo10 || ''}"
                     data-photo11="${poiData.photo11 || ''}"
                     data-photo12="${poiData.photo12 || ''}"
                     data-photo13="${poiData.photo13 || ''}">`;
    }
    
    // Gérer la description selon la langue
    let description = '';
    
    console.log('=== DEBUG LANGUE ===');
    console.log('currentLanguage:', currentLanguage);
    console.log('poiData.trad_des:', poiData.trad_des);
    console.log('poiData.descriptif:', poiData.descriptif);
    
    if (currentLanguage === 'en' && poiData.trad_des) {
        description = poiData.trad_des;
        console.log('Utilisation de trad_des (EN)');
    } else if (poiData.descriptif) {
        description = poiData.descriptif;
        console.log('Utilisation de descriptif (FR)');
    }
    
    console.log('Description finale:', description);
    console.log('===================')
    
    if (description) {
        content += `<p>${description}</p>`;
    }
    
    if (poiData.tel) {
        content += `<p><strong>Tél :</strong> ${poiData.tel}</p>`;
    }
    
    if (poiData.mail) {
        content += `<p><strong>Email :</strong> ${poiData.mail}</p>`;
    }
    
    if (poiData.site_web) {
        const moreInfoText = currentLanguage === 'en' ? 'More information' : 'Plus d\'informations';
        content += `<p><a href="${poiData.site_web}" target="_blank">${moreInfoText}</a></p>`;
    }
    
    if (poiData.Latitude && poiData.Longitude) {
        const itineraryText = currentLanguage === 'en' ? 'Itinerary' : 'Itinéraire';
        const clickHereText = currentLanguage === 'en' ? 'click here' : 'cliquez-ici';
        content += `<p><i>${itineraryText} : <a href="https://www.google.com/maps/dir//${poiData.Latitude},${poiData.Longitude}" target="_blank">${clickHereText}</a></i></p>`;
    }
    
    content += `</div>`;
    
    // Remplacer le contenu du volet
    poiList.innerHTML = content;
    
    // Ouvrir le volet
    sidePanel.classList.add('active');
}

// Fonction pour supprimer les zones d'orchidées
function removeOrchideeZones() {
    if (bassinVesgreLayer && map.hasLayer(bassinVesgreLayer)) {
        map.removeLayer(bassinVesgreLayer);
    }
    if (bassinVaucouleursLayer && map.hasLayer(bassinVaucouleursLayer)) {
        map.removeLayer(bassinVaucouleursLayer);
    }
}

// Fonction pour créer le contenu de la popup à la demande
function createPopupContent(properties) {
    let popupContent = `<h3>${properties.nom}</h3>`;
    
    // Conteneur pour la mise en page à deux colonnes
    popupContent += `<div class="popup-container">`;
    
    // Colonne de gauche pour le descriptif
    popupContent += `<div class="popup-text">`;
    if (properties.descriptif) {
        popupContent += `<p>${properties.descriptif}</p>`;
    }
    popupContent += `</div>`;
    
    // Colonne de droite pour l'image
    if (properties.photo) {
        popupContent += `
            <div class="popup-image">
                <img src="${properties.photo}" alt="${properties.nom}" class="popup-thumbnail" 
                     data-full-img="${properties.photo}" 
                     data-photo2="${properties.photo2 || ''}"
                     data-photo3="${properties.photo3 || ''}"
                     data-photo4="${properties.photo4 || ''}"
                     data-photo5="${properties.photo5 || ''}"
                     data-photo6="${properties.photo6 || ''}"
                     data-photo7="${properties.photo7 || ''}"
                     data-photo8="${properties.photo8 || ''}"
                     data-photo9="${properties.photo9 || ''}"
                     data-photo10="${properties.photo10 || ''}"
                     data-photo11="${properties.photo11 || ''}"
                     data-photo12="${properties.photo12 || ''}"
                     data-photo13="${properties.photo13 || ''}">
            </div>
        `;
    } else {
        // Si pas d'image, ajuster l'espace pour le texte
        popupContent = popupContent.replace('<div class="popup-text">', '<div class="popup-text" style="width:100%">');
    }
    
    popupContent += `</div>`; // Fin du conteneur à deux colonnes
    
    // Section pour les liens et informations supplémentaires
    popupContent += `<div class="popup-links">`;
    
    if (properties.tel) {
        popupContent += `<p><strong>Tél :</strong> ${properties.tel}</p>`;
    }
    
    if (properties.mail) {
        popupContent += `<p><strong>Email :</strong> ${properties.mail}</p>`;
    }
    
    if (properties.site_web) {
        popupContent += `<p><a href="${properties.site_web}" target="_blank">Plus d'informations</a></p>`;
    }
    
    if (properties.accessibilité) {
        popupContent += `<p><strong>Accessible :</strong> ${properties.accessibilité}</p>`;
    }
    
    if (properties.Latitude && properties.Longitude) {
        popupContent += `<p><a href="https://www.google.com/maps/dir//${properties.Latitude},${properties.Longitude}" target="_blank">Itinéraire</a></p>`;
    }
    
    popupContent += `</div>`; // Fin de la section des liens
    
    return popupContent;
}

// Fonction pour configurer les gestionnaires d'événements pour les bassins
function setupBassinHandler(marker, bassinLayer) {
    marker.on('click', function(e) {
        L.DomEvent.stopPropagation(e);
        
        // Fermer toutes les popups existantes
        map.closePopup();
        
        // Effet sur l'icône
        const iconElement = this.getElement();
        if (iconElement) {
            iconElement.classList.add('marker-active');
        }
        
        // Supprimer l'effet des autres marqueurs
        document.querySelectorAll('.marker-active').forEach(el => {
            if (el !== iconElement) el.classList.remove('marker-active');
        });
        
        // Afficher SEULEMENT dans le volet droit (pas de popup Leaflet)
        showPoiInSidePanel(this.poiData);
        
        if (bassinLayer) {
            // Supprimer d'abord toutes les zones d'orchidées existantes
            if (typeof removeOrchideeZones === 'function') {
                removeOrchideeZones();
            }
            
            // Retirer temporairement le marqueur du cluster
            markers.removeLayer(marker);
            // Ajouter le marqueur directement à la carte
            marker.addTo(map);
            // Ajouter la couche du bassin
            map.addLayer(bassinLayer);
            // Puis ajuster la vue avec un délai pour éviter les conflits
            setTimeout(function() {
                map.fitBounds(bassinLayer.getBounds(), {animate: false});
            }, 100);
        }
    });
    
    // Supprimer la zone quand le volet se ferme
    document.addEventListener('DOMContentLoaded', function() {
        const closeSidePanel = document.querySelector('.close-side-panel');
        if (closeSidePanel) {
            closeSidePanel.addEventListener('click', function() {
                if (bassinLayer && map.hasLayer(bassinLayer)) {
                    map.removeLayer(bassinLayer);
                    // Remettre le marqueur dans le cluster
                    if (map.hasLayer(marker)) {
                        map.removeLayer(marker);
                        markers.addLayer(marker);
                    }
                }
                // Supprimer l'effet de l'icône
                const iconElement = marker.getElement();
                if (iconElement) {
                    iconElement.classList.remove('marker-active');
                }
            });
        }
    });
}

// Écouter les changements de langue pour rafraîchir le POI affiché
window.addEventListener('languageChanged', function(e) {
    if (currentPoiData) {
        showPoiInSidePanel(currentPoiData);
    }
});