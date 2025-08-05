// Configuración de la API
const API_KEY = '4ebc73be19904f0d8e9fdef552ff0948'; // Reemplaza con tu API key de NewsAPI
const BASE_URL = 'https://newsapi.org/v2';

// Mapeo de categorías para la API
const categoryMapping = {
    'todas': 'general',
    'tecnologia': 'technology',
    'deportes': 'sports',
    'politica': 'politics',
    'economia': 'business'
};

// Iconos por categoría
const categoryIcons = {
    'technology': '🤖',
    'sports': '⚽',
    'politics': '🏛️',
    'business': '📈',
    'general': '📰',
    'health': '🏥',
    'science': '🔬',
    'entertainment': '🎬'
};

let displayedNews = [];
let filteredNews = [];
let currentFilter = 'todas';
let newsPerPage = 6;
let currentPage = 1;
let isLoading = false;

// Función para obtener noticias de la API
async function fetchNewsFromAPI(category = 'general', country = 'us') {
    const apiCategory = categoryMapping[category] || category;
    const url = `${BASE_URL}/top-headlines?country=${country}&category=${apiCategory}&pageSize=20&apiKey=${API_KEY}`;
    
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        const data = await response.json();
        
        if (data.status === 'ok') {
            return data.articles.map((article, index) => ({
                id: Date.now() + index,
                title: article.title || 'Sin título',
                summary: article.description || 'Sin descripción disponible',
                category: article.category || apiCategory,
                author: article.author || article.source.name || 'Fuente no especificada',
                date: article.publishedAt || new Date().toISOString(),
                icon: categoryIcons[apiCategory] || '📰',
                url: article.url,
                image: article.urlToImage
            }));
        } else {
            throw new Error(data.message || 'Error en la API');
        }
    } catch (error) {
        console.error('Error fetching news:', error);
        return getFallbackNews(); // Datos de respaldo
    }
}

// Función para obtener noticias por búsqueda
async function searchNewsFromAPI(query) {
    const url = `${BASE_URL}/everything?q=${encodeURIComponent(query)}&language=es&sortBy=publishedAt&pageSize=20&apiKey=${API_KEY}`;
    
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        const data = await response.json();
        
        if (data.status === 'ok') {
            return data.articles.map((article, index) => ({
                id: Date.now() + index,
                title: article.title || 'Sin título',
                summary: article.description || 'Sin descripción disponible',
                category: 'busqueda',
                author: article.author || article.source.name || 'Fuente no especificada',
                date: article.publishedAt || new Date().toISOString(),
                icon: '🔍',
                url: article.url,
                image: article.urlToImage
            }));
        } else {
            throw new Error(data.message || 'Error en la búsqueda');
        }
    } catch (error) {
        console.error('Error searching news:', error);
        return [];
    }
}

// Datos de respaldo en caso de error con la API
function getFallbackNews() {
    return [
        {
            id: 1,
            title: "Revolución en Inteligencia Artificial transforma múltiples industrias",
            summary: "Los avances más recientes en IA están redefiniendo sectores como la salud, educación y transporte, ofreciendo soluciones innovadoras que mejoran la calidad de vida.",
            category: "tecnologia",
            author: "Ana García",
            date: "2025-08-05",
            icon: "🤖"
        },
        {
            id: 2,
            title: "México logra clasificación histórica a la final internacional",
            summary: "Un partido lleno de emociones y jugadas espectaculares lleva a la selección nacional a escribir una nueva página en la historia del deporte mexicano.",
            category: "deportes",
            author: "Carlos Ruiz",
            date: "2025-08-04",
            icon: "⚽"
        },
        {
            id: 3,
            title: "Nueva reforma educativa revoluciona el sistema nacional",
            summary: "El gobierno presenta cambios estructurales significativos que prometen modernizar la educación y adaptarla a los desafíos del siglo XXI.",
            category: "politica",
            author: "María López",
            date: "2025-08-03",
            icon: "🏛️"
        },
        {
            id: 4,
            title: "Indicadores económicos superan todas las proyecciones",
            summary: "Los números del trimestre revelan un crecimiento sostenido que posiciona al país en una trayectoria económica muy prometedora para el resto del año.",
            category: "economia",
            author: "Roberto Silva",
            date: "2025-08-02",
            icon: "📈"
        }
    ];
}

