const btnSearch = document.getElementById('btnSearch')
const searchInput = document.getElementById('input')
const mainContent = document.getElementById('mainContent')
const btnWatchlist = document.getElementById('btnWatchlist')
let title = ""
let page =1

let myWatchList = []
if(localStorage.getItem('movieId')){
    myWatchList= (JSON.parse(localStorage.getItem('movieId')))
}

if(location.href.endsWith('watchlist.html')){
    showWatchlist(myWatchList)
}
else{
btnSearch.addEventListener('click', searchByTitle)
}
//Add to watch list listener
document.addEventListener('click', function(e){
    if(e.target.dataset.add){
        addToWatchList(e.target.dataset.add)
    }
})

// remove from watchlist listener
document.addEventListener('click', function(e){
    if(e.target.dataset.remove){
        removeFromWatchlist(e.target.dataset.remove)
    }
})



function searchByTitle(){
    document.getElementById('main').style.backgroundImage ="unset"
    title = searchInput.value
    getMovies(title,page)

}
function getMovies(movieTitle,page){
    mainContent.innerHTML=""
  fetch(`http://www.omdbapi.com/?apikey=dd7e260a&s=${movieTitle}&page=${page}`)
    .then(res=> res.json())
    .then(data=> {
        if(data.totalResults){
        data.Search.forEach(element => getMovieById(element.imdbID));
        pagination(data.totalResults)
                             }
        else{
            movieNotFount()
        }
                 } )
                                   }

    function getMovieById(id){
   
         fetch(`http://www.omdbapi.com/?apikey=dd7e260a&i=${id}`)
         .then(res=> res.json())
         .then(data=> showMovies(data))
                              }

function pagination(totalMovies){
    const pages = totalMovies/10;
    let pageButtons = ""
    for(let p=1; p<=pages; p++){
        pageButtons += `<a class="btn_page" data-page="${p}" onclick='getMovies("${title}", ${p})'>${p}</a>`
    }
    document.getElementById('page').innerHTML = pageButtons
}



function showMovies(movie){
    const listButton = renderWatchlisted(movie.imdbID)
    const html =`
    <div class="movie" id="post${movie.imdbID}">
    <img class="movie_img" src="${movie.Poster}" alt="">
    <div class="movie_content">
        <div class="movie_title">
            <a href="#">${movie.Title}</a>
           <span class="movie_rate"> <i class="fa-solid fa-star"></i> ${movie.imdbRating}</span>
        </div>
        <div class="movie_details" data-details="${movie.imdbID}">
            <p class="movie_time">${movie.Runtime}</p>
            <p class="movie_gener">${movie.Genre}</p>
            ${listButton}
        </div>
        <p class="movie_text">
        ${movie.Plot}
        </p>
    </div>
</div>

`
mainContent.innerHTML += html
}

function movieNotFount(){

    mainContent.innerHTML = `<p class="not_found">Unable to find what you’re looking for. Please try another search.</p>`
}


function showWatchlist(movies){
    document.getElementById('main').style.backgroundImage ="unset"

   if(movies.length>0){
    movies.forEach(movie=>getMovieById(movie))
    
   }
   else{
    mainContent.innerHTML = `<div class="not_found"><p>Your watchlist is looking a little empty...</p>
    <a class="add_some_movie" href="index.html" ><i class="fa-solid fa-circle-plus"></i> Let’s add some movies!</a>
    </div>
    `
   }
}


function renderWatchlisted(id){
   
  const inList = myWatchList.includes(id)
  if(inList){
    return `<button class="btn_action"  data-remove="${id}" id="btn${id}"><i class="fa-solid fa-circle-minus"></i> Remove</button> `
  }
  return `<button class="btn_action" data-add="${id}" id="btn${id}"><i class="fa-solid fa-circle-plus"></i> Watchlist</button>`
}



function addToWatchList(movieId){
   
    myWatchList.push(movieId)
    localStorage.setItem('movieId',JSON.stringify(myWatchList))
    const parrent =document.getElementById(`btn${movieId}`).parentNode
    document.getElementById(`btn${movieId}`).remove()
   parrent.innerHTML+= renderWatchlisted(movieId)

}


function removeFromWatchlist(id){
   for(let index =0; index<myWatchList.length; index++){
        if(myWatchList[index]==id){
            myWatchList.splice(index,1)
            localStorage.setItem('movieId',JSON.stringify(myWatchList))
            if(location.href.endsWith('watchlist.html')){
                removePost(id)
            }
        }
   }
   const parrent =document.getElementById(`btn${id}`).parentNode
   document.getElementById(`btn${id}`).remove()
  parrent.innerHTML+= renderWatchlisted(id)
}
//  localStorage.clear('movieId')

function removePost(id){
    document.getElementById(`post${id}`).remove()
    if(!myWatchList.length>0){
        mainContent.innerHTML = `<div class="not_found"><p>Your watchlist is looking a little empty...</p>
        <a class="add_some_movie" href="index.html" ><i class="fa-solid fa-circle-plus"></i> Let’s add some movies!</a>
        </div>
        `
    }
}
