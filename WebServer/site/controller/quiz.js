function createNode(){

	var total = Totalquiz.length;
	console.log(total);
	console.log("IN");

	for(i=0;i<total;i++){
		var iDiv = document.createElement('div');
		iDiv.className = "card-media";
		document.getElementById('card_container').appendChild(iDiv);

		var cardMediaObjectContainer = document.createElement('div');
		cardMediaObjectContainer.className = "card-media-object-container";
		iDiv.appendChild(cardMediaObjectContainer);

		var cardMediaObject = document.createElement('div');
		cardMediaObject.className = "card-media-object";
		cardMediaObject.setAttribute('style', 'background-image:url("https://static.pexels.com/photos/46274/pexels-photo-46274.jpeg")');
		cardMediaObjectContainer.appendChild(cardMediaObject);

		var cardMediaBody = document.createElement('div');
		cardMediaBody.className  = "card-media-body";
		iDiv.appendChild(cardMediaBody);

		var cardMediaBodyTop = document.createElement('div');
		cardMediaBodyTop.className = "card-media-body-top";
		cardMediaBody.appendChild(cardMediaBodyTop);

		var date = document.createElement('span');
		date.className = "subtle";
		date.innerHTML = Totalquiz[i].date_created;
		cardMediaBodyTop.appendChild(date);

		var title = document.createElement('h5');
		title.className = "card-media-body-heading";
		title.innerHTML = Totalquiz[i].quiz_title;
		cardMediaBody.appendChild(title);

		var description = document.createElement('span');
		description.className = "card-media-body-heading";
		description.innerHTML = Totalquiz[i].description;
		cardMediaBody.appendChild(description);

		var cardMediaBodySupportBot = document.createElement('div');
		cardMediaBodySupportBot.className = "card-media-body-supporting-bottom card-media-body-supporting-bottom-reveal";
		cardMediaBody.appendChild(cardMediaBodySupportBot);

		var button = document.createElement('a');
		button.className = "card-media-body-supporting-bottom-text card-media-link u-float-right";
		button.innerHTML = "Host";
		button.setAttribute('href', '/host?quizId=' + Totalquiz[i].quiz_id);
		cardMediaBodySupportBot.appendChild(button);

	}

}

function findTopRating(){
	var max = 0;
	var index;
    var topRatingArr = [];
    var maxArr = [];

    for(i=0;i<Totalquiz.length;i++){
        topRatingArr.push(Totalquiz[i]);
    }

    console.log(Totalquiz);
    console.log(topRatingArr);


     topRatingArr.sort(function(a, b) {
        return parseInt(a.quiz_rating) - parseInt(b.quiz_rating);
    });

     topRatingArr.reverse();
    console.log("AFTER SORT")
    console.log(topRatingArr);

    for(i=0 ; i<3 ; i++){
        maxArr.push(topRatingArr[i]);
    }

    console.log(maxArr);


    for(v =0;v<maxArr.length;v++){
    	var iDiv = document.createElement('div');
    	iDiv.className = "card-media";
    	document.getElementById('sidebar-container').appendChild(iDiv);

    	var cardMediaContainer = document.createElement('div');
    	cardMediaContainer.className = "card-media-object-container";
    	iDiv.appendChild(cardMediaContainer);

    	var cardMediaObject = document.createElement('div');
    	cardMediaObject.className = "card-media-object";
    	cardMediaContainer.appendChild(cardMediaObject);

    	var thumbnail = document.createElement('img');
    	thumbnail.setAttribute('src', 'https://static.pexels.com/photos/46274/pexels-photo-46274.jpeg');
    	cardMediaObject.appendChild(thumbnail);

    	var date = document.createElement('span');
    	date.className = "card-media-object-tag";
    	date.className = "subtle";
    	date.innerHTML = maxArr[v].date_created;

    	var cardMediaBody = document.createElement('div');
    	cardMediaBody.className = "card-media-body";
    	iDiv.appendChild(cardMediaBody);

    	var title = document.createElement('span');
    	title.className = "card-media-body-heading";
    	title.innerHTML = maxArr[v].description;
    	cardMediaBody.appendChild(title);

    	var buttonDiv = document.createElement('div');
    	buttonDiv.className = "card-media-body-supporting-bottom";
    	buttonDiv.className = "card-media-body-supporting-bottom-reveal";
    	cardMediaBody.appendChild(buttonDiv);

    	var button = document.createElement('a');
    	button.className = "card-media-body-supporting-bottom-text";
    	button.className = "card-media-link";
    	button.className = "u-float-right";
    	button.innerHTML = "Host";
			button.setAttribute('href', '/host?quizId=' + maxArr[v].quiz_id);
    	buttonDiv.appendChild(button);


    }
		// createNode();
}
// createNode();
// $(document).ready(findTopRating());
// createNode();
