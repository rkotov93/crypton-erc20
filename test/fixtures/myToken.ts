import { ethers } from "hardhat";
import { Contract } from "ethers";

const NAME = "MyToken";
const SYMBOL = "MTK";

async function myTokenDeploymentFixture() {
  const accounts = await ethers.getSigners();
  const owner = accounts[0];

  const MyToken = await ethers.getContractFactory("MyToken");
  const myToken: Contract = await MyToken.deploy(NAME, SYMBOL);
  await myToken.deployed();

  return { myToken, accounts, owner };
}

export { myTokenDeploymentFixture };
