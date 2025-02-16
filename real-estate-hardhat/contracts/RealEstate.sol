// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract RealEstate {
    struct Property {
        uint id;
        address owner;
        string location;
        uint price;
        bool forSale;
    }

    mapping(uint => Property) public properties;
    uint public propertyCount;

    event PropertyRegistered(uint indexed id, address indexed owner, string location, uint price);
    event PropertyTransferred(uint indexed id, address indexed newOwner, uint price);
    event PropertyListedForSale(uint indexed id, uint price);

    constructor() {
        propertyCount = 0;
    }

    function registerProperty(string memory _location, uint _price) public {
        require(bytes(_location).length > 0, "Location cannot be empty");
        require(_price > 0, "Price must be greater than 0");

        propertyCount++;
        properties[propertyCount] = Property(propertyCount, msg.sender, _location, _price, false);
        emit PropertyRegistered(propertyCount, msg.sender, _location, _price);
    }

    function listForSale(uint _id, uint _price) public {
        require(_id > 0 && _id <= propertyCount, "Invalid property ID");
        require(properties[_id].owner == msg.sender, "You are not the owner");
        require(_price > 0, "Price must be greater than 0");

        properties[_id].forSale = true;
        properties[_id].price = _price;
        emit PropertyListedForSale(_id, _price);
    }

    function buyProperty(uint _id) public payable {
        require(_id > 0 && _id <= propertyCount, "Invalid property ID");
        require(properties[_id].forSale, "Property not for sale");
        require(msg.value >= properties[_id].price, "Insufficient funds");

        address previousOwner = properties[_id].owner;
        require(previousOwner != msg.sender, "You cannot buy your own property");

        (bool success, ) = payable(previousOwner).call{value: msg.value}("");
        require(success, "Transfer failed");

        properties[_id].owner = msg.sender;
        properties[_id].forSale = false;

        emit PropertyTransferred(_id, msg.sender, msg.value);
    }

    function getProperty(uint _id) public view returns (uint, address, string memory, uint, bool) {
        require(_id > 0 && _id <= propertyCount, "Invalid property ID");
        Property memory p = properties[_id];
        return (p.id, p.owner, p.location, p.price, p.forSale);
    }
}
