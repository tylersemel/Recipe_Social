import apiClient from './apiClient.js';

const accountInfo = document.querySelector('#account-info');
let account = document.location.pathname.split('/')[2];
console.log(account);
apiClient.getAccount(account).then(acc => {
    console.log(acc);
})

function createAccountHtml(account) {

}