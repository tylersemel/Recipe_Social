const API_BASE = '/api/v1/';

const HTTPClient = {
    get: (url) => {
      return fetch(API_BASE + url).
      then(res => {
        if (res.ok) {
          return res.json();
        }
        throw new Error('Network response was not ok.');
      }).
      then(obj => {
        console.log(obj);
        return obj;
      }).
      catch(err => console.log(err));
    }
  };

export default {
    getAccount: (username) => {
        return HTTPClient.get('account/' + username);
    }
}