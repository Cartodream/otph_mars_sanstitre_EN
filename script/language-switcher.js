// Système de gestion des langues
const translations = {
    fr: {
        // Header
        pageTitle: "Le Patrimoine du Pays Houdanais en ligne",
        
        // Filtres
        filters: "Filtres",
        selectAll: "Tout sélectionner",
        deselectAll: "Tout désélectionner",
        
        // Catégories
        architecturalHeritage: "Patrimoine Architectural",
        naturalHeritage: "Patrimoine Naturel",
        memorialHeritage: "Patrimoine Mémoriel",
        gastronomicHeritage: "Patrimoine Gastronomique",
        industrialHeritage: "Patrimoine Industriel",
        otherPoints: "Autres Points",
        
        // Sous-catégories Architectural
        castlesManors: "Châteaux, Manoirs...",
        churchesChapels: "Eglises, Chapelles...",
        traditionalBuildings: "Maisons, Moulins, Lavoirs...",
        
        // Sous-catégories Naturel
        pondsRivers: "Etangs et Rivières",
        vines: "Vignes",
        barnOwl: "Effraie",
        littleOwl: "Chevêche",
        flora: "Flore",
        raptor: "Rapace",
        heron: "Héron",
        forestsParks: "Forêts et Parcs",
        bat: "Chauve Souris",
        cervids: "Cervidés",
        swallow: "Hirondelle",
        
        // Sous-catégories Mémoriel
        famousPeople: "Personnages célèbres",
        museums: "Musées",
        memoryPlaces: "Lieux de Mémoire",
        historicalPlaces: "Lieux Historiques",
        
        // Sous-catégories Gastronomique
        craftspeople: "Artisan de Bouche",
        localCuisine: "Cuisine Locale",
        farmProducer: "Ferme Producteur",
        fishFarm: "Pisciculture",
        jamMaker: "Artisan Confiturier",
        
        // Sous-catégories Industriel
        factories: "Usines",
        aqueduct: "Aqueduc",
        
        // Autres
        curiosity: "Curiosité",
        
        // Panneaux latéraux
        poiList: "Liste des points d'intérêt",
        foundationTitle: "Fondation du Patrimoine",
        foundationText: "La Fondation du Patrimoine aide à financer les restaurations du patrimoine français (publics/privés). Notre carte repère ses actions locales pour le Patrimoine public. Son logo sur certains points d'intérêt distingue projets en cours ou achevés ; un lien donne le détail des actions conduites.",
        
        // Boutons
        explorer: "Explorer",
        list: "Liste",
        
        // POI Panel
        pointOfInterest: "Point d'Intérêt",
        moreInformation: "Plus d'informations",
        itinerary: "Itinéraire",
        clickHere: "cliquez-ici",
        
        // Langue
        language: "Langue"
    },
    en: {
        // Header
        pageTitle: "Houdan Region Online Heritage",
        
        // Filtres
        filters: "Filters",
        selectAll: "Select All",
        deselectAll: "Deselect All",
        
        // Catégories
        architecturalHeritage: "Architectural Heritage",
        naturalHeritage: "Natural Heritage",
        memorialHeritage: "Memorial Heritage",
        gastronomicHeritage: "Gastronomic Heritage",
        industrialHeritage: "Industrial Heritage",
        otherPoints: "Other Points of Interest",
        
        // Sous-catégories Architectural
        castlesManors: "Monumental Built Heritage",
        churchesChapels: "Religious Heritage",
        traditionalBuildings: "Traditional Buildings",
        
        // Sous-catégories Naturel
        pondsRivers: "Ponds and Rivers",
        vines: "Vineyards",
        barnOwl: "Barn Owls",
        littleOwl: "Little Owls",
        flora: "Flora",
        raptor: "Birds of Prey",
        heron: "Herons",
        forestsParks: "Forests and Parks",
        bat: "Bats",
        cervids: "Deer",
        swallow: "Swallows",
        
        // Sous-catégories Mémoriel
        famousPeople: "Famous People",
        museums: "Museums",
        memoryPlaces: "Places of Remembrance",
        historicalPlaces: "Historic Sites",
        
        // Sous-catégories Gastronomique
        craftspeople: "Artisanal Food Producers",
        localCuisine: "Local Cuisine",
        farmProducer: "Farm Producers",
        fishFarm: "Fish Farming",
        jamMaker: "Artisanal Jam Makers",
        
        // Sous-catégories Industriel
        factories: "Factories",
        aqueduct: "Aqueducts",
        
        // Autres
        curiosity: "Curiosities",
        
        // Panneaux latéraux
        poiList: "List of Points of Interest",
        foundationTitle: "Heritage Foundation",
        foundationText: "The Heritage Foundation helps finance the restoration of French heritage sites (public/private). Our map highlights its local actions for public heritage. Its logo on certain points of interest distinguishes between ongoing and completed projects; a link provides details of the actions carried out",
        
        // Boutons
        explorer: "Explorer",
        list: "List",
        
        // POI Panel
        pointOfInterest: "Point of Interest",
        moreInformation: "More information",
        itinerary: "Itinerary",
        clickHere: "click here",
        
        // Langue
        language: "Language"
    }
};

