import { Tab } from './components/Tab.js';

class BrowserTab {
  constructor() {
    this.tabsContainer = document.getElementById('browserTabs');
    this.contentContainer = document.getElementById('browserTabContent');
    this.newTabButton = document.getElementById('newTab');
    this.tabs = [];
    
    if (this.tabsContainer && this.contentContainer && this.newTabButton) {
      this.init();
    } else {
      console.error('Required DOM elements not found');
    }
  }

  init() {
    this.newTabButton.addEventListener('click', () => this.createTab());
    this.createTab(); // Create initial tab
  }

  createTab() {
    // Remove active class from existing tabs
    this.tabsContainer.querySelectorAll('.nav-link').forEach(t => t.classList.remove('active'));
    this.contentContainer.querySelectorAll('.tab-pane').forEach(c => {
      c.classList.remove('active', 'show');
    });

    const tabId = `tab-${Date.now()}`;
    const tab = new Tab(tabId, () => this.closeTab(tabId));
    
    const tabButton = tab.createTabElement();
    const tabContent = tab.createContentElement();

    // Add new tab before the "new tab" button
    const newTabItem = this.tabsContainer.querySelector('.nav-item:last-child');
    this.tabsContainer.insertBefore(tabButton, newTabItem);
    this.contentContainer.appendChild(tabContent);
    
    this.tabs.push(tab);
  }

  closeTab(tabId) {
    const tabButton = this.tabsContainer.querySelector(`[data-bs-target="#${tabId}"]`).parentNode;
    const tabContent = document.getElementById(tabId);
    
    tabButton.remove();
    tabContent.remove();
    this.tabs = this.tabs.filter(t => t.id !== tabId);
    
    // If no tabs left, create a new one
    if (this.tabs.length === 0) {
      this.createTab();
    }
  }
}

// Initialize browser tabs when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new BrowserTab();
});