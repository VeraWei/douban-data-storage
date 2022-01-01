/**
 * this file will maintain all the original data that get from douban
 */

const cheerio = require('cheerio');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');

let child;

const fetchCategories = (category, subCategory) => {

  let dirPath = `personal/${category}/${subCategory}/list`;
  if (['reviews', 'notes'].includes(subCategory)) { 
    dirPath = `personal/${subCategory}/list`;
  }

  const filePath = path.join(__dirname, '..', dirPath, '0.html');
  let lastPage = 0;

  try {
    const data = fs.readFileSync(filePath, 'utf8');
    const $ = cheerio.load(data);
    lastPage = $('.paginator>a').last().text();
  } catch (err) {
    console.error(err)
  }

  let page = 1;
  let times = 15;

  let curlHostLink = `https://${category}.douban.com/people/${process.env.PERSONAL_KEY}/${subCategory}`;

  if (subCategory === 'annotation') {
    curlHostLink = `https://${category}.douban.com/people/${process.env.PERSONAL_KEY}/${subCategory}/`;
    times = 5;
  }
  
  // loop all pages
  while (page < lastPage) {
    const start = page * times;
    const command = `curl "${curlHostLink}?start=${start}" -H 'Referer: https://${category}.douban.com' -H 'Cookie: ${process.env.PERSONAL_COOKIE}' --compressed --output ${dirPath}/${page}.html`;
    child = exec(command);
    page++;
  }
}

// only for annotation and reviews, get it's detail
const fetchDetailFile = (link, folderPath, fileName) => {
  const command = `mkdir -p ${folderPath}/detail & curl "${link}" -H 'Cookie: ${process.env.PERSONAL_COOKIE}' --compressed --output ${folderPath}/detail/${fileName}.html`;
  exec(command);
};

// once we get all list files, loop it's detail
const readListFiles = (folderPath, subCategory) => {
  const listFolderPath = `${folderPath}/list`;
  fs.readdirSync(path.join(__dirname, '..', listFolderPath)).forEach(filePath => {
    const data = fs.readFileSync(path.join(__dirname, '..', listFolderPath, filePath), 'utf8');
    const $ = cheerio.load(data);
    
    let elements = [];
    if (subCategory === 'annotation') {
      elements = $('.rnotes li h5 > a');
    } else if (subCategory === 'reviews') {
      elements =  $('.review-list .review-item h2 a');
    } else if (subCategory === 'notes') {
      return $('.note-container').each((index, element) => {
        const link = $(element).attr('data-url');
        const pageNum = link.split('/')[4];
        fetchDetailFile(link, folderPath, pageNum);
      });
    }

    return elements.each((index, element) => {
      const link = $(element).attr('href');
      const pageNum = link.split('/')[4];
      fetchDetailFile(link, folderPath, pageNum);
    });
  });
}

// loop all categories
const init = () => {
  const categoryList = ["book", "movie", "music"];
  const subCategoryList = ["do", "wish", "collect"];
  
  for (const category of categoryList) {
    for (const subCategory of subCategoryList) {
      fetchCategories(category, subCategory);
    }
  };
  
  fetchCategories('book', 'annotation');
  fetchCategories('book', 'reviews');
  fetchCategories('book', 'notes');
}

(() => {
  init();

  const annotationPath = 'personal/book/annotation';
  const reviewsPath = 'personal/reviews';
  const notesPath = 'personal/notes';

  // add more detail files
  child?.on('close', (err) => {
    if (err) {
      console.error(`exec error: ${err}`);
      return;
    }
    console.log('The files fetching process closed');
    readListFiles(annotationPath, 'annotation');
    readListFiles(reviewsPath, 'reviews');
    readListFiles(notesPath, 'notes');
  });
})();
