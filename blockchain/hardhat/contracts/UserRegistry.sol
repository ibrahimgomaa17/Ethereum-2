// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract UserRegistry {
    struct User {
        string userId;
        address walletAddress;
        bool isAdmin;
    }

    struct AssetTransfer {
        string previousOwnerId;
        string newOwnerId;
        uint256 transferTime;
        bool isRecalled;
    }

    mapping(string => User) private users; // Mapping from userId to User
    mapping(address => string) private addressToUserId; // Mapping from address to userId
    mapping(string => bool) private admins; // Admins by userId
    mapping(string => AssetTransfer[]) private transferHistory; // Transfer history by userId
    string[] private allUserIds;

    bytes32 public immutable poaAdminId;

    event UserRegistered(string userId, address walletAddress, bool isAdmin);
    event AdminAdded(string indexed adminId);
    event AdminRemoved(string indexed adminId);
    event AssetsTransferred(string indexed fromId, string indexed toId);
    event AssetRecalled(string indexed fromId, string indexed recalledById);

    modifier onlyAdmin() {
        require(
            admins[addressToUserId[msg.sender]],
            "Access Denied: Only admins can perform this action."
        );
        _;
    }

    modifier onlyPoaAdmin() {
        require(
            keccak256(abi.encodePacked(addressToUserId[msg.sender])) ==
                poaAdminId,
            "Access Denied: Only the PoA admin can remove admins."
        );
        _;
    }

    constructor() {
        poaAdminId = keccak256(abi.encodePacked("admin"));
        users["admin"] = User("admin", msg.sender, true);
        addressToUserId[msg.sender] = "admin";
        admins["admin"] = true;
        allUserIds.push("admin");
        emit AdminAdded("admin");
    }

    function registerUser(string memory _userId) public {
        require(
            users[_userId].walletAddress == address(0),
            "Error: User ID already taken."
        );
        require(
            bytes(addressToUserId[msg.sender]).length == 0,
            "Error: Address already associated with a user."
        );

        users[_userId] = User(_userId, msg.sender, false);
        addressToUserId[msg.sender] = _userId;
        allUserIds.push(_userId);

        emit UserRegistered(_userId, msg.sender, false);
    }

    function removeAdmin(string memory _adminId) public onlyPoaAdmin {
        require(admins[_adminId], "Error: User is not an admin.");
        require(
            keccak256(abi.encodePacked(_adminId)) != poaAdminId,
            "Error: Cannot remove the PoA admin."
        );

        admins[_adminId] = false;
        emit AdminRemoved(_adminId);
    }

    function isAdmin(string memory _userId) public view returns (bool) {
        return admins[_userId];
    }

    function getUserById(
        string memory _userId
    ) public view returns (string memory, address, bool) {
        require(
            users[_userId].walletAddress != address(0),
            "Error: User not found."
        );
        User memory user = users[_userId];
        return (user.userId, user.walletAddress, user.isAdmin);
    }

    function getUserIdByAddress(
        address _walletAddress
    ) public view returns (string memory) {
        require(
            bytes(addressToUserId[_walletAddress]).length > 0,
            "Error: Address not associated with any user."
        );
        return addressToUserId[_walletAddress];
    }

    function transferAssets(string memory _fromId, string memory _toId) public {
        require(
            users[_fromId].walletAddress == msg.sender,
            "Error: Only the asset owner can transfer assets."
        );
        require(
            users[_toId].walletAddress != address(0),
            "Error: Recipient user does not exist."
        );

        transferHistory[_fromId].push(
            AssetTransfer({
                previousOwnerId: _fromId,
                newOwnerId: _toId,
                transferTime: block.timestamp,
                isRecalled: false
            })
        );

        emit AssetsTransferred(_fromId, _toId);
    }

    function recallAsset(string memory _fromId) public onlyAdmin {
        require(
            transferHistory[_fromId].length > 0,
            "Error: No transfer history found."
        );

        AssetTransfer storage lastTransfer = transferHistory[_fromId][
            transferHistory[_fromId].length - 1
        ];
        lastTransfer.isRecalled = true;

        emit AssetRecalled(_fromId, addressToUserId[msg.sender]);
    }

    function getAllUsers()
        public
        view
        returns (string[] memory, address[] memory, bool[] memory)
    {
        string[] memory userIds = new string[](allUserIds.length);
        address[] memory walletAddresses = new address[](allUserIds.length);
        bool[] memory isAdmins = new bool[](allUserIds.length);

        for (uint i = 0; i < allUserIds.length; i++) {
            User memory user = users[allUserIds[i]];
            userIds[i] = user.userId;
            walletAddresses[i] = user.walletAddress;
            isAdmins[i] = user.isAdmin;
        }

        return (userIds, walletAddresses, isAdmins);
    }
}
