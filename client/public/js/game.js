var socket = io();
const urlSearchParams = new URLSearchParams(window.location.search);
const params = Object.fromEntries(urlSearchParams.entries());


window.onload = () => {
    const div_enter_name = document.querySelector('#div_enter_name');
    let userIsHost = false;
    // TODO: check if userIsHost
    if (userIsHost) {
        div_enter_name.classList.toggle('fade');
        setTimeout(() => {
            div_enter_name.classList.add('hidden');
        }, 1000);    
    }
    
}