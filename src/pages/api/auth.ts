/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { NextApiRequest, NextApiResponse } from 'next'
import Pusher from 'pusher'

const pusher = new Pusher({
  appId: process.env.PUSHER_APPID!,
  key: process.env.PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: 'eu',
  useTLS: true,
})

export default (req: NextApiRequest, res: NextApiResponse) => {
  const socketId = req.body.socket_id
  const channel = req.body.channel_name

  const id = req.cookies.id
  const name = req.cookies.name

  if (!id || !name) {
    res.status(403).send('Error authenticating')
  }

  const presenceData = {
    user_id: req.cookies.id,
    user_info: {
      name: req.cookies.name,
    },
  }

  const auth = pusher.authenticate(socketId, channel, presenceData)
  res.send(auth)
}
