"use client";
import React, { useState } from 'react';
import ContentContainer from '../../src/components/ContentContainer';
import styles from './page.module.css';
import Link from 'next/link';
import ArtistCard, { Artist } from '../../src/components/ArtistCard';
import ArtistPopup from '../../src/components/ArtistPopup';

// Example artist data for each stage
const kirkenArtists: Artist[] = [
  {
    image: '/images/festival/brooke.png',
    title: 'Brooke Sharkey',
    time: '',
    description: 'Brooke Sharkey er en britisk-fransk låtskriver og sanger, kjent for sin unike stemme og atmosfæriske låter på både engelsk og fransk. Hun har gitt ut flere kritikerroste album, og har fått internasjonal oppmerksomhet for sin særegne stil. Nå bosatt i Oslo, er hun aktuell med nytt album og turné.'
  },
  {
    image: '/images/festival/duetrost.png',
    title: 'Duetrost',
    time: '',
    description: 'Duetrost er en akustisk trio fra Oslo som skaper et unikt og sjarmerende musikalsk univers. Med en spennende besetning bestående av Håkon Aase på fiolin, Fredrik Karwowski på gitar og Knærten Simonsen på trommer, henter de inspirasjon fra folkemusikk, klassisk musikk og den nordiske jazzen.\n\nBandet er kjent for sine instrumentale skildringer av natur og dyreliv, hvor låttitler som "Røyskatten", "Seilfisk" og "Bever fra Mali" inviterer lytteren inn i en fantasifull og levende verden. Musikken deres er preget av improvisasjon, smittende spilleglede og et kammermusikalsk uttrykk som garantert får deg til å trekke på smilebåndet.\n\nEnten du er tilhenger av jazz, folkemusikk eller bare vakre, stemningsfulle melodier, er Duetrost et bekjentskap du ikke vil gå glipp av. Opplev deres originale komposisjoner og la deg forføre av et band som byr på både humor, sårbarhet og instrumental briljans. Hold ørene åpne for Duetrost – en trio som fargelegger norsk musikk med sine særegne og billedrike toner!'
  }
];
const hagenArtists: Artist[] = [
  {
    image: '/images/festival/festival-poster.jpg',
    title: 'Fosskok skrangleorkester',
    time: '',
    description: ''
  },
  {
    image: '/images/festival/august.png',
    title: 'August Kann',
    time: '',
    description: 'August Kann debuterte i 2019 med albumet How Did All These People Get Into My Room, som ble godt mottatt for sitt personlige uttrykk og melankolske, men forfriskende visepop-sound.\n\nI 2021 ga han ut sitt andre album, This is the Sound, som ble beskrevet som en følelsesmessig berg-og-dalbane fra forelskelse til mørkere temaer. Albumet ble mikset av Joseph Lorge, kjent for sitt arbeid med Bob Dylan og John Legend.\n\nKann har blitt sammenlignet med Paul Simon og har en særegen, hese vokal kombinert med eksperimenterende instrumentering.'
  },
  {
    image: '/images/festival/festival-poster.jpg',
    title: 'Soap',
    time: '',
    description: ''
  },
  {
    image: '/images/festival/highchief.png',
    title: 'Heigh Chief',
    time: '',
    description: 'Heigh Chief leverer en kruttsterk blanding av rock, americana og blues med dype røtter i sørstatssoul. Dette Oslobaserte bandet har markert seg som en formidabel liveopplevelse, kjent for sin smittende energi, spilleglede og eksepsjonelle musikalitet. Med flere kritikerroste album, inkludert det anerkjente "Chorus of Crickets", byr Heigh Chief på et tidløst lydbilde som appellerer til fans av The Allman Brothers Band og J.J. Grey & Mofro, samtidig som de har sitt eget uttrykk. Frontet av Bjørn Blix og Marcus Løvdal, og med Lars Christian Narum (Hellbillies) på tangenter, garanterer bandet en konsertopplevelse som setter spor. Gå ikke glipp av sjansen til å se et av Norges mest dynamiske band live!'
  }
];
const stabburetArtists: Artist[] = [
  {
    image: '/images/festival/festival-poster.jpg',
    title: 'Torstein og Tryllefløyta',
    time: '',
    description: ''
  },
  {
    image: '/images/festival/festival-poster.jpg',
    title: 'Skyggeteater',
    time: '',
    description: ''
  }
];

