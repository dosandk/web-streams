const fetchRequest = url => fetch(url)
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error: ', error));

export default fetchRequest;
