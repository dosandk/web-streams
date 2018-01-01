const $fill = document.getElementById('progress-fill');
const $percentValue = document.getElementById('percent-value');
const $requestBtn = document.getElementById('request');
const $cancelBtn = document.getElementById('cancel');

const request = {
  async makeRequest () {
    const url = 'https://upload.wikimedia.org/wikipedia/commons/1/1f/Cosmic_%E2%80%98Winter%E2%80%99_Wonderland.jpg';
    const response = await fetch(url);
    this.reader = response.body.getReader();
    const contentLength = response.headers.get('Content-Length');

    this.disableRequestBtn();
    this.enableCancelBtn();

    async function read (reader, received = 0) {
      const {value = {}, done} = await reader.read();
      const {length} = value;
      received += length;
      const width = `${Math.round(received / contentLength * 100)}%`;

      if (done) {
        request.progressAnimationId = requestAnimationFrame(() => {
          $fill.style.background = 'green';
          request.disableCancelBtn();
          document.body.style.backgroundImage = `url(${url})`;
        });
        return;
      }

      if ($fill.style.width !== width) {
        requestAnimationFrame(() => {
          $percentValue.innerText = width;
          $fill.style.width =  width;
        });
      }

      read(reader, received);
    }

    read(this.reader);
  },

  enableCancelBtn() {
    $cancelBtn.removeAttribute('disabled');
    $cancelBtn.classList.remove('disabled');
  },

  disableCancelBtn() {
    $cancelBtn.setAttribute('disabled', 'disabled');
    $cancelBtn.classList.add('disabled');
  },

  disableRequestBtn () {
    $requestBtn.setAttribute('disabled', 'disabled');
    $requestBtn.classList.add('disabled');
  },

  async abortRequest () {
    if (this.reader) {
      await this.reader.cancel();
      cancelAnimationFrame(this.progressAnimationId);
      this.disableCancelBtn();
    }
  }
};
