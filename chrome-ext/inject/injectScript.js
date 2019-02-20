/**
 * Injects a script tag into the current document
 *
 * @param {string} content - Code to be executed in the current document
 */
function injectScript (content) {
  try {
    const container = document.head || document.documentElement
    const scriptTag = document.createElement('script')
    scriptTag.setAttribute('async', false)
    scriptTag.textContent = content
    container.insertBefore(scriptTag, container.children[0])
    container.removeChild(scriptTag)
  } catch (e) {
    console.error('script injection failed', e)
  }
}

if (true) {
  injectScript(`
    console.log('chrome', chrome);
    console.log('chrome', chrome.runtime.sendMessage);

    const _instaweb_id = "kmdamjjnlpjgbnaeaboghopmcchjpaep"
    
    window.in = {
      request: (data) => new Promise((resolve, reject) => {
        chrome.runtime.sendMessage(_instaweb_id, data, null, (...args) => {
          resolve(...args)
        });

        setTimeout(() => reject('timeout'), 5000);
      })
    }
  `)

  // setupStreams()
  // listenForProviderRequest()
  // checkPrivacyMode()
}
