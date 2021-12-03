// var socket = io();
document.addEventListener('DOMContentLoaded', function () {
    var elems = document.querySelectorAll('select');
    var instances = M.FormSelect.init(elems, {
        // specify options here
    });
});

window.onload = () => {
    const txt_name = document.querySelector('#txt_name');
    const btn_create = document.querySelector('#btn_create');
    const dd_settings = document.querySelector('#dd_settings');
    let hidden_menu_items = document.querySelectorAll('.hiddenmenu');

    txt_name.addEventListener('keyup', (e) => {
        if (e.isComposing || e.keyCode === 229) {
            return;
        }
        if (e.keyCode === 13) {
            axios.post('/users', { 'name': txt_name.value.trim() }).then((res) => {
                window.localStorage.setItem('currentUser', JSON.stringify(res.data));
                for (let i = 0; i < hidden_menu_items.length; i++) {
                    hidden_menu_items[i].classList.remove('fade');
                }                
            });
        }
    });

    btn_create.addEventListener('click', (e) => {
        // TODO: add some validation here perhaps?
        let currentUser = window.localStorage.getItem('currentUser');
        if (typeof (currentUser) !== 'undefined') {
            let user = JSON.parse(currentUser);
            axios.post('/games', {
                'user': user,
                'settings': dd_settings.value
            }).then((res) => {
                if (res.data.id) {
                    window.location.replace(`./game?gameid=${res.data.id}`)
                }                
            });
        }
    });
}