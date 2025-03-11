// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface IFruitToken {
    function mint(address to, uint amount) external;
}

contract TreeNFT is ERC721URIStorage, Ownable {
    uint public tokenCounter;
    IFruitToken public fruitToken;
    mapping(uint => uint) public lastClaimTime;

    constructor(address _fruitTokenAddress) ERC721("Tree NFT", "TREE") Ownable(msg.sender) {
        tokenCounter = 0;
        fruitToken = IFruitToken(_fruitTokenAddress);
    }

    function mintNFT(string memory tokenURI) external {
        uint tokenId = tokenCounter;
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, tokenURI);

        lastClaimTime[tokenId] = block.timestamp;

        tokenCounter++;
    }

    function claimRewards(uint[] calldata tokenIds) external  {
        uint totalReward = 0;
        for (uint i = 0; i < tokenIds.length; i++) {
            require(ownerOf(tokenIds[i]) == msg.sender, "Caller is not NFT owner.");

            uint lastTime = lastClaimTime[tokenIds[i]];
            uint daysPassed = (block.timestamp - lastTime) / 120;

            if (daysPassed > 0) {
                totalReward += daysPassed;
                lastClaimTime[tokenIds[i]] = lastTime + daysPassed * 120;
            }
        }
        require(totalReward > 0, "No rewards available");
        fruitToken.mint(msg.sender, totalReward * 1e18);
    }
}