// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract UserRegistry {
    struct User {
        string userId;
        address walletAddress;
        bool isAdmin;
    }

    struct AssetTransfer {
        address previousOwner;
        address newOwner;
        uint256 transferTime;
        bool isRecalled;
    }

    mapping(address => User) private users;
    mapping(string => address) private userIdToAddress;
    mapping(address => bool) private admins;
    mapping(address => AssetTransfer[]) private transferHistory;

    address public immutable poaAdmin;

    event UserRegistered(string userId, address walletAddress, bool isAdmin);
    event AdminAdded(address indexed admin);
    event AdminRemoved(address indexed admin);
    event AssetsTransferred(address indexed from, address indexed to);
    event AssetRecalled(address indexed from, address indexed recalledBy);

    modifier onlyAdmin() {
        require(admins[msg.sender], "Access Denied: Only admins can perform this action.");
        _;
    }

    modifier onlyPoaAdmin() {
        require(msg.sender == poaAdmin, "Access Denied: Only the PoA admin can remove admins.");
        _;
    }

    constructor() {
        poaAdmin = msg.sender;
        admins[msg.sender] = true;
        users[msg.sender] = User("admin", msg.sender, true);
        emit AdminAdded(msg.sender);
    }

    function registerUser(string memory _userId, address _walletAddress, bool _isAdmin) public onlyAdmin {
        require(users[_walletAddress].walletAddress == address(0), "Error: User already exists.");
        require(userIdToAddress[_userId] == address(0), "Error: User ID already taken.");

        users[_walletAddress] = User(_userId, _walletAddress, _isAdmin);
        userIdToAddress[_userId] = _walletAddress;

        if (_isAdmin) {
            admins[_walletAddress] = true;
            emit AdminAdded(_walletAddress);
        }

        emit UserRegistered(_userId, _walletAddress, _isAdmin);
    }

    function removeAdmin(address _admin) public onlyPoaAdmin {
        require(admins[_admin], "Error: Address is not an admin.");
        require(_admin != poaAdmin, "Error: Cannot remove the PoA admin.");

        admins[_admin] = false;
        emit AdminRemoved(_admin);
    }

    function isAdmin(address _addr) public view returns (bool) {
        return admins[_addr];
    }

    function getUserByAddress(address _walletAddress) public view returns (string memory, address, bool) {
        require(users[_walletAddress].walletAddress != address(0), "Error: User not found.");
        User memory user = users[_walletAddress];
        return (user.userId, user.walletAddress, user.isAdmin);
    }

    function getAddressByUserId(string memory _userId) public view returns (address) {
        require(userIdToAddress[_userId] != address(0), "Error: User ID not found.");
        return userIdToAddress[_userId];
    }
}
