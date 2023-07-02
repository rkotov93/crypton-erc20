import { task } from 'hardhat/config'
import { BigNumber, ContractTransaction, ContractReceipt } from "ethers"
import { Address } from 'cluster';

task('transferFrom', 'Transfer allowed tokens')
    .addParam('token', 'Token address')
    .addParam('from', 'Owner address')
    .addParam('to', 'Recipient address')
    .addParam('amount', 'Token amount in WEI')
	.setAction(async ({ token, from, to, amount }, { ethers }) => {
        const Token = await ethers.getContractFactory('MyToken')
        const tokenContract = Token.attach(token)

        // event listener from https://stackoverflow.com/questions/68432609/contract-event-listener-is-not-firing-when-running-hardhat-tests-with-ethers-js
        const contractTx: ContractTransaction = await tokenContract.transferFrom(from, to, amount)
        const contractReceipt: ContractReceipt = await contractTx.wait()
        const event = contractReceipt.events?.find(event => event.event === 'Transfer')
        if (!event) {
            console.log('Event was not found')
            return
        }

        const eInitiator: String = contractReceipt.from
        const eSender: Address = event.args!['from']
        const eRecipient: Address = event.args!['to']
        const eAmount: BigNumber = event.args!['value']

        console.log(`Initiator: ${eInitiator}`)
        console.log(`From: ${eSender}`)
    	console.log(`To: ${eRecipient}`)
    	console.log(`Amount: ${eAmount}`)
    })
