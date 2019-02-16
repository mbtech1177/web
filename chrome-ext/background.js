console.log('chrome', chrome)

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
            console.log('changing header value:', header.value, new_header.value)
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
          "*://*/*",
          // "*://*.instagram.com/"
            // "http://stackoverflow.com/*",
            // "http://127.0.0.1:6789/*"
        ],
        // In the main window and frames
        types: ["main_frame", "sub_frame", "xmlhttprequest"]
    },
    ["blocking", "requestHeaders", "extraHeaders"]
);
