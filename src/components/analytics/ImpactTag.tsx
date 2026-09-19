import Script from "next/script";

// Impact.com tracking tag, used to attribute traffic/conversions for
// partner affiliations (e.g. HubSpot).
export default function ImpactTag() {
  return (
    <Script id="impact-tag" strategy="afterInteractive">
      {`
        (function(i,m,p,a,c,t){c.ire_o=p;c[p]=c[p]||function(){(c[p].a=c[p].a||[]).push(arguments)};t=a.createElement(m);var z=a.getElementsByTagName(m)[0];t.async=1;t.src=i;z.parentNode.insertBefore(t,z)})('https://utt.impactcdn.com/P-A7808285-6404-49dd-91b4-fb215247a7221.js','script','impactStat',document,window);
        impactStat('trackImpression');
      `}
    </Script>
  );
}
