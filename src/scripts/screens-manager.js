import Home from './screens/home-screen.js';
import Calculator from './screens/calculator/calculator.js';

export default class ScreensManager {
    constructor(domManager) {
        this.domManager = domManager;
        this.activeScreen = null;
        this.createScreens();
        this.showScreen(this.home);
    }

    createScreens() {
        this.home = new HomeScreen(this.domManager);
        this.toDoList = new ToDoListScreen(this.domManager);
        this.calculator = new CalculatorScreen(this.domManager);
        this.weatherApp = new WeatherAppScreen(this.domManager);
        this.connectFour = new connectFourScreen(this.domManager);
        this.rockPaperScissors = new RockPaperScissorsScreen(this.domManager);
        this.chess = new ChessScreen(this.domManager);
        this.checkers = new CheckersScreen(this.domManager);
        this.mineSweeper = new MineSweeperScreen(this.domManager);
        this.ticTacToe = new TicTacToeScreen(this.domManager);
        this.twoThousandFortyeight = new TwentyFortyEightScreen(this.domManager);
    }

    showScreen(screen) {
        if (this.activeScreen) {
            this.activeScreen.hide();
        }
        this.activeScreen = screen;
        this.activeScreen.show();
    }
}

class Screen {
    constructor(domManager, className) {
        this.domManager = domManager;
        this.screen = this.createScreen(className);
        this.screen.classList.add('hidden');
        this.domManager.main.main.appendChild(this.screen);
    }

    createScreen(className) {
        const screen = document.createElement('div');
        screen.classList.add('screen', className);
        return screen;
    }

    show() {
        this.screen.classList.remove('hidden');
        
    }

    hide() {
        this.screen.classList.add('hidden');
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
    constructor(domManager) {
        super(domManager, 'calculator-screen');
        new Calculator(this);
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