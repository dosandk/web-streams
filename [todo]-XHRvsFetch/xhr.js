const xhrRequest = url => {
  const xhr = new XMLHttpRequest();

  xhr.open('GET', url);
  xhr.responseType = 'json';

  xhr.onload = () => console.log(xhr.response);
  xhr.onerror = () => console.error('Error');

  xhr.send();
};

export default xhrRequest;