// Función para formatear fecha
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
}

// Función para obtener color de categoría
function getCategoryColor(category) {
    const colors = {
        'technology': 'linear-gradient(135deg, #3498db, #2980b9)',
        'sports': 'linear-gradient(135deg, #e74c3c, #c0392b)',
        'politics': 'linear-gradient(135deg, #9b59b6, #8e44ad)',
        'business': 'linear-gradient(135deg, #27ae60, #229954)',
        'tecnologia': 'linear-gradient(135deg, #3498db, #2980b9)',
        'deportes': 'linear-gradient(135deg, #e74c3c, #c0392b)',
        'politica': 'linear-gradient(135deg, #9b59b6, #8e44ad)',
        'economia': 'linear-gradient(135deg, #27ae60, #229954)'
    };
    return colors[category] || 'linear-gradient(135deg, #95a5a6, #7f8c8d)';
}

// Función para obtener nombre de categoría en español
function getCategoryName(category) {
    const names = {
        'technology': 'Tecnología',
        'sports': 'Deportes', 
        'politics': 'Política',
        'business': 'Economía',
        'general': 'General',
        'health': 'Salud',
        'science': 'Ciencia',
        'entertainment': 'Entretenimiento',
        'busqueda': 'Búsqueda',
        'tecnologia': 'Tecnología',
        'deportes': 'Deportes',
        'politica': 'Política',
        'economia': 'Economía'
    };
    return names[category] || category.charAt(0).toUpperCase() + category.slice(1);
}

// Función para crear una tarjeta de noticia
function createNewsCard(news) {
    const imageContent = news.image ? 
        `<img src="${news.image}" alt="${news.title}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
         <div style="display: none; width: 100%; height: 100%; background: linear-gradient(135deg, #3498db, #2c3e50); align-items: center; justify-content: center; color: white; font-size: 3.5rem;">${news.icon}</div>` :
        `<div style="width: 100%; height: 100%; background: linear-gradient(135deg, #3498db, #2c3e50); display: flex; align-items: center; justify-content: center; color: white; font-size: 3.5rem;">${news.icon}</div>`;
        
    return `
        <div class="news-card" onclick="openNews(${news.id})">
            <div class="news-image">
                ${imageContent}
            </div>
            <div class="news-content">
                <span class="news-category" style="background: ${getCategoryColor(news.category)}">
                    ${getCategoryName(news.category)}
                </span>
                <h2 class="news-title">${news.title}</h2>
                <p class="news-summary">${news.summary}</p>
                <div class="news-meta">
                    <span class="news-date">${formatDate(news.date)}</span>
                    <span class="news-author">Por ${news.author}</span>
                </div>
            </div>
        </div>
    `;
}

// Función para mostrar loading
function showLoading() {
    document.getElementById('loading').style.display = 'block';
}

// Función para ocultar loading
function hideLoading() {
    document.getElementById('loading').style.display = 'none';
}

// Función para renderizar noticias
function renderNews(newsArray) {
    const newsGrid = document.getElementById('newsGrid');
    const newsHTML = newsArray.map(news => createNewsCard(news)).join('');
    newsGrid.innerHTML = newsHTML;
}

