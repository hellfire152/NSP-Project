//Test data
var name = "Bryan";
var date = 22 / 6 / 2017;
var Totalquiz = [{
        quiz_id: 2,
        user_id: 1,
        quiz_title: 'NIMAMAMEIYOUMAO',
        quiz_type: 'Classic',
        visibility: 1,
        description: 'quiz description',
        quiz_rating: 3,
        date_created: '2017-06-20T16:00:00.000Z'
    },
    {
        quiz_id: 3,
        user_id: 1,
        quiz_title: 'NIPAPAMEIYOUMAO',
        quiz_type: 'Classic',
        visibility: 1,
        description: 'quiz description',
        quiz_rating: 5,
        date_created: '2017-06-20T16:00:00.000Z'
    },
    {
        quiz_id: 4,
        user_id: 1,
        quiz_title: 'NIGEGEMEIYOUMAO',
        quiz_type: 'Classic',
        visibility: 1,
        description: 'quiz description',
        quiz_rating: 4,
        date_created: '2017-06-20T16:00:00.000Z'
    },
    {
        quiz_id: 1,
        user_id: 1,
        quiz_title: 'quiz title',
        quiz_type: 'Classic',
        visibility: 1,
        description: 'NIDIDIMEIYOUMAO',
        quiz_rating: 3,
        date_created: '2017-06-19T16:00:00.000Z'
    },
    {
        quiz_id: 1,
        user_id: 1,
        quiz_title: 'NIDIDIMEIYOUMAO',
        quiz_type: 'Classic',
        visibility: 1,
        description: 'NIDIDIMEIYOUMAO',
        quiz_rating: 3,
        date_created: '2017-06-19T16:00:00.000Z'
    }
];
//End of Test Data


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

// document.onload(createNode());

//ToDo find out the error on .splice method
//Supposedly result is to print out only top 3  
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

$(document).ready(findTopRating());