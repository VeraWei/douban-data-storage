const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const $_parseDom = ($) => {
  // general remover
  $('#db-global-nav').remove();
  $('#db-nav-sns').remove();
  $('#db-nav-movie').remove();
  $('#db-nav-book').remove();
  $('#db-nav-music').remove();
  $('.nav-list').remove();
  $('#footer').remove();

  // remove useless elements
  $('#db-usr-profile .info ul').remove();
  $('#comments').remove();
  $('form').remove();
};

const handleTagA = ($) => {
  // replace lists href with the relative path
  // https://book.douban.com/annotation/77466904/
  $('.rnotes .item').each((index, item) => {
    const id = $(item).find('h5 a').attr('href').split('/')[4];
    if (id) {
      const href = `../detail/${id}.html`;
      $(item).find('h5 a').attr('href', href);
    }
  });

  // https://book.douban.com/review/12463105/
  $('.review-item .main-bd').each((index, item) => {
    const id = $(item).find('h2 a').attr('href').split('/')[4];
    if (id) {
      const href = `../detail/${id}.html`;
      $(item).find('h2 a').attr('href', href);
    }
  });

  // replace paginator
  $('.paginator a').each((index, element) => {
    const num = $(element).text() - 1;
    if (num >= 0) {
      $(element).attr('href', `./${num}.html`);
    }
  });

  // disable all other a tag functionality
  $('a').each((index, element) => {
    const isDetailLink = $(element).attr('href')?.startsWith("../detail")
    const isPaginatorLink = $(element).attr('href')?.startsWith("./");
    if (!isDetailLink && !isPaginatorLink) {
      $(element).attr('href', 'javascript:void(0)');
    }
  });
}

const getAllFiles = function (dirPath, arrayOfFiles) {
  const originalFiles = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  originalFiles.forEach(function (file) {
    if (file.startsWith('.')) return;
    if (fs.statSync(dirPath + '/' + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + '/' + file, arrayOfFiles);
    } else {
      arrayOfFiles.push(path.join(dirPath, '/', file));
    }
  });

  return arrayOfFiles;
};

/**
 * parse string
 */
const parseStr = (str) => str?.trim().split(" ").join("");


/**
 * annotation | reviews
 * list | detail
 */

const loopFolderPath = path.join(__dirname, '/', '..', 'personal');
const files = getAllFiles(loopFolderPath);

const bookData = {
  "collect": [],
  "do": [],
  "wish": []
}
const movieData = {
  "collect": [],
  "do": [],
  "wish": []
}
const musicData = {
  "collect": [],
  "do": [],
  "wish": []
}

const reviewsData = [];

const annotationData = {
  "detail": [],
  "list": []
};

const handleAnnotationFiles = ($, isDetailPage) => {
  if (isDetailPage) {
    const data = {};
    const $content = $("#content");
    data['name'] = parseStr($content.find('h1').text());
    data['imgSrc'] = $content.find('.pic img').attr('src');
    data['author'] = parseStr($content.find('.info h6 a').text());
    data['stat'] = parseStr($content.find('.info p .stat').text());
    data['bookName'] = $content.find('.info p .name').text();
    data['comment'] = $content.find('#link-report').text().trim();
    data['id'] = $content.find('.action-react a').attr('data-object_id');
    data['date'] = parseStr($content.find('.pubtime').text());

    annotationData['detail'].push(data);
  } else {
    // handle annotation list
    const elements = $(".annotations-item");
    elements.each((index, element) => {
      const data = {};
      const imgSrc = $(element).find('.book-cover img').attr('src');
      const href = $(element).find('.annotations-context a').attr('href');
      const id = href.split('/')[6];
      data["id"] = id;
      data['imgSrc'] = imgSrc;
      data['href'] = href;
      data['notes'] = [];
  
      const $items = $(element).find('.rnotes .item');
  
      $items.each((index, item) => {
        const itemData = {};
        const itemName = $(item).find('h5 a').text().trim();
        const noteId = $(item).find('h5 a').attr('href').split('/')[4];
        console.log($(item).find('h5 a').attr('href'));
        const shortNote = $(item).find('.reading-note').text();
        itemData['name'] = parseStr(itemName);
        itemData['noteId'] = noteId;
        itemData['shortNote'] = shortNote.trim();
        data['notes'].push(itemData);
      });
      
      annotationData['list'].push(data);
    });
  }
}

