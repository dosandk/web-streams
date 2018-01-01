const $fill = document.getElementById('progress-fill');
const $percentValue = document.getElementById('percent-value');
const $requestBtn = document.getElementById('request');
const $cancelBtn = document.getElementById('cancel');

const $toggleRequestTypeBtn = document.getElementById('toggle-request-type-btn');
const $progressControls = document.getElementById('progress-controls');
const $urlInput = document.getElementById('url-input');

$toggleRequestTypeBtn.addEventListener('click', () => {
  $progressControls.classList.toggle('hide');
});

const request = {
  get url () {
    return $urlInput.value;
  },

  async makeRequest () {
    const {checked} = $toggleRequestTypeBtn;
    checked ? this.requestWithProgress() : this.basicRequest();
  },

  async basicRequest () {
    const response = await fetch(this.url);
    const blobData = await response.blob();

    this.showLoadedImg(blobData);
  },

  async requestWithProgress () {
    const chunksArr = [];
    const response = await fetch(this.url);
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
        const blobData = new Blob([concatenate(Uint8Array, ...chunksArr)]);
        return request.finishProgress(blobData);
      }

      chunksArr.push(value);

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

  finishProgress (blob) {
    this.progressAnimationId = requestAnimationFrame(() => {
      $fill.style.background = 'green';
      request.disableCancelBtn();
      this.showLoadedImg(blob);
    });
  },

  showLoadedImg (blob) {
    const imageUrl = window.URL.createObjectURL(blob);
    document.body.style.backgroundImage = `url(${imageUrl})`;
  },

  async abortRequest () {
    if (this.reader) {
      await this.reader.cancel();
      cancelAnimationFrame(this.progressAnimationId);
      this.disableCancelBtn();
    }
  }
};

function concatenate (resultConstructor, ...arrays) {
  let totalLength = 0;
  for (let arr of arrays) {
    totalLength += arr.length;
  }
  let result = new resultConstructor(totalLength);
  let offset = 0;
  for (let arr of arrays) {
    result.set(arr, offset);
    offset += arr.length;
  }
  return result;
}
