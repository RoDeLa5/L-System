export { init };

let drawingRule: { [key: string]: string };
let prodRule: { [key: string]: [string[], number[]] };
let symbols: string[] = [];

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
  document.getElementById("new-symbol-btn").addEventListener("click", () => {
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
        this.previousElementSibling.appendChild(
          prodRuleItemElm.cloneNode(true)
        );
      });
    (elm.querySelector("div > .symbol-name") as HTMLInputElement).value =
      _symbol;
    symbolListElm.appendChild(elm);
  });

  document.getElementById("save-btn").addEventListener("click", () => {
    symbols = [];
    drawingRule = {};
    prodRule = {};

    Array.from(symbolListElm.children).forEach((symbolElm) => {
      const _symbol = (
        symbolElm.querySelector(".symbol-name") as HTMLInputElement
      ).value;
      drawingRule[_symbol] = (
        symbolElm.querySelector(
          "div:nth-child(2) > textarea"
        ) as HTMLTextAreaElement
      ).value;

      prodRule[_symbol] = [[], []];
      Array.from(
        (symbolElm.querySelector("div:nth-child(2) > ul") as HTMLUListElement)
          .children
      ).forEach((prodElm) => {
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
      prodRule[_symbol];
    });

    /* 
    console.log(symbols);
    console.table(drawingRule);
    console.table(prodRule);
    */
  });

  document.getElementById("copy-btn").addEventListener("click", () => {
    navigator.clipboard.writeText(
      JSON.stringify({
        symbols: symbols,
        drawingRule: drawingRule,
        prodRule: prodRule,
      })
    );
  });
}
