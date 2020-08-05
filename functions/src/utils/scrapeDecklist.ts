import puppeteer from 'puppeteer'

/**
 * Scrapes mtggoldfish decklist and parses it into Quantity CardName
 * TODO: refactor with support for uneven mainboard quantities
 */
async function scrapeDecklist(deckURL: string) {
  const browser = await puppeteer.launch({
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
    ],
  });
  const page = await browser.newPage();
  await page.goto(deckURL);

  const scrapeSelectors = async (selectors: string) => {
    const values = await page.evaluate((selectors: string) => {
      const elements = Array.from(document.querySelectorAll(selectors));

      return elements.map(element => element.textContent.trim());
    }, selectors);

    return values
  };

  const [deckTitle] = await scrapeSelectors('.deck-view-title')
  const cardQuantities = await scrapeSelectors('.active .deck-col-qty')
  const cardNames = await scrapeSelectors('.active .deck-col-card a')

  await browser.close()

  const cards = []

  cardQuantities.forEach((quantity: string, index: number) => {
    if (cardNames[index]) cards.push(`${quantity} ${cardNames[index]}`)
  })

  let count = 0
  const deck = {
    name: deckTitle.split('\n')[0],
    mainboard: [],
    sideboard: [],
  }

  cards.map(str => {
    const [quantity] = str.split(' ')

    deck[count < 60 ? 'mainboard' : 'sideboard'].push(str)
    count += parseInt(quantity)
  })

  return {
    name: deck.name,
    mainboard: deck.mainboard.join('\n'),
    sideboard: deck.sideboard.join('\n'),
  }
}

export default scrapeDecklist
