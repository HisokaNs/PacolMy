chrome.runtime.onInstalled.addListener(function() {
  // Lógica para bloquear os sites informados
  chrome.webRequest.onBeforeRequest.addListener(
    function(details) {
      // Recupera a lista de sites bloqueados do armazenamento local
      chrome.storage.local.get(['sitesBloqueados'], function(result) {
        var sitesBloqueados = result.sitesBloqueados || [];
        // Verifica se o URL da solicitação está na lista de sites bloqueados
        if (sitesBloqueados.some(site => details.url.includes(site))) {
          return { cancel: true }; // Cancela a solicitação para bloquear o site
        }
      });
    },
    { urls: ["<all_urls>"] }, // Bloqueia todos os URLs
    ["blocking"]
  );
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'getBlockedSites') {
    getBlockedSites(sendResponse);
  } else if (request.action === 'removeBlockedSite') {
    removeBlockedSite(request.site, sendResponse);
  }
  return true; // Para permitir o uso de sendResponse de forma assíncrona
});

function getBlockedSites(sendResponse) {
  chrome.storage.local.get(['sitesBloqueados'], function(result) {
    var sitesBloqueados = result.sitesBloqueados || [];
    sendResponse({ sitesBloqueados: sitesBloqueados });
  });
}

function removeBlockedSite(site, sendResponse) {
  chrome.storage.local.get(['sitesBloqueados'], function(result) {
    var sitesBloqueados = result.sitesBloqueados || [];
    var siteIndex = sitesBloqueados.indexOf(site);
    if (siteIndex !== -1) {
      sitesBloqueados.splice(siteIndex, 1);
      chrome.storage.local.set({ sitesBloqueados: sitesBloqueados }, function() {
        sendResponse({ sitesBloqueados: sitesBloqueados });
      });
    }
  });
}

// Obter a lista de sites bloqueados ao carregar a extensão
getBlockedSites(function(response) {
  var sitesBloqueados = response.sitesBloqueados || [];
  if (sitesBloqueados.length > 0) {
    chrome.runtime.sendMessage({ action: 'siteBloqueado', sitesBloqueados: sitesBloqueados });
  }
});

chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get(['sitesBloqueados'], function(result) {
        var sitesBloqueados = result.sitesBloqueados || [];
        // Verifica se o URL da solicitação está na lista de sites bloqueados
        if (sitesBloqueados.some(site => details.url.includes(site))) {
          resolve({ cancel: true }); // Cancela a solicitação para bloquear o site
        } else {
          resolve({ cancel: false }); // Permite a solicitação
        }
      });
    });
  },
  { urls: ["<all_urls>"] }, // Bloqueia todos os URLs
  ["blocking"]
);
