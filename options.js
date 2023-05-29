document.addEventListener('DOMContentLoaded', function() {
    var sitesBloqueadosList = document.getElementById('sites-bloqueados-list');
    var bloquearButton = document.getElementById('bloquear');
  
    // Adiciona o evento de clique ao botão "Bloquear"
    bloquearButton.addEventListener('click', function() {
      var sitesBloqueadosInput = document.getElementById('sites-bloqueados');
      var sitesBloqueados = sitesBloqueadosInput.value.split(',').map(site => site.trim());
  
      addBlockedSites(sitesBloqueados);
      sitesBloqueadosInput.value = ''; // Limpa o campo de entrada
  
      // Atualiza a lista de sites bloqueados
      updateBlockedSitesList(sitesBloqueados);
    });
  
    // Obtém os sites bloqueados e atualiza a lista quando a página é carregada
    chrome.runtime.sendMessage({ action: 'getBlockedSites' }, function(response) {
      var sitesBloqueados = response.sitesBloqueados || [];
      updateBlockedSitesList(sitesBloqueados);
    });
  
    function updateBlockedSitesList(sitesBloqueados) {
      sitesBloqueadosList.innerHTML = '';
  
      sitesBloqueados.forEach(function(site) {
        var listItem = document.createElement('li');
        listItem.textContent = site;
  
        var deleteButton = document.createElement('button');
        deleteButton.textContent = 'X';
        deleteButton.addEventListener('click', function() {
          removeBlockedSite(site);
        });
  
        listItem.appendChild(deleteButton);
        sitesBloqueadosList.appendChild(listItem);
      });
    }
  
    function addBlockedSites(sitesBloqueados) {
        chrome.storage.local.get(['sitesBloqueados'], function(result) {
          var existingSites = result.sitesBloqueados || [];
          var updatedSites = existingSites.concat(sitesBloqueados);
      
          chrome.storage.local.set({ sitesBloqueados: updatedSites }, function() {
            // Atualiza a lista de sites bloqueados após adicionar os novos sites
            updateBlockedSitesList(updatedSites);
          });
        });
      }
      
  
    function removeBlockedSite(site) {
      chrome.runtime.sendMessage({ action: 'removeBlockedSite', site: site }, function(response) {
        var sitesBloqueados = response.sitesBloqueados || [];
        updateBlockedSitesList(sitesBloqueados);
      });
    }
  });
  