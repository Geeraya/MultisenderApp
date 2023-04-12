import React from "react"
import { type JsonRpcSigner, ethers } from "ethers"
import { ERC20abi } from "../utils/ERC20abi"

// TYPES

interface EthereumContextProps {
  currentAccount: string
  connectWallet: () => void
  multiSend: (wallets: Wallet[], tokenAddress: string) => void
  getSymbol: (tokenAddress: string) => Promise<string>
}

interface Wallet {
  address: string
  amount: number
}

interface EthereumProviderProps {
  children: React.ReactNode
}

// CONTEXT

export const EthereumContext = React.createContext<EthereumContextProps | null>(
  null
)

export const EthereumProvider = (props: EthereumProviderProps) => {
  const { children } = props
  const [currentAccount, setCurrentAccount] = React.useState("")
  const [signer, setSigner] = React.useState<JsonRpcSigner | null>(null)

  const { ethereum } = window

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

  async function sendERC20(
    amount: number,
    to: string,
    tokenContract: ethers.Contract
  ): Promise<void> {
    const decimals = await tokenContract.decimals()
    const amountInWei = ethers.parseUnits(amount.toString(), decimals)
    const tx = await tokenContract.transfer(to, amountInWei)
    await tx.wait()
  }

  async function multiSend(wallets: Wallet[], tokenAddress: string) {
    const tokenContract = new ethers.Contract(tokenAddress, ERC20abi, signer)
    wallets.forEach(async (wallet) => {
      await sendERC20(wallet.amount, wallet.address, tokenContract)
    })
  }

  async function getSymbol(tokenAddress: string) {
    const provider = new ethers.BrowserProvider(ethereum)
    const tokenContract = new ethers.Contract(tokenAddress, ERC20abi, provider)
    const symbol = await tokenContract.symbol()
    return symbol
  }

  React.useEffect(() => {
    checkIfWalletIsConnect()
    if (!currentAccount) return

    // Create a new BrowserProvider instance
    const provider = new ethers.BrowserProvider(ethereum)

    // Use a boolean flag to keep track of whether the component is mounted
    let isMounted = true

    // Get a signer from the provider and set it as state
    provider.getSigner().then((signer) => {
      if (isMounted) {
        setSigner(signer)
      }
    })

    // Return a cleanup function that cancels the outstanding promise
    return () => {
      isMounted = false
    }
  }, [currentAccount])

  return (
    <EthereumContext.Provider
      value={{
        currentAccount,
        connectWallet,
        multiSend,
        getSymbol,
      }}
    >
      {children}
    </EthereumContext.Provider>
  )
}
