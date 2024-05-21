import './styles/style.css';
import AssetsManager from './scripts/assets-manager.js';
import Creator from './scripts/creator.js';
import DOMManager from './scripts/dom-manager.js';
import EventsManager from './scripts/events-manager.js';
import ScreensManager from './scripts/screens-manager.js';


new EventsManager(new ScreensManager(new DOMManager(new AssetsManager(), new Creator())));
