const $fill = document.getElementById('progress-fill');
const $percentValue = document.getElementById('percent-value');
const $requestBtn = document.getElementById('request');
const $cancelBtn = document.getElementById('cancel');

const request = {
  async makeRequest () {
    const url = 'https://upload.wikimedia.org/wikipedia/commons/5/5e/Indian-lion-zoo-thrichur.jpg';
    const response = await fetch(url);
    this.reader = response.body.getReader();
    const contentLength = response.headers.get('Content-Length');

    $requestBtn.setAttribute('disabled', 'disabled');
    $requestBtn.classList.add('disabled');
    $cancelBtn.classList.remove('disabled');
    $cancelBtn.removeAttribute('disabled');


    async function read (reader, received = 0) {
      const {value = {}, done} = await reader.read();
      const {length} = value;
      received += length;
      const width = `${Math.round(received / contentLength * 100)}%`;

      if (done) {
        return requestAnimationFrame(() => {
          $fill.style.background = 'green';
          $cancelBtn.setAttribute('disabled', 'disabled');
          $cancelBtn.classList.add('disabled');
          document.body.style.backgroundImage = `url(${url})`;
        });
      }

      requestAnimationFrame(() => {
        if ($fill.style.width !== width) {
          console.error('width', width);

          $percentValue.innerText = width;
          $fill.style.width =  width;
        }
      });

      read(reader, received);
    }

    read(this.reader);
  },

  abortRequest () {
    if (this.reader) {
      this.reader.cancel();
    }
  }
};
