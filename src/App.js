import * as PushSDK from '@pushprotocol/restapi'
import './App.css'
import { useEffect,useState } from 'react'
import { ethers } from 'ethers'
import Notifications from './Notifications.jsx'

function App(){
  const recipientAddress='eip155:5:0x5E84A2288188B48c34840Ab83C5B227C7a87e96F'
  const [notifications,setNotifications]=useState([])

  const provider=new ethers.providers.Web3Provider(window.ethereum)
  const signer=provider.getSigner()

  useEffect(()=>{
    const fetchNotifications=async()=>{
      const notifs=await PushSDK.user.getFeeds({
        user:recipientAddress,
        env:'staging'
      })
      setNotifications(notifs)
      console.log(notifs);
    }
    connectToMetaMask()
    fetchNotifications()
  },[])

  async function connectToMetaMask(){
    try{
      console.log("signed in as",await signer.getAddress());
    }
    catch (err)
    {
      console.log("Not signed in");
      await provider.send("eth_requestAccounts",[])
    }
  }
  
  const optInChannel=async()=>{
    await PushSDK.channels.subscribe({
      signer:signer,
      channelAddress:'eip155:0x5E84A2288188B48c34840Ab83C5B227C7a87e96F',
      userAddress:await signer.getAddress(),
      onSuccess:()=>{
        console.log('opt in success');
    },
    onError:()=>{
      console.log('opt in error');
    },
    env:'staging',
    })
  }

  return(
    <div>
      <header>
        <button onClick={optInChannel}>Opt in to Channel</button>
        {
          notifications && (
            <Notifications notifications={notifications}></Notifications>
          )
        }
      </header>
    </div>
  )
}

export default App