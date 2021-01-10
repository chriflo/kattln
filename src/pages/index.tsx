import Link from 'next/link'

export default function Home() {
  return (
    <>
      <label htmlFor="name">Name</label>
      <input type="text" id="name" />
      <Link href="/room/1">
        <button>Runde erstellen</button>
      </Link>
      <button>Runde beitreten</button>
    </>
  )
}
