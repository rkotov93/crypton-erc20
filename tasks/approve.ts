import { task } from 'hardhat/config'
import { BigNumber, ContractTransaction, ContractReceipt } from "ethers";
import { Address } from 'cluster';

task('approve', 'Approve allowance')
    .addParam('token', 'Token address')
    .addParam('spender', 'An address that will be allowed to spend provided amount of token')
    .addParam('amount', 'Token amount')
	.setAction(async ({ token, spender, amount }, { ethers }) => {
        const Token = await ethers.getContractFactory('MyToken')
        const tokenContract = Token.attach(token)

        // event listener from https://stackoverflow.com/questions/68432609/contract-event-listener-is-not-firing-when-running-hardhat-tests-with-ethers-js
        const contractTx: ContractTransaction = await tokenContract.approve(spender, amount);
        const contractReceipt: ContractReceipt = await contractTx.wait();
        const event = contractReceipt.events?.find(event => event.event === 'Approval');
        if (!event) {
            console.log('Event was not found')
            return
        }

        const eOwner: Address = event.args!['owner'];
        const eSpender: Address = event.args!['spender'];
        const eAmount: BigNumber = event.args!['value'];

    	console.log(`Owner: ${eOwner}`)
    	console.log(`Spender: ${eSpender}`)
    	console.log(`Amount: ${eAmount}`)
    })
