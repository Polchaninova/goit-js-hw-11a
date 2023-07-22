import axios from 'axios';
import Notiflix from 'notiflix';

import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const formBoxes = document.querySelector('.search-form');
const containerCard = document.querySelector('.gallery');
let imagesName = ''

const resetPage = () => {
  page = DEFAULT_PAGE;
};
const DEFAULT_PAGE = 1
let page = DEFAULT_PAGE;

function fetchImages(imagesName) {
  return axios.get(`https://pixabay.com/api/?key=38349487-797b5deb970457741df4d2220&q=${imagesName}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`)
    .then(response => {
      return response.data
    })
    .then(data => {
      page += 1;
      return {
        imagesWay: data.hits,
        isLastPage: page >= data.totalHits,
        totalHits: data.totalHits
      }
    })
}

formBoxes.addEventListener('submit', onSubmitForm)

function onSubmitForm(e) {
  e.preventDefault()
  imagesName = e.currentTarget.elements.searchQuery.value;

  resetPage()
  fetchImages(imagesName)
    .then(({ imagesWay, isLastPage, totalHits }) => {
      //  if request with data is Empty
      const dataEmpty = totalHits === 0;
      if (dataEmpty) {
        Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
        return
      }
      // success accept
      Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
      containerCard.innerHTML = createMarkup(imagesWay);

      photo__card.refresh()

      // if is Page Last
      if (isLastPage) {
        Notiflix.Notify.warning("We're sorry, but you've reached the end of search results.");
      }
    })
    .catch(error => (console.log(error)))
    .finally()
}

const options = {
  rootMargin: "200px",
  threshold: 0.5,
};
const observer = new IntersectionObserver(entries => {

  entries.forEach(entry => {
    if (entry.isIntersecting) { // если сейчас ЕЛЕМЕНТ вошел во вьюпорт
      console.log("Intersecting");
      fetchImages(imagesName)
        .then(({ imagesWay, isLastPage }) => {
          page += 1
          containerCard.insertAdjacentHTML('beforeend', createMarkup(imagesWay))
        })
      photo__card.refresh()
    }

  })
}, options);

observer.observe(document.querySelector('.scroll-guard'))


function createMarkup(images) {
  return images.map(({ webformatURL, largeImageURL, likes, tags, views, comments, downloads }) => `
  <div class="photo__card">
  <a class="photo__link"
  href="${largeImageURL}">
  <img loading="lazy"
  src="${webformatURL}"
  alt="${tags}" class="img" />
 </a>
      <div class="info">
        <p class="info-item">
          <b>Likes</b>
          <b>${likes}👍</b>
        </p>
        <p class="info-item">
          <b>Views</b>
          <b>${views}👀</b>
        </p>
        <p class="info-item">
        <b>Comments</b>
          <b>${comments}💬</b>
        </p>
        <p class="info-item">
          <b>Download</b>
          <b>${downloads}</b>
        </p>
      </div>

    </div>`
  ).join('')
}
const photo__card = new SimpleLightbox('.photo__card a', { captionsData: "alt", captionDelay: 250, captionPosition: 'bottom' });


