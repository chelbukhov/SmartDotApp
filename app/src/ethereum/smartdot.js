import web3 from './web3';
import SmartDot from './build/Smartdot.json';
//const instance = 0;
//const address = '0x007ea1f740dc4b0b1ec0333f5ef645ce0df55bcf'; //ver 1.2
//const address = '0x2AD1c8d71a0370D16AA4870B3F7741ABf1a2F38b'; //ver 1.3 Mumbai testnet
//const address = '0x7Cd66c5FF626640297132f0A608eB62fF5B35915'; //ver 0.9.3 BSC testnet
const address = '0x3d4d78223f70ee4593f1f40dd68c6d08ecbe401d'; //ver 0.9.5 BSC testnet
const instance = new web3.eth.Contract(
    SmartDot.abi,
    address
);

export default instance;