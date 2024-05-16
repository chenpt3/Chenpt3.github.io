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
    constructor(domManager) {
        this.domManager = domManager;
        this.screen = this.createScreen();
        this.screen.classList.add('hidden');
        this.domManager.main.main.appendChild(this.screen);
    }

    createScreen() {
        const screen = document.createElement('div');
        screen.classList.add('screen');
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
        super(domManager);
        new Home(domManager);
    }
}

class ToDoListScreen extends Screen {
    constructor(domManager) {
        super(domManager);
    }
}

class CalculatorScreen extends Screen {
    constructor(domManager) {
        super(domManager);
        new Calculator(this);
    }
}

class WeatherAppScreen extends Screen {
    constructor(domManager) {
        super(domManager);
    }
}

class connectFourScreen extends Screen {
    constructor(domManager) {
        super(domManager);
    }
}

class RockPaperScissorsScreen extends Screen {
    constructor(domManager) {
        super(domManager);
    }
}

class ChessScreen extends Screen {
    constructor(domManager) {
        super(domManager);
    }
}

class CheckersScreen extends Screen {
    constructor(domManager) {
        super(domManager);
    }
}

class MineSweeperScreen extends Screen {
    constructor(domManager) {
        super(domManager);
    }
}

class TicTacToeScreen extends Screen {
    constructor(domManager) {
        super(domManager);
    }
}

class TwentyFortyEightScreen extends Screen {
    constructor(domManager) {
        super(domManager);
    }
}