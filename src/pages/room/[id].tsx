import { useRouter } from 'next/router'

export default function Room() {
  const router = useRouter()
  const { id } = router.query

  return (
    <>
      <h1>Runde - {id}</h1>
    </>
  )
}
