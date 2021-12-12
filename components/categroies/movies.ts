import { writeDataToJsonFile } from '../util/helper';

const parseHTMLDom = () => {
  return '';
};

export const init = () => {
  const customJson = parseHTMLDom();
  writeDataToJsonFile(customJson, 'movies.json');
};
