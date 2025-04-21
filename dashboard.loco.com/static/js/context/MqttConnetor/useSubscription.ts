import MQTTPattern from 'mqtt-pattern'
import { useContext, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { v4 as uuidv4 } from 'uuid'

import { RootState } from '../../app/RootReducer'
import { getFingerprint } from '../../utils/fingerprint'
import MqttContext from './MqttContext'
import { MqttContext as Context } from './types'

export default function useSubscription<T>(topic: string) {
  const { mqtt, status, messages, addMessage, lastMessage } = useContext<
    Context<T>
  >(MqttContext)
  const {
    login: { me: streamerDetails },
    liveStreamManager: { currentLiveStreamDetails },
  } = useSelector((state: RootState) => state)
  const subscribed = useMemo(
    () =>
      mqtt?.subscribe(topic, { qos: 2 }, async () => {
        const fingerprint = await getFingerprint()
        if (
          mqtt &&
          subscribed &&
          streamerDetails?.user_uid &&
          topic ===
            `chat/v2/${currentLiveStreamDetails?.uid}/${fingerprint}/history`
        ) {
          mqtt.publish(
            `chat/v2/${currentLiveStreamDetails?.uid}/device`,
            JSON.stringify({
              device_id: fingerprint,
              user_uid: streamerDetails?.user_uid,
              status: 10,
            }),
            { qos: 0 },
            function(err) {
              if (err) {
                // console.log(err);
              }
            }
          )
        }
        if (
          mqtt &&
          subscribed &&
          topic === `stream_stats/${currentLiveStreamDetails?.uid}/live_views`
        ) {
          mqtt.publish(
            `stream_stats/${currentLiveStreamDetails?.uid}/device`,
            JSON.stringify({
              device_id: fingerprint,
              user_uid: streamerDetails?.user_uid,
              status: 10,
            }),
            { qos: 0 },
            function(err) {
              if (err) {
                // do nothing
              }
            }
          )
        }
        if (mqtt && subscribed) {
          subscribed.on(
            'message',
            (t: string, message: { toString: () => string }) => {
              let msg
              try {
                msg = JSON.parse(message.toString())
              } catch (e) {
                msg = message.toString()
              }

              const packet = {
                message: msg,
                topic: t,
                //@ts-ignore
                id: uuidv4(),
              }
              //@ts-ignore
              if (MQTTPattern.matches(topic, t)) {
                if (!(msg?.msgId === fingerprint)) {
                  addMessage(packet)
                }
              }
            }
          )
        }
      }),

    [mqtt, currentLiveStreamDetails?.uid]
  )

  const msgs = messages.filter((msg) => MQTTPattern.matches(topic, msg.topic))
  const lastMessageOnTopic = msgs[msgs.length - 1]

  return {
    msgs,
    mqtt,
    status,
    lastMessage,
    lastMessageOnTopic,
    topic,
  }
}
