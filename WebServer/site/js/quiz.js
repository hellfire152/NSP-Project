//Test data
var name = "Bryan";
var date = 22 / 6 / 2017;
var Totalquiz = [{
        quiz_id: 23,
        user_id: 123,
        quiz_title: "Test QUiz 1",
        quiz_type: "Classic",
        visibility: 1,
        description: "This is test quiz 1",
        quiz_rating: 5,
        date_created: "2017-06-15"
    },
    {
        quiz_id: 24,
        user_id: 123,
        quiz_title: "Test QUiz 2",
        quiz_type: "Classic",
        visibility: 1,
        description: "This is test quiz 2",
        quiz_rating: 3,
        date_created: "2017-06-17"
    },
    {
        quiz_id: 25,
        user_id: 123,
        quiz_title: "Test QUiz 3",
        quiz_type: "Classic",
        visibility: 1,
        description: "This is test quiz 3",
        quiz_rating: 4,
        date_created: "2017-05-06"
    },
    {
        quiz_id: 26,
        user_id: 124,
        quiz_title: "Test Quiz 4",
        quiz_type: 'Classic',
        visibility: 1,
        description: 'NIDIDIMEIYOUMAO',
        quiz_rating: 3,
        date_created: "2017-06-17"
    },
    {
        quiz_id: 27,
        user_id: 124,
        quiz_title: "Test Quiz 5",
        quiz_type: 'Classic',
        visibility: 1,
        description: 'NIDIDIMEIYOUMAO',
        quiz_rating: 3,
        date_created: "2017-06-01"
    }
];
//End of Test Data
function createNode1(){
    var total = Totalquiz.length;

    for(i =0;i<total;i++){
        var iDiv =  document.createElement('div');
        iDiv.className = "card all-quiz";
        document.getElementsByClassName('quiz-container')[0].appendChild(iDiv);

        var cardImgDiv = document.createElement('div');
        cardImgDiv.className = "card-image waves-effect waves-block waves-light";
        iDiv.appendChild(cardImgDiv);

        var quiz_category = document.createElement('a');
        quiz_category.className = "btn-floating btn-large btn-price waves-effect waves-light pink accent-2 quiz-category";
        cardImgDiv.appendChild(quiz_category);

        var cardImg = document.createElement('img');
        cardImg.className = "quiz-image";
        cardImgDiv.appendChild(cardImg);

        var actionButtonDiv1 = document.createElement('div');
        actionButtonDiv1.className = "col s2 offset-s5";
        iDiv.appendChild(actionButtonDiv1);

        var actionButton1 = document.createElement('a');
        actionButton1.className = "btn-floating btn-large waves-effect waves-light green accent-4";
        actionButtonDiv1.appendChild(actionButton1);

        var shareicon = document.createElement('i');
        shareicon.className = 'material-icons';
        shareicon.innerHTML = "share";
        actionButton1.appendChild(shareicon);

        var actionButtonDiv2 = document.createElement('div');
        actionButtonDiv2.className = "col s2";
        iDiv.appendChild(actionButtonDiv2);

        var actionButton2 = document.createElement('a');
        actionButton2.className = "btn-floating btn-large waves-effect waves-light red accent-2";
        actionButtonDiv2.appendChild(actionButton2);

        var favicon = document.createElement('i');
        favicon.className = "material-icons";
        favicon.innerHTML = "favorite";
        actionButton2.appendChild(favicon);

        var actionButtonDiv3 = document.createElement('div');
        actionButtonDiv3.className = "col s2";
        iDiv.appendChild(actionButtonDiv3);

        var actionButton3 = document.createElement('a');
        actionButton3.className = "btn-floating btn-large waves-effect waves-light light-blue";
        actionButtonDiv3.appendChild(actionButton3);

        var infoicon = document.createElement('i');
        infoicon.className = "material-icons activator";
        infoicon.innerHTML = "info";
        actionButton3.appendChild(infoicon);

        var content = document.createElement('div');
        content.className = "card-content";
        iDiv.appendChild(content);

        var title = document.createElement('span');
        title.className = "card-title activator grey-text text-darken-4";
        title.innerHTML = Totalquiz[i].quiz_title;
        content.appendChild(title);

        var actionButton4 = document.createElement('a');
        actionButton4.className = "btn-floating btn-large waves-effect waves-light red";
        content.appendChild(actionButton4);

        var playicon = document.createElement('i');
        playicon.className = "material-icons";
        playicon.innerHTML = "play_circle_filled";
        actionButton4.appendChild(playicon);

        var extraInfo = document.createElement('div');
        extraInfo.className = "card-reveal";
        iDiv.appendChild(extraInfo);

        var reveal_title = document.createElement('span');
        reveal_title.className = "card-title grey-text text-darken-4";
        reveal_title.innerHTML = Totalquiz[i].quiz_title;
        extraInfo.appendChild(reveal_title);

        var close = document.createElement('i');
        close.innerHTML = "close";
        close.className = "material-icons right";
        reveal_title.appendChild(close);

        var quiz_content = document.createElement('p');
        quiz_content.innerHTML =  "20 MCQ Questions";
        reveal_title.appendChild(quiz_content);

        var createdBy = document.createElement('p');
        createdBy.innerHTML = "Created By: " + Totalquiz[i].user_id;
        reveal_title.appendChild(createdBy);

        var quiz_created = document.createElement('p');
        quiz_created.innerHTML =  "Created On: " + Totalquiz[i].date_created;
        reveal_title.appendChild(quiz_created);





    }
}

