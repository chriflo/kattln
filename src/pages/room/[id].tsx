import React from 'react'
import { useRouter } from 'next/router'

export default function Room() {
  const [name, setName] = React.useState('')
  const router = useRouter()

  React.useEffect(() => {
    const savedName = window.localStorage.getItem('name')
    if (!savedName) {
      router.push('/')
    } else {
      setName(savedName)
    }
  }, [])

  const { id } = router.query

  return (
    <>
      <h1>
        Hi {name}! Runde - {id}
      </h1>
    </>
  )
}
