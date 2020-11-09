function testWebP(callback) {

    let webP = new Image();
    webP.onload = webP.onerror = function () {
    callback(webP.height == 2);
    };
    webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
    }
    testWebP(function (support) {
    if (support == true) {
    document.querySelector('body').classList.add('webp');
    }else{
    document.querySelector('body').classList.add('no-webp');
    }
    });


 
(() => {
    const btnShow = document.querySelectorAll('.show-info');
    const btnClose = document.querySelectorAll('.close');
    const show = document.querySelectorAll('.hidden-info');
    btnShow.forEach((item,index) => {
        item.addEventListener('click', () => {
               show[index].classList.toggle('is-open');
           });
       });
       btnClose.forEach((item,index) => {
        item.addEventListener('click', () => {
               show[index].classList.toggle('is-open');
           });
       });
  })();

 



     