// Función para cargar noticias iniciales
async function loadInitialNews() {
    if (isLoading) return;
    isLoading = true;
    showLoading();
    
    try {
        const newsFromAPI = await fetchNewsFromAPI(currentFilter);
        filteredNews = newsFromAPI;
        displayedNews = filteredNews.slice(0, newsPerPage);
        renderNews(displayedNews);
        currentPage = 1;
    } catch (error) {
        console.error('Error loading news:', error);
        // Mostrar mensaje de error amigable
        document.getElementById('newsGrid').innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 4rem; color: #666; background: white; border-radius: 12px; box-shadow: 0 8px 24px rgba(0,0,0,0.08);">
                <div style="font-size: 4rem; margin-bottom: 1rem;">⚠️</div>
                <h3 style="color: #e74c3c; margin-bottom: 1rem; font-weight: 300;">Error al cargar noticias</h3>
                <p>Por favor, verifica tu conexión a internet o intenta más tarde.</p>
                <button onclick="loadInitialNews()" style="margin-top: 1rem; padding: 0.8rem 2rem; background: #3498db; color: white; border: none; border-radius: 25px; cursor: pointer;">Reintentar</button>
            </div>
        `;
    } finally {
        isLoading = false;
        hideLoading();
    }
}

// Función para cargar más noticias
async function loadMoreNews() {
    if (isLoading) return;
    isLoading = true;
    showLoading();
    
    try {
        const startIndex = currentPage * newsPerPage;
        const endIndex = startIndex + newsPerPage;
        const moreNews = filteredNews.slice(startIndex, endIndex);
        
        if (moreNews.length > 0) {
            displayedNews = displayedNews.concat(moreNews);
            renderNews(displayedNews);
            currentPage++;
        } else {
            // Si no hay más noticias locales, intentar cargar más de la API
            const additionalNews = await fetchNewsFromAPI(currentFilter);
            if (additionalNews.length > filteredNews.length) {
                filteredNews = additionalNews;
                const newNews = filteredNews.slice(displayedNews.length, displayedNews.length + newsPerPage);
                if (newNews.length > 0) {
                    displayedNews = displayedNews.concat(newNews);
                    renderNews(displayedNews);
                } else {
                    showNoMoreNews();
                }
            } else {
                showNoMoreNews();
            }
        }
    } catch (error) {
        console.error('Error loading more news:', error);
        alert('Error al cargar más noticias. Intenta más tarde.');
    } finally {
        isLoading = false;
        hideLoading();
    }
}

// Función para mostrar mensaje de no más noticias
function showNoMoreNews() {
    const loadMoreBtn = document.querySelector('.load-more-btn');
    loadMoreBtn.textContent = 'No hay más noticias disponibles';
    loadMoreBtn.disabled = true;
    loadMoreBtn.style.opacity = '0.6';
    setTimeout(() => {
        if (loadMoreBtn) {
            loadMoreBtn.textContent = 'Ver más noticias';
            loadMoreBtn.disabled = false;
            loadMoreBtn.style.opacity = '1';
        }
    }, 3000);
}

// Función para filtrar noticias por categoría
async function filterNews(category) {
    if (isLoading) return;
    currentFilter = category;
    currentPage = 1;
    await loadInitialNews();
    
    // Actualizar pills activas
    const pills = document.querySelectorAll('.pill');
    const navLinks = document.querySelectorAll('nav a');
    
    pills.forEach(pill => pill.classList.remove('active'));
    navLinks.forEach(link => link.classList.remove('active'));
    
    event.target.classList.add('active');
}

// Función para buscar noticias
async function searchNews() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();
    
    if (searchTerm.length === 0) {
        await loadInitialNews();
        return;
    }

    if (searchTerm.length < 2) {
        alert('Por favor ingresa al menos 2 caracteres para buscar');
        return;
    }

    if (isLoading) return;
    isLoading = true;
    showLoading();
    
    try {
        // Buscar en la API
        const searchResults = await searchNewsFromAPI(searchTerm);
        
        displayedNews = searchResults;
        renderNews(displayedNews);
        
        if (searchResults.length === 0) {
            document.getElementById('newsGrid').innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 4rem; color: #666; background: white; border-radius: 12px; box-shadow: 0 8px 24px rgba(0,0,0,0.08);">
                    <div style="font-size: 4rem; margin-bottom: 1rem;">🔍</div>
                    <h3 style="color: #2c3e50; margin-bottom: 1rem; font-weight: 300;">No encontramos resultados para "${searchTerm}"</h3>
                    <p>Intenta con otros términos de búsqueda o explora nuestras categorías</p>
                    <button onclick="document.getElementById('searchInput').value=''; loadInitialNews();" style="margin-top: 1rem; padding: 0.8rem 2rem; background: #3498db; color: white; border: none; border-radius: 25px; cursor: pointer;">Ver todas las noticias</button>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error searching news:', error);
        document.getElementById('newsGrid').innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 4rem; color: #666; background: white; border-radius: 12px; box-shadow: 0 8px 24px rgba(0,0,0,0.08);">
                <div style="font-size: 4rem; margin-bottom: 1rem;">⚠️</div>
                <h3 style="color: #e74c3c; margin-bottom: 1rem; font-weight: 300;">Error en la búsqueda</h3>
                <p>No se pudo realizar la búsqueda. Intenta más tarde.</p>
            </div>
        `;
    } finally {
        isLoading = false;
        hideLoading();
    }
}

