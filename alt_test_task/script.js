var button = document.querySelector(".btn");
var list = document.getElementById('list');
var input  = document.querySelector("input");

button.addEventListener("click", function() {
    if(input.value != '') {
        if ( /[^a-zA-Z]/.test(input.value)) {
            var li = document.createElement('li');
            li.innerText= input.value ;
            var btnx = document.createElement('button');
            btnx.innerText = 'x';
            list.appendChild(li);
            li.appendChild(btnx);

            btnx.addEventListener("click", function(){
                delel = btnx.parentNode;
                delel.parentNode.removeChild(delel);
            })




            input.value = '';
        }else {
            var li = document.createElement('li');
            li.innerText= input.value ;
            list.appendChild(li);
            input.value = '';
        }


    }
});