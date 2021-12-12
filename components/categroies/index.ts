import {init as MoviesInit} from './movies';
import {init as MusicInit}  from './music';
import {init as BookInit} from './books';
import { urlParser } from 'src/util/helper';

const init = () => {
    const { category } = urlParser();
    if (category === 'movie') {
        MoviesInit();
    } else if (category === 'music') {
        MusicInit();
    } else if (category === 'book') {
        BookInit();
    }
}