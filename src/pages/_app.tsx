import { Provider } from "react-redux"
import type { AppProps } from "next/app"
import "@/i18n/i18n"

import store from "@/store"

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  )
}
