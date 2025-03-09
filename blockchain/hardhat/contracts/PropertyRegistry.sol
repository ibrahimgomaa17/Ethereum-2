// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract PropertyRegistry {
    struct Property {
        string uniqueId;
        string name;
        string propertyType;
        string serialNumber;
        string location;
        address currentOwner;
        address[] ownershipHistory;
        uint256 lastTransferTime;
        bool transferredByAdmin;
    }

    mapping(string => Property) private properties;
    mapping(address => string[]) private ownerProperties;
    string[] private allPropertyIds;

    event PropertyRegistered(string uniqueId, string name, address indexed owner);
    event OwnershipTransferred(string uniqueId, address indexed previousOwner, address indexed newOwner);
    event PropertyRecalled(string uniqueId, address indexed previousOwner, address indexed recalledBy);

    modifier propertyExists(string memory _uniqueId) {
        require(bytes(properties[_uniqueId].uniqueId).length > 0, "Error: Property not found");
        _;
    }

    modifier onlyOwnerOrAdmin(string memory _uniqueId, bool _byAdmin) {
        require(properties[_uniqueId].currentOwner == msg.sender || _byAdmin, "Error: Only the owner or admin can transfer");
        _;
    }

    function registerProperty(
        string memory _name,
        string memory _propertyType,
        string memory _serialNumber,
        string memory _location,
        address _owner
    ) public {
        string memory uniqueId = string(abi.encodePacked(_propertyType, "-", _serialNumber));
        require(bytes(properties[uniqueId].uniqueId).length == 0, "Error: Property already exists");

        Property storage newProperty = properties[uniqueId];
        newProperty.uniqueId = uniqueId;
        newProperty.name = _name;
        newProperty.propertyType = _propertyType;
        newProperty.serialNumber = _serialNumber;
        newProperty.location = _location;
        newProperty.currentOwner = _owner;
        newProperty.lastTransferTime = block.timestamp;
        newProperty.transferredByAdmin = false;
        newProperty.ownershipHistory.push(_owner);
        ownerProperties[_owner].push(uniqueId);
        allPropertyIds.push(uniqueId);

        emit PropertyRegistered(uniqueId, _name, _owner);
    }

    function transferProperty(string memory _uniqueId, address _newOwner, bool _byAdmin)
        public
        propertyExists(_uniqueId)
        onlyOwnerOrAdmin(_uniqueId, _byAdmin)
    {
        Property storage prop = properties[_uniqueId];

        if (_byAdmin) {
            prop.transferredByAdmin = true;
        } else {
            require(
                !prop.transferredByAdmin || block.timestamp >= prop.lastTransferTime + 365 days,
                "Error: Property cannot be transferred yet"
            );
        }

        _removePropertyFromOwner(prop.currentOwner, _uniqueId);
        prop.currentOwner = _newOwner;
        prop.lastTransferTime = block.timestamp;
        prop.ownershipHistory.push(_newOwner);
        ownerProperties[_newOwner].push(_uniqueId);

        emit OwnershipTransferred(_uniqueId, msg.sender, _newOwner);
    }

    function recallProperty(string memory _uniqueId) public propertyExists(_uniqueId) {
        Property storage prop = properties[_uniqueId];
        require(prop.transferredByAdmin, "Error: Cannot recall a property transferred by owner");
        require(prop.ownershipHistory.length > 1, "Error: No previous owner to recall");
        require(prop.ownershipHistory[prop.ownershipHistory.length - 2] == msg.sender, "Error: Only previous owner can recall");

        address previousOwner = prop.ownershipHistory[prop.ownershipHistory.length - 2];
        prop.currentOwner = previousOwner;
        prop.transferredByAdmin = false;

        emit PropertyRecalled(_uniqueId, msg.sender, previousOwner);
    }

    function getProperty(string memory _uniqueId)
        public
        view
        propertyExists(_uniqueId)
        returns (
            string memory, 
            string memory, 
            string memory, 
            string memory, 
            string memory, 
            address, 
            bool, 
            uint256
        )
    {
        Property storage prop = properties[_uniqueId];
        return (
            prop.uniqueId,
            prop.name,
            prop.propertyType,
            prop.serialNumber,
            prop.location,
            prop.currentOwner,
            prop.transferredByAdmin,
            prop.lastTransferTime
        );
    }

    function getPropertiesByOwner(address _owner) public view returns (string[] memory) {
        return ownerProperties[_owner];
    }

    function canTransferProperty(string memory _uniqueId) public view propertyExists(_uniqueId) returns (bool) {
        Property storage prop = properties[_uniqueId];
        return !prop.transferredByAdmin || block.timestamp >= prop.lastTransferTime + 365 days;
    }

    function getOwnershipHistory(string memory _uniqueId) public view propertyExists(_uniqueId) returns (address[] memory) {
        return properties[_uniqueId].ownershipHistory;
    }

    function getAllProperties() public view returns (Property[] memory) {
        Property[] memory allProperties = new Property[](allPropertyIds.length);
        for (uint i = 0; i < allPropertyIds.length; i++) {
            allProperties[i] = properties[allPropertyIds[i]];
        }
        return allProperties;
    }

    function _removePropertyFromOwner(address _owner, string memory _uniqueId) private {
        string[] storage ownerList = ownerProperties[_owner];
        for (uint i = 0; i < ownerList.length; i++) {
            if (keccak256(bytes(ownerList[i])) == keccak256(bytes(_uniqueId))) {
                ownerList[i] = ownerList[ownerList.length - 1];
                ownerList.pop();
                break;
            }
        }
    }
}
