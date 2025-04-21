import { connect, IClientOptions, MqttClient } from 'mqtt'
import React, { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import { RootState } from '../../app/RootReducer'
import { mqttPassword, mqttPort, mqttUrl, mqttUsername } from '../../constent'
import MqttContext from './MqttContext'
import { Message, MessageStructure } from './types'

interface Props {
  brokerUrl?: string | Record<string, unknown>
  opts?: IClientOptions | undefined
  children: React.ReactNode
}

export default function Connector({ children }: Props) {
  const [status, setStatus] = useState<string>('offline')
  const [mqtt, setMqtt] = useState<MqttClient>()
  const [messages, setMessages] = useState<Message<MessageStructure>[]>([])

  const fingerPrint = localStorage.getItem('fingerprint')

  const { currentLiveStreamDetails, isLive } = useSelector(
    (state: RootState) => state.liveStreamManager
  )
  const { accessToken } = useSelector((state: RootState) => state.app)

  useEffect(() => {
    const mqttInstance: any = connect(mqttUrl, {
      port: mqttPort,
      path: '/mqtt',
      username: mqttUsername,
      password: mqttPassword,
      clientId: `${fingerPrint! + 'dashboard' + ':' + accessToken!}`,
      will: {
        topic: `all/${fingerPrint}/device_disconnect`,
        payload: JSON.stringify({
          device_id: fingerPrint,
        }),
        qos: 0,
        retain: false,
      },
    })
    setMqtt(mqttInstance)
    mqttInstance.on('connect', () => setStatus('connected'))
    mqttInstance.on('reconnect', () => setStatus('reconnecting'))
    mqttInstance.on('close', () => setStatus('closed'))
    mqttInstance.on('offline', () => setStatus('offline'))
    return () => {
      if (mqttInstance) {
        mqttInstance.end()
      }
    }
  }, [accessToken, fingerPrint, isLive])

  useEffect(() => {
    const interval = setInterval(() => {
      if (mqtt && isLive) {
        mqtt.publish(
          `device/${fingerPrint}/ping`,
          JSON.stringify({
            message: `hello`,
          }),
          { qos: 0 },
          function(err) {
            if (err) {
              // do nothing
            } else {
              // do nothing
            }
          }
        )
      }
    }, 15000)
    return () => clearInterval(interval)
  }, [mqtt, isLive])

  const addMessage = useCallback((message: Message<any>) => {
    const msgTopic = `chat/v2/${currentLiveStreamDetails?.uid}/message`
    const activityFollowerTopic = `activity/${currentLiveStreamDetails?.streamer.user_uid}/follow`
    const activityMessageTopic = `activity/${currentLiveStreamDetails?.uid}/message`
    if (message.topic === msgTopic) {
      setMessages((state) => {
        const allMsgTopicMessages = state.filter((e) => e.topic === msgTopic)
        const otherTopicMessages = state.filter((e) => e.topic !== msgTopic)
        if (allMsgTopicMessages.length >= 70) {
          const sliceMessages = allMsgTopicMessages.slice(
            allMsgTopicMessages.length / 2
          )

          return [...otherTopicMessages, ...sliceMessages, message]
        } else {
          return [...state, message]
        }
      })
    } else if (message.topic === activityFollowerTopic) {
      setMessages((state) => {
        const allMsgTopicMessages = state.filter(
          (e) => e.topic === activityFollowerTopic
        )
        const otherTopicMessages = state.filter(
          (e) => e.topic !== activityFollowerTopic
        )
        if (allMsgTopicMessages.length >= 30) {
          const sliceMessages = allMsgTopicMessages.slice(
            allMsgTopicMessages.length / 2
          )
          return [...otherTopicMessages, ...sliceMessages, message]
        } else {
          return [...state, message]
        }
      })
    } else if (message.topic === activityMessageTopic) {
      setMessages((state) => {
        const allMsgTopicMessages = state.filter(
          (e) => e.topic === activityMessageTopic
        )
        const otherTopicMessages = state.filter(
          (e) => e.topic !== activityMessageTopic
        )
        if (allMsgTopicMessages.length >= 30) {
          const sliceMessages = allMsgTopicMessages.slice(
            allMsgTopicMessages.length / 2
          )
          return [...otherTopicMessages, ...sliceMessages, message]
        } else {
          return [...state, message]
        }
      })
    }
  }, [])

  const lastMessage = messages[messages.length - 1]

  return (
    <MqttContext.Provider
      value={{ status, mqtt, addMessage, messages, lastMessage }}
    >
      {children}
    </MqttContext.Provider>
  )
}
