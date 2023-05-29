document.addEventListener('DOMContentLoaded', function() {
  var sitesBloqueadosList = document.getElementById('sites-bloqueados-list');

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

  function removeBlockedSite(site) {
    chrome.runtime.sendMessage({ action: 'removeBlockedSite', site: site }, function(response) {
      var sitesBloqueados = response.sitesBloqueados || [];
      updateBlockedSitesList(sitesBloqueados); // Atualiza a lista após a remoção
    });
  }
});