// Classe pour gérer la langue
class LanguageSwitcher {
    constructor() {
        // Détecter la langue via le referrer (ex: fr.tourisme-pays-houdanais.fr)
        const referrer = document.referrer;
        if (referrer && referrer.includes('fr.')) {
            this.currentLanguage = 'fr';
        } else {
            this.currentLanguage = 'en';
        }
        localStorage.setItem('language', this.currentLanguage);
        this.init();
    }
    
    init() {
        this.createLanguageSwitcher();
        this.applyLanguage(this.currentLanguage);
    }
    
    createLanguageSwitcher() {
        // Bouton toujours masqué
        return;
        
        // Créer le conteneur du sélecteur de langue
        const languageSwitcher = document.createElement('div');
        languageSwitcher.className = 'language-switcher';
        languageSwitcher.innerHTML = `
            <select id="language-select" class="language-select">
                <option value="fr">Français</option>
                <option value="en">English</option>
            </select>
        `;
        
        // Ajouter après les contrôles de zoom
        const mapControls = document.querySelector('.map-controls');
        if (mapControls) {
            mapControls.parentNode.insertBefore(languageSwitcher, mapControls.nextSibling);
        }
        
        // Ajouter l'écouteur d'événement
        const select = document.getElementById('language-select');
        select.value = this.currentLanguage;
        select.addEventListener('change', (e) => {
            this.setLanguage(e.target.value);
        });
    }
    
