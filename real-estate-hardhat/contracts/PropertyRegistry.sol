// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract PropertyRegistry {
    struct Property {
        string uniqueId; // Unique identifier (e.g., "Car-TSLA123456")
        string name; // Property name
        string propertyType; // Car, House, Land, etc.
        string serialNumber; // Unique serial number
        string location; // Optional (only for House/Land)
        address currentOwner; // Owner address
        address[] ownershipHistory; // Track past owners
    }

    mapping(string => Property) private properties; // uniqueId -> Property
    mapping(address => string[]) private ownerProperties; // owner -> List of property IDs
    mapping(string => string) private serialToUniqueId; // serialNumber -> uniqueId
    mapping(string => string) private nameToUniqueId; // name -> uniqueId
    string[] private allProperties; // List of all registered properties

    event PropertyRegistered(string uniqueId, string name, address indexed owner);
    event OwnershipTransferred(string uniqueId, address indexed previousOwner, address indexed newOwner);

    // 🔹 Register a New Property
    function registerProperty(
        string memory _name,
        string memory _propertyType,
        string memory _serialNumber,
        string memory _location
    ) public {
        string memory uniqueId = string(abi.encodePacked(_propertyType, "-", _serialNumber));

        require(bytes(properties[uniqueId].uniqueId).length == 0, "Error: Property already exists");

        address[] memory emptyHistory;
        properties[uniqueId] = Property(
            uniqueId, _name, _propertyType, _serialNumber, _location, msg.sender, emptyHistory
        );

        properties[uniqueId].ownershipHistory.push(msg.sender);
        ownerProperties[msg.sender].push(uniqueId);
        serialToUniqueId[_serialNumber] = uniqueId;
        nameToUniqueId[_name] = uniqueId;
        allProperties.push(uniqueId);

        emit PropertyRegistered(uniqueId, _name, msg.sender);
    }

    // 🔹 Get Property by Unique ID
    function getProperty(string memory _uniqueId) 
        public 
        view 
        returns (string memory, string memory, string memory, string memory, string memory, address) 
    {
        require(bytes(properties[_uniqueId].uniqueId).length > 0, "Error: Property not found");
        Property memory prop = properties[_uniqueId];

        return (
            prop.uniqueId,
            prop.name,
            prop.propertyType,
            prop.serialNumber,
            prop.location,
            prop.currentOwner
        );
    }

    // 🔹 Get Properties by Owner
    function getPropertiesByOwner(address _owner) public view returns (string[] memory) {
        return ownerProperties[_owner];
    }

    // 🔹 Get Property Ownership History
    function getOwnershipHistory(string memory _uniqueId) public view returns (address[] memory) {
        return properties[_uniqueId].ownershipHistory;
    }

    // 🔹 Transfer Property Ownership
    function transferProperty(string memory _uniqueId, address _newOwner) public {
        require(properties[_uniqueId].currentOwner == msg.sender, "Error: Only the owner can transfer");

        // Remove from old owner's list
        string[] storage ownerList = ownerProperties[msg.sender];
        for (uint i = 0; i < ownerList.length; i++) {
            if (keccak256(bytes(ownerList[i])) == keccak256(bytes(_uniqueId))) {
                ownerList[i] = ownerList[ownerList.length - 1];
                ownerList.pop();
                break;
            }
        }

        properties[_uniqueId].currentOwner = _newOwner;
        properties[_uniqueId].ownershipHistory.push(_newOwner);
        ownerProperties[_newOwner].push(_uniqueId);

        emit OwnershipTransferred(_uniqueId, msg.sender, _newOwner);
    }

    // 🔹 Get Property by Serial Number
    function getPropertyBySerial(string memory _serialNumber) 
        public 
        view 
        returns (string memory, string memory, string memory, string memory, string memory, address) 
    {
        string memory uniqueId = serialToUniqueId[_serialNumber];
        return getProperty(uniqueId);
    }

    // 🔹 Get Property by Name
    function getPropertyByName(string memory _name) 
        public
        view 
        returns (string memory, string memory, string memory, string memory, string memory, address) 
    {
        string memory uniqueId = nameToUniqueId[_name];
        return getProperty(uniqueId);
    }

    // 🔹 Get All Registered Properties
    function getAllProperties() public view returns (string[] memory) {
        return allProperties;
    }
}