export default function Festival() {
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);

  return (
    <ContentContainer>
      <div className={styles.container}>
        <div className={styles.posterContainer}>
          <img 
            src="/images/festival/festival-poster.jpg" 
            alt="Festival i hagen 2025 - 14. juni hos Fosskok" 
            className={styles.posterImage}
          />
        </div>
        <p className={styles.subheader}>
          Sommeren 2025 vender vi tilbake til røttene – og inviterer til festival på Hammer Prestegård! Det blir musikk, mat, drikke og glede. På dagtid blir det også gratis barneprogram. Vi løfter frem lokale og kortreiste artister, og skaper en inkluderende møteplass hvor hele nabolaget, kommunen og hvem som helst ellers er velkommen!
          <br /><br />
          Mer info om programmet kommer.
          Hold deg oppdatert på fosskok.no, og følg med på instagram og facebook for artistslipp.
        </p>
        
        <div className={styles.festivalContent}>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Kjøp festivalpass</h2>
            <div className={styles.ticketInfo}>
              <div className={styles.ticketType}>
                <h3>Dagspass</h3>
                <p className={styles.price}>kr 350,-</p>
                <p className={styles.earlyBird}>Første 30 billetter: kr 300,-</p>
                <p>Under 16 år: <strong>Gratis!</strong></p>
                <Link href="https://tikkio.com/events/56347" target="_blank" rel="noopener noreferrer" className={styles.button}>Kjøp nå</Link>
              </div>
            </div>
          </section>
          
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Line-up <span style={{fontSize: '1rem', fontWeight: 400, marginLeft: 8}}>(med forbehold om endringer)</span></h2>
            
            <div className={styles.lineup}>
              <div className={styles.stage}>
                <h3>Kirken</h3>
                <div className={styles.stageTable}>
                  {kirkenArtists.map((artist, idx) => (
                    <ArtistCard
                      key={artist.title + idx}
                      artist={artist}
                      onClick={() => setSelectedArtist(artist)}
                    />
                  ))}
                </div>
              </div>
              <div className={styles.stage}>
                <h3>Hagen</h3>
                <div className={styles.stageTable}>
                  {hagenArtists.map((artist, idx) => (
                    <ArtistCard
                      key={artist.title + idx}
                      artist={artist}
                      onClick={() => setSelectedArtist(artist)}
                    />
                  ))}
                </div>
              </div>
              <div className={styles.stage}>
                <h3>Stabburet</h3>
                <div className={styles.stageTable}>
                  {stabburetArtists.map((artist, idx) => (
                    <ArtistCard
                      key={artist.title + idx}
                      artist={artist}
                      onClick={() => setSelectedArtist(artist)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>
          
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Mat og drikke</h2>
            <p className={styles.foodDrinkText}>
              Vi serverer kortreist mat og drikke disket opp av vår egen stjernekokk!
            </p>
          </section>
          
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Praktisk info</h2>
            <div className={styles.practicalInfo}>
              <p><strong>Parkering:</strong> Stor parkeringsplass ved kirken rett på nedsiden av hagen</p>
              <p><strong>Dato:</strong> Lørdag 14. juni</p>
              <p><strong>Start:</strong> 14:00</p>
              <p><strong>Slutt:</strong> 23:59</p>
              <p><strong>Transport:</strong> Buss 110</p>
            </div>
          </section>
        </div>
      </div>
      {selectedArtist && (
        <ArtistPopup
          artist={selectedArtist}
          onClose={() => setSelectedArtist(null)}
        />
      )}
    </ContentContainer>
  );
}
