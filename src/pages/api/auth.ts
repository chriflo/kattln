import { NextApiRequest, NextApiResponse } from 'next'
import Pusher from 'pusher'

const pusher = new Pusher({
  appId: process.env.PUSHER_APPID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: 'eu',
  useTLS: true,
})

export default (req: NextApiRequest, res: NextApiResponse) => {
  const socketId = req.body.socket_id
  const channel = req.body.channel_name

  const presenceData = {
    user_id: Math.random().toString(36).substring(7),
    user_info: {
      name: 'John Smith',
    },
  }

  const auth = pusher.authenticate(socketId, channel, presenceData)
  res.send(auth)
}
