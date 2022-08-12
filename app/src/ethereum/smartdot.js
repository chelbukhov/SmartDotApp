import web3 from './web3';
import SmartDot from './build/Smartdot.json';
//const instance = 0;
//const address = '0x007ea1f740dc4b0b1ec0333f5ef645ce0df55bcf'; //ver 1.2
const address = '0x2AD1c8d71a0370D16AA4870B3F7741ABf1a2F38b'; //ver 1.3
const instance = new web3.eth.Contract(
    SmartDot.abi,
    address
);

export default instance;