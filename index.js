const assert = require("assert");

const invoices = require("./invoices.json");
const plays = require("./plays.json");

function statement(invoice, plays) {
    let result = `演出费用清单: ${invoice.custom}\n`;
    
    for (let perf of invoice.performances) {
        const play = playFor(perf);
        let thisAmount = amountFor(perf);
        result += `  ${play.name}: ${formatAsUSD(thisAmount)} ${perf.audience
        } 座位 \n`;
    }
    
    let volumnCredits = totalVolumnCredits();

    result += `所欠金额为 ${formatAsUSD(totalAmount())}\n`;
    result += `您获得 ${volumnCredits} 积分\n`;
    return result;

    function totalAmount() {
        let result = 0;
        for (let perf of invoice.performances) {
            result += amountFor(perf);
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
        }).format(number / 100);
    }

    function volumnCreditsFor(perf) {
        const play = playFor(perf);
        let result = 0;
        result += Math.max(perf.audience - 30, 0);
        // 为喜剧计算额外的积分
        if ("喜剧" === play.type) result += Math.floor(perf.audience / 5);
        return result;
    }

    function playFor(performance) {
        return plays[performance.playID];
    }

    function amountFor(perf) {
        const play = playFor(perf);
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
}

const stats = statement(invoices[0], plays);
console.log(stats);
assert.strictEqual(
    `演出费用清单: 华夏艺术中心
  哈姆雷特: $650.00 55 座位 
  乌龙山伯爵: $580.00 35 座位 
  驴得水: $500.00 40 座位 
所欠金额为 $1,730.00
您获得 47 积分\n`,
    stats
);
