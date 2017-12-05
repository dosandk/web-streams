const fetchWrapper = {
  async makeRequest (url) {
    const response = await fetch(url);
    this.reader = response.body.getReader();
  },
  cancelRequest() {
    this.reader.cancel();
  }
};
