const invoices = require("./invoices.json");
const plays = require("./plays.json");

function statement(invoice, plays) {
    let result = `Statement for ${invoice.custom}\n`;
    for (let perf of invoice.performances) {
        const play = playFor(perf);
        let thisAmount = amountFor(play, perf);
        result += `  ${play.name}: ${formatAsUSD(thisAmount / 100)} ${perf.audience
            } seats \n`;
    }

    result += `Amount owed is ${formatAsUSD(totalAmount() / 100)}\n`;

    result += `You earned ${totalVolumnCredits()} creadits\n`;

    return result;

    function totalAmount() {
        let result = 0;
        for (let perf of invoice.performances) {
            const play = playFor(perf);
            let thisAmount = amountFor(play, perf);
            result += thisAmount;
        }
        return result;
    }

    function totalVolumnCredits() {
        let result = 0;
        for (let perf of invoice.performances) {
            result += volumnCreditsFor(perf);
        }
        return result;
    }

    function formatAsUSD(number) {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 2,
        }).format(number);
    }

    function playFor(performance) {
        return plays[performance.playID];
    }

    function amountFor(play, perf) {
        let result = 0;
        switch (play.type) {
            case "悲剧":
                result = 40000;
                if (perf.audience > 30) {
                    result += 1000 * (perf.audience - 30);
                }
                break;
            case "喜剧":
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