import { Header } from 'components/header'
import 'normalize.css'
import { GlobalStyles } from 'styles/global'
import Head from 'next/head'

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link rel="icon" type="image/svg+xml" href="/leave.svg" />
      </Head>
      <GlobalStyles />
      <Header />
      <main
        css={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <Component {...pageProps} />
      </main>
    </>
  )
}
