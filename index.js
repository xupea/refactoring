const assert = require('assert');

const invoices = require("./invoices.json");
const plays = require("./plays.json");

function statement(invoice, plays) {
    let totalAmount = 0;
    let volumnCredits = 0;
    let result = `演出费用清单: ${invoice.custom}\n`;
    const format = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
    }).format;
    for (let perf of invoice.performances) {
        const play = plays[perf.playID];
        let thisAmount = 0;

        switch (play.type) {
            case "悲剧":
                thisAmount = 40000;
                if (perf.audience > 30) {
                    thisAmount += 1000 * (perf.audience - 30);
                }
                break;
            case "喜剧":
                thisAmount = 30000;
                if (perf.audience > 20) {
                    thisAmount += 10000 + 500 * (perf.audience - 20)
                }
                thisAmount += 300 * perf.audience;
                break;
            default:
                throw new Error(`unknown type: ${play.type}`);
        }

        // 计算积分
        volumnCredits += Math.max(perf.audience - 30, 0);
        // 为喜剧计算额外的积分
        if ("喜剧" === play.type) volumnCredits += Math.floor(perf.audience / 5);
        // 打印
        result += `  ${play.name}: ${format(thisAmount / 100)} ${perf.audience
            } 座位 \n`;
        totalAmount += thisAmount;
    }
    result += `所欠金额为 ${format(totalAmount / 100)}\n`;
    result += `您获得 ${volumnCredits} 积分\n`;
    return result;
}

const stats = statement(invoices[0], plays);
console.log(stats)
assert.strictEqual(`演出费用清单: 华夏艺术中心
  哈姆雷特: $650.00 55 座位 
  乌龙山伯爵: $580.00 35 座位 
  驴得水: $500.00 40 座位 
所欠金额为 $1,730.00
您获得 47 积分\n`, stats)
