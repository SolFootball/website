'use client';

import { Button } from '@nextui-org/react';
import { PublicKey } from '@solana/web3.js';
import {
	useConnection,
	useWallet,
	useAnchorWallet,
} from '@solana/wallet-adapter-react';
import { useContext, useState } from 'react';
import { getAssociatedTokenAddress } from '@solana/spl-token';
import { solfotProgramInterface } from './utils/constants';
import { SfFinal } from './program/sf_final';
import { Program, AnchorProvider } from '@coral-xyz/anchor';
import { UserStatusContext } from '@/app/providers';

export default function BetButton() {
	const [betTxnSignature, setBetTxnSignature] = useState('');
	const { userStatus, updateUserStatus } = useContext(UserStatusContext);
	const { publicKey, sendTransaction } = useWallet();
	const { connection } = useConnection();
	const wallet = useAnchorWallet();
	const betURL = '/api/bet';

	async function betTransaction() {
		if (!publicKey || !wallet) {
			console.error('Wallet not connected');
			return;
		}

		const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
		if (!contractAddress) {
			console.error('Failed to get contract address');
		}
		var caPublicKey: PublicKey;
		try {
			caPublicKey = new PublicKey(contractAddress!);
		} catch (erroor) {
			// Invalid public key
			console.error('Failed to parse publick key');
			return;
		}

		const contractAddressUSDC = process.env.NEXT_PUBLIC_USDC_ADDRESS;
		if (!contractAddressUSDC) {
			console.error('Failed to get contract address');
		}
		var usdcPublicKey: PublicKey;
		try {
			usdcPublicKey = new PublicKey(contractAddressUSDC!);
		} catch (error) {
			// Invalid public key
			console.error(`Failed to parse publick key: ${error}`);
			return;
		}

		const provider = new AnchorProvider(connection, wallet);
		const program = new Program(
			solfotProgramInterface,
			provider,
		) as Program<SfFinal>;

		const [escrowAccountPDA, _escrowAccountBump] =
			PublicKey.findProgramAddressSync(
				[Buffer.from('escrow')],
				caPublicKey,
			);
		const userTokenAcc = await getAssociatedTokenAddress(
			usdcPublicKey,
			publicKey,
		);
		const escrowTokenAcc = (
			await program.account.escrowAccount.fetch(escrowAccountPDA)
		).usdcTokenAccount;

		console.log(escrowTokenAcc);

		const transaction = await program.methods
			.bet()
			.accounts({
				escrowTokenAccount: escrowTokenAcc,
				userTokenAccount: userTokenAcc,
			})
			.transaction();

		try {
			// Sign and make transaction
			const txn = await sendTransaction(transaction, connection);

			// Send transaction to backend
			try {
				const res = await fetch(betURL, {
					method: 'POST',
					body: JSON.stringify({
						transactionHash: txn,
					}),
				});

				if (res.ok) {
					console.log('Bet Confirmed');
					setBetTxnSignature(txn);
					updateUserStatus();
				} else {
					console.error(
						`Error confirming bet: ${res.status}, ${res.statusText}`,
					);
				}
			} catch (error) {
				console.error(`Error confirming bet: ${error}`);
			}
		} catch (error) {
			const err = `Bet transaction failed: ${error}`;
			console.error(err);
		}
	}

	return (
		<>
			<div className="flex items-center justify-center flex-col gap-3">
				{userStatus?.has_betted == true ? (
					<></>
				) : (
					<>
						<Button
							color="primary"
							className="font-extrabold text-white"
							onClick={betTransaction}
						>
							Bet
						</Button>
					</>
				)}

				{betTxnSignature != '' ? <p>Bet succesfull</p> : <></>}
			</div>
		</>
	);
}
