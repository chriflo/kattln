import Link from 'next/link'

export default function Home() {
  return (
    <main
      css={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <div css={{ width: '200px' }}>
        <label htmlFor="name">Name</label>
        <input type="text" id="name" />
        <Link href="/room/1">
          <button>Runde erstellen</button>
        </Link>
        <button>Runde beitreten</button>
      </div>
    </main>
  )
}