// Función para abrir noticia completa
function openNews(newsId) {
    const news = displayedNews.find(n => n.id === newsId) || filteredNews.find(n => n.id === newsId);
    if (news) {
        // Crear modal estilo Starbucks
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
            background: rgba(0,0,0,0.8); z-index: 10000; display: flex; 
            align-items: center; justify-content: center; padding: 2rem;
        `;
        
        const imageContent = news.image ? 
            `<img src="${news.image}" alt="${news.title}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px; margin-bottom: 1rem;" onerror="this.style.display='none';">` :
            `<div style="text-align: center; margin-bottom: 2rem;">
                <div style="font-size: 4rem; margin-bottom: 1rem;">${news.icon}</div>
            </div>`;
        
        modal.innerHTML = `
            <div style="background: white; max-width: 700px; width: 100%; border-radius: 12px; padding: 2rem; position: relative; max-height: 90vh; overflow-y: auto;">
                <button onclick="this.parentElement.parentElement.remove()" style="position: absolute; top: 1rem; right: 1rem; background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #666; z-index: 1;">×</button>
                ${imageContent}
                <div style="text-align: center; margin-bottom: 2rem;">
                    <span style="background: ${getCategoryColor(news.category)}; color: white; padding: 0.5rem 1rem; border-radius: 20px; font-size: 0.8rem; text-transform: uppercase; font-weight: 600;">${getCategoryName(news.category)}</span>
                </div>
                <h2 style="color: #2c3e50; margin-bottom: 1rem; font-size: 1.5rem; font-weight: 400; line-height: 1.4;">${news.title}</h2>
                <p style="color: #666; line-height: 1.6; margin-bottom: 2rem;">${news.summary}</p>
                <div style="display: flex; justify-content: space-between; color: #999; font-size: 0.9rem; border-top: 1px solid #f0f0f0; padding-top: 1rem; margin-bottom: 1rem;">
                    <span>Por ${news.author}</span>
                    <span>${formatDate(news.date)}</span>
                </div>
                ${news.url ? `
                    <div style="text-align: center; margin-top: 2rem;">
                        <a href="${news.url}" target="_blank" rel="noopener noreferrer" style="background: linear-gradient(135deg, #3498db, #2980b9); color: white; padding: 1rem 2rem; border-radius: 25px; text-decoration: none; font-weight: 500; display: inline-block; transition: all 0.3s ease;">
                            📖 Leer artículo completo
                        </a>
                    </div>
                ` : `
                    <p style="color: #999; font-size: 0.9rem; text-align: center; margin-top: 1rem; font-style: italic;">Artículo de ejemplo - En implementación real mostraría el contenido completo.</p>
                `}
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Cerrar con click fuera del modal
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });

        // Cerrar con tecla Escape
        const closeOnEscape = (e) => {
            if (e.key === 'Escape') {
                modal.remove();
                document.removeEventListener('keydown', closeOnEscape);
            }
        };
        document.addEventListener('keydown', closeOnEscape);
    }
}

// Función para mostrar notificación de estado de API
function showAPIStatus() {
    const apiStatus = API_KEY === 'TU_API_KEY_AQUI' ? 'demo' : 'connected';
    
    if (apiStatus === 'demo') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed; top: 20px; right: 20px; background: #f39c12; color: white; 
            padding: 1rem 1.5rem; border-radius: 8px; z-index: 1000; 
            box-shadow: 0 4px 12px rgba(0,0,0,0.15); animation: slideIn 0.3s ease;
        `;
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.5rem;">
                <span>⚠️</span>
                <span style="font-size: 0.9rem;">Modo demo - Configura tu API key para noticias reales</span>
                <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; color: white; cursor: pointer; margin-left: 0.5rem;">×</button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Auto-remover después de 5 segundos
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }
}

// Función para manejar Enter en búsqueda
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('searchInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchNews();
        }
    });
    
    // Mostrar estado de la API al cargar
    showAPIStatus();
});

// Cargar noticias al iniciar la página
window.onload = function() {
    loadInitialNews();
};