function createNode() {

    var total = Totalquiz.length;

    for (var i = 0; i < total; i++) {

        var iDiv = document.createElement('div');
        iDiv.className = "card horizontal";
        document.getElementsByClassName('quiz-container')[0].appendChild(iDiv);

        //Create and append child
        var divImg = document.createElement('div');
        divImg.className = "card-image";
        iDiv.appendChild(divImg);

        var divCardStack = document.createElement('div');
        divCardStack.className = 'card-stacked';
        iDiv.appendChild(divCardStack);

        var divCardContent = document.createElement('div');
        divCardContent.className = 'card-content';
        divCardStack.appendChild(divCardContent);

        var newH = document.createElement('h5');
        var Htext = document.createTextNode(Totalquiz[i].quiz_title);
        newH.appendChild(Htext);
        divCardContent.appendChild(newH);

        var newP = document.createElement('p');
        var text = document.createTextNode("20 MCQ Questions")
        newP.appendChild(text);
        divCardContent.appendChild(newP);

        var newP1 = document.createElement('p');
        var text = document.createTextNode("Created By: " + Totalquiz[i].user_id);
        newP1.appendChild(text);
        divCardContent.appendChild(newP1);

        var newP2 = document.createElement('p');
        var text = document.createTextNode("Created On: " + Totalquiz[i].date_created);
        newP2.appendChild(text);
        divCardContent.appendChild(newP2);

        var divCardAction = document.createElement('div');
        divCardAction.className = 'card-action';
        divCardStack.appendChild(divCardAction);

        var playTag = document.createElement('a');
        playTag.setAttribute('href', '#');
        playTag.innerHTML = "Play";
        divCardAction.appendChild(playTag);

        var FavouTag = document.createElement('a');
        FavouTag.setAttribute('href', '#');
        FavouTag.innerHTML = "Favourite";
        divCardAction.appendChild(FavouTag);

        var ShareTag = document.createElement('a');
        ShareTag.setAttribute('href', '#');
        ShareTag.innerHTML = "Share";
        divCardAction.appendChild(ShareTag);
    }
}


function findTopRating1(){

    var max = 0;
    var index;
    var topRatingArr = [];
    var maxArr = [];


    for(i=0;i<Totalquiz.length;i++){
        topRatingArr.push(Totalquiz[i]);
    }
    console.log(Totalquiz);
    console.log(topRatingArr);
    // topRatingArr.sort();
    topRatingArr.sort(function(a, b) {
        return parseInt(a.quiz_rating) - parseInt(b.quiz_rating);
    });
    topRatingArr.reverse();
    console.log("AFTER SORT")
    console.log(topRatingArr);

    // for(j =topRatingArr.length-1;j>-1;j--){
    //     if(Totalquiz[j].quiz_rating == topRatingArr[j]){
    //         maxArr[j] = Totalquiz[j].quiz_title;    
    //     }
    // }

    for(i=0 ; i<3 ; i++){
        maxArr.push(topRatingArr[i]);
    }

    console.log(maxArr);


    for(v=0;v<maxArr.length;v++){

        var iDiv = document.createElement('div');
        iDiv.className = "card-panel hoverable teal";
        document.getElementsByClassName('quiz')[0].appendChild(iDiv);

        //Create and append child

        var newTitle = document.createElement('span');
        newTitle.className = "text-darken-4";
        newTitle.innerHTML = (maxArr[v].quiz_title);

        console.log(maxArr[v]);

        iDiv.appendChild(newTitle);
        
        var divImg = document.createElement('div');
        divImg.className = "card-image";
        iDiv.appendChild(divImg);

        var divCardStack = document.createElement('div');
        divCardStack.className = 'card-stacked';
        iDiv.appendChild(divCardStack);

        var divCardContent = document.createElement('div');
        divCardContent.className = 'card-content';
        divCardStack.appendChild(divCardContent);

        var newH = document.createElement('h5');
        var Htext = document.createTextNode(maxArr[v].quiz_title);
        newH.appendChild(Htext);
        divCardContent.appendChild(newH);

        var newP = document.createElement('p');
        var text = document.createTextNode("20 MCQ Questions")
        newP.appendChild(text);
        divCardContent.appendChild(newP);

        var divCardAction = document.createElement('div');
        divCardAction.className = 'card-action';
        divCardStack.appendChild(divCardAction);

        var playTag = document.createElement('a');
        playTag.setAttribute('href', '#');
        playTag.innerHTML = "Play";
        divCardAction.appendChild(playTag);

        var FavouTag = document.createElement('a');
        FavouTag.setAttribute('href', '#');
        FavouTag.innerHTML = "Favourite";
        divCardAction.appendChild(FavouTag);

        var ShareTag = document.createElement('a');
        ShareTag.setAttribute('href', '#');
        ShareTag.innerHTML = "Share";
        divCardAction.appendChild(ShareTag);
    }

}


