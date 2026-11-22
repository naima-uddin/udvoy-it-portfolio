import Image from "next/image";
import Link from "next/link";
import FootLegal from "./FootLegal";
import { SITE } from "@/lib/site";

/** the frame for pages other than the home page: a simple header, the content and the legal footer */
export default function SubPage({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <>
      <div className="backdrop" aria-hidden />
      <header className="sp-nav">
        <Link href="/" className="logo">
          <Image src="/brand/udvoy-logo-white.png" alt={SITE.name} width={135} height={30} loading="eager" />
        </Link>
        <Link href="/#contact" className="nav-cta">
          Let&apos;s talk
        </Link>
      </header>
      <main className={`main sp ${className}`}>{children}</main>
      <footer className="sp-foot">
        <FootLegal />
      </footer>
    </>
  );
}
