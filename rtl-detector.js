// List of RTL language codes
const RTL_LANGUAGES = ['ar', 'he', 'fa', 'ur', 'yi', 'ps', 'sd', 'ug', 'ku'];

// Function to check if a language is RTL
function isRTLLanguage(lang) {
  if (!lang) return false;
  const langCode = lang.toLowerCase().split('-')[0];
  return RTL_LANGUAGES.includes(langCode);
}

// Function to apply or remove RTL mode
function applyRTLMode(isRTL) {
  const html = document.documentElement;
  const currentBootstrapLink = document.querySelector('link[href*="bootstrap"]');
  
  if (isRTL) {
    html.setAttribute('dir', 'rtl');
    html.setAttribute('lang', 'ar'); // or detected language
    
    // Switch to RTL Bootstrap if not already using it
    if (currentBootstrapLink && !currentBootstrapLink.href.includes('rtl')) {
      currentBootstrapLink.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.rtl.min.css';
      currentBootstrapLink.integrity = 'sha384-dpuaG1suU0eT09tx5plTaGMLBsfDLzUCCUXOY2j/LSvXYuG6Bqs43ALlhIqAJVRb';
    }
  } else {
    html.setAttribute('dir', 'ltr');
    
    // Switch to LTR Bootstrap if using RTL
    if (currentBootstrapLink && currentBootstrapLink.href.includes('rtl')) {
      currentBootstrapLink.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css';
      currentBootstrapLink.integrity = 'sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH';
    }
  }
}

// Function to detect Google Translate changes
function detectLanguageChange() {
  // Check for Google Translate's lang attribute on html element
  const htmlLang = document.documentElement.lang;
  
  // Check for Google Translate's class or data attributes
  const isTranslated = document.documentElement.classList.contains('translated-ltr') ||
                       document.documentElement.classList.contains('translated-rtl') ||
                       document.body.classList.contains('translated-ltr') ||
                       document.body.classList.contains('translated-rtl');
  
  // Get the current language from html lang attribute or Google Translate
  let currentLang = htmlLang;
  
  // Check if Google Translate has set a language
  const gtLang = document.documentElement.getAttribute('lang');
  if (gtLang && gtLang !== 'en') {
    currentLang = gtLang;
  }
  
  // Apply RTL mode if language is RTL
  const shouldBeRTL = isRTLLanguage(currentLang);
  applyRTLMode(shouldBeRTL);
}

// Create a MutationObserver to watch for changes
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    // Check if the lang attribute or class changed
    if (mutation.type === 'attributes' && 
        (mutation.attributeName === 'lang' || 
         mutation.attributeName === 'class')) {
      detectLanguageChange();
    }
  });
});

// Start observing
observer.observe(document.documentElement, {
  attributes: true,
  attributeFilter: ['lang', 'class']
});

// Also observe body for Google Translate changes
observer.observe(document.body, {
  attributes: true,
  attributeFilter: ['class']
});

// Initial check on page load
window.addEventListener('DOMContentLoaded', () => {
  detectLanguageChange();
  
  // Double-check after a short delay (Google Translate might load after DOMContentLoaded)
  setTimeout(detectLanguageChange, 500);
  setTimeout(detectLanguageChange, 1000);
});

// Check periodically for Google Translate widget initialization
let checkCount = 0;
const intervalId = setInterval(() => {
  detectLanguageChange();
  checkCount++;
  
  // Stop checking after 10 seconds
  if (checkCount > 20) {
    clearInterval(intervalId);
  }
}, 500);
