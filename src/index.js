import Notiflix from 'notiflix';
import axios from 'axios';
import SimpleLightbox from "simplelightbox/dist/simple-lightbox.esm";

const galleryEl = document.querySelector('.gallery');
const formEl = document.querySelector('.search-form');
const inputEl = document.querySelector('.search-input');
const buttonLoadEl = document.querySelector('.load-more');
const KEY = '34310450-164638d0ced594f3db31885e7';
const URL = 'https://pixabay.com/api/';
let curentPage = 1;
let searchText = '';
const perPage = 40;

Notiflix.Notify.init({
  position: 'center-center', // 'right-top' - 'right-bottom' - 'left-top' - 'left-bottom' - 'center-top' - 'center-bottom' - 'center-center'
  timeout: 5000,
  clickToClose: true,
});

formEl.addEventListener('submit', addElementList);
function addElementList(event) { 
  resetData();
  event.preventDefault();
  const searchText = inputEl.value;
  addImagesToPage(searchText); 
};
buttonLoadEl.addEventListener('click',  () => {
  searchText = inputEl.value;
  addImagesToPage(searchText);
});

async function searchImage (searchText, curentPage) {
  try {
    const response = await axios.get(URL, {
      params:{
      key: KEY,
      q: searchText,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      per_page: perPage,
      page: curentPage,
      }
    });
    const dataRespons = await response.data;
    const totalHits = dataRespons.totalHits;
    const lengthHits = dataRespons.hits.length;
    if (lengthHits === 0 || searchText.trim() === '') {
      buttonLoadEl.classList.add('hidden')
      return Notiflix.Notify.failure(`Sorry, there are no images matching your search query. Please try again.`) 
    }
      else {
        buttonLoadEl.classList.remove('hidden');
      }
    
    colectionValidator(curentPage, perPage, totalHits);
    return dataRespons;
  } catch (error) {
  Notiflix.Notify.failure(`Sorry, there are no images matching your search query. Please try again.`) 
  }
};
async function addImagesToPage(searchText) {
  try { 
    let elemets = await searchImage(searchText, curentPage);
    let elemetsArray = elemets.hits;
    curentPage++;
    let cartImage = elemetsArray.map(({
      webformatURL, tags, likes, views, comments, downloads }) => {
      return `<ul class="list gallery-list">
        <li class="item">
          <div class="photo-card">
            <img
              src="${webformatURL}"
              alt="${tags}"
              loading="lazy"
            />
            <div class="info">
              <p class="info-item">
                <b>Likes</b>
                 ${likes}
                 </p>
              <p class="info-item">
                <b>Views</b>
                 ${views}
                
              </p>
              <p class="info-item">
                <b>Comments</b>
                ${comments}
              </p>
              <p class="info-item">
                <b>Downloads</b>
               ${downloads}
              </p>
            </div>
          </div>
        </li>
      </ul>`
    }).join('\n');
    
    return  galleryEl.insertAdjacentHTML('beforeend', cartImage)
  } 
  catch (error) {
    error
  }
  
};


function resetData () {
  buttonLoadEl.classList.add('hidden');
  galleryEl.innerHTML = '';
  curentPage = 1;
};

 function colectionValidator(curentPage, perPage, totalHits) {
      if ((curentPage * perPage) >= totalHits) {
      buttonLoadEl.classList.add('hidden');
      Notiflix.Notify.success('We\'re sorry, but you\'ve reached the end of search results.');
    }   
};
const lightbox = new SimpleLightbox('.gallery a',
   ( {
       captionsData: 'alt',
       captionDelay: 250,
    }));