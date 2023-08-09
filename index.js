const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const app = express();
const puppeteer = require("puppeteer");

const data = {
  title: "",
  price: "",
};

// const newUrl =
//   "https://www.amazon.in/AmazonBasics-DisplayPort-port-HDMI-Cable/dp/B015OW3GJK?_encoding=UTF8&content-id=amzn1.sym.7289df79-b8e5-4181-9ee7-6407406ffc73&linkId=d49ff71aac480c1a2bb6f786d0554ca8&language=en_IN&ref_=as_li_ss_tl&th=1";

const newUrl = "http://127.0.0.1:5500/index.html";

async function test() {
  let browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  // Navigate the page to a URL
  await page.goto(newUrl);
  await autoScroll(page);
  const dynamicContent = await page.evaluate(() => {
    // Replace the selector below with the actual selector of the content you want to extract
    const elements = document.querySelectorAll("#productDetails_feature_div");
    const content = [];
    for (const element of elements) {
      content.push(element.innerHTML);
    }
    return content;
  });

  const data1 = [];
  const $ = cheerio.load(dynamicContent[0]);
  console.log(typeof dynamicContent[0]);
  $(".prodDetSectionEntry", dynamicContent[0]).each(function () {
    const property = $(this).text().trim(); // Extract the text content and remove any leading/trailing spaces
    data1.push({ [property]: "" }); // Add it as a pro
  });
  let count = 0;
  $(".prodDetAttrValue", dynamicContent[0]).each(function () {
    const value = $(this).text().trim(); // Extract the text content and remove any leading/trailing spaces
    const property = Object.keys(data1[count])[0]; // Get the property name from data1
    data1[count][property] = value; // Update the corresponding value in data1 array
    count++;
  });
  await browser.close();

  console.log(data1);
}
async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 100;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;
        if (totalHeight >= scrollHeight - window.innerHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });
  });
}

test();
app.listen(8000, () => {
  console.log("running at port 8000");
});
