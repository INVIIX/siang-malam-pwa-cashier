import { useEffect } from 'react'
import { toast } from 'sonner'
import { useRegisterSW } from 'virtual:pwa-register/react'
import { Button } from '../ui/button'

function PWABadge() {
  const period = 60 * 60 * 1000
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(swUrl, r) {
      if (period <= 0) return
      if (r?.active?.state === 'activated') {
        registerPeriodicSync(period, swUrl, r)
      }
      else if (r?.installing) {
        r.installing.addEventListener('statechange', (e) => {
          const sw = e.target as ServiceWorker
          if (sw.state === 'activated')
            registerPeriodicSync(period, swUrl, r)
        })
      }
    },
  })

  function close() {
    setOfflineReady(false)
    setNeedRefresh(false)
  }

  useEffect(() => {
    if (offlineReady) {
      toast('App ready to work offline', {
        cancel: <Button variant="outline" onClick={() => close()}>Close</Button>,
      })
    }

    if (needRefresh) {
      toast('New content available, click on reload button to update.', {
        cancel: <Button variant="outline" onClick={() => close()}>Close</Button>,
        action: <Button onClick={() => updateServiceWorker(true)}>Action</Button>,
      })
    }
  }, [offlineReady, needRefresh])

  return <></>
  // <div className="PWABadge" role="alert" aria-labelledby="toast-message">
  //   {(offlineReady || needRefresh)
  //     && (
  //       // <div className="PWABadge-toast">
  //       //   <div className="PWABadge-message">
  //       //     {offlineReady
  //       //       ? <span id="toast-message">App ready to work offline</span>
  //       //       : <span id="toast-message">New content available, click on reload button to update.</span>}
  //       //   </div>
  //       //   <div className="PWABadge-buttons">
  //       //     {needRefresh && <button className="PWABadge-toast-button" onClick={() => updateServiceWorker(true)}>Reload</button>}
  //       //     <button className="PWABadge-toast-button" onClick={() => close()}>Close</button>
  //       //   </div>
  //       // </div>
  //       <Alert>
  //         <CheckCircle2Icon />
  //         <AlertTitle>Success! Your changes have been saved</AlertTitle>
  //         <AlertDescription>
  //           This is an alert with icon, title and description.
  //         </AlertDescription>
  //       </Alert>
  //     )}
  // </div>
}

export default PWABadge

/**
 * This function will register a periodic sync check every hour, you can modify the interval as needed.
 */
function registerPeriodicSync(period: number, swUrl: string, r: ServiceWorkerRegistration) {
  if (period <= 0) return

  setInterval(async () => {
    if ('onLine' in navigator && !navigator.onLine)
      return

    const resp = await fetch(swUrl, {
      cache: 'no-store',
      headers: {
        'cache': 'no-store',
        'cache-control': 'no-cache',
      },
    })

    if (resp?.status === 200)
      await r.update()
  }, period)
}
