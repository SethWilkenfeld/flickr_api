/*
	Homework #4
	script.js
	Gardner Wilkenfeld
*/

var searchResultsArray = []; // Stores the Search Results as an Array of Objects
var slideShowArray = []; // Stores the Selected Items for the SlideShow as an Array of Objects

var index; // Index to be used for the SlideShow
var showInterval; // Interval setting
var imgUrl; // Stores the url of the image to load

/* Creates the Sumbit button */
function loadSearchSubmitButton() {
	/* Create a Submit button for searching Flickr */
	$("<button>", {
		id:"searchSubmit",
		type:"submit"
	}).text("Submit").appendTo("#searchForm");

	/* Style the button using JQuery */
	$("#searchSubmit").button({
		icons:{
		  primary:"ui-icon-refresh"
		}
	});
}

function loadClearAllButton() {
	/* Create a Submit button for searching Flickr */
	$("<button>", {
		id:"clearAll",
		type:"button",
		onclick:"clearAll()"
	}).text("Clear All").appendTo("#buttons");

	/* Style the button using JQuery */
	$("#clearAll").button({
		icons:{
		  primary:"ui-icon-trash"
		}
	});
}

function loadLaunchButton() {
	/* Create a Submit button for searching Flickr */
	$("<button>", {
		id:"launchButton",
		type:"button",
		onclick:"launchSlideShow()"
	}).text("Launch").appendTo("#buttons");

	/* Style the button using JQuery */
	$("#launchButton").button({
		icons:{
		  primary:"ui-icon-triangle-1-e"
		}
	});
}

/* Search Flickr for images */
function flickrSearch() {
	var searchTags = $("#searchField").val(); // Get search field input

	if((searchTags != "") && (searchTags != null)) {
		hideLoader(); // First clear the current loader
		showLoader(); // Create a loader

		/* Setup Flickr API */
		var key = "b65af0321101588257cd5745c912e347";
		var urlString = "http://api.flickr.com/services/rest/?method=flickr.photos.search";

		/* Query Flickr API */
		var requestData = {api_key:key,tags:searchTags,sort:"interestingness-desc",per_page:"40",format:"json"};
		$.get(urlString, requestData);
	}
}

/* Process the jquery results from Flickr */
function jsonFlickrApi(data) {
	$("#resultsList").children().remove(); // Clears the current content of the Search Results DIV
	searchResultsArray = data.photos.photo; // Store the Array of Objects for the requested page

	var markup =	"<li id = 'http://farm${farm}.staticflickr.com/${server}/${id}_${secret}.jpg' class = 'resultImg' name = '${title}'>" +
						"<img src = 'http://farm${farm}.staticflickr.com/${server}/${id}_${secret}_s.jpg'>" +
					"</li>";

	$.template("photoTemplate", markup);
	$.tmpl("photoTemplate", searchResultsArray).draggable({helper: "clone"}).appendTo( "#resultsList" );

	hideLoader(); // First clear the current loader
}

/* Shows the loader img and text */
function showLoader() {
	/* Create the DIV for the loader img */
	$("<div>", {
		id:"searchLoader"
	}).appendTo("#search");

	/* Insert the loader img */
	$("<img>", {
		src:"imgs/ajax-loader-large.gif"
	}).appendTo("#searchLoader");

	/* Insert the text for the loader */
	$("<div>", {
		id:"searchLoaderText"
	}).text("Loading...").appendTo("#search");
}

/* Hides the loader img and text */
function hideLoader() {
	$("#searchLoader").remove();
	$("#searchLoaderText").remove();
}

/* Handles the drop operations */
function dropHandler() {
	$("#selected").droppable({ // Area for dropping
		accept: "#resultsList > li", // Accepts items from search results
		drop: function(event, ui) { // On drop call this function
			addImg(ui.draggable); // Send the item to the addImg function
		}
	});
}

/* Add the image to the SlideShow List */
function addImg(item) {
	slideShowArray.push(searchResultsArray[item]); // Push the object to the array
	item.clone().appendTo("#selectedList"); // Display the cloned <li> in the Selected DIV
}

/* Clears the SlideShow of all items */
function clearAll() {
	var selectedGallery = $("#selectedList"); // Get the html object
	selectedGallery.children().remove(); // Clear the html object
	slideShowArray = []; // Clear the array
}

/* Launch the SlideShow */
function launchSlideShow() {
	if($("#selectedList").children().length > 0) { // Only if there are images in the slideshow list
		index = 1; // Set the index to the 2nd item in the list

		$("#slideShow").children().remove(); // Clears the current image attached the the slideshow div
		imgUrl = slideShowArray[0].context.id; // Seet the current slideshow object

		/* Create the img object and attach it */
		$("<img>", {
			src:imgUrl
		}).appendTo("#slideShow");

		/* Show the dialog box */
		$("#slideShow").dialog({
			title:slideShowArray[0].context.name,
			width:"auto",
			height:"auto",
			position: {
				my:"left top",
				at:"left top",
				of:"#results"
			},
			modal:true,
			close:function(event, ui) { // On close event
				clearInterval(showInterval); // Clear the interval function
			}
		});

		showInterval = setInterval(nextImage,3000); // Set the interval function to call nextImage()
	}
}

/* Shows the next image */
function nextImage() {
	if(index < 	slideShowArray.length) { // Until you reach the end of the slideShow array
		$("#slideShow").children().remove(); // Clear the last image
		imgUrl = slideShowArray[index].context.id; // Set the current object

		/* Create the img object and attach it */
		$("<img>", {
			src:imgUrl
		}).appendTo("#slideShow");

		/* Show the dialog box */
		$("#slideShow").dialog({
			title:slideShowArray[index].context.name,
			width:"auto",
			height:"auto",
			position: {
				my:"left top",
				at:"left top",
				of:"#results"
			},
			modal:true,
			close:function(event, ui) { // On close event
				clearInterval(showInterval); // Clear the interval function
			}
		});

		index++; // Increment the index for next pass
	} else { // Once you reach the end of the slideShow
		clearInterval(showInterval); // Clear the interval function
		$("#slideShow").dialog("destroy"); // Hide the dialog
	}
}