import { task } from 'hardhat/config'
import { BigNumber, ContractTransaction, ContractReceipt } from "ethers"
import { Address } from 'cluster';

task('transfer', 'Transfer token to address')
    .addParam('token', 'Token address')
    .addParam('to', 'Recipient address')
    .addParam('amount', 'Token amount in WEI')
	.setAction(async ({ token, to, amount}, { ethers }) => {
        const Token = await ethers.getContractFactory('MyToken')
        const tokenContract = Token.attach(token)

        // event listener from https://stackoverflow.com/questions/68432609/contract-event-listener-is-not-firing-when-running-hardhat-tests-with-ethers-js
        const contractTx: ContractTransaction = await tokenContract.transfer(to, amount)
        const contractReceipt: ContractReceipt = await contractTx.wait()
        const event = contractReceipt.events?.find(event => event.event === 'Transfer')
        if (!event) {
            console.log('Event was not found')
            return
        }

        const eInitiator: Address = event.args!['from']
        const eRecipient: Address = event.args!['to']
        const eAmount: BigNumber = event.args!['value']

        console.log(`Initiator: ${eInitiator}`)
    	console.log(`Recipient: ${eRecipient}`)
    	console.log(`Amount: ${eAmount}`)
    })
