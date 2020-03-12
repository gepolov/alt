var button = document.querySelector(".btn");
var list = document.getElementById('list');
var input  = document.querySelector("input");

button.addEventListener("click", function() {
    if(input.value != '') {
        var li = document.createElement('li');
        li.innerText= input.value ;
        list.appendChild(li);
        input.value = '';

    }
});
