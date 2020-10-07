const invoices = require("./invoices.json");
const plays = require("./plays.json");

function statement(invoice, plays) {
    let totalAmount = 0;
    let volumnCredits = 0;

    let result = `Statement for ${invoice.custom}\n`;

    const format = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
    }).format;

    for (let perf of invoice.performances) {
        const play = playFor(perf);

        let thisAmount = amountFor(play, perf);

        volumnCredits += volumnCreditsFor(perf);

        result += `  ${play.name}: ${format(thisAmount / 100)} ${perf.audience
            } seats \n`;

        totalAmount += thisAmount;
    }

    result += `Amount owed is ${format(totalAmount / 100)}\n`;

    result += `You earned ${volumnCredits} creadits\n`;

    return result;

    function playFor(performance) {
        return plays[performance.playID];
    }

    function amountFor(play, perf) {
        let result = 0;
        switch (play.type) {
            case "tragedy":
                result = 40000;
                if (perf.audience > 30) {
                    result += 1000 * (perf.audience - 30);
                }
                break;
            case "comedy":
                result = 30000;
                if (perf.audience > 20) {
                    result += 10000 + 500 * (perf.audience - 20);
                }
                result += 300 * perf.audience;
                break;
            default:
                throw new Error(`unknown type: ${play.type}`);
        }
        return result;
    }

    function volumnCreditsFor(perf) {
        let result = 0;
        const play = playFor(perf);
        result += Math.max(perf.audience - 30, 0);
    
        if ("comedy" === play.type)
            result += Math.floor(perf.audience / 5);
        return result;
    }
}

const stats = statement(invoices[0], plays);
console.log(stats);