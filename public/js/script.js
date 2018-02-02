(function() {
  document.getElementById('form').onsubmit = function (e) {
    e.preventDefault();
    var destinationAddress = this.querySelector('[name=destination]').value;
    var amount = this.querySelector('[name=amount]').value;
    var sourceSeed = this.querySelector('[name=sourceSeed]').value;
  };
})();
