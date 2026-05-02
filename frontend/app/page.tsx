import Link from 'next/link';
import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.hero}>
        <div className={styles.logo}>TrimFlow</div>
        <p className={styles.tagline}>
          Real-time navbat boshqaruvi, AI chat yordamchisi va moliyaviy analitikaga ega
          zamonaviy sartaroshxona platformasi.
        </p>

        <div className={styles.actions}>
          <Link href="/auth/login" className={styles.btnPrimary}>
            Kirish
          </Link>
          <Link href="/auth/register" className={styles.btnSecondary}>
            Ro&apos;yxatdan o&apos;tish
          </Link>
        </div>

        <div className={styles.features}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>01</div>
            <div className={styles.featureTitle}>Onlayn Bronlash</div>
            <p className={styles.featureDesc}>
              Qulay interfeys orqali xohlagan sartaroshingizga bron qiling. Vaqt slotlarini
              real-time ko&apos;ring va tanlang.
            </p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>02</div>
            <div className={styles.featureTitle}>Real-time Navbat</div>
            <p className={styles.featureDesc}>
              Socket.io texnologiyasi orqali navbat holatini real vaqtda kuzatib boring.
              Hech qanday kutilmagan holatlar yo&apos;q.
            </p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>03</div>
            <div className={styles.featureTitle}>AI Yordamchi</div>
            <p className={styles.featureDesc}>
              TrimAgent sun&apos;iy intellekt yordamida bron qiling, tavsiyalar oling va
              savollaringizga javob toping.
            </p>
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        2026 TrimFlow. Barcha huquqlar himoyalangan.
      </footer>
    </div>
  );
}
