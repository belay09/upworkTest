import { formatUrl } from '../utils/url.js';

export class Tab {
  constructor(id, onClose) {
    this.id = id;
    this.onClose = onClose;
    this.isMaximized = false;
    this.isMinimized = false;
  }

  createTabElement() {
    const tabButton = document.createElement('li');
    tabButton.className = 'nav-item';
    tabButton.innerHTML = `
      <div class="nav-link active d-flex align-items-center" data-bs-toggle="tab" data-bs-target="#${this.id}">
        <div class="tab-header">
          <span class="tab-title">New Tab</span>
          <div class="tab-controls">
            <button class="btn btn-sm btn-light minimize-button">
              <i class="fas fa-window-minimize"></i>
            </button>
            <button class="btn btn-sm btn-light maximize-button">
              <i class="fas fa-window-maximize"></i>
            </button>
            <button class="btn btn-sm btn-light close-button">
              <i class="fas fa-times"></i>
            </button>
          </div>
        </div>
      </div>
    `;
    
    this.setupTabControls(tabButton);
    return tabButton;
  }

  createContentElement() {
    const tabContent = document.createElement('div');
    tabContent.className = 'tab-pane fade show active';
    tabContent.id = this.id;
    tabContent.innerHTML = `
      <div class="p-2">
        <div class="input-group mb-3">
          <input type="text" class="form-control url-input" placeholder="Search Google or enter URL">
          <button class="btn btn-primary go-button">Go</button>
        </div>
        <div class="iframe-wrapper">
          <iframe class="tab-iframe" src="about:blank" sandbox="allow-same-origin allow-scripts allow-popups allow-forms"></iframe>
        </div>
      </div>
    `;
    
    this.setupContentControls(tabContent);
    return tabContent;
  }

  setupTabControls(tabButton) {
    const minimizeButton = tabButton.querySelector('.minimize-button');
    const maximizeButton = tabButton.querySelector('.maximize-button');
    const closeButton = tabButton.querySelector('.close-button');

    minimizeButton.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleMinimize();
    });

    maximizeButton.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleMaximize();
    });

    closeButton.addEventListener('click', (e) => {
      e.stopPropagation();
      this.onClose();
    });
  }

  setupContentControls(tabContent) {
    const urlInput = tabContent.querySelector('.url-input');
    const goButton = tabContent.querySelector('.go-button');
    const iframe = tabContent.querySelector('.tab-iframe');

    goButton.addEventListener('click', () => {
      const url = formatUrl(urlInput.value.trim());
      iframe.src = url;
    });

    urlInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        goButton.click();
      }
    });

    iframe.addEventListener('load', () => {
      try {
        const title = iframe.contentDocument.title;
        this.updateTitle(title || urlInput.value || 'New Tab');
      } catch (e) {
        this.updateTitle(urlInput.value || 'New Tab');
      }
    });
  }

  updateTitle(title) {
    const tabElement = document.querySelector(`[data-bs-target="#${this.id}"]`);
    if (tabElement) {
      tabElement.querySelector('.tab-title').textContent = title;
    }
  }

  toggleMinimize() {
    const content = document.getElementById(this.id);
    this.isMinimized = !this.isMinimized;
    content.classList.toggle('minimize-tab');
  }

  toggleMaximize() {
    const content = document.getElementById(this.id);
    this.isMaximized = !this.isMaximized;
    content.classList.toggle('maximize-tab');
  }
}