import { SyntheticEvent, useContext, useState } from "react"

import { EthereumContext } from "./context/EthereumProvider"

interface Wallet {
  [key: string]: string | number | boolean
  address: string
  amount: number
  status: string
}

function App() {
  const ethereumContext = useContext(EthereumContext)
  const { currentAccount, connectWallet } = ethereumContext ?? {}

  const [wallets, setWallets] = useState<Wallet[]>([
    { address: "", amount: 0, status: "" },
  ])

  function handleChange(
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ): void {
    const values = [...wallets]
    values[index][event.target.name] = event.target.value
    setWallets(values)
  }

  function handleAdd(): void {
    setWallets([...wallets, { address: "", amount: 0, status: "" }])
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
        <input />
        <p>SYM</p>
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
                    onChange={(event) => handleChange(index, event)}
                  />
                </div>
                <div className="flex gap-1">
                  <p>Amount:</p>
                  <input
                    className="text-black"
                    value={wallet.amount}
                    type="number"
                    name="amount"
                    onChange={(event) => handleChange(index, event)}
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
          <button className="rounded-md border p-1">Send</button>
        </div>
      </div>
    </div>
  )
}

export default App
