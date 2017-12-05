const xhr = {
  makeRequest (url) {
    this.xhr = new XMLHttpRequest();

    this.xhr.open('GET', url);
    this.xhr.responseType = 'json';

    this.xhr.onload = () => console.log(xhr.response);
    this.xhr.onerror = () => console.error('Error');

    this.xhr.send();
  },
  abortRequest() {
    this.xhr.abort();
  }
};
