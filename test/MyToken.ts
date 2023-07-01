import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { BigNumber, Contract } from "ethers";
import { ethers } from "hardhat";

const DECIMALS = 18;
const NAME = "MyToken";
const SYMBOL = "MTK";
const INITIAL_AMOUNT = ethers.utils.parseUnits("1", "18"); // 10^18
// const bigNumberExample = BigNumber.from(1000);

describe("MyToken contract", function () {
  let MyToken;
  let myToken: Contract;
  let owner: SignerWithAddress, user1: SignerWithAddress, user2: SignerWithAddress, users: SignerWithAddress[];

  beforeEach(async () => {
    MyToken = await ethers.getContractFactory('MyToken');
    [owner, user1, user2, ...users] = await ethers.getSigners();
    myToken = await MyToken.deploy(NAME, SYMBOL);
  })

  describe("Initial params of contract", async () => {
    

  })

  describe("Contract logic", function () {
    
  })
});