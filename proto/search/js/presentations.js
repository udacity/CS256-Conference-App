var infoDiv = document.querySelector('div#info');
var queryInput = document.querySelector('input#query');
var searchButton = document.querySelector('button#search');
var searchResultsElement = document.querySelector('div#searchResults');

var pouchdb;
var localCouchName = 'http://127.0.0.1:5984/presentations';
var pouchName = 'idb://presentations';
var remoteCouchName = 'https://chrome.iriscouch.com/presentations';
// var remoteCouchName = 'https://chrome.cloudant.com/presentations';

var numResults = 0;
var numSlides = 0;
function init(remote, local){
  Pouch(local, function(error, db){
    pouchdb = db;
    if (error) {
      console.log("Pouch error creating database:", error);
    } else {
      Pouch.replicate(remote, local, function (error, changes) {
        if (error) {
          console.log('Pouch replicate() error: ', error);
        } else {
          db.allDocs({include_docs: true}, function(error, docs) {
            infoDiv.innerText = 'Built database with ' + docs.rows.length +
              ' presentations.';
            queryInput.disabled = false;
            queryInput.focus();
            searchButton.disabled = false;
            // console.log('Pouch db: ' + docs.rows.length + ' rows: ', docs.rows);
          });
        }
      });
    }
  });
}

function destroy(name){
  Pouch.destroy(name, function(error){
    if (error) {
      console.log("Pouch error destroying database:", error)
    } else {
      console.log('Pouch destroyed database:', name);
    }
  });
}

// destroy(remoteCouchName);
// destroy(pouchName);

init(localCouchName, pouchName);

// var getAllButton = document.querySelector('button#getAll');

// getAllButton.onclick = function(){
//   pouchdb.allDocs({include_docs: true}, function(error, docs) {
//     console.log('docs: ', docs);
//     console.log('Pouch replicated ' + docs.rows.length + 'rows: ', docs.rows);
//   });
// };

function map(presentation){
// maybe not worth doing: adds size to DB and doesn't take much time
//   if (presentation.text.indexOf(queryString) === -1) {
// //      console.log('Not found in whole presentation: ', presentation.url);
//      return;
//   } else {
// //      console.log('>>> Found in ', presentation.url);
//   }
  var urlString = '<a href="' + presentation.url + '">' +
    presentation.url.replace('http://', '') + '</a>';
  var slides = presentation.slides;
  numSlides += slides.length;
  for (var i = 0; i !== slides.length; ++i) {
    var slide = slides[i];
    // checking slide text doesn't speed it up much!
    if (slide.text.toLowerCase().indexOf(queryString) === -1) {
      continue;
    } else {
      numResults += 1;
    }
    if (slide.images) {
      for (var j = 0; j != slide.images.length; ++j) {
        var image = slide.images[j];
        if (image.alt.toLowerCase().indexOf(queryString) !== -1 ||
          image.src.toLowerCase().indexOf(queryString) !== -1) {
          log(urlString + ' image: ' + image.alt + ', ' + image.src);
        }
      }
    }
    if (slide.heading && slide.heading.toLowerCase().indexOf(queryString) !== -1) {
      log(urlString + ' heading: ' + slide.heading);
    }
    if (slide.aside && slide.aside.toLowerCase().indexOf(queryString) !== -1) {
      log(urlString + ' aside: ' + slide.aside);
    }
  }
}

function searchFor(string){
  queryString = string;
  if (!pouchdb) {
    alert('Error creating local database.\n\nPlease reload the page.');
    return;
  }
  pouchdb.query({map: map}, {reduce: false},
    function(error, response) {
      if (error){
        console.log('pouchdb.query error: ', error);
      } else {
//        console.log('pouchdb.query success:', response);
        if (numResults === 0) {
          searchResultsElement.innerHTML = '<p>No results.</p>';
        } else {
          pouchdb.allDocs({include_docs: true}, function(error, docs) {
            searchResultsElement.innerHTML =
              '<p>In ' + numSlides + ' slides in ' +
              docs.rows.length + ' presentations, found ' +
              numResults + ' match(es):</p>' +
              searchResultsString;
          });
        }
        console.timeEnd('Time for search:');
      }
    }
  );
}

searchButton.onclick = function(){
  var queryString = queryInput.value.replace(/[^a-zA-Z]/g, " ").toLowerCase();
  numResults = 0;
  numSlides = 0;
  searchResultsString = '';
  searchResultsElement.innerText = '';
  console.time('Time for search:');
  searchFor(queryString);
};

var searchResultsString = '';
function log(string){
  searchResultsString += '<p>' + string + '</p>';
}
