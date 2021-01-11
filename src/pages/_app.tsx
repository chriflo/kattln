import { Header } from 'components/header'
import 'normalize.css'
import { GlobalStyles } from 'styles/global'
import Head from 'next/head'

export default function MyApp({ Component, pageProps }) {
  return (
    <div
      css={{
        overflow: 'hidden',
        height: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        bottom: 0,
      }}
    >
      <Head>
        <link rel="icon" type="image/svg+xml" href="/leave.svg" />
      </Head>
      <GlobalStyles />
      <Header css={{ alignSelf: 'flex-start' }} />
      <main
        css={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          flexGrow: 1,
        }}
      >
        <Component {...pageProps} />
      </main>
    </div>
  )
}
