import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("GovernanceModule", (m) => {
  const governance = m.contract("Governance");

  return {
    governance,
  };
});