function findTopRating(){
    var max = 0;
    var index;
    var topRatingArr = [];
    var maxArr = [];

 
    
    for(var i =0;i<Totalquiz.length;i++){
        topRatingArr.push(Totalquiz[i].quiz_rating);      
    } 

    topRatingArr.sort();

    console.log(topRatingArr);

    for(j =topRatingArr.length-1;j>topRatingArr.length-4;j--){
        maxArr.push(topRatingArr[j]);
        console.log(maxArr);
    }

    for(v = 0;v<maxArr.length;v++){
        var iDiv = document.createElement('div');
        iDiv.className = "card-panel hoverable teal";
        document.getElementsByClassName('quiz')[0].appendChild(iDiv);

        //Create and append child

        var newTitle = document.createElement('span');
        newTitle.className = "text-darken-4";
        newTitle.innerHTML = (maxArr[v].quiz_title);

        console.log(maxArr[v]);

        iDiv.appendChild(newTitle);
        
        var divImg = document.createElement('div');
        divImg.className = "card-image";
        iDiv.appendChild(divImg);

        var divCardStack = document.createElement('div');
        divCardStack.className = 'card-stacked';
        iDiv.appendChild(divCardStack);

        var divCardContent = document.createElement('div');
        divCardContent.className = 'card-content';
        divCardStack.appendChild(divCardContent);

        var newH = document.createElement('h5');
        var Htext = document.createTextNode(maxArr[j].quiz_title);
        newH.appendChild(Htext);
        divCardContent.appendChild(newH);

        var newP = document.createElement('p');
        var text = document.createTextNode("20 MCQ Questions")
        newP.appendChild(text);
        divCardContent.appendChild(newP);

        var divCardAction = document.createElement('div');
        divCardAction.className = 'card-action';
        divCardStack.appendChild(divCardAction);

        var playTag = document.createElement('a');
        playTag.setAttribute('href', '#');
        playTag.innerHTML = "Play";
        divCardAction.appendChild(playTag);

        var FavouTag = document.createElement('a');
        FavouTag.setAttribute('href', '#');
        FavouTag.innerHTML = "Favourite";
        divCardAction.appendChild(FavouTag);

        var ShareTag = document.createElement('a');
        ShareTag.setAttribute('href', '#');
        ShareTag.innerHTML = "Share";
        divCardAction.appendChild(ShareTag);
    }

}

$(document).ready(createNode1());
$(document).ready(findTopRating1());
//ToDo find out the error on .splice method
//Supposedly result is to print out only top 3  
/*
function findTopRating() {
    var max = 0;
    var index;
    var maxArr = [3];
    var quizArr;

    // for (var j; j < Totalquiz.length; j++) {
    //     quizArr[j] = Totalquiz[j];
    // }

    for (i = 0; i < Totalquiz.length; i++) {
        if (Totalquiz[i].quiz_rating > max) {
            max = Totalquiz[i].quiz_rating;
            index = i;
        }
        maxArr[i] = Totalquiz[index];
        // quizArr.splice(index, 1);
    }

    console.log('max arr consisit of: ' + maxArr);

    for (i = 0; i < maxArr.length; i++) {
        var iDiv = document.createElement('div');
        iDiv.className = "card horizontal";
        document.getElementsByClassName('quiz')[0].appendChild(iDiv);

        //Create and append child
        var divImg = document.createElement('div');
        divImg.className = "card-image";
        iDiv.appendChild(divImg);

        var divCardStack = document.createElement('div');
        divCardStack.className = 'card-stacked';
        iDiv.appendChild(divCardStack);

        var divCardContent = document.createElement('div');
        divCardContent.className = 'card-content';
        divCardStack.appendChild(divCardContent);

        var newH = document.createElement('h5');
        var Htext = document.createTextNode(maxArr[i].quiz_title);
        newH.appendChild(Htext);
        divCardContent.appendChild(newH);

        var newP = document.createElement('p');
        var text = document.createTextNode("20 MCQ Questions")
        newP.appendChild(text);
        divCardContent.appendChild(newP);

        var divCardAction = document.createElement('div');
        divCardAction.className = 'card-action';
        divCardStack.appendChild(divCardAction);

        var playTag = document.createElement('a');
        playTag.setAttribute('href', '#');
        playTag.innerHTML = "Play";
        divCardAction.appendChild(playTag);

        var FavouTag = document.createElement('a');
        FavouTag.setAttribute('href', '#');
        FavouTag.innerHTML = "Favourite";
        divCardAction.appendChild(FavouTag);

        var ShareTag = document.createElement('a');
        ShareTag.setAttribute('href', '#');
        ShareTag.innerHTML = "Share";
        divCardAction.appendChild(ShareTag);
    }
}
*/
// $(document).ready(findTopRating());