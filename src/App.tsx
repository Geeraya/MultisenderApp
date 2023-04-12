import { SyntheticEvent, useContext, useState } from "react"
import { ethers } from "ethers"

import { EthereumContext } from "./context/EthereumProvider"

interface Wallet {
  [key: string]: string | number | boolean
  address: string
  amount: number
  status: string
}

function App() {
  const ethereumContext = useContext(EthereumContext)
  if (!ethereumContext) return <div>No Ethereum Context, contact developer</div>
  const { currentAccount, connectWallet, multiSend } = ethereumContext

  const [wallets, setWallets] = useState<Wallet[]>([
    { address: "", amount: 0, status: "" },
  ])
  const [tokenAddress, setTokenAddress] = useState("")

  function handleTokenAddressChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const tokenAddress = event.target.value
    setTokenAddress(tokenAddress)
  }

  function handleWalletFormChange(
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ): void {
    const values = [...wallets]
    values[index][event.target.name] = event.target.value
    setWallets(values)
  }

  function handleAdd(): void {
    const amount = wallets[wallets.length - 1].amount
    setWallets([...wallets, { address: "", amount, status: "" }])
  }

  function handleDelete(index: number): void {
    const values = [...wallets]
    values.splice(index, 1)
    setWallets(values)
  }

  return (
    <div className="mx-2 mt-2 flex flex-col items-center justify-center border">
      {/* NAV */}
      <div className="flex w-full justify-between border-b p-2">
        <h1 className="text-xl">Multisender</h1>
        {currentAccount ? (
          <p>{currentAccount}</p>
        ) : (
          <button className="rounded-md border p-1" onClick={connectWallet}>
            Connect wallet
          </button>
        )}
      </div>
      {/* BODY */}
      <div className="mt-2 flex gap-1 border p-2">
        <p>Token address:</p>
        <input
          className="text-sm text-black"
          value={tokenAddress}
          onChange={handleTokenAddressChange}
        />
        <p>SYMBOL</p>
      </div>

      <div className="mx-2 flex flex-col items-center justify-center p-2">
        {wallets.map((wallet, index) => {
          return (
            <div
              key={index}
              className="mb-2 flex items-center rounded-md border"
            >
              <p className="p-1">{index + 1}</p>
              <div className="border-x p-2">
                <div className="mb-2 flex gap-1">
                  <p>Address:</p>
                  <input
                    className="w-full text-sm text-black"
                    value={wallet.address}
                    type="text"
                    name="address"
                    onChange={(event) => handleWalletFormChange(index, event)}
                  />
                </div>
                <div className="flex gap-1">
                  <p>Amount:</p>
                  <input
                    className="text-black"
                    value={wallet.amount}
                    type="number"
                    name="amount"
                    onChange={(event) => handleWalletFormChange(index, event)}
                  />
                </div>
              </div>
              <div className="flex flex-col p-1">
                <p className="bold">{wallet.status}</p>
                <p
                  className="text-sm italic"
                  onClick={() => handleDelete(index)}
                >
                  Delete
                </p>
              </div>
            </div>
          )
        })}
        <div className="flex gap-1">
          <button className="rounded-md border p-1" onClick={handleAdd}>
            Add
          </button>
          <button
            className="rounded-md border p-1"
            onClick={() => {
              if (wallets.length === 0) return
              multiSend(wallets, tokenAddress)
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
