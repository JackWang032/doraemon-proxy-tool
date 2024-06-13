chrome.storage.local.get('config', function ({ config }) {
    if (!config?.devopsInjectEnabled) return;

    console.log('Doraemon Proxy Tool Works! ' + new Date().toLocaleString());

    // 无法访问window, 需要通过script注入
    var hackElement = document.createElement('script');
    hackElement.src = chrome.runtime.getURL('devops.js');

    document.documentElement.appendChild(hackElement);
});
