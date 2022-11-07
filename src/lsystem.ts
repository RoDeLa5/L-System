import { Turtle } from "./turtle";

export { LSystem };

interface DrawingRuleString {
  [key: string]: string;
}

interface DrawingRule {
  [key: string]: Function;
}

interface ProdRule {
  [key: string]: string[];
}

class LSystem {
  private turtle: Turtle;
  private drawingRule: DrawingRule;
  private prodRule: ProdRule;
  private state: string[];
  private _age: number;
  private maxAge: number;

  constructor(
    drawingRuleString: DrawingRuleString,
    prodRule: ProdRule,
    axiom: string[],
    maxAge: number = Infinity
  ) {
    this.turtle = new Turtle();
    this.drawingRule = {};
    for (const symbol in drawingRuleString) {
      this.drawingRule[symbol] = parseCommand(drawingRuleString[symbol]);
    }

    this.prodRule = prodRule;
    this.state = axiom;
    this._age = 0;
    this.maxAge = maxAge;
  }

  public get age(): number {
    return this._age;
  }

  /**
   * Render
   */
  public render() {
    this.turtle.reset();
    this.state.forEach((symbol) => {
      this.drawingRule[symbol](this.turtle);
    });
  }

  /**
   * Grow
   */
  public grow() {
    if (this._age >= this.maxAge) {
      return false;
    }
    this._age += 1;

    const newState: string[] = [];
    this.state.forEach((symbol) => {
      if (symbol in this.prodRule) {
        newState.push(...this.prodRule[symbol]);
      } else {
        newState.push(symbol);
      }
    });
    this.state = newState;
    return true;
  }

  public log() {
    console.log(this.state.join(""));
  }
}

function parseCommand(commandStr: string) {
  let str = "";
  const commands = commandStr.split(";");
  commands.forEach((command) => {
    let [func, ...args] = command.trim().split(" ");
    if (func) {
      str += "turtle." + func + "(" + args.join(",") + ");";
    }
  });
  return new Function("turtle", str);
}
