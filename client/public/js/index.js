// var socket = io();
window.onload = () => {
    const txt_name = document.querySelector('#txt_name');
    const btn_create = document.querySelector('#btn_create');
    const dd_settings = document.querySelector('#dd_settings');

    txt_name.addEventListener('keyup', (e) => {
        if (e.isComposing || e.keyCode === 229) {
            return;
        }
        // Enter key is pressed for the name input
        // This should fire an event to obtain uuid and save in local storage as well as DB
        if (e.keyCode === 13) {
            axios.post('/users', { 'name': txt_name.value.trim() }).then((res) => {
                window.localStorage.setItem('currentUser', JSON.stringify(res.data));
            });
        }
    });

    btn_create.addEventListener('click', (e) => {
        let currentUser = window.localStorage.getItem('currentUser');
        if (typeof (currentUser) !== 'undefined') {
            let user = JSON.parse(currentUser);
            axios.post('/games', {
                'user': user,
                'settings': dd_settings.value
            }).then((res) => {
                // TODO: redirect to game page with link /game/:gameid
            });
        }
    });
}