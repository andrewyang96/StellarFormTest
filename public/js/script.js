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
      var transaction = new StellarSdk.TransactionBuilder(account, {memo: memo})
        .addOperation(StellarSdk.Operation.payment({
            destination: destinationAddress,
            asset: StellarSdk.Asset.native(),
            amount: amount
          }))
        .build();

      // Sign transaction
      var sourceKeypair = StellarSdk.Keypair.fromSecret(sourceSeed);
      transaction.sign(sourceKeypair);

      // Send transaction XDR
      var xdr = transaction.toEnvelope().toXDR('base64');
      fetch('/transactions', {
        method: 'POST',
        body: JSON.stringify({xdr: xdr}),
        headers: new Headers({'Content-Type': 'application/json'})
      }).then(function (res) {
        return res.json();
      }).then(function (res) {
        console.log(res);
      }).catch(function (err) {
        console.log('Error: ' + err);
      });
    });
  };
})();
