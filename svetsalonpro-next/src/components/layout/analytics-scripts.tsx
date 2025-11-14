'use client';

import Script from 'next/script';

const yandexId = process.env.NEXT_PUBLIC_YANDEX_METRICA_ID;
const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export function AnalyticsScripts() {
  return (
    <>
      {yandexId ? (
        <>
          <Script id="yandex-metrica" strategy="afterInteractive">
            {`(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0];k.async=1;k.src=r;a.parentNode.insertBefore(k,a);})(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js', 'ym');
ym('${yandexId}', 'init', {
  clickmap:true,
  trackLinks:true,
  accurateTrackBounce:true,
  webvisor:true
});`}
          </Script>
          <noscript>
            <div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://mc.yandex.ru/watch/${yandexId}`}
                style={{ position: 'absolute', left: '-9999px' }}
                alt=""
              />
            </div>
          </noscript>
        </>
      ) : null}

      {gaId ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            strategy="afterInteractive"
          />
          <Script id="ga4" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', '${gaId}');`}
          </Script>
        </>
      ) : null}
    </>
  );
}
