import { fetchImages, DEFAULT_PAGE, resetPage, nextPage } from './js/fetchAPI';
import Notiflix from 'notiflix';

import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const formBoxes = document.querySelector('.search-form');
const containerCard = document.querySelector('.gallery');
const btnLoadMore = document.querySelector('.load-more');
let imagesName = ''



formBoxes.addEventListener('submit', onSubmitForm)

async function onSubmitForm(e) {
  e.preventDefault()
  imagesName = e.currentTarget.elements.searchQuery.value;

  resetPage()
  btnLoadMore.classList.remove('is-visible')
  try {
    const { imagesWay, isLastPage, totalHits } = await fetchImages(imagesName)
    //  if request with data is Empty
    const dataEmpty = totalHits === 0;
    if (dataEmpty) {
      Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
      return
    }
    // success accept
    Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
    containerCard.innerHTML = createMarkup(imagesWay);
    btnLoadMore.classList.add('is-visible')
    photo__card.refresh()

    // if is Page Last
    if (isLastPage) {
      btnLoadMore.classList.remove('is-visible')
      Notiflix.Notify.warning("We're sorry, but you've reached the end of search results.");
    }
  }
  catch (error) {
    console.log(error);
    Notiflix.Notify.failure('Please try again.');
  }
}

// more image
btnLoadMore.addEventListener('click', async (e) => {
  e.preventDefault();
  try {
    const { imagesWay, isLastPage } = await fetchImages(imagesName)
    nextPage()
    containerCard.insertAdjacentHTML('beforeend', createMarkup(imagesWay))

    const { height: cardHeight } =
      document.querySelector(".gallery")
        .firstElementChild.getBoundingClientRect();
    console.log(cardHeight);

    window.scrollBy({  // window.scrollBy(X, Y);
      top: cardHeight * 2,
      behavior: "smooth", //behavior отвечает за поведение прокрутки.
    });

    if (isLastPage) {
      btnLoadMore.classList.remove('is-visible')
      Notiflix.Notify.warning("We're sorry, but you've reached the end of search results.");
    }
    photo__card.refresh()
  }
  catch (error) {
    console.log(error);
    Notiflix.Notify.failure('Please try again.');
  }
}
)

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











// const instance = axios.create({
//   baseURL: 'https://pixabay.com/api',
//   params: {
//     key: '38349487-797b5deb970457741df4d2220',
//     q: { imagesName },
//     type_image: 'photo',
//     orientation: 'horizontal',
//     safesearch: true,
//   }
// });
