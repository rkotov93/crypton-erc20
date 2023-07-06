import { task } from 'hardhat/config'
import { BigNumber, ContractTransaction, ContractReceipt } from "ethers";
import { Address } from 'cluster';

task('burn', 'Burn tokens')
    .addParam('token', 'Token address')
    .addParam('amount', 'Token amount')
	.setAction(async ({ token, amount }, { ethers }) => {
        const Token = await ethers.getContractFactory('MyToken')
        const tokenContract = Token.attach(token)

        // event listener from https://stackoverflow.com/questions/68432609/contract-event-listener-is-not-firing-when-running-hardhat-tests-with-ethers-js
        const contractTx: ContractTransaction = await tokenContract.burn(amount);
        const contractReceipt: ContractReceipt = await contractTx.wait();
        const event = contractReceipt.events?.find(event => event.event === 'Transfer');
        if (!event) {
            console.log('Event was not found')
            return
        }

        const eInitiator: Address = event.args!['from'];
        const eRecipient: Address = event.args!['to'];
        const eAmount: BigNumber = event.args!['value'];
        if (eRecipient.toString() != "0x0000000000000000000000000000000000000000") {
            console.error("Tokens were transfered instead of get burned")
        }

        console.log(`${eInitiator} has burned ${eAmount} of MTK`)
    })
