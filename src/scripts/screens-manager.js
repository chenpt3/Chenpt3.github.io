import Home from './screens/home-screen.js';
import Calculator from './screens/calculator/calculator.js';

export default class ScreensManager {
    constructor(domManager) {
        this.domManager = domManager;
        this.activeScreen = null;
        this.screenCache = {};
        this.screenState = {};
        this.screenClasses = {
            'home': HomeScreen,
            'todo-list': ToDoListScreen,
            'calculator': CalculatorScreen,
            'weather-app': WeatherAppScreen,
            'connect-four': connectFourScreen,
            'rock-paper-scissors': RockPaperScissorsScreen,
            'chess': ChessScreen,
            'checkers': CheckersScreen,
            'mine-sweeper': MineSweeperScreen,
            'tic-tac-toe': TicTacToeScreen,
            'twenty-forty-eight': TwentyFortyEightScreen
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
        new Home(domManager);
    }
}

class ToDoListScreen extends Screen {
    constructor(domManager) {
        super(domManager, 'todo-list-screen');
    }
}

class CalculatorScreen extends Screen {
    constructor(domManager, state) {
        super(domManager, 'calculator-screen');
        const calc = new Calculator(this, state);
        this.screenState = calc.state;
    }
}

class WeatherAppScreen extends Screen {
    constructor(domManager) {
        super(domManager, 'weather-app-screen');
    }
}

class connectFourScreen extends Screen {
    constructor(domManager) {
        super(domManager, 'connect-four-screen');
    }
}

class RockPaperScissorsScreen extends Screen {
    constructor(domManager) {
        super(domManager, 'rock-paper-scissors-screen');
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
        super(domManager, 'mine-sweeper-screen');
    }
}

class TicTacToeScreen extends Screen {
    constructor(domManager) {
        super(domManager, 'tic-tac-toe-screen');
    }
}

class TwentyFortyEightScreen extends Screen {
    constructor(domManager) {
        super(domManager, 'twenty-forty-eight-screen');
    }
}