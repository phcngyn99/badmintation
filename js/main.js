// js/main.js

import { UIController } from './ui.js';

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.uiController = new UIController();
  console.log('Badminton Tournament Manager initialized');
});

