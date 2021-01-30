import { Header, headerHeight } from 'components/header'
import 'normalize.css'
import { colors, GlobalStyles } from 'styles/global'
import Head from 'next/head'
import { PusherProvider } from '@harelpls/use-pusher'

const pusherConfig = {
  // required config props
  clientKey: '50ae4175a7dd934129ab',
  cluster: 'eu',
  authEndpoint: '/api/auth',
}

export default function MyApp({ Component, pageProps }: { Component: any; pageProps: any }) {
  return (
    <PusherProvider {...pusherConfig}>
      <div
        css={{
          overflow: 'hidden',
          height: '100vh',
          width: '100vw',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          bottom: 0,
          paddingTop: headerHeight,
        }}
      >
        <Head>
          <link rel="icon" type="image/svg+xml" href="/leave.svg" />
        </Head>
        <GlobalStyles />
        <Header />
        <main
          css={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            alignItems: 'center',
            flexGrow: 1,
          }}
        >
          <Component {...pageProps} />
          <div css={{ height: '100px', width: '100%', background: colors.mint, flexShrink: 0 }} />
        </main>
      </div>
    </PusherProvider>
  )
}
