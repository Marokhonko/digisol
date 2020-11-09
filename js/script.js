"use strict";

function testWebP(callback) {
  var webP = new Image();

  webP.onload = webP.onerror = function () {
    callback(webP.height == 2);
  };

  webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
}

testWebP(function (support) {
  if (support == true) {
    document.querySelector('body').classList.add('webp');
  } else {
    document.querySelector('body').classList.add('no-webp');
  }
});

(function () {
  var btnShow = document.querySelectorAll('.show-info');
  var btnClose = document.querySelectorAll('.close');
  var show = document.querySelectorAll('.hidden-info');
  btnShow.forEach(function (item, index) {
    item.addEventListener('click', function () {
      show[index].classList.toggle('is-open');
    });
  });
  btnClose.forEach(function (item, index) {
    item.addEventListener('click', function () {
      show[index].classList.toggle('is-open');
    });
  });
})();