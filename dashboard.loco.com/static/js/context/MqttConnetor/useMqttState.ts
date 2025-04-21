import { useContext } from 'react'

import MqttContext from './MqttContext'
import { MqttContext as Context } from './types'

export default function useMqttState<T>() {
  const {
    status,
    mqtt,
    messages: allMessages,
    lastMessage,
    addMessage,
  } = useContext<Context<T>>(MqttContext)

  return {
    status,
    mqtt,
    allMessages,
    lastMessage,
    addMessage,
  }
}