// no need to handle reviews list, info from detail pages is enough
const handleReviewFiles = ($) => {
  const data = {};
  const $content = $("#content");
  data['id'] = $content.find('.main').attr('id');
  data['name'] = $content.find('h1').text().trim();
  data['imgSrc'] = $content.find('.author-avatar img').attr('src');
  data['author'] = parseStr($content.find('.main-hd a span').text());
  data['stat'] = parseStr($content.find('.main-title-rating').attr('title'));
  data['reviewName'] = $content.find('.main-hd a:nth-child(2)').text();
  data['comment'] = $content.find('#link-report').text().trim();
  data['date'] = parseStr($content.find('.main-meta').text());
  
  reviewsData.push(data);
}

const handleElseFiles = ($, category, subCategory) => {
  const isBook = category === 'book';
  // music & movie are sharing the same structure
  // book is using the classname interest-list
  const elements = (isBook) ? $(".interest-list li") : $(".grid-view .item");
  elements.each((index, element) => {
    const data = {};
    const imgSrc = $(element).find('.pic img').attr('src');
    const href = $(element).find('.pic a').attr('href');
    const id = href.split('/')[4];
    const date = $(element).find('.date').text();
    const comment = $(element).find('.comment').text();
    data["id"] = id;
    data['imgSrc'] = imgSrc;
    data['href'] = href;
    data['date'] = parseStr(date);
    data['comment'] = parseStr(comment);

    if (isBook) {
      const name = $(element).find('.info h2 a').text();
      const pub = $(element).find('.pub').text();
      data['name'] = parseStr(name);
      data['pub'] = parseStr(pub);
    } else {
      const name = $(element).find('.title em').text();
      const intro = $(element).find('.pic a').attr('href');
      data['name'] = parseStr(name);
      data['intro'] = parseStr(intro);
    }
    if (category === 'book') bookData[subCategory].push(data);
    else if (category === 'music') musicData[subCategory].push(data);
    else if (category === 'movie') movieData[subCategory].push(data);
  });
};

// general parser for all pages
files.forEach((filePath) => {
  const data = fs.readFileSync(filePath, 'utf-8');
  const $ = cheerio.load(data);
  $_parseDom($);

  const filePathArr = filePath.split('/');

  const category = filePathArr[filePathArr.length - 4];
  const subCategory = filePathArr[filePathArr.length - 3];
  const fileName = filePathArr[filePathArr.length - 1];
  console.log(category, subCategory, fileName);

  if (filePath.includes('annotation')) {
    handleAnnotationFiles($, filePath.includes('detail'), filePath);
  } else if (filePath.includes('reviews') && filePath.includes('detail')) {
    handleReviewFiles($);
  } else {
    handleElseFiles($, category, subCategory);
  }

  handleTagA($);

  fs.writeFileSync(filePath, $.html());
});

exec(`mkdir -p ${loopFolderPath}/json`, (err, stdout, stderr) => {
  fs.writeFileSync(path.join(__dirname, '..', 'personal/json', 'book.json'), JSON.stringify(bookData));
  fs.writeFileSync(path.join(__dirname, '..', 'personal/json', 'music.json'), JSON.stringify(musicData));
  fs.writeFileSync(path.join(__dirname, '..', 'personal/json', 'movie.json'), JSON.stringify(movieData));
  fs.writeFileSync(path.join(__dirname, '..', 'personal/json', 'annotation.json'), JSON.stringify(annotationData));
  fs.writeFileSync(path.join(__dirname, '..', 'personal/json', 'reviews.json'), JSON.stringify(reviewsData));
});
