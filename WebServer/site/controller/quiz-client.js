function createNode(){
  var total = Totalquiz.length;

  console.log("IN");
  for(i=0;i<total;i++){
    var iDiv = document.createElement('div');
    iDiv.className = "post-quiz";
    document.getElementById('quiz-div').appendChild(iDiv);

    var post = document.createElement('div');
    post.className = "post";
    iDiv.appendChild(post);

    var post_thumb = document.createElement('div');
    post_thumb.className = "post-thumb";
    post_thumb.setAttribute('href', document.location.origin + '/host?quizId=' + Totalquiz[i].quiz_id);
    post.appendChild(post_thumb);

    var postImg = document.createElement('img');
    postImg.className = "img-rounded";
    postImg.setAttribute('src', '/resources/images/works/portfolio-6.jpg');
    post_thumb.appendChild(postImg);

    var postDetail = document.createElement('div');
    postDetail.className = "post-detail";
    post.appendChild(postDetail);

    var title = document.createElement('h3');
    title.innerHTML = Totalquiz[i].quiz_title;
    post_thumb.setAttribute('href', document.location.origin + '/host?quizId=' + Totalquiz[i].quiz_id);
    postDetail.appendChild(title);

    var postMeta = document.createElement('div');
    postMeta.className = "post-meta";
    postDetail.appendChild(postMeta);

    var metaInfo = document.createElement('div');
    metaInfo.className = "meta-info";
    metaInfo.innerHTML = Totalquiz[i].date_created;
    postMeta.appendChild(metaInfo);

    var calendarIcon = document.createElement('i');
    calendarIcon.className = "fa fa-calendar";
    metaInfo.appendChild(calendarIcon);

    var content = document.createElement('p');
    content.innerHTML = Totalquiz[i].description;
    postDetail.appendChild(content);

    // var createdBy = document.createElement('p');
    // createdBy.innerHTML = Totalquiz[i].date_created;
    // createdBy.appendChild(createdBy);

  }
}
