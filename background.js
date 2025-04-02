let enabled = false;

// Check initial state on startup
chrome.storage.sync.get(["enabled"], (result) => {
  enabled = result.enabled || false;
});

chrome.action.onClicked.addListener((tab) => {
  // Do not run on chrome:// or Web Store pages
  if (
    tab.url.startsWith("chrome://") ||
    tab.url.startsWith("https://chrome.google.com/webstore")
  ) {
    console.warn("Cannot run on this page.");
    return;
  }

  enabled = !enabled;
  chrome.storage.sync.set({ enabled });

  try {
    if (enabled) {
      // Inject the content script if needed
      chrome.scripting
        .executeScript({
          target: { tabId: tab.id },
          files: ["content.js"],
        })
        .then(() => {
          // Once injected, call our global function to enable the feature
          return chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: () => {
              if (window.pesticideEnable) {
                window.pesticideEnable();
                console.log("Pesticide enabled");
              }
            },
          });
        })
        .catch((err) => {
          console.error("Error executing script:", err);
        });
    } else {
      // Directly execute the disable function for more reliable operation
      chrome.scripting
        .executeScript({
          target: { tabId: tab.id },
          func: () => {
            if (window.pesticideDisable) {
              window.pesticideDisable();
              console.log("Pesticide disabled");
            }
          },
        })
        .catch((err) => {
          console.error("Error disabling pesticide:", err);
        });
    }
  } catch (error) {
    console.error("Error in action listener:", error);
  }
});

// When a tab is updated/refreshed, check if we need to re-enable
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && enabled) {
    if (
      tab.url &&
      !tab.url.startsWith("chrome://") &&
      !tab.url.startsWith("https://chrome.google.com/webstore")
    ) {
      try {
        chrome.scripting
          .executeScript({
            target: { tabId: tabId },
            files: ["content.js"],
          })
          .then(() => {
            return chrome.scripting.executeScript({
              target: { tabId: tabId },
              func: () => {
                if (window.pesticideEnable) {
                  window.pesticideEnable();
                }
              },
            });
          })
          .catch((err) => {
            console.log("Error in tab update:", err);
          });
      } catch (error) {
        console.error("Error in tab update:", error);
      }
    }
  }
});
