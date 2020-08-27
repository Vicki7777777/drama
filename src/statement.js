function statement (invoice, plays) {
  return generateText(invoice, plays);
}

function generateText(invoice, plays) {

  let totalAmount = 0;
  let volumeCredits = 0;
  let result = `Statement for ${invoice.customer}\n`;
  let textResult = {customer:invoice.customer,performances: []};

  const format = getFormat();
  let thisAmount = 0;
  for (let perf of invoice.performances) {
    const play = plays[perf.playID];
    switch (play.type) {
      case 'tragedy':
        thisAmount = 40000;
        if (perf.audience > 30) {
          thisAmount += 1000 * (perf.audience - 30);
        }
        break;
      case 'comedy':
        thisAmount = 30000;
        if (perf.audience > 20) {
          thisAmount += 10000 + 500 * (perf.audience - 20);
        }
        thisAmount += 300 * perf.audience;
        break;
      default:
        throw new Error(`unknown type: ${play.type}`);
    }
    // add volume credits
    volumeCredits += Math.max(perf.audience - 30, 0);
    // add extra credit for every ten comedy attendees
    if ('comedy' === play.type) volumeCredits += Math.floor(perf.audience / 5);
    //print line for this order
    result += ` ${play.name}: ${format(thisAmount / 100)} (${perf.audience} seats)\n`;
    let data = {
      name:play.name,
      amount:thisAmount,
      audience: perf.audience
    }
    textResult.performances.push(data);
    totalAmount += thisAmount;
  }
  result += `Amount owed is ${format(totalAmount / 100)}\n`;
  textResult.totalAmount = totalAmount
  result += `You earned ${volumeCredits} credits \n`;
  textResult.volumeCredits = volumeCredits
  let printTextResult = null;
  printTextResult = printText(textResult);
  return printTextResult;
}

function getFormat() {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format;
}

function printText(textResult) {
  const format = getFormat();
  let result = `Statement for ${textResult.customer}\n`;
  for(let i=0;i<textResult.performances.length;i++){
    result += ` ${textResult.performances[i].name}: ${format(textResult.performances[i].amount / 100)} (${textResult.performances[i].audience} seats)\n`;
  }
  result += `Amount owed is ${format(textResult.totalAmount / 100)}\n`;
  result += `You earned ${textResult.volumeCredits} credits \n`;
  return result
}

module.exports = {
  statement,
};
