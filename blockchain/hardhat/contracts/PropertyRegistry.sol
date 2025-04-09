// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract PropertyRegistry {
    struct TransferRecord {
        address previousOwner;
        address newOwner;
        uint256 transferTime;
        bool transferredByAdmin;
        bool recalled;
    }

    struct Property {
        string uniqueId;
        string name;
        string propertyType;
        string serialNumber;
        string location;
        string imageUrl; // Changed from base64 to URL and made optional
        address currentOwner;
        TransferRecord[] transferHistory;
        uint256 lastTransferTime;
        bool transferredByAdmin;
    }

    mapping(string => Property) private properties;
    mapping(address => string[]) private ownerProperties;
    string[] private allPropertyIds;

    mapping(address => bool) public isAdmin;
    address public owner;
    uint256 public contractCreationTime;

    event PropertyRegistered(string uniqueId, string name, address indexed owner, uint256 timestamp);
    event OwnershipTransferred(string uniqueId, address indexed previousOwner, address indexed newOwner, uint256 timestamp);
    event PropertyRecalled(string uniqueId, address indexed recalledBy, address indexed returnedTo, uint256 timestamp);
    event AdminUpdated(address indexed admin, bool status, uint256 timestamp);

    modifier propertyExists(string memory _uniqueId) {
        require(bytes(properties[_uniqueId].uniqueId).length > 0, "Error: Property not found");
        _;
    }

    modifier onlyOwnerOrAdmin(string memory _uniqueId, bool _byAdmin) {
        require(properties[_uniqueId].currentOwner == msg.sender || _byAdmin, "Error: Only the owner or admin can transfer");
        _;
    }

    modifier onlyAdmin() {
        require(isAdmin[msg.sender], "Error: Caller is not an admin");
        _;
    }

    constructor() {
        owner = msg.sender;
        isAdmin[msg.sender] = true;
        contractCreationTime = block.timestamp;
    }

    function setAdmin(address _admin, bool _status) public {
        require(msg.sender == owner, "Error: Only contract owner can update admins");
        isAdmin[_admin] = _status;
        emit AdminUpdated(_admin, _status, block.timestamp);
    }

    function registerProperty(
        string memory _name,
        string memory _propertyType,
        string memory _serialNumber,
        string memory _location,
        string memory _imageUrl,
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
        newProperty.imageUrl = _imageUrl; // Can be empty
        newProperty.currentOwner = _owner;
        newProperty.lastTransferTime = block.timestamp;
        newProperty.transferredByAdmin = false;

        newProperty.transferHistory.push(TransferRecord({
            previousOwner: address(0),
            newOwner: _owner,
            transferTime: block.timestamp,
            transferredByAdmin: false,
            recalled: false
        }));

        ownerProperties[_owner].push(uniqueId);
        allPropertyIds.push(uniqueId);

        emit PropertyRegistered(uniqueId, _name, _owner, block.timestamp);
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

        address previousOwner = prop.currentOwner;
        prop.currentOwner = _newOwner;
        prop.lastTransferTime = block.timestamp;

        prop.transferHistory.push(TransferRecord({
            previousOwner: previousOwner,
            newOwner: _newOwner,
            transferTime: block.timestamp,
            transferredByAdmin: _byAdmin,
            recalled: false
        }));

        _removePropertyFromOwner(previousOwner, _uniqueId);
        ownerProperties[_newOwner].push(_uniqueId);

        emit OwnershipTransferred(_uniqueId, previousOwner, _newOwner, block.timestamp);
    }

    function transferAllPropertiesOfUser(address _from, address _to) public onlyAdmin {
        require(_from != _to, "Error: Cannot transfer to the same owner");
        string[] storage userAssets = ownerProperties[_from];
        require(userAssets.length > 0, "Error: No properties found for the user");

        for (uint i = 0; i < userAssets.length; i++) {
            string memory propertyId = userAssets[i];
            Property storage prop = properties[propertyId];

            if (prop.currentOwner != _from) {
                continue;
            }

            prop.transferredByAdmin = true;
            prop.lastTransferTime = block.timestamp;

            prop.transferHistory.push(TransferRecord({
                previousOwner: _from,
                newOwner: _to,
                transferTime: block.timestamp,
                transferredByAdmin: true,
                recalled: false
            }));

            prop.currentOwner = _to;
            ownerProperties[_to].push(propertyId);

            emit OwnershipTransferred(propertyId, _from, _to, block.timestamp);
        }

        delete ownerProperties[_from];
    }

    function reverseAdminTransferAll(address _from, address _to) public {
        require(msg.sender == _from, "Error: Only original owner can reverse");
        require(_from != address(0) && _to != address(0), "Error: Invalid address");

        string[] storage toProps = ownerProperties[_to];
        uint i = 0;

        while (i < toProps.length) {
            string memory propertyId = toProps[i];
            Property storage prop = properties[propertyId];

            bool isReversible = prop.transferredByAdmin &&
                prop.currentOwner == _to &&
                prop.transferHistory.length > 0 &&
                prop.transferHistory[prop.transferHistory.length - 1].previousOwner == _from;

            if (isReversible) {
                prop.currentOwner = _from;
                prop.transferredByAdmin = false;

                prop.transferHistory.push(TransferRecord({
                    previousOwner: _to,
                    newOwner: _from,
                    transferTime: block.timestamp,
                    transferredByAdmin: false,
                    recalled: true
                }));

                ownerProperties[_from].push(propertyId);

                toProps[i] = toProps[toProps.length - 1];
                toProps.pop();

                emit PropertyRecalled(propertyId, _from, _to, block.timestamp);
            } else {
                i++;
            }
        }
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
            prop.imageUrl,
            prop.currentOwner,
            prop.transferredByAdmin,
            prop.lastTransferTime
        );
    }

    function hasImage(string memory _uniqueId)
        public
        view
        propertyExists(_uniqueId)
        returns (bool)
    {
        return bytes(properties[_uniqueId].imageUrl).length > 0;
    }

    function getPropertiesByOwner(address _owner) public view returns (string[] memory) {
        return ownerProperties[_owner];
    }

    function canTransferProperty(string memory _uniqueId)
        public
        view
        propertyExists(_uniqueId)
        returns (bool)
    {
        Property storage prop = properties[_uniqueId];
        return !prop.transferredByAdmin || block.timestamp >= prop.lastTransferTime + 365 days;
    }

    function getTransferHistory(string memory _uniqueId)
        public
        view
        propertyExists(_uniqueId)
        returns (TransferRecord[] memory)
    {
        return properties[_uniqueId].transferHistory;
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
