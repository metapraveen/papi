(function() {
  window.addEventListener('load', init);

  function init() {
    let record = true;
    // reload the page to store apis with response and headers
    addEvt('button.record-button', 'click', function() {
      record = true;
      resetList();
      curObjs = { flag: 1 };
      chrome.devtools.inspectedWindow.reload({});
    });

    // reload the page and compare apis with stored response and headers
    addEvt('button.compare-button', 'click', function() {
      record = false;
      resetList();
      curObjs = { flag: 1 };
      chrome.devtools.inspectedWindow.reload({});
    });

    if (window.chrome && chrome.devtools) {
      chrome.devtools.network.onNavigated.addListener(resetList);
      chrome.devtools.network.onRequestFinished.addListener(function(request) {
        // push each request to storage using url as key
        let url = request.request.url;
        if (request.response.content.mimeType === 'application/json') {
          request.getContent(function(currentContent) {
            // if recording, save api's detail in local storage
            if (record) {
              chrome.storage.local.set({ [url]: currentContent }, function() {
                console.log('response saved for the url ', url);
              });
              updateUI(request.request.url, record);
            } else {
              // else compare
              chrome.storage.local.get(url, function(result) {
                const prevContent = result[url];
                const diff = DeepDiff(JSON.parse(prevContent), JSON.parse(currentContent));
                if (diff) {
                  console.log('API ', url, 'response has changed');
                  updateUI(request.request.url, record, diff);
                } else {
                  console.log('api ', url, ' response is consistant');
                  updateUI(request.request.url, record);
                }
              });
            }
          });
        }
      });
    }
  }

  function addEvt(sel, evt, func) {
    document.querySelector(sel).addEventListener(evt, func);
  }

  function resetList() {
    document.querySelector('.preprocessed-urls').innerHTML = '';
  }

  /**
   *
   * @param {string} url
   * @param {boolean} record - record mode or compare mode
   * @param {Object} difference - json diff of the api response
   */
  function updateUI(url, record, difference) {
    const rowContainer = document.querySelector('.preprocessed-urls');
    let message = '';
    if (record) {
      message = 'The response has been recorded for';
    } else if (difference) {
      message = 'The response has changed for';
    } else {
      message = 'The response is consistant for';
    }
    rowContainer.appendChild(createRow(url, message, difference));
  }

  function createRow(url, message, diff) {
    const li = document.createElement('li');
    const className = diff ? 'diff' : 'no-diff';

    li.innerHTML = `<div class="${className}" >${message} <a  href="${url}" target="_blank">  ${url} </a></div>`;

    // if api diff is present, append it along so we can show it later
    if (diff) {
      li.innerHTML =
        li.innerHTML +
        `<div class="response-diff"><div>The difference between previous and current response </div><code> ${JSON.stringify(
          diff
        )}</code><div>`;
    }

    return li;
  }
})();
