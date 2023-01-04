$(function () {
  $("#navbar-toggler-button").blur(function (event) {
    var screenWidth = window.innerWidth;
    if (screenWidth < 768) {
      $("#navbar-toggler").collapse('hide');
    }
  });
});

function sendGetRequest(url, responseHandler) {
  var request = new XMLHttpRequest();
  request.onreadystatechange = function () {
    handleResponse(request, responseHandler);
  };
  request.open("GET", url);
  request.send(null);
}

function handleResponse(request, responseHandler) {
  if (request.readyState == 4 && request.status == 200) {
    console.log(request);
    responseHandler(request);
  }
}

(function (global) {
  var homeHtml = "snippets/home-main.html";
  var dc = {};

  var insertHtml = function (selector, html) {
    var target = document.querySelector(selector);
    target.innerHTML = html;
  };

  var showLoading = function (selector) {
    var html = "<div class='text-center'>";
    html += "<img src='img/ajax-loader.gif'>";
    html += "</div>";
    insertHtml(selector, html);
  };

  document.addEventListener("DOMContentLoaded", function (event) {
    showLoading("#main");

    sendGetRequest(homeHtml, function (request) {
      document.querySelector("#main").innerHTML = request.responseText;
    });
  });
})(window);