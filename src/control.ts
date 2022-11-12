import { LSystem, DrawingRule, ProdRule } from "./lsystem";

export { init, lsystem };

let symbols: string[] = [];
let drawingRule: DrawingRule;
let prodRule: ProdRule;
let axiom: string;
let maxAge: number;
let lsystem: LSystem;

const axiomInputElm = document.getElementById(
  "axiom-input"
) as HTMLInputElement;
const symbolListElm = document.getElementById(
  "symbol-list"
) as HTMLUListElement;
const newSymbolInput = document.getElementById(
  "new-symbol-input"
) as HTMLInputElement;

const symbolItemElm = document.querySelector(
  "#template > .symbol-item"
) as HTMLLIElement;
const prodRuleItemElm = document.querySelector("#template > .prod-rule-item")!;

function init() {
  newSymbolInput.addEventListener("keydown", (e) => {
    if (e.key == "Enter") {
      addSymbol();
    }
  });
  document
    .getElementById("new-symbol-btn")
    .addEventListener("click", addSymbol);

  document.getElementById("save-btn").addEventListener("click", save);

  document.getElementById("copy-btn").addEventListener("click", () => {
    navigator.clipboard.writeText(
      JSON.stringify({
        symbols: symbols,
        drawingRule: drawingRule,
        prodRule: prodRule,
        axiom: axiom,
        maxAge: maxAge,
      })
    );
  });
}

function addSymbol() {
  const _symbol = newSymbolInput.value;
  if (_symbol.length != 1) {
    return;
  }
  if (
    !Array.from(symbolListElm.children).every((symbolElm) => {
      return (
        (symbolElm.querySelector(".symbol-name") as HTMLInputElement).value !=
        _symbol
      );
    })
  ) {
    return;
  }

  symbols.push(_symbol);

  const elm = symbolItemElm.cloneNode(true) as HTMLLIElement;
  elm
    .querySelector("div > .add-prod-rule-btn")
    .addEventListener("click", function () {
      this.previousElementSibling.appendChild(prodRuleItemElm.cloneNode(true));
    });
  (elm.querySelector("div > .symbol-name") as HTMLInputElement).value = _symbol;
  symbolListElm.appendChild(elm);
}

function save() {
  // Reset variables
  symbols = [];
  drawingRule = {};
  prodRule = {};

  // Set axiom
  axiom = axiomInputElm.value;
  if (axiom == "") {
    lsystem = undefined;
    return;
  }

  // Set max age
  maxAge = parseInt(
    (document.getElementById("max-age-input") as HTMLInputElement).value
  );
  if (maxAge == NaN) {
    maxAge = Infinity;
  }

  // Set drawing rule
  Array.from(symbolListElm.children).forEach((symbolElm) => {
    const _symbol = (
      symbolElm.querySelector(".symbol-name") as HTMLInputElement
    ).value;
    drawingRule[_symbol] = (
      symbolElm.querySelector(
        "div:nth-child(2) > textarea"
      ) as HTMLTextAreaElement
    ).value;

    // Set production rule
    // Get LI elements of production rule
    const prodRuleList = Array.from(
      (symbolElm.querySelector("div:nth-child(2) > ul") as HTMLUListElement)
        .children
    );
    // Check if the list is empty and add to prodRule
    if (prodRuleList.length) {
      prodRule[_symbol] = [[], []];
      prodRuleList.forEach((prodElm) => {
        const prodTxt = (
          prodElm.querySelector("input:nth-child(1)") as HTMLInputElement
        ).value;
        let prodWeight = (
          prodElm.querySelector("input:nth-child(2)") as HTMLInputElement
        ).value;
        if (prodWeight == "") {
          if (prodTxt == "") {
            prodElm.remove();
            return;
          }
          prodWeight = "0";
        }
        prodRule[_symbol][0].push(prodTxt);
        prodRule[_symbol][1].push(parseInt(prodWeight));
      });
    }
    lsystem = new LSystem(drawingRule, prodRule, axiom, maxAge);
  });
}
