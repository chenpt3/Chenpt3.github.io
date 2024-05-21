import ToDoList from './to-do-list.js';
import Calculator from 'calc-port-pack';

export default class ScreensManager {
    constructor(domManager) {
        this.domManager = domManager;
        this.activeScreen = null;
        this.screenCache = {};
        this.screenState = {};
        this.screenClasses = {
            'home': HomeScreen,
            'toDoList': ToDoListScreen,
            'calculator': CalculatorScreen,
            'weatherApp': WeatherAppScreen,
            'connectFour': connectFourScreen,
            'rockPaperScissors': RockPaperScissorsScreen,
            'chess': ChessScreen,
            'checkers': CheckersScreen,
            'mineSweeper': MineSweeperScreen,
            'ticTacToe': TicTacToeScreen,
            'twoThousandFortyeight': TwentyFortyEightScreen
        };
        this.createCurrentScreen('home-screen');
    }

    createCurrentScreen(screen) {
        if (this.activeScreen) {
            this.clearScreen();
        }
        const ScreenClass = this.screenClasses[screen] || HomeScreen;
        this.activeScreen = new ScreenClass(this.domManager, this.screenCache[`${screen}-screen`]);

        if (this.screenCache[`${screen}-screen`]) {
            this.activeScreen.screenState = this.screenCache[`${screen}-screen`];
        }
        
        this.screenState = this.activeScreen.screenState;
    }

    clearScreen() {
        this.screenState = this.activeScreen.screenState;
        this.screenCache[this.activeScreen.screen.classList[1]] = this.screenState;
        this.activeScreen = null;
        this.domManager.main.main.innerHTML = '';
    }
}

class Screen {
    constructor(domManager, className) {
        this.domManager = domManager;
        this.screen = this.createScreen(className);
        this.domManager.main.main.appendChild(this.screen);
    }

    createScreen(className) {
        const screen = document.createElement('div');
        screen.classList.add('screen', className);
        return screen;
    }
}

class HomeScreen extends Screen {
    constructor(domManager) {
        super(domManager, 'home-screen');
        this.populateHomeScreen();
    }

    populateHomeScreen() {
        const homeScreen = this.screen;
        const homeScreenContent = document.createElement('div');
        homeScreenContent.classList.add('home-screen-content');
        homeScreen.appendChild(homeScreenContent);

        const homeScreenTitle = document.createElement('h1');
        homeScreenTitle.classList.add('home-screen-title');
        homeScreenTitle.textContent = 'Welcome to the Home Screen!';
        homeScreenContent.appendChild(homeScreenTitle);

        const homeScreenDescription = document.createElement('p');
        homeScreenDescription.classList.add('home-screen-description');
        homeScreenDescription.textContent = 'Please select a game or app from the menu to begin.';
        homeScreenContent.appendChild(homeScreenDescription);
    }
}

class ToDoListScreen extends Screen {
    constructor(domManager, state) {
        super(domManager, 'toDoList-screen');
        const toDoList = new ToDoList(this, state);
        this.screenState = toDoList.state;
    }
}

class CalculatorScreen extends Screen {
    constructor(domManager, state) {
        super(domManager, 'calculator-screen');
        const calculator = new Calculator(this, state);
        this.screenState = calculator.state;
    }
}

class WeatherAppScreen extends Screen {
    constructor(domManager) {
        super(domManager, 'weatherApp-screen');
    }
}

class connectFourScreen extends Screen {
    constructor(domManager) {
        super(domManager, 'connectFour-screen');
    }
}

class RockPaperScissorsScreen extends Screen {
    constructor(domManager) {
        super(domManager, 'rockPaperScissors-screen');
    }
}

class ChessScreen extends Screen {
    constructor(domManager) {
        super(domManager, 'chess-screen');
    }
}

class CheckersScreen extends Screen {
    constructor(domManager) {
        super(domManager, 'checkers-screen');
    }
}

class MineSweeperScreen extends Screen {
    constructor(domManager) {
        super(domManager, 'mineSweeper-screen');
    }
}

class TicTacToeScreen extends Screen {
    constructor(domManager) {
        super(domManager, 'ticTacToe-screen');
    }
}

class TwentyFortyEightScreen extends Screen {
    constructor(domManager) {
        super(domManager, 'twentyFortyEight-screen');
    }
}