/** The module for receiving response from the MODX website<br/>
* We only request to /event-map-api.js which fires a snippet that returns the data we need (based on page requesting)
* @module Data
* @requires Promise
*/

var Promise = require('core-js/library/fn/promise'); //IE9 needs a Promise polyfill
var exports = module.exports = {};


/** Get the projects from the DB. 
* @param {int} page_id - The current page id (hardcoded in HTML)
* @fires {@link makeRequest} - requesting the data from the server
* @return {Object} projects - A promise that should have the projects JSON Object on an error if something failed.
*/

exports.getProjects = function(page_id) {

	return new Promise(function (resolve, reject) {

		makeRequest('POST', '/event-map-api.js?t=' + Math.random(), page_id)
		.then(function (projects) {
		   //setTimeout(() => { resolve(JSON.parse(projects)); }  , 4000) //testing to see if it will work if delayed 10 sec
		   resolve(JSON.parse(projects));
		})
	 	.catch(function (err) {
		  reject(`Error Status: ${err.status}. ${err.statusText} ${err}`);
		});
	});
};


/** Makes a request to a server 
* @param {string} method - The type of method (POST/GET)
* @param {string} url - The URL to request
* @param {int} page_id - The page id requesting the data
* @return {Object} projects - A promise that should have the projects JSON Object on an error if something failed.
*/
function makeRequest (method, url, page_id) {

  return new Promise(function (resolve, reject) {

    var xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    xhr.onload = function () {
      if (this.status >= 200 && this.status < 300) {
        resolve(xhr.response || xhr.responseText);
      } else {
        reject({
          status: this.status,
          statusText: xhr.statusText
        });
      }
    };

    xhr.onerror = function () {
      reject({
        status: this.status,
        statusText: xhr.statusText
      });
    };
    xhr.send("pid=" + page_id);

  });

}

