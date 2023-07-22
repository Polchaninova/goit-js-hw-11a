import axios from 'axios';
axios.defaults.baseURL = 'https://pixabay.com/api/';
axios.defaults.params = {
  key: '38349487-797b5deb970457741df4d2220'
}

const DEFAULT_PAGE = 1
let page = DEFAULT_PAGE;

const resetPage = () => {
  page = DEFAULT_PAGE;
};

const nextPage = () => {
  page += 1
}
async function fetchImages(imagesName) {
  const response = await axios.get('/', {
    params: {
      q: imagesName,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      per_page: 40,
      page: page,
    }
  })
  const data = response.data;

  nextPage()
  return {
    imagesWay: data.hits,
    isLastPage: page >= data.totalHits,
    totalHits: data.totalHits
  }

}
export { fetchImages, DEFAULT_PAGE, resetPage, nextPage }




// function fetchImages(imagesName) {
//   return axios.get(`https://pixabay.com/api/?key=38349487-797b5deb970457741df4d2220&q=${imagesName}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`)
//     .then(response => {
//       return response.data
//     })
//     .then(data => {
//       page += 1;
//       return {
//         imagesWay: data.hits,
//         isLastPage: page >= data.totalHits,
//         totalHits: data.totalHits
//       }
//     })
// }