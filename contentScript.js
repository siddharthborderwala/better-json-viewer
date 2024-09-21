function injectScript(file) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = chrome.runtime.getURL(file);
    script.onload = () => {
      script.remove();
      resolve();
    };
    script.onerror = reject;
    (document.head || document.documentElement).appendChild(script);
  });
}

function injectStyles(file) {
  const link = document.createElement('link');
  link.href = chrome.runtime.getURL(file);
  link.type = 'text/css';
  link.rel = 'stylesheet';
  (document.head || document.documentElement).appendChild(link);
}

function isJsonResponse() {
  const contentType = document.contentType || '';
  return contentType.includes('json') || 
         (document.body.childNodes.length === 1 && 
          document.body.firstChild.nodeName === 'PRE');
}

async function init() {
  if (isJsonResponse()) {
    injectStyles('styles.css');
    await injectScript('injected.js');

    // Set initial theme
    const currentTheme = localStorage.getItem('jsonViewerTheme') || window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    document.body.classList.add(currentTheme);

    window.addEventListener('message', (event) => {
      if (event.data.type && event.data.type === 'FROM_PAGE') {
        const jsonData = event.data.jsonData;
        
        const container = document.createElement('div');
        container.id = 'json-tree-viewer';
        document.body.innerHTML = '';
        document.body.appendChild(container);

        renderJsonTree(jsonData, container);
        addCollapsibleFunctionality();

        // Add theme toggle button after rendering JSON tree
        addThemeToggleButton();
      }
    }, false);
  }
}

function renderJsonTree(data, container, isRoot = true) {
  if (Array.isArray(data)) {
    renderArray(data, container, isRoot);
  } else if (typeof data === 'object' && data !== null) {
    renderObject(data, container, isRoot);
  } else {
    renderPrimitive(data, container);
  }
}

function renderArray(arr, container, isRoot) {
  const wrapper = document.createElement('span');
  wrapper.className = 'json-array';
  
  const collapsible = document.createElement('span');
  collapsible.className = 'collapsible';
  collapsible.textContent = '[';
  wrapper.appendChild(collapsible);

  const content = document.createElement('span');
  content.className = 'array-content collapsible-content';
  
  arr.forEach((value, index) => {
    const itemContainer = document.createElement('span');
    itemContainer.className = 'array-item';
    renderJsonTree(value, itemContainer, false);
    if (index < arr.length - 1) {
      itemContainer.appendChild(document.createTextNode(','));
    }
    content.appendChild(itemContainer);
  });

  wrapper.appendChild(content);
  wrapper.appendChild(document.createTextNode(']'));
  container.appendChild(wrapper);
}

function renderObject(obj, container, isRoot) {
  const wrapper = document.createElement('span');
  wrapper.className = 'json-object';
  
  const collapsible = document.createElement('span');
  collapsible.className = 'collapsible';
  collapsible.textContent = '{';
  wrapper.appendChild(collapsible);

  const content = document.createElement('span');
  content.className = 'object-content collapsible-content';
  
  Object.entries(obj).forEach(([key, value], index) => {
    const property = document.createElement('span');
    property.className = 'object-property';

    const keySpan = document.createElement('span');
    keySpan.className = 'json-key';
    keySpan.textContent = `"${key}": `;
    property.appendChild(keySpan);

    renderJsonTree(value, property, false);
    
    if (index < Object.entries(obj).length - 1) {
      property.appendChild(document.createTextNode(','));
    }
    
    content.appendChild(property);
  });

  wrapper.appendChild(content);
  wrapper.appendChild(document.createTextNode('}'));
  container.appendChild(wrapper);
}

function renderPrimitive(value, container) {
  const valueSpan = document.createElement('span');
  const valueType = value === null ? 'null' : typeof value;
  valueSpan.className = `json-${valueType}`;
  valueSpan.textContent = JSON.stringify(value);
  container.appendChild(valueSpan);
}

function addCollapsibleFunctionality() {
  const collapsibles = document.querySelectorAll('.collapsible');
  for (const collapsible of collapsibles) {
    const content = collapsible.nextElementSibling;
    const closingBracket = content.nextSibling;
    const isArray = collapsible.textContent === '[';

    collapsible.addEventListener('click', function() {
      this.classList.toggle('expanded');
      content.classList.toggle('hidden');

      if (this.classList.contains('expanded')) {
        const ellipsis = document.createElement('span');
        ellipsis.className = 'ellipsis';
        ellipsis.textContent = '...';
        this.appendChild(ellipsis);
      } else {
        const existingEllipsis = this.querySelector('.ellipsis');
        if (existingEllipsis) {
          existingEllipsis.remove();
        }
      }
    });

    // Create a wrapper for the closing bracket
    const closingBracketWrapper = document.createElement('span');
    closingBracketWrapper.className = 'closing-bracket';
    closingBracketWrapper.textContent = isArray ? ']' : '}';
    closingBracket.replaceWith(closingBracketWrapper);
  }
}

function toggleTheme() {
  const body = document.body;
  body.classList.toggle('dark');
  body.classList.toggle('light');
  const newTheme = body.classList.contains('dark') ? 'dark' : 'light';
  localStorage.setItem('jsonViewerTheme', newTheme);
}

function addThemeToggleButton() {
  const themeToggle = document.createElement('button');
  themeToggle.id = 'theme-toggle';
  themeToggle.textContent = 'Toggle Theme';
  document.body.appendChild(themeToggle);

  // Add event listener for theme toggle
  themeToggle.addEventListener('click', toggleTheme);
}

init();
