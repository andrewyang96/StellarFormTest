(function() {
  var getSequenceNumber = function (publicKey, cb) {
    var server = new StellarSdk.Server('https://horizon-testnet.stellar.org');
    server.loadAccount(publicKey).then(function (result) {
      cb(result.sequenceNumber());
    });
  };

  document.getElementById('form').onsubmit = function (e) {
    e.preventDefault();
    var destinationAddress = this.querySelector('[name=destination]').value;
    var amount = this.querySelector('[name=amount]').value;
    var memoText = this.querySelector('[name=memo]').value || null;
    var sourceSeed = this.querySelector('[name=sourceSeed]').value;

    // Build transaction
    StellarSdk.Network.useTestNetwork();
    getSequenceNumber(destinationAddress, function (sequenceNumber) {
      var account = new StellarSdk.Account(destinationAddress, sequenceNumber);
      var memo = memoText ? StellarSdk.Memo.text(memoText) : StellarSdk.Memo.none();
      var transaction = new TransactionBuilder(account, {memo: memo})
        .addOperation(StellarSdk.Operation.payment({
            destination: destinationAddress,
            asset: StellarBase.Asset.native(),
            amount: amount
          }))
        .build();
      // TODO: sign
    });
  };
})();
