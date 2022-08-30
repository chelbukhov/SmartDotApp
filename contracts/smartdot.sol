// SPDX-License-Identifier: MIT

/**
 * Token SmartDot (SDOT) created for project https://smartdot.xyz
 * The token is not intended for investment.
 * This is a technical token that will serve as a pass to use the project's application family.
 * 
 * However, if you want to help the development of the project financially, 
 * you can receive a certain amount of tokens. 
 * To do this, you just need to send any number of coins MATIC to the address of this smart contract. 
 * In response, the smart contract will credit your address with the appropriate number of tokens in a 1:1 ratio.
 * 
 * Together we make the world a better place.
 */

// Smartdot version 0.9.6
// 30.08.2022 Alex Production

pragma solidity >=0.7.0 <0.9.0;


abstract contract Context {
    function _msgSender() internal view virtual returns (address) {
        return msg.sender;
    }

    function _msgData() internal view virtual returns (bytes calldata) {
        this; // silence state mutability warning without generating bytecode - see https://github.com/ethereum/solidity/issues/2691
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


interface IERC20 {
    function totalSupply() external view returns (uint256);

    function balanceOf(address account) external view returns (uint256);

    function transfer(address recipient, uint256 amount) external returns (bool);

    function allowance(address owner, address spender) external view returns (uint256);

    function approve(address spender, uint256 amount) external returns (bool);

    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);

    event Transfer(address indexed from, address indexed to, uint256 value);

    event Approval(address indexed owner, address indexed spender, uint256 value);
}


contract ERC20 is Context, IERC20 {
    mapping (address => uint256) private _balances;

    mapping (address => mapping (address => uint256)) private _allowances;

    uint256 private _totalSupply;

    string private _name;
    string private _symbol;

    constructor (string memory name_, string memory symbol_) {
        _name = name_;
        _symbol = symbol_;
    }

    function name() public view virtual returns (string memory) {
        return _name;
    }

    function symbol() public view virtual returns (string memory) {
        return _symbol;
    }

    function decimals() public view virtual returns (uint8) {
        return 18;
    }

    function totalSupply() public view virtual override returns (uint256) {
        return _totalSupply;
    }

    function balanceOf(address account) public view virtual override returns (uint256) {
        return _balances[account];
    }

    function transfer(address recipient, uint256 amount) public virtual override returns (bool) {
        _transfer(_msgSender(), recipient, amount);
        return true;
    }

    function allowance(address owner, address spender) public view virtual override returns (uint256) {
        return _allowances[owner][spender];
    }

    function approve(address spender, uint256 amount) public virtual override returns (bool) {
        _approve(_msgSender(), spender, amount);
        return true;
    }

    function transferFrom(address sender, address recipient, uint256 amount) public virtual override returns (bool) {
        _transfer(sender, recipient, amount);

        uint256 currentAllowance = _allowances[sender][_msgSender()];
        require(currentAllowance >= amount, "ERC20: transfer amount exceeds allowance");
        _approve(sender, _msgSender(), currentAllowance - amount);

        return true;
    }

    function increaseAllowance(address spender, uint256 addedValue) public virtual returns (bool) {
        _approve(_msgSender(), spender, _allowances[_msgSender()][spender] + addedValue);
        return true;
    }

    function decreaseAllowance(address spender, uint256 subtractedValue) public virtual returns (bool) {
        uint256 currentAllowance = _allowances[_msgSender()][spender];
        require(currentAllowance >= subtractedValue, "ERC20: decreased allowance below zero");
        _approve(_msgSender(), spender, currentAllowance - subtractedValue);

        return true;
    }
      function _transfer(address sender, address recipient, uint256 amount) internal virtual {
        require(sender != address(0), "ERC20: transfer from the zero address");
        require(recipient != address(0), "ERC20: transfer to the zero address");

        _beforeTokenTransfer(sender, recipient, amount);

        uint256 senderBalance = _balances[sender];
        require(senderBalance >= amount, "ERC20: transfer amount exceeds balance");
        _balances[sender] = senderBalance - amount;
        _balances[recipient] += amount;

        emit Transfer(sender, recipient, amount);
    }

    function _mint(address account, uint256 amount) internal virtual {
        require(account != address(0), "ERC20: mint to the zero address");

        _beforeTokenTransfer(address(0), account, amount);

        _totalSupply += amount;
        _balances[account] += amount;
        emit Transfer(address(0), account, amount);
    }

    function _burn(address account, uint256 amount) internal virtual {
        require(account != address(0), "ERC20: burn from the zero address");

        _beforeTokenTransfer(account, address(0), amount);

        uint256 accountBalance = _balances[account];
        require(accountBalance >= amount, "ERC20: burn amount exceeds balance");
        _balances[account] = accountBalance - amount;
        _totalSupply -= amount;

        emit Transfer(account, address(0), amount);
    }

    function _approve(address owner, address spender, uint256 amount) internal virtual {
        require(owner != address(0), "ERC20: approve from the zero address");
        require(spender != address(0), "ERC20: approve to the zero address");

        _allowances[owner][spender] = amount;
        emit Approval(owner, spender, amount);
    }

    function _beforeTokenTransfer(address from, address to, uint256 amount) internal virtual { }
}


contract MyToken is ERC20, Ownable {
    event Withdraw(address, uint256);
    address myAddress = address(this);
    mapping (address => uint) private whitelist;
    uint public endDate = 1672531200; //1 January 2023
    constructor() ERC20("SmartDot", "SDOT") {

    }

    function addToWhiteList (address investor, uint amount) internal {
        if (block.timestamp <= endDate) {
            whitelist[investor] += amount;
        }
    }

    function isInvestor(address investor) public view returns (uint) {
        return whitelist[investor];
    }

    receive() external payable {
        addToWhiteList(msg.sender, msg.value);
        _mint(_msgSender(), msg.value);
    }

    fallback() external payable {
        addToWhiteList(msg.sender, msg.value);
        _mint(_msgSender(), msg.value);
    }

    function withdraw (uint _value) public onlyOwner {
        address payable to = payable(owner());
        require (myAddress.balance >= _value,"Value is more than balance");
        to.transfer(_value);
        emit Withdraw(_msgSender(), _value);

    }
}


interface Items {
    struct Item {
        uint collectionID;
        string nameItem;
        string ipfsCID;
        string ipfsFileName;
        string description;
        uint blockNumber;
        uint createDate;
        int latitude;
        int longitude;
        bool isActive;

    }
}



contract Smartdot is Ownable, Items {
    
    event AddUsers(address indexed newUser);

    uint private totalItems;
    MyToken private token;
    address payable public tokenAdress;
    // first address - owner
    // second address - personal collection contract for this owner
    mapping(address => address) public mapCollections;
    
    mapping(address => bool) public mapContracts;

    //uint - itemID
    //address contract collections where stored item with itemID
    mapping(uint => address) public itemsContract;  

    modifier onlyContract() {
        require(mapContracts[msg.sender]==true, "Caller is not the collection contract");
        _;
    }
/*
    constructor (){
        token = new MyToken();
        totalItems = 0;
    }
*/
    constructor (address payable _tokenAddress){
        tokenAdress = _tokenAddress;
        token = MyToken(tokenAdress);
        totalItems = 0;
    }

    function showYourBalance() public view returns (uint) {
        return token.balanceOf(msg.sender);
    }

    function isInvestor() public view returns (uint) {
        return token.isInvestor(msg.sender);
    }

    function getTotalItems() public view returns (uint) {
        return totalItems;
    }

    function incTotalItems() public onlyContract {
        itemsContract[totalItems] = _msgSender();
        totalItems ++;
    }

    function newUser() public returns (bool){
        require(mapCollections[msg.sender] == address(0), "You are alredy have a contract");
        address newContract = address(new Collections(msg.sender, address(this)));
        mapContracts[newContract]=true;
        mapCollections[msg.sender]=newContract;
        emit AddUsers(msg.sender);
        return true;
    }

    function showContract() public view returns (address) {
        return mapCollections[msg.sender];
    }

    function showItem(uint itemID) public view returns (Item memory) {
        Collections contractCollections = Collections(itemsContract[itemID]); 
        return contractCollections.showItem(itemID);
    }

    function destructContract() public onlyOwner {
        address payable to = payable(owner());
        selfdestruct(to);
    }


}


contract Collections is Items {


    event AddItems(int indexed latitude, int indexed longitude, address indexed owner, uint itemID);
    event AddRecord(uint indexed parentID, uint dateCreation, string description);
    mapping (uint => Item) public mapItems;

    address public owner ;

    Smartdot mainContract;

    struct Record {
        uint parentID;
        uint blockNumber;
    }

    Record [] records;      //array of additional record contains block number event
    uint [] public items;   //array storage globalID of items for search it in mapping mapItems
    string [] public collections;
    int public geoMultiplier = 10**15; // for storage geotags in integer type of data

    modifier onlyOwner() {
        require(owner == msg.sender || address(mainContract) == msg.sender, "Caller is not the owner");
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

    function setItemIsActive (uint itemID, bool isActive) public onlyOwner {
        mapItems[itemID].isActive = isActive;
    }

    function addItem(uint collectionID, string memory nameItem, string memory ipfsCID, string memory ipfsFileName, string memory description, int latitude, int longitude) public onlyOwner returns (bool) {
        Item memory tempData = Item({
            collectionID: collectionID,
            nameItem: nameItem,
            ipfsCID: ipfsCID,
            ipfsFileName: ipfsFileName,
            description: description,
            blockNumber: block.number,
            createDate: block.timestamp,
            latitude: latitude,
            longitude: longitude,
            isActive: true
        });
        uint resultID = mainContract.getTotalItems();
        mapItems[resultID]=tempData;
        mainContract.incTotalItems();
        items.push(resultID);
        emit AddItems(latitude, longitude, msg.sender, resultID);
        return true;
    }

    function changeCollection(uint itemID, uint newCollectionID) public onlyOwner returns (bool) {
        mapItems[itemID].collectionID = newCollectionID;
        return true;
    }

    function addRecord(uint parentID, uint dateCreation, string memory description) public onlyOwner returns(bool) {
        Record memory tempData = Record ({
            parentID: parentID,
            blockNumber: block.number
        });
        emit AddRecord(parentID, dateCreation, description);
        records.push(tempData);
        return true;
    }

    function showItemsAmount() public view returns (uint) {
        return items.length;
    }

    function showCollectionsAmount() public view returns (uint) {
        return collections.length;
    }

    function showRecordsAmount() public view returns (uint) {
        return records.length;
    }

    function showAllRecords() public view returns (Record [] memory) {
        return records;
    }

    function findRecords(uint parentID) public view returns (uint [] memory) {
        uint [] memory tempData = new uint[](records.length);
        uint count = 0;
        for (uint i = 0; i < records.length; i ++){
            if (records[i].parentID == parentID) {
                tempData[count] = records[i].blockNumber;
                count ++;
            }
        }
        return tempData;
    }

    function showItem(uint itemID) public view returns (Item memory) {
        return mapItems[itemID];
    }

    function showCollectionName(uint collectionID) public view returns (string memory) {
        return collections[collectionID];
    }

}

