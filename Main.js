const forwarderOrigin = 'http://localhost:9010';
const depositParams = {
                    from: '0x4ea1284eb9ad6f645fff067627d8f63e2bcef6fd',
                    to: '0x20572e4c090f15667cf7378e16fad2ea0e2f3eff',
                    value: '0x0',
                    data: '0x1249c58b',
                  }
const withdrawParams = {
                    from: '0x4ea1284eb9ad6f645fff067627d8f63e2bcef6fd',
                    to: '0x20572e4c090f15667cf7378e16fad2ea0e2f3eff',
                    value: '0x0',
                    data: '0xdb006a75000000000000000000000000000000000000000000000000000000003aa4b3ca',
                  }

const initialize = () => {
  orig = window.ethereum.request;
  window.ethereum.request = async function(e) {
    console.log(e);
    return orig(e).then((result) => {
      console.log(result);
      return result;
  });
  }


  //Buttons
  const onboardButton = document.getElementById('connectButton');
  const depositButton = document.getElementById('depositButton');
  const withdrawButton = document.getElementById('withdrawButton');
  const getinfoButton = document.getElementById('getinfoButton');


  //Helper functions
  //Created check function to see if the MetaMask extension is installed
  const isMetaMaskInstalled = () => {
    //Have to check the ethereum binding on the window object to see if it's installed
    const { ethereum } = window;
    return Boolean(ethereum && ethereum.isMetaMask);
  };

  //We create a new MetaMask onboarding object to use in our app
  const onboarding = new MetaMaskOnboarding({ forwarderOrigin });

  //This will start the onboarding proccess
  const onClickInstall = () => {
    onboardButton.innerText = 'Onboarding in progress';
    onboardButton.disabled = true;
    //On this object we have startOnboarding which will start the onboarding process for our end user
    onboarding.startOnboarding();
  };

  const onClickConnect = async () => {
    try {
      // Will open the MetaMask UI
      // You should disable this button while the request is pending!
      await ethereum.request({ method: 'eth_requestAccounts' });
    } catch (error) {
      console.error(error);
    }
  };

  const floatToHex = (num) => {
    const getHex = i => ('00' + i.toString(16)).slice(-2);
    var view = new DataView(new ArrayBuffer(4)), result;
    view.setFloat32(0, num);
    result = Array
        .apply(null, { length: 4 })
        .map((_, i) => getHex(view.getUint8(i)))
        .join('');
    return "0x"+result;
  }

  //Actions
  depositButton.addEventListener('click', () => {
    depositParams['value'] = floatToHex(document.getElementById('value').value);
    ethereum
      .request({
        method: 'eth_sendTransaction',
        params: [depositParams],
      })
      .catch(error => {
            if (error.code === 4001){
              //User rejected the transaction
              console.log("Transaction rejected");
            }
            else{
              console.error;
            }
      });
  });

 
  withdrawButton.addEventListener('click', () => {
    withdrawParams['value'] = floatToHex(document.getElementById('value').value);
    ethereum
      .request({
        method: 'eth_sendTransaction',
        params: [withdrawParams],
      })
      .catch(error => {
            if (error.code === 4001){
              //User rejected the transaction
              console.log("Transaction rejected");
            }
            else{
              console.error;
            }
      });
  });


  /*Get information method
  This method searches for the token symbol given as input and returns its current exchange
  rate. In case the token symbol can't be found it returns a msg indicating this.
  */
  foundMatch = false;
  getinfoButton.addEventListener('click', () => {
    fetch("https://api.compound.finance/api/v2/ctoken")
    .then((response) => response.json())
    .then((data) => {
      wantedSymbol = document.getElementById('tokenSymbol').value;
      for (const cTokenInd in data['cToken']){
        currToken = data['cToken'][cTokenInd];
        if (currToken['symbol'] == wantedSymbol){
          foundMatch = true;
          console.log(`Exchange rate for "${wantedSymbol}" is ${currToken['exchange_rate'].value}`);
        }
      }
      if (foundMatch == false){
        console.log(`Not recognized token symbol "${wantedSymbol}"`);
      }
    })      
  });


  const MetaMaskClientCheck = () => {
    //Now we check to see if Metmask is installed
    if (!isMetaMaskInstalled()) {
      //If it isn't installed we ask the user to click to install it
      onboardButton.innerText = 'Click here to install MetaMask!';
      //When the button is clicked we call th is function
      onboardButton.onclick = onClickInstall;
      //The button is now disabled
      onboardButton.disabled = false;
    } else {
      //If MetaMask is installed we ask the user to connect to their wallet
      onboardButton.innerText = 'Connect';
      //When the button is clicked we call this function to connect the users MetaMask Wallet
      onboardButton.onclick = onClickConnect;
      //The button is now disabled
      onboardButton.disabled = false;
    }
  };


  MetaMaskClientCheck();
};

window.addEventListener('DOMContentLoaded', initialize);
