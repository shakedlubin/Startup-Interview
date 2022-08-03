const forwarderOrigin = 'http://localhost:9010';
const txParams = {
                    from: '0x4ea1284eb9ad6f645fff067627d8f63e2bcef6fd',
                    to: '0x20572e4c090f15667cf7378e16fad2ea0e2f3eff',
                    value: '0x0000',
                    data: '0x1249c58b',
                  }

const initialize = () => {
  //Buttons
  const depositButton = document.getElementById('depositButton');
  const withdrawButton = document.getElementById('withdrawButton');
  const getinfoButton = document.getElementById('getinfoButton');

  //Actions
  depositButton.addEventListener('click', () => {
    ethereum
      .request({
        method: 'eth_sendTransaction',
        params: [txParams],
      })
      .then((txHash) => console.log(txHash))
      .catch((error) => console.error);
  });

  withdrawButton.addEventListener('click', () => {
    ethereum
      .request({
        method: 'eth_sendTransaction',
        params: [txParams],
      })
  });

  getinfoButton.addEventListener('click', () => {
    ethereum
      .request({
        method: 'eth_getBalance',
        params: [txParams],
      })
  });

};

window.addEventListener('DOMContentLoaded', initialize);
