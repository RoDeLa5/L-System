import { Turtle } from "./turtle";

export { LSystem, DrawingRule, ProdRule };

interface DrawingRule {
  [key: string]: string;
}

interface DrawingRuleFunc {
  [key: string]: Function;
}

interface ProdRule {
  [key: string]: [string[], number[]];
}

class LSystem {
  private turtle: Turtle;
  private drawingRule: DrawingRuleFunc;
  private prodRule: ProdRule;
  private state: string;
  private _age: number;
  private maxAge: number;

  constructor(
    drawingRuleString: DrawingRule,
    prodRule: ProdRule,
    axiom: string,
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
    Array.from(this.state).forEach((symbol) => {
      if (typeof this.drawingRule[symbol] == "function") {
        this.drawingRule[symbol](this.turtle);
      }
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

    let newState = "";
    Array.from(this.state).forEach((symbol) => {
      if (this.prodRule[symbol] != undefined) {
        newState += randomChoice(...this.prodRule[symbol]);
      } else {
        newState += symbol;
      }
    });
    this.state = newState;
    return true;
  }

  public log() {
    console.log(this.state);
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

function randomChoice(array: any[], weight: number[]) {
  const partialSumArray: number[] = [];
  let sum = 0;
  weight.forEach((value) => {
    sum += value;
    partialSumArray.push(sum);
  });
  const r = Math.random() * sum;
  for (let i = 0; i < partialSumArray.length; i++) {
    if (partialSumArray[i] > r) {
      return array[i];
    }
  }
}
