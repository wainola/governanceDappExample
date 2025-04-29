// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Governance {
    struct Proposal {
        string title;
        string description;
        address proposer;
        uint256 timestamp;
    }
    
    Proposal[] public proposals;
    
    event ProposalCreated(uint256 indexed id, string title, address proposer);
    
    function createProposal(string memory title, string memory description) public {
        Proposal memory newProposal = Proposal({
            title: title,
            description: description,
            proposer: msg.sender,
            timestamp: block.timestamp
        });
        
        proposals.push(newProposal);
        emit ProposalCreated(proposals.length - 1, title, msg.sender);
    }
    
    function getProposalCount() public view returns (uint256) {
        return proposals.length;
    }
    
    function getProposal(uint256 index) public view returns (string memory title, string memory description, address proposer, uint256 timestamp) {
        require(index < proposals.length, "Proposal does not exist");
        Proposal memory proposal = proposals[index];
        return (proposal.title, proposal.description, proposal.proposer, proposal.timestamp);
    }
} 