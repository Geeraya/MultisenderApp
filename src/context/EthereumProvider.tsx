import React from "react"
import { ethers } from "ethers"

const { ethereum } = window

interface EthereumContextProps {
  currentAccount: string
  connectWallet: () => void
}

export const EthereumContext = React.createContext<EthereumContextProps | null>(
  null
)

interface EthereumProviderProps {
  children: React.ReactNode
}
export const EthereumProvider = (props: EthereumProviderProps) => {
  const { children } = props
  const [currentAccount, setCurrentAccount] = React.useState("")

  async function checkIfWalletIsConnect() {
    try {
      const accounts = await ethereum.request({ method: "eth_accounts" })

      if (accounts.length) {
        setCurrentAccount(accounts[0])
      } else {
        console.log("No accounts found")
      }
    } catch (error) {
      console.log(error)
    }
  }

  async function connectWallet() {
    try {
      if (!window.ethereum) return alert("Please install MetaMask.")

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      })
      setCurrentAccount(accounts[0])
      window.location.reload()
    } catch (error) {
      console.log(error)
      throw new Error("No ethereum object")
    }
  }

  React.useEffect(() => {
    checkIfWalletIsConnect()
    if (!currentAccount) return
  }, [currentAccount])

  return (
    <EthereumContext.Provider
      value={{
        currentAccount,
        connectWallet,
      }}
    >
      {children}
    </EthereumContext.Provider>
  )
}
