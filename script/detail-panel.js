// Script pour afficher les détails des POIs dans le panneau latéral au lieu des popups
let currentPoiData = null;

document.addEventListener('DOMContentLoaded', function() {
    // Référence au panneau latéral et à la liste des POIs
    const sidePanel = document.getElementById('side-panel');
    const poiListContainer = document.getElementById('poi-list');
    
    // Fonction pour afficher les détails d'un POI dans le panneau latéral
    window.showPoiDetails = function(properties) {
        // Sauvegarder les données du POI actuellement affiché
        currentPoiData = properties;
        // Masquer les couches des bassins si elles sont visibles
        if (window.bassinVaucouleursLayer && map.hasLayer(window.bassinVaucouleursLayer)) {
            map.removeLayer(window.bassinVaucouleursLayer);
        }
        if (window.bassinVesgreLayer && map.hasLayer(window.bassinVesgreLayer)) {
            map.removeLayer(window.bassinVesgreLayer);
        }
        
        // Vider le contenu actuel (y compris le message d'information)
        poiListContainer.innerHTML = '';
        
        // Créer le contenu détaillé
        let detailContent = `<div class="poi-detail">`;
        
        // Titre
        const currentLanguage = localStorage.getItem('language') || 'fr';
        const displayName = (currentLanguage === 'en' && properties.nom_en) ? properties.nom_en : properties.nom;
        detailContent += `<h2 class="poi-detail-title">${displayName}</h2>`;
        detailContent += `<span class="poi-category">${properties.sous_cat}</span>`;
        
        // Image (au-dessus du texte)
        if (properties.photo) {
            detailContent += `
                <div class="poi-detail-image">
                    <img src="${properties.photo}" alt="${properties.nom}" class="detail-thumbnail" 
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
        }
        
        // Description (en dessous de l'image)
        detailContent += `<div class="poi-detail-text">`;
        let description = '';
        
        console.log('Langue actuelle:', currentLanguage);
        console.log('trad_des disponible:', properties.trad_des);
        console.log('descriptif disponible:', properties.descriptif);
        
        if (currentLanguage === 'en' && properties.trad_des) {
            description = properties.trad_des;
            console.log('Utilisation de trad_des');
        } else if (properties.descriptif) {
            description = properties.descriptif;
            console.log('Utilisation de descriptif');
        }
        
        if (description) {
            detailContent += `<p>${description}</p>`;
        } else {
            detailContent += `<p>Aucune description disponible.</p>`;
        }
        detailContent += `</div>`;
        
        // Informations supplémentaires
        detailContent += `<div class="poi-detail-info">`;
        
        if (properties.commune) {
            detailContent += `<p><i class="fas fa-map-marker-alt"></i> ${properties.commune}`;
            if (properties.adresse) {
                detailContent += ` - ${properties.adresse}`;
            }
            detailContent += `</p>`;
        }
        
        if (properties.tel) {
            detailContent += `<p><i class="fas fa-phone"></i> ${properties.tel}</p>`;
        }
        
        if (properties.mail) {
            detailContent += `<p><i class="fas fa-envelope"></i> ${properties.mail}</p>`;
        }
        
        if (properties.site_web) {
            detailContent += `<p><a href="${properties.site_web}" target="_blank" class="detail-link"><i class="fas fa-external-link-alt"></i> Plus d'informations</a></p>`;
        }
        
        if (properties.accessibilité) {
            detailContent += `<p><i class="fas fa-wheelchair"></i> Accessible : ${properties.accessibilité}</p>`;
        }
        
        if (properties.Latitude && properties.Longitude) {
            detailContent += `<p><a href="https://www.google.com/maps/dir//${properties.Latitude},${properties.Longitude}" target="_blank" class="detail-link"><i class="fas fa-directions"></i> Itinéraire</a></p>`;
        }
        
        detailContent += `</div>`; // Fin des informations
        
        detailContent += `</div>`; // Fin du détail
        
        // Ajouter le contenu au panneau
        poiListContainer.innerHTML = detailContent;
        

        
        // Ajouter des gestionnaires pour les images (pour la lightbox)
        const detailImage = poiListContainer.querySelector('.detail-thumbnail');
        if (detailImage) {
            detailImage.addEventListener('click', function() {
                // Utiliser la fonction existante pour ouvrir la lightbox
                window.openLightbox(this);
            });
        }
    };
    
    // Créer un alias pour la compatibilité
    window.showPoiInSidePanel = window.showPoiDetails;
    
    // Écouter les changements de langue
    window.addEventListener('languageChanged', function(e) {
        console.log('Événement languageChanged reçu:', e.detail);
        console.log('currentPoiData:', currentPoiData);
        // Si un POI est actuellement affiché, le rafraîchir
        if (currentPoiData) {
            console.log('Rafraîchissement du POI');
            window.showPoiDetails(currentPoiData);
        }
    });
});