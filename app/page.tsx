"use client";

import { useState, useEffect } from "react";
import { ethers,  } from "ethers";
import { Governance__factory } from "./typechain-types";

// Contract address - you'll need to replace this with your deployed contract address
const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

interface Proposal {
  title: string;
  description: string;
  proposer: string;
  timestamp: number;
}

export default function Home() {
  const [account, setAccount] = useState<string>("");
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [contract, setContract] = useState<ReturnType<typeof Governance__factory.connect> | null>(null);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // Connect to wallet
  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        
        // Use ethers v6 BrowserProvider
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        
        setAccount(accounts[0]);
        setProvider(provider);
        setSigner(signer);
        
        // Initialize contract with TypeChain factory
        const contract = Governance__factory.connect(
          contractAddress,
          signer
        );
        setContract(contract);
        
        // Load proposals
        loadProposals(contract);
      } else {
        setError("Please install MetaMask to use this dApp");
      }
    } catch (error) {
      setError("Error connecting to wallet");
      console.error(error);
    }
  };

  // Load proposals from the contract
  const loadProposals = async (contractInstance: ReturnType<typeof Governance__factory.connect>) => {
    try {
      setIsLoading(true);
      const count = await contractInstance.getProposalCount();
      const proposalList: Proposal[] = [];
      
      for (let i = 0; i < count; i++) {
        const proposal = await contractInstance.getProposal(i);
        proposalList.push({
          title: proposal[0],
          description: proposal[1],
          proposer: proposal[2],
          timestamp: Number(proposal[3]),
        });
      }
      
      setProposals(proposalList);
      setIsLoading(false);
    } catch (error) {
      setError("Error loading proposals");
      setIsLoading(false);
      console.error(error);
    }
  };

  // Submit a new proposal
  const submitProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description || !contract) {
      setError("Title and description are required");
      return;
    }
    
    try {
      setIsLoading(true);
      const tx = await contract.createProposal(title, description);
      await tx.wait();
      
      // Reset form
      setTitle("");
      setDescription("");
      
      // Reload proposals
      await loadProposals(contract);
      setIsLoading(false);
    } catch (error) {
      setError("Error submitting proposal");
      setIsLoading(false);
      console.error(error);
    }
  };

  useEffect(() => {
    // Check if we're in a browser environment
    if (typeof window !== 'undefined' && window.ethereum) {
      connectWallet();
      
      // Listen for account changes
      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        setAccount(accounts[0]);
        connectWallet();
      });
    }
  }, []);

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center text-black">Governance Proposals</h1>
        
        {/* Wallet Connection */}
        <div className="mb-8 text-center">
          {account ? (
            <div className="p-4 bg-green-100 rounded-lg">
              <p className="font-medium text-black">Connected: {account.substring(0, 6)}...{account.substring(account.length - 4)}</p>
            </div>
          ) : (
            <button
              onClick={connectWallet}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Connect Wallet
            </button>
          )}
        </div>
        
        {/* Error Message */}
        {error && (
          <div className="p-4 mb-8 bg-red-100 text-black rounded-lg">
            {error}
          </div>
        )}
        
        {/* Proposal Form */}
        {account && (
          <div className="mb-12 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4 text-black">Submit a New Proposal</h2>
            <form onSubmit={submitProposal}>
              <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-medium mb-2 text-black">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded text-black"
                  placeholder="Enter proposal title"
                  required
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="description" className="block text-sm font-medium mb-2 text-black">
                  Description
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded text-black"
                  rows={4}
                  placeholder="Enter proposal description"
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-400"
              >
                {isLoading ? "Submitting..." : "Submit Proposal"}
              </button>
            </form>
          </div>
        )}
        
        {/* Proposals List */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4 text-black">Existing Proposals</h2>
          
          {isLoading ? (
            <p className="text-center p-4 text-black">Loading proposals...</p>
          ) : proposals.length > 0 ? (
            <div className="space-y-4">
              {proposals.map((proposal, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg">
                  <h3 className="text-xl font-medium mb-2 text-black">{proposal.title}</h3>
                  <p className="mb-2 text-black">{proposal.description}</p>
                  <div className="text-sm text-black">
                    <p>Proposed by: {proposal.proposer.substring(0, 6)}...{proposal.proposer.substring(proposal.proposer.length - 4)}</p>
                    <p>Date: {new Date(proposal.timestamp * 1000).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center p-4 text-black">No proposals yet. Be the first to create one!</p>
          )}
        </div>
      </div>
    </div>
  );
}
