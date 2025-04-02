if (!window.pesticideInitialized) {
  window.pesticideInitialized = true;

  // Store original positions to restore them later
  const originalPositions = new WeakMap();

  // --- Utility: Get Color Based on Tag ---
  function getColorForTag(tag) {
    const colors = {
      div: "orange",
      section: "blue",
      h1: "red",
      h2: "red",
      h3: "red",
      p: "green",
      header: "purple",
      footer: "purple",
      // Add more mappings as needed
    };
    return colors[tag] || "gray";
  }

  // --- Add Outlines and Tag Labels ---
  function addTagLabels() {
    const elements = document.querySelectorAll("*");
    elements.forEach((el) => {
      // Skip our tooltip and any already added labels
      if (el.id === "hoverTooltip" || el.classList.contains("pesticide-label"))
        return;
      const tag = el.tagName.toLowerCase();
      const color = getColorForTag(tag);
      // Set outline with color
      el.style.outline = `1px solid ${color}`;
      // Add a small label if not already present
      if (!el.querySelector(".pesticide-label")) {
        const label = document.createElement("div");
        label.textContent = tag;
        label.className = "pesticide-label";

        // Assign different positions based on tag type
        let position = "top-left"; // Default position

        // Assign different positions to different tags
        if (tag.startsWith("h") && tag.length === 2 && !isNaN(tag[1])) {
          // This handles h1, h2, h3, etc.
          position = "center";
        } else {
          switch (tag) {
            case "div":
              position = "top-right";
              break;
            case "p":
              position = "bottom-left";
              break;
            case "section":
              position = "bottom-right";
              break;
            case "header":
            case "footer":
              position = "center-top";
              break;
            // Add more cases as needed
          }
        }

        // Apply position-specific CSS
        let positionCSS = "";
        switch (position) {
          case "top-left":
            positionCSS = "top: 0; left: 0;";
            break;
          case "top-right":
            positionCSS = "top: 0; right: 0;";
            break;
          case "bottom-left":
            positionCSS = "bottom: 0; left: 0;";
            break;
          case "bottom-right":
            positionCSS = "bottom: 0; right: 0;";
            break;
          case "center-top":
            positionCSS = "top: 0; left: 50%; transform: translateX(-50%);";
            break;
          case "center":
            positionCSS =
              "top: 50%; left: 50%; transform: translate(-50%, -50%);";
            break;
        }

        label.style.cssText = `
            position: absolute;
            ${positionCSS}
            background: ${color};
            color: white;
            font-size: 10px;
            padding: 2px 4px;
            z-index: 10000;
            pointer-events: none;
          `;

        // Store original position before changing it
        if (getComputedStyle(el).position === "static") {
          originalPositions.set(el, el.style.position || "static");
          el.style.position = "relative";
        }
        el.appendChild(label);
      }
    });
  }

  // Remove the outlines and labels
  function removeTagLabels() {
    // Remove all pesticide labels first
    const labels = document.querySelectorAll(".pesticide-label");
    labels.forEach((label) => label.remove());

    // Then clear outlines from all elements
    const elements = document.querySelectorAll("*");
    elements.forEach((el) => {
      // Clear outline unconditionally
      el.style.outline = "";

      // Restore original position if we stored one
      if (originalPositions.has(el)) {
        el.style.position = originalPositions.get(el);
      }
    });
  }

  // --- Tooltip Functionality ---
  let tooltip;
  let currentElement = null;
  let tooltipVisible = false;

  function createTooltip() {
    tooltip = document.createElement("div");
    tooltip.id = "hoverTooltip";
    document.body.appendChild(tooltip);
    tooltip.style.cssText = `
        position: absolute;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 5px 10px;
        border-radius: 5px;
        font-size: 12px;
        font-family: monospace;
        user-select: none;
        z-index: 9999;
        opacity: 0;
        transition: opacity 0.1s ease-in-out;
        pointer-events: none;
        max-width: 500px;
        white-space: pre-wrap;
      `;
  }

  function showTooltip(event) {
    if (!event.shiftKey || !currentElement) return;
    // Use getAttribute("class") to preserve spaces
    const classes = currentElement.getAttribute("class") || "";
    const tag = currentElement.tagName.toLowerCase();
    tooltip.textContent = `${tag} ${classes}`;
    tooltip.style.opacity = "1";
    tooltip.style.left = `${event.pageX + 10}px`;
    tooltip.style.top = `${event.pageY + 10}px`;
    tooltipVisible = true;
  }

  function copyTooltip(event) {
    if (event.shiftKey && event.key.toLowerCase() === "c" && currentElement) {
      const classes = currentElement.getAttribute("class") || "";
      if (classes.trim()) {
        navigator.clipboard.writeText(classes.trim()).then(() => {
          tooltip.textContent = "Copied!";
          setTimeout(() => {
            if (tooltipVisible) showTooltip(event);
          }, 800);
        });
      }
    }
  }

  function hideTooltip(event) {
    if (event.key === "Shift") {
      tooltip.style.opacity = "0";
      tooltipVisible = false;
    }
  }

  function removeTooltip() {
    if (tooltip) {
      tooltip.remove();
      tooltipVisible = false;
    }
  }

  // Update current element on hover
  document.addEventListener("mouseover", (event) => {
    currentElement = event.target;
  });
  document.addEventListener("mousemove", showTooltip);
  document.addEventListener("keydown", copyTooltip);
  document.addEventListener("keyup", hideTooltip);

  // Create the tooltip on page load
  createTooltip();

  // --- Expose Global Toggle Functions ---
  window.pesticideEnable = function () {
    addTagLabels();
  };

  window.pesticideDisable = function () {
    removeTagLabels();
    removeTooltip();
    // Clear references
    currentElement = null;
  };

  // Listen for messages to disable the feature (from background.js)
  chrome.runtime.onMessage.addListener((request) => {
    if (request.action === "disableFeature") {
      window.pesticideDisable && window.pesticideDisable();
    }
  });
}
