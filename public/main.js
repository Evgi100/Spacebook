var SpacebookApp = function () {

  var posts = [];

  function _fetchData() {
    $.ajax({
      method: "GET",
      url: '/posts',
      success: function (data) {
        process(data)
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
      }
    });
  }

  var process = function (data) {
    posts = (data);
    console.log(posts);
    _renderPosts();
  }

  var $posts = $(".posts");

  function _renderPosts() {
    $posts.empty();
    var source = $('#post-template').html();
    var template = Handlebars.compile(source);
    for (var i = 0; i < posts.length; i++) {
      var newHTML = template(posts[i]);
      $posts.append(newHTML);
      // _renderComments(i)
    }
  }

  function addPost(newPost) {
    // posts.push({ text: newPost, comments: [] });
    $.ajax({
      method: "POST",
      url: '/posts',
      data: { text: newPost, comments: [] },
      success: function (data) {
        _renderPosts();
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
      }
    });
  }

/// Need to change the postIndex to postId , 

  function _renderComments(postIndex) {
    var post = $(".post")[postIndex];
    $commentsList = $(post).find('.comments-list')
    $commentsList.empty();
    var source = $('#comment-template').html();
    var template = Handlebars.compile(source);
    for (var i = 0; i < posts[postIndex].comments.length; i++) {
      var newHTML = template(posts[postIndex].comments[i]);
      $commentsList.append(newHTML);
    }
  }

  var removePost = function (postId) {
    $.ajax({
      method: "DELETE",
      url: '/posts/:'+postId+'',
      success: function (postId) {
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
      }
    });
    _renderPosts();
  };

  var addComment = function (newComment, postId) {
    $.ajax({
      method: "POST",
      url: '/posts/' + postId,
      success: function (postId) {
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
      }
    });
    // posts[postIndex].comments.push(newComment);

    _renderComments(postIndex);
  };


  var deleteComment = function (postIndex, commentIndex) {
    posts[postIndex].comments.splice(commentIndex, 1);
    _renderComments(postIndex);
  };

  _fetchData();
  _renderPosts();

  return {
    addPost: addPost,
    removePost: removePost,
    addComment: addComment,
    deleteComment: deleteComment,
    posts: posts
  };
};

var app = SpacebookApp();


$('#addpost').on('click', function () {
  var $input = $("#postText");
  if ($input.val() === "") {
    alert("Please enter text!");
  } else {
    app.addPost($input.val());
    $input.val("");
  }
})


var $posts = $(".posts");

$posts.on('click', '.remove-post', function () {
  // var index = $(this).closest('.post').index();
  var postId = $(this).closest('.post').data().id;
  app.removePost(postId);
});

$posts.on('click', '.toggle-comments', function () {
  var $clickedPost = $(this).closest('.post');
  $clickedPost.find('.comments-container').toggleClass('show');
});

$posts.on('click', '.add-comment', function () {

  var $comment = $(this).siblings('.comment');
  var $user = $(this).siblings('.name');

  if ($comment.val() === "" || $user.val() === "") {
    alert("Please enter your name and a comment!");
    return;
  }
  // var postIndex = $(this).closest('.post').index();
  postId = $(this).closest('.post').data().id;
  var newComment = { text: $comment.val(), user: $user.val() };

  app.addComment(newComment, postId);

  $comment.val("");
  $user.val("");

});

$posts.on('click', '.remove-comment', function () {
  var $commentsList = $(this).closest('.post').find('.comments-list');
  // var postIndex = $(this).closest('.post').index();
  // var commentIndex = $(this).closest('.comment').index();
  postId = $(this).closest('.post').data().id;
  commentId=$(this).closest('.comment').data().id;
  app.deleteComment(postId, commentId);
});