    setLanguage(lang) {
        this.currentLanguage = lang;
        localStorage.setItem('language', lang);
        this.applyLanguage(lang);
        
        console.log('Déclenchement de languageChanged avec:', lang);
        // Déclencher un événement personnalisé pour que d'autres scripts puissent réagir
        window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: lang } }));
    }
    
    applyLanguage(lang) {
        const t = translations[lang];
        
        // Mettre à jour le titre de la page
        const pageTitle = document.querySelector('h1');
        if (pageTitle) {
            pageTitle.textContent = t.pageTitle;
        }
        
        // Mettre à jour les titres des filtres
        document.querySelectorAll('.filters-header h2, .side-panel-header h2').forEach(el => {
            if (el.textContent.includes('Filtre') || el.textContent.includes('Filter')) {
                el.textContent = t.filters;
            }
            if (el.textContent.includes('Liste') || el.textContent.includes('List')) {
                el.textContent = t.poiList;
            }
            if (el.textContent.includes('Fondation') || el.textContent.includes('Foundation')) {
                el.textContent = t.foundationTitle;
            }
        });
        
        // Mettre à jour les boutons de filtres
        document.querySelectorAll('.filter-buttons button').forEach(btn => {
            if (btn.textContent.includes('Tout sélectionner') || btn.textContent.includes('Select All')) {
                btn.textContent = t.selectAll;
            }
            if (btn.textContent.includes('Tout désélectionner') || btn.textContent.includes('Deselect All')) {
                btn.textContent = t.deselectAll;
            }
        });
        
        // Mettre à jour les titres des groupes de filtres
        this.updateFilterGroupTitles(lang, t);
        
        // Mettre à jour les labels des filtres
        this.updateFilterLabels(lang, t);
        
        // Mettre à jour le texte de la fondation
        const foundationContent = document.querySelector('.fondation-content p');
        if (foundationContent) {
            foundationContent.textContent = t.foundationText;
        }
        
        // Mettre à jour les titres des boutons
        document.getElementById('toggle-explorer-btn').title = t.filters;
        document.getElementById('toggle-list-btn').title = t.list;
        document.getElementById('toggle-fondation-btn').title = t.foundationTitle;
        
        // Mettre à jour le bouton toggle filters
        const toggleFiltersBtn = document.querySelector('.toggle-filters-btn');
        if (toggleFiltersBtn) {
            toggleFiltersBtn.textContent = '';
            const icon = document.createElement('i');
            icon.className = 'fas fa-compass';
            toggleFiltersBtn.appendChild(icon);
            toggleFiltersBtn.appendChild(document.createTextNode(' ' + t.explorer));
        }
    }
    
    updateFilterGroupTitles(lang, t) {
        const categoryMap = {
            'Patrimoine Architectural': t.architecturalHeritage,
            'Patrimoine Naturel': t.naturalHeritage,
            'Patrimoine Mémoriel': t.memorialHeritage,
            'Patrimoine Gastronomique': t.gastronomicHeritage,
            'Patrimoine Industriel': t.industrialHeritage,
            'Autres Points': t.otherPoints,
            'Architectural Heritage': t.architecturalHeritage,
            'Natural Heritage': t.naturalHeritage,
            'Memorial Heritage': t.memorialHeritage,
            'Gastronomic Heritage': t.gastronomicHeritage,
            'Industrial Heritage': t.industrialHeritage,
            'Other Points': t.otherPoints
        };
        
        document.querySelectorAll('.filter-title').forEach(title => {
            const currentText = title.textContent.trim();
            if (categoryMap[currentText]) {
                title.textContent = categoryMap[currentText];
            }
        });
    }
    
    updateFilterLabels(lang, t) {
        const subcategoryMap = {
            // Architectural
            'Châteaux, Manoirs...': t.castlesManors,
            'Monumental Built Heritage': t.castlesManors,
            'Eglises, Chapelles...': t.churchesChapels,
            'Religious Heritage': t.churchesChapels,
            'Maisons, Moulins, Lavoirs...': t.traditionalBuildings,
            'Traditional Buildings': t.traditionalBuildings,
            
            // Naturel
            'Etangs et Rivières': t.pondsRivers,
            'Ponds and Rivers': t.pondsRivers,
            'Vignes': t.vines,
            'Vineyards': t.vines,
            'Effraie': t.barnOwl,
            'Barn Owls': t.barnOwl,
            'Chevêche': t.littleOwl,
            'Little Owls': t.littleOwl,
            'Flore': t.flora,
            'Flora': t.flora,
            'Rapace': t.raptor,
            'Birds of Prey': t.raptor,
            'Héron': t.heron,
            'Herons': t.heron,
            'Forêts et Parcs': t.forestsParks,
            'Forests and Parks': t.forestsParks,
            'Chauve Souris': t.bat,
            'Bats': t.bat,
            'Cervidés': t.cervids,
            'Deer': t.cervids,
            'Hirondelle': t.swallow,
            'Swallows': t.swallow,
            
            // Mémoriel
            'Personnages célèbres': t.famousPeople,
            'Famous People': t.famousPeople,
            'Musées': t.museums,
            'Museums': t.museums,
            'Lieux de Mémoire': t.memoryPlaces,
            'Places of Remembrance': t.memoryPlaces,
            'Lieux Historiques': t.historicalPlaces,
            'Historic Sites': t.historicalPlaces,
            
            // Gastronomique
            'Artisan de Bouche': t.craftspeople,
            'Artisanal Food Producers': t.craftspeople,
            'Cuisine Locale': t.localCuisine,
            'Local Cuisine': t.localCuisine,
            'Ferme Producteur': t.farmProducer,
            'Farm Producers': t.farmProducer,
            'Pisciculture': t.fishFarm,
            'Fish Farming': t.fishFarm,
            'Artisan Confiturier': t.jamMaker,
            'Artisanal Jam Makers': t.jamMaker,
            
            // Industriel
            'Usines': t.factories,
            'Factories': t.factories,
            'Aqueduc': t.aqueduct,
            'Aqueducts': t.aqueduct,
            
            // Autres
            'Curiosité': t.curiosity,
            'Curiosities': t.curiosity
        };
        
        document.querySelectorAll('.filter-options label span').forEach(span => {
            const currentText = span.textContent.trim();
            if (subcategoryMap[currentText]) {
                span.textContent = ' ' + subcategoryMap[currentText];
            }
        });
    }
    
    translate(key) {
        return translations[this.currentLanguage][key] || key;
    }
}

// Initialiser le sélecteur de langue au chargement du DOM
document.addEventListener('DOMContentLoaded', function() {
    window.languageSwitcher = new LanguageSwitcher();
});
