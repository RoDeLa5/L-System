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
  public turtle: Turtle;

  private drawingRule: DrawingRuleFunc;
  private prodRule: ProdRule;
  private state: string;
  private _age: number;
  private maxAge: number;

  private _meshCount: { [meshType: string]: { [symbol: string]: number } };

  constructor(
    drawingRuleString: DrawingRule,
    prodRule: ProdRule,
    axiom: string,
    maxAge: number = Infinity
  ) {
    this.turtle = new Turtle();
    this.drawingRule = {};

    this._meshCount = { line: {}, sphere: {} };
    this.parseCommand(drawingRuleString);

    this.prodRule = prodRule;
    this.state = axiom;
    this._age = 0;
    if (maxAge) {
      this.maxAge = maxAge;
    }
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

    this.turtle.meshCount = { line: 0, sphere: 0 };

    Array.from(this.state).forEach((symbol) => {
      if (this.prodRule[symbol] != undefined) {
        const _s: string = randomChoice(...this.prodRule[symbol]);
        _s.split("").forEach((c) => {
          this.turtle.meshCount.line += this._meshCount.line[c];
          this.turtle.meshCount.sphere += this._meshCount.sphere[c];
        });
        newState += _s;
      } else {
        this.turtle.meshCount.line += this._meshCount.line[symbol];
        this.turtle.meshCount.sphere += this._meshCount.sphere[symbol];
        newState += symbol;
      }
    });

    this.state = newState;
    return true;
  }

  public log() {
    console.log(this.state);
    console.table(this.turtle.meshCount);
  }

  public remove() {
    this.turtle.reset();
    this.turtle.removeFromParent();
  }

  private parseCommand(drawingRule: DrawingRule) {
    Object.entries(drawingRule).forEach(([symbol, commandStr]) => {
      let str = "";
      let meshCount = { line: 0, sphere: 0 };
      const commands = commandStr.split(";");
      commands.forEach((command) => {
        let [func, ...args] = command.trim().split(" ");
        if (func) {
          str += "turtle." + func + "(" + args.join(",") + ");";
        }
        switch (func) {
          case "move":
            meshCount.line += 1;
            break;
          case "sphere":
            meshCount.sphere += 1;
            break;
        }
      });

      this.drawingRule[symbol] = new Function("turtle", str);
      this._meshCount.line[symbol] = meshCount.line;
      this._meshCount.sphere[symbol] = meshCount.sphere;
    });
  }
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
