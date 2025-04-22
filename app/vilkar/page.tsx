import React from 'react';
import ContentContainer from '@/src/components/ContentContainer'; // Corrected path
import styles from './vilkar.module.css'; // We'll create this file for styling

const VilkarPage = () => {
  return (
    <ContentContainer>
      <div className={styles.vilkarContainer}>
        <h1>Salgsbetingelser - Fosskok SA</h1>

        <h2>1. Betaling</h2>
        <p>Vi tilbyr trygg betaling gjennom følgende løsninger:</p>
        <ul>
          <li>Vipps – for kjøp av mat, drikke og merch på festivalområdet.</li>
          <li>Tikkio – for kjøp av billetter til konserter og festival.</li>
        </ul>
        <p>Betaling må skje før levering/bruk. Kvittering sendes automatisk ved kjøp via Tikkio. Vipps-kjøp vises i din Vipps.</p>

        <h2>2. Angrerett og refusjon</h2>
        <p>
          Kjøp av billetter til kulturarrangementer er unntatt angrerett etter
          angrerettloven § 22 m.
        </p>
        <p>
          Vi tilbyr derfor ingen refusjon ved kjøp av billetter, med mindre
          arrangementet blir avlyst.
        </p>
        <p>
          Ved avlysning vil kjøper få mulighet til refusjon i tråd med
          betingelser oppgitt i Tikkio.
        </p>

        <h2>3. Mat og drikke</h2>
        <p>Mat og drikke kjøpt på stedet refunderes ikke.</p>
        <p>
          Ved feil eller mangler, ta kontakt med ansvarlig person på området så
          raskt som mulig.
        </p>

        <h2>4. Klage og kontakt</h2>
        <p>
          Hvis du har spørsmål, ønsker å gi tilbakemelding eller klage på en vare
          eller et kjøp, kontakt oss på:
        </p>
        <p>E-post: fosskok.sa@gmail.com</p>
        <p>
          Vi besvarer henvendelser så snart som mulig, normalt innen 2–5
          virkedager.
        </p>

        <h2>5. Aldersgrense og ansvar</h2>
        <p>
          For kjøp av alkohol må kjøper være over 18 år og kunne vise gyldig
          legitimasjon ved forespørsel.
        </p>
        <p>
          Vi forbeholder oss retten til å nekte salg ved brudd på alkoholloven
          eller uansvarlig oppførsel.
        </p>
      </div>
    </ContentContainer>
  );
};

export default VilkarPage;
