import './styles/style.css';
import AssetsManager from './scripts/assets-manager.js';
import DOMManager from './scripts/dom-manager.js';
import EventsManager from './scripts/events-manager.js';
import ScreensManager from './scripts/screens-manager.js';

const assetsManager = new AssetsManager();
const domManager = new DOMManager(assetsManager);
const screensManager = new ScreensManager(domManager);
const eventsManager = new EventsManager(domManager, screensManager);

