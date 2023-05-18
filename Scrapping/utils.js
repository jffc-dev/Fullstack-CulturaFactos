import { writeFile, readFile, appendFile } from 'node:fs/promises'
import path from 'node:path'
import * as cheerio from 'cheerio'

const DB_PATH = path.join(process.cwd(), 'db')
const DB_LOGS = path.join(process.cwd(), 'logs')

export const readDBFile = (fileName) => {
  return readFile(`${DB_PATH}/${fileName}.json`, 'utf-8').then(JSON.parse)
}

const dateFormat = (date) => {
  return ('00' + date.getDate()).slice(-2) + '/' +
  ('00' + (date.getMonth() + 1)).slice(-2) + '/' +
  date.getFullYear() + ' ' +
  ('00' + date.getHours()).slice(-2) + ':' +
  ('00' + date.getMinutes()).slice(-2) + ':' +
  ('00' + date.getSeconds()).slice(-2)
}

export const writeLog = async(dbName) => {
  const msg = `Leaderboard data was successfully scrapped ${dateFormat(new Date())}.\n`
  return appendFile(`${DB_LOGS}/${dbName}.txt`, msg, (err) => {
    if (err) throw err
    console.log('Saved!')
  })
}

export const writeDBFile = async(dbName, data) => {
  return writeFile(
    `${DB_PATH}/${dbName}.json`,
    JSON.stringify(data, null, 2),
    'utf-8'
  )
}

export const writeTxtFile = async(dbName, data) => {
  return writeFile(
    `${DB_PATH}/${dbName}.txt`,
    data,
    'utf-8'
  )
}

export const scrape = async (url) => {
  const text = await fetch(url).then((response) => response.text())
  await writeTxtFile('html1', text)
  return cheerio.load(text)
}

export const convertToDecimalPriceLoan = (price) => {
  let loan = false
  const multipliers = {
    'mil': 1000,
    'mill': 1000000
  };

  const numericValue = parseFloat(price.replace(/[^\d.,]/g, '').replace(',', '.'));

  if(price==="Préstamo" || price.includes("Tarifa de préstamo:")){
      loan = true
  }

  const abbreviation = price.match(/mil+|mill+/i);
  if (abbreviation && abbreviation[0]) {
    const multiplier = multipliers[abbreviation[0].toLowerCase()];
    return {price: numericValue * multiplier, loan};
  }

  return {price:numericValue, loan};
};