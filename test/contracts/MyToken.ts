
import { expect } from "chai";
import { ethers } from "hardhat";
import { BigNumber, Contract } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

import { myTokenDeploymentFixture } from "../fixtures/myToken";

describe("MyToken", () => {
  let myToken: Contract;
  let owner: SignerWithAddress;
  let accounts: SignerWithAddress[];

  beforeEach(async () => {
    ({ myToken, owner, accounts } = await loadFixture(myTokenDeploymentFixture));
  });

  describe("Initial params of contract", async () => {
    it("initializes contract with values", async () => {
      expect(await myToken.name()).to.be.eq("MyToken")
      expect(await myToken.symbol()).to.be.eq("MTK")
      expect(await myToken.decimals()).to.be.eq(18)
      expect(await myToken.balanceOf(owner.address)).to.be.eq((10 ** 19).toString())
    })
  })

  describe("#mint", async () => {
    let recipient: SignerWithAddress;
    let amount: number;

    beforeEach(() => {
      recipient = accounts[1]
      amount = 100
    })

    context("when sender is an owner", () => {
      it("deposits token to recipient's address", async () => {
        await expect(myToken.mint(recipient.address, amount))
          .to.changeTokenBalance(myToken, recipient, 100)
          .to.emit(myToken, "Transfer")
          .withArgs(ethers.constants.AddressZero, recipient.address, amount);
      })
    })

    context("when sender is not an owner", () => {
      let sender: SignerWithAddress

      beforeEach(() => {
        sender = accounts[2]
      })

      it("reverts transaction", async () => {
        await expect(
          myToken.connect(sender).mint(recipient.address, amount)
        ).to.be.revertedWith("MyToken: you are not an owner");
      })
    })
  })

  describe("#approve", () => {
    let spender: SignerWithAddress
    let amount: number

    beforeEach(() => {
      spender = accounts[1]
      amount = 100
    })

    it("sets allowance to provided amount", async () => {
      await expect(myToken.approve(spender.address, amount))
        .to.emit(myToken, "Approval")
        .withArgs(owner.address, spender.address, amount);
      expect(await myToken.allowance(owner.address, spender.address)).to.be.eq(100)
    })
  })

  describe("#burn", () => {
    let amount: number

    it("sets allowance to provided amount", async () => {
      amount = 100
      await expect(myToken.burn(amount))
        .to.changeTokenBalance(myToken, owner, -100)
        .to.emit(myToken, "Transfer")
        .withArgs(owner.address, ethers.constants.AddressZero, amount);
    })

    context("when amount is bigger than sender balance", () => {
      it("reverts transaction", async () => {
        amount = await myToken.balanceOf(owner.address) + 100

        await expect(
          myToken.burn(amount)
        ).to.be.revertedWith("MyToken: Insufficient balance");
      })
    })
  })

  describe("#transfer", () => {
    let recipient: SignerWithAddress
    let amount: number

    beforeEach(() => {
      recipient = accounts[1]
      amount = 100
    })

    it("sends tokens from sender to recipient", async () => {
      await expect(myToken.transfer(recipient.address, 100))
        .to.changeTokenBalances(myToken, [owner, recipient], [-100, 100])
        .to.emit(myToken, "Transfer")
        .withArgs(owner.address, recipient.address, amount);
    })

    context("when amount is bigger than sender balance", () => {
      beforeEach(async () => {
        amount = await myToken.balanceOf(owner.address) + 100
      })

      it("reverts transaction", async () => {
        await expect(myToken.transfer(recipient.address, amount))
          .to.be.revertedWith("MyToken: Not enough balance");
      })
    })
  })

  describe("#transferFrom", () => {
    let spender: SignerWithAddress
    let recipient: SignerWithAddress
    let amount: number
    let approvedAmount: number

    beforeEach(async () => {
      spender = accounts[1]
      recipient = accounts[2]
      amount = 100
      approvedAmount = 100

      await myToken.approve(spender.address, approvedAmount)
    })

    it("sends tokens from owner to recipient", async () => {
      await expect(myToken.connect(spender).transferFrom(owner.address, recipient.address, 100))
        .to.changeTokenBalances(myToken, [owner, recipient], [-100, 100])
        .to.emit(myToken, "Transfer")
        .withArgs(owner.address, recipient.address, amount);
    })

    context("when amount is bigger than owner's balance", () => {
      beforeEach(async () => {
        amount = await myToken.balanceOf(owner.address) + 100
      })

      it("reverts transaction", async () => {
        await expect(myToken.connect(spender).transferFrom(owner.address, recipient.address, amount))
          .to.be.revertedWith("MyToken: Insufficient balance");
      })
    })

    context("when amount is bigger than approved amount", () => {
      beforeEach(async () => {
        amount = approvedAmount + 100
      })

      it("reverts transaction", async () => {
        await expect(myToken.connect(spender).transferFrom(owner.address, recipient.address, amount))
          .to.be.revertedWith("MyToken: Insufficient allowance");
      })
    })
  })
});
