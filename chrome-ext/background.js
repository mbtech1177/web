chrome.webRequest.onBeforeSendHeaders.addListener(
    function(info) {
      // xhr.js:126 Refused to set unsafe header "User-Agent"
      // xhr.js:126 Refused to set unsafe header "Connection"
      // xhr.js:126 Refused to set unsafe header "Accept-Encoding"
      // xhr.js:126 Refused to set unsafe header "Cookie2"


        let headers = info.requestHeaders

        console.log('headers', headers)

        const new_headers = headers
          .filter(header => header.name.includes('X-Instaweb'))
          .map(header => {
            return {
              name: header.name.replace('X-Instaweb-', ''),
              value: header.value,
            }
          })

        console.log('new headers', new_headers)

        headers.forEach(header => {
          const new_header = new_headers.find(_ => _.name == header.name)

          if (new_header) {
            console.log(`changing header '${header.name}' to '${new_header.name}':`, header.value, new_header.value)
            header.value = new_header.value
          }
        })

        console.log('edited headers', headers)

        return {
          requestHeaders: headers
        };

    },
    // Request filter
    {
        // Modify the headers for these pages
        urls: [
          "https://caffeinum.github.io/*",
          "https://instagrambot.github.io/*",
          "*://localhost/*",
          "file://*/*",
          "chrome-extension://*/*",
          // TODO: remove wildcard
          "*://*/*"
        ],
        // In the main window and frames
        types: ["main_frame", "sub_frame", "xmlhttprequest"]
    },
    ["blocking", "requestHeaders", "extraHeaders"]
);

let user = {}

document.addEventListener('DOMContentLoaded', async () => {
  const { username, password } = await getCredentials()

  window.instagram = new Instagram(username, password)

  user = await window.instagram.login()

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('message', message)
    console.log('sender', sender)

    const { method, params } = message

    if (method === 'get_user_info') {
      chrome.tabs.sendMessage(sender.tab.id, { user })
    } else {
      instagram.callMethod(method, ...params)
        .then(res => chrome.tabs.sendMessage(sender.tab.id, res))
    }

  })

}, false);

// chrome.tabs.getSelected(null, function(tab) {
//    console.log(tab.url);
//    const analyzeUrl = `https://morejust.media/read?url=${tab.url}`;
//    window.open(analyzeUrl);
//  });
//

function sendIntoActiveTab(data) {
  if (!activeTab || !data) return

  console.log('sending message to', activeTab.id, data)
  chrome.tabs.sendMessage(activeTab.id, data)
}

let activeTab = null

function updateActive(tab) {
    activeTab = tab
}
function onActivated(info) {
    chrome.tabs.get(info.tabId, updateActive)
}
function onUpdated(info, tab) {
    if (tab.active)
        updateActive(tab)
}
chrome.tabs.query({active: true, lastFocusedWindow: true}, function(tabs) {
    updateActive(tabs[0])
})

chrome.tabs.onActivated.addListener(onActivated)
chrome.tabs.onUpdated.addListener(onUpdated)
