// SPDX-License-Identifier: MIT
// Smartdot version 1.0.0 
// 18.07.2022 Chelbukhov A.

pragma solidity >=0.7.0 <0.9.0;


abstract contract Context {
    function _msgSender() internal view virtual returns (address) {
        return msg.sender;
    }

    function _msgData() internal view virtual returns (bytes calldata) {
        return msg.data;
    }
}

abstract contract Ownable is Context {
    address private _owner;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    /**
     * @dev Initializes the contract setting the deployer as the initial owner.
     */
    constructor() {
        _transferOwnership(_msgSender());
    }

    /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyOwner() {
        _checkOwner();
        _;
    }

    /**
     * @dev Returns the address of the current owner.
     */
    function owner() public view virtual returns (address) {
        return _owner;
    }

    /**
     * @dev Throws if the sender is not the owner.
     */
    function _checkOwner() internal view virtual {
        require(owner() == _msgSender(), "Ownable: caller is not the owner");
    }


    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * Can only be called by the current owner.
     */
    function transferOwnership(address newOwner) public virtual onlyOwner {
        require(newOwner != address(0), "Ownable: new owner is the zero address");
        _transferOwnership(newOwner);
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * Internal function without access restriction.
     */
    function _transferOwnership(address newOwner) internal virtual {
        address oldOwner = _owner;
        _owner = newOwner;
        emit OwnershipTransferred(oldOwner, newOwner);
    }
}


interface Items {
    struct Item {
        address ownerAddress;
        uint collectionID;
        string nameItem;
        string ipfsCID;
        string description;
    }
}


contract Smartdot is Ownable, Items {
    
    event addUsers(address indexed newUser);
    event addItems(address indexed owner, uint indexed itemID);

    uint public totalItems;
    
    // first address - owner
    // second address - personal collection contract for this owner
    mapping(address => address) public mapCollections;
    
    mapping(address => bool) public mapContracts;

    mapping (uint => Item) public items;

    modifier onlyContract() {
        require(mapContracts[msg.sender]==true, "Caller is not the collection contract");
        _;
    }

    constructor (){
        totalItems = 0;
    }

    function newUser() public returns (bool){
        require(mapCollections[msg.sender] == address(0), "You are alredy have a contract");
        address newContract = address(new Collections(msg.sender, address(this)));
        mapContracts[newContract]=true;
        mapCollections[msg.sender]=newContract;
        emit addUsers(msg.sender);
        return true;
    }

    function showContract() public view returns (address) {
        return mapCollections[msg.sender];
    }


    function addItem(uint collectionID, string memory nameItem, string memory ipfsCID, string memory description) public onlyContract returns (uint resultID) {
        Item memory tempData = Item({
            ownerAddress: address(msg.sender),
            collectionID: collectionID,
            nameItem: nameItem,
            ipfsCID: ipfsCID,
            description: description
        });
        items[totalItems]=tempData;
        resultID = totalItems;
        totalItems += 1;
        emit addItems(msg.sender, resultID);
        return resultID;
    }

    function showItem(uint itemID) public view returns (Item memory) {
        return items[itemID];
    }


}


contract Collections is Items {

    address public owner ;

    Smartdot mainContract;

    uint [] public items;    // uint - ID token from main contract mapping

    string [] public collections;

    modifier onlyOwner() {
        require(owner == msg.sender, "Caller is not the owner");
        _;
    }

    constructor(address ownerAddress, address smartdot) {
        owner = ownerAddress;
        mainContract = Smartdot(smartdot);
    }

    function addCollection(string memory nameCollection) public onlyOwner returns (bool) {
        collections.push(nameCollection);
        return true;
    }

    function addItem(uint collectionID, string memory nameItem, string memory ipfsCID, string memory description) public onlyOwner returns(uint) {
        uint resultID = mainContract.addItem(collectionID, nameItem, ipfsCID, description);
        items.push(resultID);
        return resultID;
    }

    function showItemsAmount() public view onlyOwner returns (uint) {
        return items.length;
    }

    function showCollectionsAmount() public view returns (uint) {
        return collections.length;
    }

    /*
        dev 
        param itemID - index of local array items[]
        return index in mapping items in main contract
    */
    function showItemMainID(uint itemID) internal view returns (uint) {
        return items[itemID];
    }

    function showItem(uint itemID) public view onlyOwner returns (Item memory) {
        uint globalID = showItemMainID(itemID);
        return mainContract.showItem(globalID);
    }

    function showCollectionName(uint collectionID) public view returns (string memory) {
        return collections[collectionID];
    }

}




