import web3 from './web3';
import SmartDot from './build/Smartdot.json';
//const instance = 0;

const instance = new web3.eth.Contract(
    SmartDot.abi,
    '0x007ea1f740dc4b0b1ec0333f5ef645ce0df55bcf'
);

export default instance;